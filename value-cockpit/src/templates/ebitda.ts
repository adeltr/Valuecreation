import type { Metric } from '../domain/types';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';

export type EbitdaInputs = {
  REVENUE: number;
  REVENUE_GROWTH: number;
  EBITDA_MARGIN: number;
  EBITDA_ENTRY: number;
  ENTRY_MULTIPLE: number;
  EXIT_MULTIPLE: number;
  HOLD_YEARS: number;
  NET_DEBT_ENTRY: number;
  FCF_ANNUAL: number;
};

// Generic two-point bridge on base codes only (docs/11 level 1): any EBITDA-family
// archetype without its own sector template uses it.
// Approximations (documented): constant growth and margin to exit; EBITDA_ENTRY is the
// historical input, so levers on growth or margin never move the entry price.
const FORMULAS: Record<string, string> = {
  REVENUE_EXIT: 'REVENUE * (1 + REVENUE_GROWTH) ^ HOLD_YEARS',
  EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN',
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

export function instantiateEbitdaTemplate(companyId: string, inputs: EbitdaInputs, archetype: SectorArchetype): Metric[] {
  const vocab = getActiveVocabulary(archetype);
  const make = (code: string, value: number | null, formula: string | null): Metric => {
    if (!vocab.isMetricCode(code)) throw new Error(`Template emits unknown code: ${code}`);
    return {
      id: `${companyId}:${code}`, companyId, code, label: code,
      unit: vocab.metricMeta[code].unit, isCalculated: formula !== null, formula,
      currentValue: value, benchmarkValue: null, benchmarkSource: null,
    };
  };
  return [
    ...Object.entries(inputs).map(([code, value]) => make(code, value, null)),
    ...Object.entries(FORMULAS).map(([code, formula]) => make(code, null, formula)),
  ];
}
