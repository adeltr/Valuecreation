import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';
import { instantiateSaasTemplate } from '../templates/saas';
import type { Lever, ScenarioLever, ScenarioAssumption } from '../domain/types';

const metrics = instantiateSaasTemplate('c1', {
  ARR: 100, GROSS_CHURN: 0.10, EXPANSION_RATE: 0.12, EBITDA_MARGIN: 0.20,
  ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 4,
  NET_DEBT_ENTRY: 60, FCF_ANNUAL: 8,
});

const churnLever = (status: Lever['status']): Lever => ({
  id: 'lev-churn', nodeId: 'n1', causeId: null,
  label: 'Onboarding & CS playbook', mechanism: 'Cut gross churn',
  category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
  expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
  effort: 'medium', confidence: 0.6, confidenceBasis: '2 portfolio cases',
  source: 'claude', status,
});

const sl: ScenarioLever[] = [{ scenarioId: 's1', leverId: 'lev-churn', appliedDelta: -0.02, deltaKind: 'absolute' }];

describe('runScenario', () => {
  it('REFUSES a non-validated lever (analyst gate, invariant 4)', () => {
    expect(() => runScenario('s1', metrics, [churnLever('hypothesis')], sl, []))
      .toThrow(/validated/i);
  });
  it('propagates churn -2pts to MOIC, all engine-computed', () => {
    const results = runScenario('s1', metrics, [churnLever('validated')], sl, []);
    const get = (c: string) => results.find((r) => r.metricCode === c)!;
    expect(get('NRR').value).toBeCloseTo(1.04, 10);
    expect(get('ARR_EXIT').value).toBeCloseTo(100 * 1.04 ** 4, 4);
    expect(results.every((r) => r.computedBy === 'engine')).toBe(true);
  });
  it('applies percent deltas relatively', () => {
    const pctLever = { ...churnLever('validated'), deltaKind: 'percent' as const };
    const slPct: ScenarioLever[] = [{ scenarioId: 's1', leverId: 'lev-churn', appliedDelta: -0.5, deltaKind: 'percent' }];
    const results = runScenario('s1', metrics, [pctLever], slPct, []);
    const churn = results.find((r) => r.metricCode === 'GROSS_CHURN')!;
    expect(churn.value).toBeCloseTo(0.05, 10);  // 0.10 * (1 - 0.5)
  });
  it('exit multiple sensitivity via assumptions yields distinct MOICs', () => {
    const lever = [churnLever('validated')];
    const moicAt = (mult: number) => {
      const a: ScenarioAssumption[] = [{ scenarioId: 's1', metricCode: 'EXIT_MULTIPLE', value: mult }];
      return runScenario('s1', metrics, lever, sl, a).find((r) => r.metricCode === 'MOIC')!.value;
    };
    expect(moicAt(7)).toBeLessThan(moicAt(8));
    expect(moicAt(8)).toBeLessThan(moicAt(9));
  });
  it('REFUSES a scenario deltaKind that differs from the validated lever', () => {
    const slMismatch: ScenarioLever[] = [{ scenarioId: 's1', leverId: 'lev-churn', appliedDelta: -0.02, deltaKind: 'percent' }];
    expect(() => runScenario('s1', metrics, [churnLever('validated')], slMismatch, []))
      .toThrow(/deltaKind/i);
  });
});
