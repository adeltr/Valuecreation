import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { SPECS } from './index';
import { getActiveVocabulary, EXTENDED_ARCHETYPES, BASE_ARCHETYPES, type SectorArchetype } from '../ontology/registry';
import { TEMPLATES } from '../templates';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';
import { extractDependencies } from '../engine/formula';
import { BRIDGE_METRIC_CODES } from '../ontology/base';
import type { Lever } from '../domain/types';

const BRIDGE_INPUTS = ['EBITDA_ENTRY', 'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS', 'NET_DEBT_ENTRY', 'FCF_ANNUAL'];

describe.each(Object.values(SPECS))('$archetype sector spec', (spec) => {
  const a = spec.archetype as SectorArchetype;
  const vocab = getActiveVocabulary(a);
  const metrics = TEMPLATES[a]!.instantiate('c', spec.demoInputs);
  const base = resolveMetrics(metrics);

  it('is a level-2 archetype whose vocabulary holds every spec term', () => {
    expect(EXTENDED_ARCHETYPES).toContain(a);
    expect(BASE_ARCHETYPES).not.toContain(a);
    for (const t of [...spec.inputs, ...spec.diagnostics, ...spec.calculated]) expect(vocab.isMetricCode(t.code), t.code).toBe(true);
    for (const l of [...spec.levers, ...spec.baseLevers]) expect(vocab.isLeverCategory(l.category), l.category).toBe(true);
    for (const c of spec.causes) expect(vocab.isCauseCategory(c.category), c.category).toBe(true);
  });

  it('stays narrow (docs/09): ≤ 8 formula inputs, ≤ 8 diagnostics, ≤ 7 sector levers', () => {
    expect(spec.inputs.length).toBeLessThanOrEqual(8);
    expect(spec.diagnostics.length).toBeLessThanOrEqual(8);
    expect(spec.levers.length).toBeLessThanOrEqual(7);
  });

  it('demo inputs are exactly the base inputs, the formula inputs and the bridge inputs', () => {
    expect(Object.keys(spec.demoInputs).sort()).toEqual([...spec.baseInputs, ...spec.inputs.map((t) => t.code), ...BRIDGE_INPUTS].sort());
  });

  it('interaction rules link two formula inputs through a base coefficient the analyst sets', () => {
    for (const r of spec.interactions ?? []) {
      expect(spec.inputs.map((t) => t.code)).toContain(r.source);
      expect(spec.inputs.map((t) => t.code)).toContain(r.target);
      expect(spec.baseInputs).toContain(r.coefficient);
      expect(vocab.isLeverTarget(r.coefficient), `${r.coefficient} must never be a lever target`).toBe(false);
    }
    expect(TEMPLATES[a]!.interactions).toEqual((spec.interactions ?? []).map((r) => ({
      sourceCode: r.source, targetCode: r.target, coefficientCode: r.coefficient,
    })));
  });

  it('every formula input feeds a formula; diagnostics never do', () => {
    const used = new Set(Object.values(spec.formulas).flatMap(extractDependencies));
    for (const t of spec.inputs) expect(used.has(t.code), `${t.code} unused`).toBe(true);
    for (const t of spec.diagnostics) expect(used.has(t.code), `${t.code} in a formula`).toBe(false);
  });

  it('the engine reproduces the hand-computed EBITDA_EXIT reference', () => {
    expect(base.get('EBITDA_EXIT')).toBeCloseTo(spec.reference.EBITDA_EXIT, 6);
    expect(Number.isFinite(base.get('MOIC'))).toBe(true);
    for (const c of BRIDGE_METRIC_CODES) expect(base.has(c), c).toBe(true);
  });

  it.each(spec.levers.filter((l) => l.target))('lever $category on $target improves EBITDA_EXIT, entry untouched', (l) => {
    const lever: Lever = {
      id: 'l', nodeId: 'n', causeId: null, label: l.category, mechanism: 'm', category: l.category,
      impactMetricCode: l.target!, expectedDelta: l.delta, deltaKind: 'absolute', timeToImpactDays: 90,
      effort: 'medium', confidence: 0.5, confidenceBasis: l.sources, source: 'analyst', status: 'validated',
    };
    expect(vocab.isLeverTarget(l.target)).toBe(true);
    expect(spec.inputs.some((t) => t.code === l.target), `${l.target} is not a formula input`).toBe(true);
    const r = runScenario('s', metrics, [lever], [{ scenarioId: 's', leverId: 'l', appliedDelta: l.delta, deltaKind: 'absolute' }], []);
    const v = new Map(r.map((x) => [x.metricCode, x.value]));
    expect(v.get('EBITDA_EXIT')!).toBeGreaterThan(base.get('EBITDA_EXIT')!);
    expect(v.get('EQUITY_ENTRY')).toBe(base.get('EQUITY_ENTRY'));
    expect(r.every((x) => x.computedBy === 'engine')).toBe(true);
  });

  it('catalog links point to existing analyses of the library', () => {
    const n = readdirSync(`data/analysis-library/${a}`).filter((f) => /^\d{2} - /.test(f)).length;
    const nums = [...Object.values(spec.catalogMetrics), ...spec.levers.map((l) => l.analyses),
      ...spec.baseLevers.map((l) => l.analyses), ...spec.causes.map((c) => c.analyses)].flat();
    for (const x of nums) expect(x >= 1 && x <= n, `#${x}`).toBe(true);
    for (const code of Object.keys(spec.catalogMetrics)) expect(vocab.isMetricCode(code), code).toBe(true);
  });
});
