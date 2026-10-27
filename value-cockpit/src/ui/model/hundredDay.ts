import type { Lever } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';

export interface PlanItem { lever: Lever; analyses: AnalysisRef[] }

const QUICK_WIN_DAYS = 100;

/** Validated levers only, split at 100 days, each with the analyses documenting its category. */
export function buildHundredDayPlan(levers: Lever[], catalog: AnalysisRef[]): { quickWins: PlanItem[]; later: PlanItem[] } {
  const items = levers
    .filter((l) => l.status === 'validated')
    .sort((a, b) => a.timeToImpactDays - b.timeToImpactDays)
    .map((lever) => ({ lever, analyses: catalog.filter((a) => a.relatedLeverCategories.includes(lever.category)) }));
  return {
    quickWins: items.filter((i) => i.lever.timeToImpactDays <= QUICK_WIN_DAYS),
    later: items.filter((i) => i.lever.timeToImpactDays > QUICK_WIN_DAYS),
  };
}

/** Exploration mode: the protocols to run to confirm or refute a driver. Never values. */
export function analysesForMetric(catalog: AnalysisRef[], code: string): AnalysisRef[] {
  return catalog.filter((a) => a.relatedMetricCodes.includes(code));
}
