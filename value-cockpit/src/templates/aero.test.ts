import { describe, it, expect } from 'vitest';
import { instantiateAeroTemplate } from './aero';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';
import type { Lever, ScenarioLever } from '../domain/types';

const BASE_INPUTS = {
  REVENUE: 500, EBITDA_MARGIN: 0.12,
  BOOK_TO_BILL: 1.06, FIXED_PRICE_SHARE: 0.60, COST_OVERRUN_RATE: 0.03,
  ENTRY_MULTIPLE: 9, EXIT_MULTIPLE: 9, HOLD_YEARS: 5,
  NET_DEBT_ENTRY: 300, FCF_ANNUAL: 25,
};

describe('aero template', () => {
  const metrics = instantiateAeroTemplate('c1', BASE_INPUTS);

  it('resolves full chain: BOOK_TO_BILL → REVENUE_EXIT → EBITDA_MARGIN_EXIT → EBITDA_EXIT → MOIC', () => {
    const v = resolveMetrics(metrics);
    const revenueExit = 500 * 1.06 ** 5;
    expect(v.get('REVENUE_EXIT')).toBeCloseTo(revenueExit, 4);
    // EBITDA_MARGIN_EXIT = 0.12 - 0.03 * 0.60 = 0.102
    expect(v.get('EBITDA_MARGIN_EXIT')).toBeCloseTo(0.102, 10);
    expect(v.get('EBITDA_ENTRY')).toBeCloseTo(500 * 0.12, 6);
    const ebitdaExit = revenueExit * 0.102;
    expect(v.get('EBITDA_EXIT')).toBeCloseTo(ebitdaExit, 4);
    const equityEntry = 500 * 0.12 * 9 - 300; // 60*9-300 = 240
    expect(v.get('EQUITY_ENTRY')).toBeCloseTo(equityEntry, 6);
    const netDebtExit = 300 - 25 * 5; // 175
    const moic = (ebitdaExit * 9 - netDebtExit) / equityEntry;
    expect(v.get('MOIC')).toBeCloseTo(moic, 4);
  });

  it('every instantiated code belongs to the aero active vocabulary', async () => {
    const { getActiveVocabulary } = await import('../ontology/registry');
    const vocab = getActiveVocabulary('aero' as any);
    for (const x of metrics) expect(vocab.isMetricCode(x.code), x.code).toBe(true);
  });

  it('PROGRAM_EXECUTION lever: overruns −1.5 pts (absolute) → EBITDA_MARGIN_EXIT = 0.111', () => {
    const lever: Lever = {
      id: 'l1', nodeId: 'n1', causeId: null,
      label: 'Reduce cost overruns via EVM', mechanism: 'earned-value milestone discipline',
      category: 'PROGRAM_EXECUTION', impactMetricCode: 'COST_OVERRUN_RATE',
      expectedDelta: -0.015, deltaKind: 'absolute', timeToImpactDays: 180,
      effort: 'medium', confidence: 0.7,
      confidenceBasis: 'historical overrun reduction 3 → 1.5 % after EVM rollout',
      source: 'analyst', status: 'validated',
    };
    const sl: ScenarioLever = { scenarioId: 's1', leverId: 'l1', appliedDelta: -0.015, deltaKind: 'absolute' };
    const results = runScenario('s1', metrics, [lever], [sl], []);
    const r = new Map(results.map((x) => [x.metricCode, x.value]));
    // EBITDA_MARGIN_EXIT = 0.12 - 0.015 * 0.60 = 0.111
    expect(r.get('EBITDA_MARGIN_EXIT')).toBeCloseTo(0.111, 6);
    const revenueExit = 500 * 1.06 ** 5;
    expect(r.get('EBITDA_EXIT')).toBeCloseTo(revenueExit * 0.111, 4);
    for (const result of results) expect(result.computedBy).toBe('engine');
  });

  it('CONTRACT_MIX lever: FIXED_PRICE_SHARE 60 → 45 % → EBITDA_MARGIN_EXIT = 0.1065', () => {
    const lever: Lever = {
      id: 'l2', nodeId: 'n2', causeId: null,
      label: 'Shift to cost-plus on renewals', mechanism: 'renegotiate expiring fixed-price contracts',
      category: 'CONTRACT_MIX', impactMetricCode: 'FIXED_PRICE_SHARE',
      expectedDelta: -0.15, deltaKind: 'absolute', timeToImpactDays: 360,
      effort: 'high', confidence: 0.6,
      confidenceBasis: 'portfolio renewal cycle — 3 major contracts expiring within hold period',
      source: 'analyst', status: 'validated',
    };
    const sl: ScenarioLever = { scenarioId: 's2', leverId: 'l2', appliedDelta: -0.15, deltaKind: 'absolute' };
    const results = runScenario('s2', metrics, [lever], [sl], []);
    const r = new Map(results.map((x) => [x.metricCode, x.value]));
    // EBITDA_MARGIN_EXIT = 0.12 - 0.03 * 0.45 = 0.1065
    expect(r.get('EBITDA_MARGIN_EXIT')).toBeCloseTo(0.1065, 6);
    for (const result of results) expect(result.computedBy).toBe('engine');
  });
});
