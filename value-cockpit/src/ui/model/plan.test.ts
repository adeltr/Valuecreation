import { describe, it, expect } from 'vitest';
import { buildPlan, type PlanInput } from './plan';
import { TEMPLATES } from '../../templates';
import { getCatalog } from '../../catalog';
import type { Lever, RootCause } from '../../domain/types';

const lever = (id: string, over: Partial<Lever>): Lever => ({
  id, nodeId: 'n', causeId: null, label: id, mechanism: 'm', category: 'FUEL_EFFICIENCY', impactMetricCode: 'FUEL_CASK',
  expectedDelta: -0.002, deltaKind: 'absolute', timeToImpactDays: 60, effort: 'high', confidence: 0.5,
  confidenceBasis: 'cf. airline-10', source: 'claude', status: 'validated', ...over,
});

const fuel = lever('fuel', {});
const lf = lever('lf', { category: 'NETWORK_OPTIMIZATION', impactMetricCode: 'LOAD_FACTOR', expectedDelta: 0.02, timeToImpactDays: 150, effort: 'low' });
const hyp = lever('hyp', { status: 'hypothesis' });
const cause: RootCause = { id: 'c1', nodeId: 'n', description: 'Flotte vieillissante', category: 'OPERATIONAL', severity: 'high', source: 'claude', evidence: null, createdAt: 'd' };

const input = (over: Partial<PlanInput> = {}): PlanInput => ({
  levers: [lf, hyp, fuel], rootCauses: [cause],
  metrics: TEMPLATES.airline!.instantiate('c', TEMPLATES.airline!.demoInputs),
  catalog: getCatalog('airline'), rules: [], family: 'ebitda', overrides: {}, ...over,
});

describe('100-day plan (PE best practice: diagnose J0–30, design J30–60, execute J60–100)', () => {
  const plan = buildPlan(input());
  const ws = (id: string) => plan.workstreams.find((w) => w.id === id)!;

  it('one workstream per validated lever, earliest impact first', () => {
    expect(plan.workstreams.map((w) => w.id)).toEqual(['fuel', 'lf']);
  });

  it('a lever landing within 100 days compresses its three phases up to its impact date', () => {
    expect(ws('fuel').bars).toEqual([
      { phase: 'diagnose', from: 0, to: 20 }, { phase: 'design', from: 20, to: 40 }, { phase: 'execute', from: 40, to: 60 },
    ]);
    expect(ws('fuel').milestones.slice(-1)[0]).toMatchObject({ day: 60 });
    expect(ws('fuel').milestones.slice(-1)[0]!.label).toMatch(/Premier impact.*FUEL_CASK/);
    expect(ws('fuel').beyond100).toBe(false);
  });

  it('a longer lever runs the standard phases and is flagged beyond day 100', () => {
    expect(ws('lf').bars).toEqual([
      { phase: 'diagnose', from: 0, to: 30 }, { phase: 'design', from: 30, to: 60 }, { phase: 'execute', from: 60, to: 100 },
    ]);
    expect(ws('lf').beyond100).toBe(true);
    expect(ws('lf').milestones.slice(-1)[0]!.label).toMatch(/J\+150/);
  });

  it('the diagnose milestone names the analyses to run first', () => {
    expect(ws('fuel').milestones[0].label).toMatch(/airline-10/);
    expect(ws('fuel').analyses.length).toBeLessThanOrEqual(3);
  });

  it('KPI: baseline from the model, target = baseline + validated delta', () => {
    expect(ws('fuel').kpi).toEqual({ code: 'FUEL_CASK', unit: 'currency', baseline: 0.022, target: 0.022 - 0.002 });
  });

  it('value at stake comes from the engine, lever by lever and all together', () => {
    expect(ws('fuel').value!.moic).toBeGreaterThan(0);
    expect(ws('fuel').value!.anchorDelta).toBeGreaterThan(0); // EBITDA_EXIT up
    expect(plan.totals.anchorCode).toBe('EBITDA_EXIT');
    expect(plan.totals.moicAll).toBeGreaterThan(plan.totals.moicBy100);
    expect(plan.totals.moicBy100).toBeGreaterThan(plan.totals.moicBase);
  });

  it('prioritisation: value × ease, and a quick win must land within the 100 days', () => {
    expect(ws('fuel').quadrant).toBe('strategic');   // high value, high effort
    expect(ws('lf').quadrant).toBe('strategic');     // high value, low effort, but impact at J+150
    const fast = buildPlan(input({ levers: [{ ...lf, timeToImpactDays: 90 }] })).workstreams[0];
    expect(fast.quadrant).toBe('quick_win');
  });

  it('cross-cutting foundations follow the bridge family', () => {
    expect(plan.foundations.map((f) => f.title)).toContain('Gouvernance et PMO');
    expect(plan.foundations.find((f) => f.id === 'f-governance')!.milestones.map((m) => m.day)).toEqual([7, 30, 60, 100]);
    expect(plan.foundations.map((f) => f.title)).toContain('Cash et BFR');
    expect(buildPlan(input({ family: 'book_value' })).foundations.map((f) => f.title)).toContain('Capital et liquidité');
    expect(buildPlan(input({ family: 'rnpv' })).foundations.map((f) => f.title)).toContain('Trésorerie et runway');
  });

  it('analyst overrides (owner, status, note) are applied; defaults are explicit', () => {
    const p = buildPlan(input({ overrides: { fuel: { owner: 'COO', status: 'in_progress' } } }));
    expect(p.workstreams[0]).toMatchObject({ owner: 'COO', status: 'in_progress', note: '' });
    expect(p.workstreams[1]).toMatchObject({ owner: 'À désigner', status: 'todo' });
  });

  it('risks: the high-severity root causes', () => {
    expect(plan.risks).toEqual(['Flotte vieillissante (OPERATIONAL)']);
  });

  it('an empty plan still has its foundations', () => {
    const p = buildPlan(input({ levers: [] }));
    expect(p.workstreams).toEqual([]);
    expect(p.totals.moicAll).toBe(p.totals.moicBase);
    expect(p.foundations.length).toBeGreaterThan(0);
  });
});
