import type { AnalysisRef } from '../../catalog/types';

/** Exploration mode: the protocols to run to confirm or refute a driver. Never values. */
export function analysesForMetric(catalog: AnalysisRef[], code: string): AnalysisRef[] {
  return catalog.filter((a) => a.relatedMetricCodes.includes(code));
}
