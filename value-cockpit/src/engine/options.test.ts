import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';
import type { Lever, Metric, ScenarioLever } from '../domain/types';

const input = (code: string, v: number): Metric => ({
  id: code, companyId: 'c', code, label: code, unit: 'ratio', isCalculated: false,
  formula: null, currentValue: v, benchmarkValue: null, benchmarkSource: null,
});
const calc = (code: string, formula: string): Metric => ({ ...input(code, 0), isCalculated: true, formula, currentValue: null });
const metrics = [input('MARGIN', 0.1), input('YEARS', 5), input('COSTS', 2), calc('VALUE', '1000 * MARGIN - COSTS')];

const lever = (id: string, days: number, cost?: number): Lever => ({
  id, nodeId: 'MARGIN', causeId: null, label: id, mechanism: 'm', category: 'COST_OPS', impactMetricCode: 'MARGIN',
  expectedDelta: 0.01, deltaKind: 'absolute', timeToImpactDays: days, effort: 'low', confidence: 0.5, confidenceBasis: 'b',
  source: 'analyst', status: 'validated', ...(cost === undefined ? {} : { implementationCost: cost }),
});
const use = (l: Lever): ScenarioLever => ({ scenarioId: 's', leverId: l.id, appliedDelta: l.expectedDelta, deltaKind: l.deltaKind });
const run = (ls: Lever[], assumptions: { metricCode: string; value: number }[] = [], options = { horizonYearsCode: 'YEARS', costCode: 'COSTS' }) =>
  new Map(runScenario('s', metrics, ls, ls.map(use), assumptions.map((a) => ({ scenarioId: 's', ...a })), [], options).map((r) => [r.metricCode, r.value]));

describe('runScenario – horizon', () => {
  it('a lever whose first impact comes after the holding period does not move the exit', () => {
    expect(run([lever('in', 5 * 365)]).get('MARGIN')).toBeCloseTo(0.11, 12);
    expect(run([lever('late', 5 * 365 + 1)]).get('MARGIN')).toBe(0.1);
  });

  it('the horizon follows a scenario assumption on the holding period', () => {
    expect(run([lever('l', 4 * 365)], [{ metricCode: 'YEARS', value: 3 }]).get('MARGIN')).toBe(0.1);
  });

  it('without the option every validated lever applies (engine default)', () => {
    expect(run([lever('late', 99_999)], [], {} as never).get('MARGIN')).toBeCloseTo(0.11, 12);
  });
});

describe('runScenario – implementation cost', () => {
  it('adds the cost of the scenario levers to the cost input, on top of what the analyst entered', () => {
    const r = run([lever('a', 30, 3), lever('b', 30, 4), lever('free', 30)]);
    expect(r.get('COSTS')).toBe(2 + 3 + 4);
    expect(r.get('VALUE')).toBeCloseTo(1000 * 0.13 - 9, 10);
  });

  it('a lever beyond the horizon still costs what was spent on it', () => {
    const r = run([lever('late', 99_999, 5)]);
    expect(r.get('MARGIN')).toBe(0.1);
    expect(r.get('COSTS')).toBe(7);
  });

  it('refuses a costed lever when the model has no cost input, and a negative cost', () => {
    expect(() => run([lever('a', 30, 3)], [], { horizonYearsCode: 'YEARS', costCode: 'NOPE' })).toThrow(/NOPE/);
    expect(() => run([lever('a', 30, -1)])).toThrow(/cost/i);
    expect(() => run([lever('a', 30)], [], { horizonYearsCode: 'YEARS', costCode: 'NOPE' })).not.toThrow();
  });
});
