import { describe, it, expect } from 'vitest';
import { instantiateCpgTemplate } from './cpg';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';
import { getActiveVocabulary } from '../ontology/registry';
import type { Lever } from '../domain/types';

// REVENUE = gross sales (€m); rates as shares of gross sales.
const INPUTS = {
  REVENUE: 1000, VOLUME_GROWTH: 0.03, PRICE_MIX_GROWTH: 0.02,
  GROSS_MARGIN: 0.45, TRADE_SPEND_RATE: 0.12, AP_RATE: 0.08, OVERHEAD_RATE: 0.10,
  EBITDA_ENTRY: 150, ENTRY_MULTIPLE: 10, EXIT_MULTIPLE: 10, HOLD_YEARS: 5,
  NET_DEBT_ENTRY: 600, FCF_ANNUAL: 60,
};
const revExit = (vg: number, pm: number) => 1000 * ((1 + vg) * (1 + pm)) ** 5;
const metrics = instantiateCpgTemplate('c', INPUTS);

const lever = (category: string, code: string, delta: number): Lever => ({
  id: 'l', nodeId: 'n', causeId: null, label: 'l', mechanism: 'm', category, impactMetricCode: code,
  expectedDelta: delta, deltaKind: 'absolute', timeToImpactDays: 120, effort: 'medium',
  confidence: 0.5, confidenceBasis: 'cf. cpg-42', source: 'analyst', status: 'validated',
});
const run = (l: Lever) => new Map(runScenario('s', metrics, [l],
  [{ scenarioId: 's', leverId: 'l', appliedDelta: l.expectedDelta, deltaKind: 'absolute' }], []).map((r) => [r.metricCode, r.value]));

describe('cpg template', () => {
  it('volume × price-mix growth and gross-to-net margin → EBITDA_EXIT → MOIC', () => {
    const v = resolveMetrics(metrics);
    expect(v.get('REVENUE_EXIT')).toBeCloseTo(revExit(0.03, 0.02), 6);
    expect(v.get('EBITDA_MARGIN_EXIT')).toBeCloseTo(0.45 - 0.12 - 0.08 - 0.10, 10);
    expect(v.get('EBITDA_EXIT')).toBeCloseTo(revExit(0.03, 0.02) * 0.15, 6);
    expect(v.get('MOIC')).toBeCloseTo((revExit(0.03, 0.02) * 0.15 * 10 - (600 - 60 * 5)) / (150 * 10 - 600), 6);
  });

  it('every instantiated code belongs to the cpg vocabulary', () => {
    const vocab = getActiveVocabulary('cpg');
    for (const m of metrics) expect(vocab.isMetricCode(m.code), m.code).toBe(true);
  });

  it('TRADE_SPEND_OPTIMIZATION: trade spend −1 pt lifts exit margin by 1 pt, entry untouched', () => {
    const r = run(lever('TRADE_SPEND_OPTIMIZATION', 'TRADE_SPEND_RATE', -0.01));
    expect(r.get('EBITDA_MARGIN_EXIT')).toBeCloseTo(0.16, 10);
    expect(r.get('EBITDA_EXIT')).toBeCloseTo(revExit(0.03, 0.02) * 0.16, 6);
    expect(r.get('EQUITY_ENTRY')).toBe(150 * 10 - 600);
  });

  it('ROUTE_TO_MARKET: volume growth +1 pt compounds with price-mix', () => {
    expect(run(lever('ROUTE_TO_MARKET', 'VOLUME_GROWTH', 0.01)).get('REVENUE_EXIT')).toBeCloseTo(revExit(0.04, 0.02), 6);
  });
});
