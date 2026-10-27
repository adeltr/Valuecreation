import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';
import type { InteractionRule, Lever, Metric, ScenarioLever } from '../domain/types';

const input = (code: string, v: number): Metric => ({
  id: code, companyId: 'c', code, label: code, unit: 'ratio', isCalculated: false,
  formula: null, currentValue: v, benchmarkValue: null, benchmarkSource: null,
});
const calc = (code: string, formula: string): Metric => ({ ...input(code, 0), isCalculated: true, formula, currentValue: null });

const metrics = [
  input('PRICE_GROWTH', 0.03), input('VOLUME_GROWTH', 0.04), input('ELASTICITY', -1.5),
  calc('REVENUE_INDEX', '(1 + PRICE_GROWTH) * (1 + VOLUME_GROWTH)'),
];

let n = 0;
const lever = (target: string, delta: number, deltaKind: 'absolute' | 'percent'): Lever => ({
  id: `l${++n}`, nodeId: target, causeId: null, label: `lever ${n}`, mechanism: 'm', category: 'PRICING',
  impactMetricCode: target, expectedDelta: delta, deltaKind, timeToImpactDays: 30, effort: 'low',
  confidence: 0.5, confidenceBasis: 'test', source: 'analyst', status: 'validated',
});
const use = (l: Lever): ScenarioLever => ({ scenarioId: 's', leverId: l.id, appliedDelta: l.expectedDelta, deltaKind: l.deltaKind });
const value = (r: { metricCode: string; value: number }[], code: string) => r.find((x) => x.metricCode === code)!.value;

const priceToVolume: InteractionRule = { sourceCode: 'PRICE_GROWTH', targetCode: 'VOLUME_GROWTH', coefficientCode: 'ELASTICITY' };

describe('runScenario – delta composition', () => {
  it('stacked deltas on one metric do not depend on lever order: (base + Σ absolute) × Π(1 + percent)', () => {
    const a = lever('VOLUME_GROWTH', 0.01, 'absolute');
    const p = lever('VOLUME_GROWTH', 0.10, 'percent');
    const one = runScenario('s', metrics, [a, p], [use(a), use(p)], []);
    const two = runScenario('s', metrics, [a, p], [use(p), use(a)], []);
    expect(value(one, 'VOLUME_GROWTH')).toBeCloseTo((0.04 + 0.01) * 1.1, 12);
    expect(value(two, 'VOLUME_GROWTH')).toBe(value(one, 'VOLUME_GROWTH'));
  });
});

describe('runScenario – interaction rules', () => {
  it('a price lever moves volume by elasticity × Δprice', () => {
    const l = lever('PRICE_GROWTH', 0.02, 'absolute');
    const r = runScenario('s', metrics, [l], [use(l)], [], [priceToVolume]);
    expect(value(r, 'VOLUME_GROWTH')).toBeCloseTo(0.04 - 1.5 * 0.02, 12);
    expect(value(r, 'REVENUE_INDEX')).toBeCloseTo(1.05 * 1.01, 12);
    expect(r.every((x) => x.computedBy === 'engine')).toBe(true);
  });

  it('Δsource is measured in the source unit, whatever the lever deltaKind', () => {
    const l = lever('PRICE_GROWTH', 0.5, 'percent'); // 0.03 → 0.045
    const r = runScenario('s', metrics, [l], [use(l)], [], [priceToVolume]);
    expect(value(r, 'VOLUME_GROWTH')).toBeCloseTo(0.04 - 1.5 * 0.015, 12);
  });

  it('adds to a lever on the target itself', () => {
    const lp = lever('PRICE_GROWTH', 0.02, 'absolute');
    const lv = lever('VOLUME_GROWTH', 0.01, 'absolute');
    const r = runScenario('s', metrics, [lp, lv], [use(lp), use(lv)], [], [priceToVolume]);
    expect(value(r, 'VOLUME_GROWTH')).toBeCloseTo(0.04 + 0.01 - 0.03, 12);
  });

  it('does nothing when no lever moves the source', () => {
    const l = lever('VOLUME_GROWTH', 0.01, 'absolute');
    const r = runScenario('s', metrics, [l], [use(l)], [], [priceToVolume]);
    expect(value(r, 'VOLUME_GROWTH')).toBeCloseTo(0.05, 12);
  });

  it('an assumption is not a lever: it never triggers a rule', () => {
    const r = runScenario('s', metrics, [], [], [{ scenarioId: 's', metricCode: 'PRICE_GROWTH', value: 0.06 }], [priceToVolume]);
    expect(value(r, 'VOLUME_GROWTH')).toBe(0.04);
  });

  it('refuses a rule on a calculated metric, a missing coefficient, or a chain of rules', () => {
    const l = lever('PRICE_GROWTH', 0.02, 'absolute');
    const run = (rules: InteractionRule[]) => () => runScenario('s', metrics, [l], [use(l)], [], rules);
    expect(run([{ ...priceToVolume, targetCode: 'REVENUE_INDEX' }])).toThrow(/calculated/);
    expect(run([{ ...priceToVolume, coefficientCode: 'NOPE' }])).toThrow(/NOPE/);
    expect(run([priceToVolume, { sourceCode: 'VOLUME_GROWTH', targetCode: 'ELASTICITY', coefficientCode: 'ELASTICITY' }])).toThrow(/chain/);
  });
});
