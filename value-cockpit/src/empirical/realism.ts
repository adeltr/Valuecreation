import type { InteractionRule, Lever, Metric } from '../domain/types';
import { resolveMetrics } from '../engine/resolver';
import { runScenario } from '../engine/scenario';

export interface Trajectory {
  /** Benchmark window matching the holding period: 3 or 5 years. */
  years: 3 | 5;
  marginDelta: { base: number; plan: number };   // EBITDA margin, exit − entry (fraction)
  revenueCagr: { base: number; plan: number };
}

/**
 * What the model implies from entry to exit — the same measures as the public benchmarks.
 * Engine-computed; the plan includes validated levers only. Null when the template has no
 * entry revenue, entry EBITDA and exit revenue (book-value and rNPV families).
 */
export function impliedTrajectory(metrics: Metric[], levers: Lever[], rules: InteractionRule[]): Trajectory | null {
  const has = (c: string) => metrics.some((m) => m.code === c);
  if (!['REVENUE', 'EBITDA_ENTRY', 'REVENUE_EXIT', 'EBITDA_EXIT', 'HOLD_YEARS'].every(has)) return null;
  const base = resolveMetrics(metrics);
  const validated = levers.filter((l) => l.status === 'validated'
    && metrics.some((m) => m.code === l.impactMetricCode && !m.isCalculated));
  const plan = validated.length
    ? new Map(runScenario('realism', metrics, validated, validated.map((l) => ({
      scenarioId: 'realism', leverId: l.id, appliedDelta: l.expectedDelta, deltaKind: l.deltaKind,
    })), [], rules).map((r) => [r.metricCode, r.value]))
    : base;
  const hold = base.get('HOLD_YEARS')!;
  const entryMargin = base.get('EBITDA_ENTRY')! / base.get('REVENUE')!;
  const margin = (v: Map<string, number>) => v.get('EBITDA_EXIT')! / v.get('REVENUE_EXIT')! - entryMargin;
  const cagr = (v: Map<string, number>) => (v.get('REVENUE_EXIT')! / base.get('REVENUE')!) ** (1 / hold) - 1;
  return {
    years: hold <= 4 ? 3 : 5,
    marginDelta: { base: margin(base), plan: margin(plan) },
    revenueCagr: { base: cagr(base), plan: cagr(plan) },
  };
}
