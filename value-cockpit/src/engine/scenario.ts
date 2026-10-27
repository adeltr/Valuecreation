import type { Metric, Lever, ScenarioLever, ScenarioAssumption, ScenarioResult, InteractionRule } from '../domain/types';
import { resolveMetrics } from './resolver';

export function runScenario(
  scenarioId: string,
  metrics: Metric[],
  levers: Lever[],
  scenarioLevers: ScenarioLever[],
  assumptions: ScenarioAssumption[],
  rules: InteractionRule[] = [],
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

  const input = (code: string, role: string) => {
    const t = byCode.get(code);
    if (!t) throw new Error(`${role} targets missing metric: ${code}`);
    if (t.isCalculated) throw new Error(`Cannot perturb a calculated metric: ${t.code}`);
    return t;
  };

  // Levers — analyst gate (invariant 4) + delta semantics. Stacked deltas on one metric are
  // order-independent: (base + Σ absolute) × Π(1 + percent).
  const absolute = new Map<string, number>();
  const factor = new Map<string, number>();
  for (const sl of scenarioLevers) {
    const lever = leverById.get(sl.leverId);
    if (!lever) throw new Error(`Unknown lever: ${sl.leverId}`);
    if (lever.status !== 'validated') {
      throw new Error(`Lever "${lever.label}" is not validated by an analyst — refused in simulation`);
    }
    if (sl.deltaKind !== lever.deltaKind) {
      throw new Error(`deltaKind mismatch on "${lever.label}": scenario ${sl.deltaKind}, lever ${lever.deltaKind}`);
    }
    const code = input(lever.impactMetricCode, 'Lever').code;
    if (sl.deltaKind === 'percent') factor.set(code, (factor.get(code) ?? 1) * (1 + sl.appliedDelta));
    else absolute.set(code, (absolute.get(code) ?? 0) + sl.appliedDelta);
  }
  const beforeLevers = new Map(perturbed.map((x) => [x.code, x.currentValue ?? 0]));
  for (const code of new Set([...absolute.keys(), ...factor.keys()])) {
    const t = byCode.get(code)!;
    t.currentValue = ((t.currentValue ?? 0) + (absolute.get(code) ?? 0)) * (factor.get(code) ?? 1);
  }

  // Interaction rules — one step, computed on the lever-induced change of each source.
  const sources = new Set(rules.map((r) => r.sourceCode));
  for (const r of rules) {
    if (sources.has(r.targetCode)) throw new Error(`Interaction rules cannot chain: ${r.targetCode} is both a source and a target`);
    input(r.sourceCode, 'Interaction rule');
    const coefficient = input(r.coefficientCode, 'Interaction rule').currentValue ?? 0;
    const delta = (byCode.get(r.sourceCode)!.currentValue ?? 0) - beforeLevers.get(r.sourceCode)!;
    const t = input(r.targetCode, 'Interaction rule');
    t.currentValue = (t.currentValue ?? 0) + coefficient * delta;
  }

  const values = resolveMetrics(perturbed);
  return [...values].map(([metricCode, value]) => ({ scenarioId, metricCode, value, computedBy: 'engine' as const }));
}
