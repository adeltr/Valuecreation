import type { Metric, Lever, ScenarioLever, ScenarioAssumption, ScenarioResult } from '../domain/types';
import { resolveMetrics } from './resolver';

export function runScenario(
  scenarioId: string,
  metrics: Metric[],
  levers: Lever[],
  scenarioLevers: ScenarioLever[],
  assumptions: ScenarioAssumption[],
): ScenarioResult[] {
  const leverById = new Map(levers.map((l) => [l.id, l]));
  const perturbed = metrics.map((x) => ({ ...x }));
  const byCode = new Map(perturbed.map((x) => [x.code, x]));

  // Analyst-set exogenous overrides (e.g. EXIT_MULTIPLE) — inputs only.
  for (const a of assumptions) {
    const t = byCode.get(a.metricCode);
    if (!t) throw new Error(`Assumption targets missing metric: ${a.metricCode}`);
    if (t.isCalculated) throw new Error(`Cannot assume a calculated metric: ${t.code}`);
    t.currentValue = a.value;
  }

  // Levers — analyst gate (invariant 4) + delta semantics.
  for (const sl of scenarioLevers) {
    const lever = leverById.get(sl.leverId);
    if (!lever) throw new Error(`Unknown lever: ${sl.leverId}`);
    if (lever.status !== 'validated') {
      throw new Error(`Lever "${lever.label}" is not validated by an analyst — refused in simulation`);
    }
    const t = byCode.get(lever.impactMetricCode);
    if (!t) throw new Error(`Lever targets missing metric: ${lever.impactMetricCode}`);
    if (t.isCalculated) throw new Error(`Cannot perturb a calculated metric: ${t.code}`);
    const base = t.currentValue ?? 0;
    t.currentValue = sl.deltaKind === 'percent' ? base * (1 + sl.appliedDelta) : base + sl.appliedDelta;
  }

  const values = resolveMetrics(perturbed);
  return [...values].map(([metricCode, value]) => ({ scenarioId, metricCode, value, computedBy: 'engine' as const }));
}
