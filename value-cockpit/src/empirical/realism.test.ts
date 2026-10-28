import { describe, it, expect } from 'vitest';
import { impliedTrajectory } from './realism';
import { TEMPLATES } from '../templates';
import type { Lever } from '../domain/types';

const cpg = TEMPLATES.cpg!;
const metrics = cpg.instantiate('c', cpg.demoInputs);
const lever: Lever = {
  id: 'l', nodeId: 'n', causeId: null, label: 'Trade spend', mechanism: 'm', category: 'TRADE_SPEND_OPTIMIZATION',
  impactMetricCode: 'TRADE_SPEND_RATE', expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90, effort: 'low',
  confidence: 0.5, confidenceBasis: 'b', source: 'analyst', status: 'validated',
};

describe('implied trajectory of the plan (engine) — compared with public benchmarks', () => {
  it('EBITDA margin change and revenue CAGR from entry to exit, without and with the validated levers', () => {
    const t = impliedTrajectory(metrics, [lever], cpg.interactions)!;
    const i = cpg.demoInputs;
    expect(t.years).toBe(5);
    const entry = i.EBITDA_ENTRY / i.REVENUE;
    const exitBase = i.GROSS_MARGIN - i.TRADE_SPEND_RATE - i.AP_RATE - i.OVERHEAD_RATE;
    expect(t.marginDelta.base).toBeCloseTo(exitBase - entry, 12);
    expect(t.marginDelta.plan).toBeCloseTo(exitBase + 0.02 - entry, 12);
    expect(t.revenueCagr.base).toBeCloseTo(t.revenueCagr.plan, 12); // trade spend does not move revenue
  });

  it('hypotheses never enter the plan trajectory (invariant 4)', () => {
    const t = impliedTrajectory(metrics, [{ ...lever, status: 'hypothesis' }], cpg.interactions)!;
    expect(t.marginDelta.plan).toBe(t.marginDelta.base);
  });

  it('the benchmark window follows the holding period: ≤ 4 years → 3-year window', () => {
    const short = cpg.instantiate('c', { ...cpg.demoInputs, HOLD_YEARS: 3 });
    expect(impliedTrajectory(short, [], cpg.interactions)!.years).toBe(3);
  });

  it('not computable without revenue at entry and exit (e.g. book-value or rNPV companies)', () => {
    const bank = TEMPLATES['commercial-bank']!;
    expect(impliedTrajectory(bank.instantiate('c', bank.demoInputs), [], [])).toBeNull();
  });
});
