import { describe, it, expect } from 'vitest';
import { instantiateAirlineTemplate } from './airline';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';
import { getActiveVocabulary } from '../ontology/registry';
import type { Lever, ScenarioLever } from '../domain/types';

// Units: ASK/RPK in millions, money in €m, yield & CASK in € per km, ancillary in € per pax.
const BASE_INPUTS = {
  ASK: 10_000, LOAD_FACTOR: 0.82, YIELD: 0.09, ANCILLARY_PER_PAX: 15, AVG_TRIP_KM: 1_500,
  CASK_EX_FUEL: 0.045, FUEL_CASK: 0.022, CAPACITY_GROWTH: 0.04,
  EBITDA_ENTRY: 150, ENTRY_MULTIPLE: 6, EXIT_MULTIPLE: 6, HOLD_YEARS: 5,
  NET_DEBT_ENTRY: 400, FCF_ANNUAL: 40,
};

const lever = (id: string, category: string, impactMetricCode: string, delta: number): Lever => ({
  id, nodeId: 'n1', causeId: null, label: id, mechanism: 'm',
  category, impactMetricCode, expectedDelta: delta, deltaKind: 'absolute',
  timeToImpactDays: 180, effort: 'medium', confidence: 0.6, confidenceBasis: 'analyst case',
  source: 'analyst', status: 'validated',
});
const sl = (l: Lever): ScenarioLever => ({ scenarioId: 's1', leverId: l.id, appliedDelta: l.expectedDelta, deltaKind: 'absolute' });

const askExit = 10_000 * 1.04 ** 5;
const ebitdaExit = (lf: number, fuelCask: number) => {
  const rpk = askExit * lf;
  return rpk * 0.09 + (rpk / 1_500) * 15 - askExit * (0.045 + fuelCask);
};

describe('airline template', () => {
  const metrics = instantiateAirlineTemplate('c1', BASE_INPUTS);

  it('resolves ASK → RPK → passengers → revenue − costs → EBITDA_EXIT → MOIC', () => {
    const v = resolveMetrics(metrics);
    expect(v.get('ASK_EXIT')).toBeCloseTo(askExit, 6);
    expect(v.get('RPK_EXIT')).toBeCloseTo(askExit * 0.82, 6);
    expect(v.get('PASSENGERS_EXIT')).toBeCloseTo(askExit * 0.82 / 1_500, 6);
    expect(v.get('EBITDA_EXIT')).toBeCloseTo(ebitdaExit(0.82, 0.022), 6);
    const equityEntry = 150 * 6 - 400;
    const netDebtExit = 400 - 40 * 5;
    expect(v.get('MOIC')).toBeCloseTo((ebitdaExit(0.82, 0.022) * 6 - netDebtExit) / equityEntry, 6);
  });

  it('every instantiated code belongs to the airline active vocabulary', () => {
    const vocab = getActiveVocabulary('airline');
    for (const x of metrics) expect(vocab.isMetricCode(x.code), x.code).toBe(true);
  });

  it('FUEL_EFFICIENCY lever: fuel CASK −0.2 cent → lower exit costs, higher MOIC, entry untouched', () => {
    const base = resolveMetrics(metrics);
    const l = lever('fuel', 'FUEL_EFFICIENCY', 'FUEL_CASK', -0.002);
    const r = new Map(runScenario('s1', metrics, [l], [sl(l)], []).map((x) => [x.metricCode, x.value]));
    expect(r.get('OPERATING_COSTS_EXIT')).toBeCloseTo(base.get('OPERATING_COSTS_EXIT')! - askExit * 0.002, 6);
    expect(r.get('EBITDA_EXIT')).toBeCloseTo(ebitdaExit(0.82, 0.020), 6);
    expect(r.get('EQUITY_ENTRY')).toBe(base.get('EQUITY_ENTRY'));
    expect(r.get('MOIC')!).toBeGreaterThan(base.get('MOIC')!);
  });

  it('NETWORK_OPTIMIZATION lever: load factor +2 pts lifts ticket AND ancillary revenue', () => {
    const l = lever('lf', 'NETWORK_OPTIMIZATION', 'LOAD_FACTOR', 0.02);
    const results = runScenario('s1', metrics, [l], [sl(l)], []);
    const r = new Map(results.map((x) => [x.metricCode, x.value]));
    const rpk = askExit * 0.84;
    expect(r.get('REVENUE_EXIT')).toBeCloseTo(rpk * 0.09 + (rpk / 1_500) * 15, 6);
    expect(r.get('EBITDA_EXIT')).toBeCloseTo(ebitdaExit(0.84, 0.022), 6);
    for (const x of results) expect(x.computedBy).toBe('engine');
  });
});
