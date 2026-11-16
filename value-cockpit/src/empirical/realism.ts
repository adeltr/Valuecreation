import type { InteractionRule, Lever, Metric } from '../domain/types';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';
import { SCENARIO_OPTIONS } from '../templates/build';

export interface Trajectory {
  /** Benchmark window matching the holding period: 3 or 5 years. */
  years: 3 | 5;
  marginDelta: { base: number; plan: number };   // EBITDA margin, exit − entry (fraction)
  revenueCagr: { base: number; plan: number };
}

/**
 * What the model implies from entry to exit — the same measures as the public benchmarks.
 * Engine-computed; the plan includes validated levers only. Null without entry EBITDA and exit
 * revenue (book-value and rNPV families, SaaS on ARR).
 */
export function impliedTrajectory(metrics: Metric[], levers: Lever[], rules: InteractionRule[]): Trajectory | null {
  const has = (c: string) => metrics.some((m) => m.code === c);
  if (!['EBITDA_ENTRY', 'REVENUE_EXIT', 'EBITDA_EXIT', 'HOLD_YEARS'].every(has)) return null;
  const base = resolveMetrics(metrics);
  // Entry revenue: the input when the template has one, otherwise the model run at year 0.
  let revenue0: number;
  try {
    revenue0 = has('REVENUE') ? base.get('REVENUE')!
      : resolveMetrics(metrics.map((m) => (m.code === 'HOLD_YEARS' ? { ...m, currentValue: 0 } : m)), ['REVENUE_EXIT']).get('REVENUE_EXIT')!;
  } catch {
    return null; // the model cannot be read at year 0: no comparison rather than a guess
  }
  const validated = levers.filter((l) => l.status === 'validated'
    && metrics.some((m) => m.code === l.impactMetricCode && !m.isCalculated));
  const plan = validated.length
    ? new Map(runScenario('realism', metrics, validated, validated.map((l) => ({
      scenarioId: 'realism', leverId: l.id, appliedDelta: l.expectedDelta, deltaKind: l.deltaKind,
    })), [], rules, SCENARIO_OPTIONS).map((r) => [r.metricCode, r.value]))
    : base;
  const hold = base.get('HOLD_YEARS')!;
  const entryMargin = base.get('EBITDA_ENTRY')! / revenue0;
  const margin = (v: Map<string, number>) => v.get('EBITDA_EXIT')! / v.get('REVENUE_EXIT')! - entryMargin;
  const cagr = (v: Map<string, number>) => (v.get('REVENUE_EXIT')! / revenue0) ** (1 / hold) - 1;
  return {
    years: hold <= 4 ? 3 : 5,
    marginDelta: { base: margin(base), plan: margin(plan) },
    revenueCagr: { base: cagr(base), plan: cagr(plan) },
  };
}
