import type { Metric } from '../domain/types';
import { evaluateFormula, extractDependencies } from './formula';
import { topoSort } from './graph';

export function resolveMetrics(metrics: Metric[]): Map<string, number> {
  const byCode = new Map(metrics.map((x) => [x.code, x]));
  const deps = new Map<string, string[]>();
  for (const x of metrics) {
    deps.set(x.code, x.isCalculated && x.formula ? extractDependencies(x.formula) : []);
  }

  const values = new Map<string, number>();
  for (const code of topoSort(deps)) {
    const metric = byCode.get(code);
    if (!metric) continue;
    if (metric.isCalculated && metric.formula) {
      const scope: Record<string, number> = {};
      for (const dep of extractDependencies(metric.formula)) {
        const v = values.get(dep);
        if (v === undefined) throw new Error(`Missing value for ${dep} (needed by ${code})`);
        scope[dep] = v;
      }
      values.set(code, evaluateFormula(metric.formula, scope));
    } else if (metric.currentValue !== null) {
      values.set(code, metric.currentValue);
    }
  }
  return values;
}
