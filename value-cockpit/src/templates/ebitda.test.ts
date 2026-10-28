import { describe, it, expect } from 'vitest';
import { instantiateEbitdaTemplate } from './ebitda';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';
import type { Lever } from '../domain/types';

const INPUTS = {
  REVENUE: 400, REVENUE_GROWTH: 0.05, EBITDA_MARGIN: 0.15, EBITDA_ENTRY: 60,
  ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 5, NET_DEBT_ENTRY: 200, FCF_ANNUAL: 20,
};
const revExit = (g: number) => 400 * (1 + g) ** 5;

const lever = (category: string, code: string, delta: number): Lever => ({
  id: 'l', nodeId: 'n', causeId: null, label: 'l', mechanism: 'm', category, impactMetricCode: code,
  expectedDelta: delta, deltaKind: 'absolute', timeToImpactDays: 90, effort: 'medium',
  confidence: 0.5, confidenceBasis: 'b', source: 'analyst', status: 'validated',
});
const run = (l: Lever) => new Map(runScenario('s', metrics, [l],
  [{ scenarioId: 's', leverId: 'l', appliedDelta: l.expectedDelta, deltaKind: 'absolute' }], []).map((r) => [r.metricCode, r.value]));

const metrics = instantiateEbitdaTemplate('c', INPUTS, 'retail');

describe('generic EBITDA template', () => {
  it('REVENUE × (1+g)^n × margin → EBITDA_EXIT → MOIC', () => {
    const v = resolveMetrics(metrics);
    expect(v.get('REVENUE_EXIT')).toBeCloseTo(revExit(0.05), 6);
    expect(v.get('EBITDA_EXIT')).toBeCloseTo(revExit(0.05) * 0.15, 6);
    expect(v.get('MOIC')).toBeCloseTo((revExit(0.05) * 0.15 * 8 - (200 - 20 * 5)) / (60 * 8 - 200), 6);
  });

  it('COST_OPS lever: margin +1 pt moves exit only (entry price untouched)', () => {
    const r = run(lever('COST_OPS', 'EBITDA_MARGIN', 0.01));
    expect(r.get('EBITDA_EXIT')).toBeCloseTo(revExit(0.05) * 0.16, 6);
    expect(r.get('EQUITY_ENTRY')).toBe(60 * 8 - 200);
  });

  it('VOLUME lever: growth +2 pts compounds to exit', () => {
    expect(run(lever('VOLUME', 'REVENUE_GROWTH', 0.02)).get('REVENUE_EXIT')).toBeCloseTo(revExit(0.07), 6);
  });

  it('rejects an archetype whose vocabulary lacks the codes it emits', () => {
    expect(() => instantiateEbitdaTemplate('c', INPUTS, 'nope' as never)).toThrow(/archetype/i);
  });
});
