import type { InteractionRule, Lever, Metric } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import type { Unit } from '../../ontology/base';
import { extractDependencies } from '../../engine/formula';
import { resolveMetrics } from '../../engine/resolver';
import { runScenario } from '../../engine/scenario';

export interface PathStep { code: string; formula: string | null }

export interface LeverCard {
  summary: string;
  target: { code: string; unit: Unit; current: number | null };
  path: PathStep[];
  /** Engine probe: MOIC change for +1 pt (percent metric) or +1 % (other units) of the target. */
  sensitivity: { step: { kind: 'absolute' | 'percent'; value: number }; moicDelta: number } | null;
  /** The lever's own impact — only once validated by the analyst (invariant 4). */
  impact: { moicBefore: number; moicAfter: number } | null;
  interactions: InteractionRule[];
  analyses: AnalysisRef[];
  dataToCollect: string[];
  improve: string[];
}

/** Shortest chain of formulas from `code` to MOIC (breadth-first on the driver tree). */
export function causalPath(metrics: Metric[], code: string, goal = 'MOIC'): PathStep[] {
  const byCode = new Map(metrics.map((m) => [m.code, m]));
  if (!byCode.has(code)) return [];
  const users = new Map<string, string[]>();
  for (const m of metrics) {
    if (!m.formula) continue;
    for (const d of extractDependencies(m.formula)) users.set(d, [...(users.get(d) ?? []), m.code]);
  }
  const prev = new Map<string, string | null>([[code, null]]);
  const queue = [code];
  while (queue.length) {
    const c = queue.shift()!;
    if (c === goal) break;
    for (const u of users.get(c) ?? []) if (!prev.has(u)) { prev.set(u, c); queue.push(u); }
  }
  if (!prev.has(goal)) return [];
  const chain: string[] = [];
  for (let c: string | null = goal; c !== null; c = prev.get(c)!) chain.unshift(c);
  return chain.map((c) => ({ code: c, formula: byCode.get(c)!.formula }));
}

const unique = (xs: string[]) => [...new Set(xs)];

export function buildLeverCard(lever: Lever, metrics: Metric[], catalog: AnalysisRef[], rules: InteractionRule[]): LeverCard {
  const target = metrics.find((m) => m.code === lever.impactMetricCode);
  const base = resolveMetrics(metrics);
  const moic = (r: { metricCode: string; value: number }[]) => r.find((x) => x.metricCode === 'MOIC')!.value;
  const run = (l: Lever, delta: number) => moic(runScenario('card', metrics, [l], [
    { scenarioId: 'card', leverId: l.id, appliedDelta: delta, deltaKind: l.deltaKind },
  ], [], rules));

  let sensitivity: LeverCard['sensitivity'] = null;
  if (target && !target.isCalculated) {
    const step = target.unit === 'percent' ? { kind: 'absolute' as const, value: 0.01 } : { kind: 'percent' as const, value: 0.01 };
    // A probe of the model, not of the lever: an analyst-owned synthetic lever of fixed size.
    const probe: Lever = { ...lever, id: '__probe', status: 'validated', source: 'analyst', deltaKind: step.kind };
    sensitivity = { step, moicDelta: run(probe, step.value) - base.get('MOIC')! };
  }

  const impact = lever.status === 'validated' && target && !target.isCalculated
    ? { moicBefore: base.get('MOIC')!, moicAfter: run(lever, lever.expectedDelta) }
    : null;

  const byLever = catalog.filter((a) => a.relatedLeverCategories.includes(lever.category));
  const byMetric = catalog.filter((a) => a.relatedMetricCodes.includes(lever.impactMetricCode) && !byLever.includes(a));
  const analyses = [...byLever, ...byMetric];

  return {
    summary: `${lever.category} agit sur ${lever.impactMetricCode} : ${lever.mechanism}`,
    target: { code: lever.impactMetricCode, unit: target?.unit ?? 'ratio', current: target?.currentValue ?? null },
    path: causalPath(metrics, lever.impactMetricCode),
    sensitivity, impact,
    interactions: rules.filter((r) => r.sourceCode === lever.impactMetricCode),
    analyses,
    dataToCollect: unique(analyses.slice(0, 3).flatMap((a) => a.dataRequired)),
    improve: unique((byLever.length ? byLever : analyses).flatMap((a) => a.improve)).slice(0, 6),
  };
}
