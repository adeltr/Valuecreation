import type { Metric } from '../domain/types';
import { getActiveVocabulary } from '../ontology/registry';

export type SaasInputs = {
  ARR: number; GROSS_CHURN: number; EXPANSION_RATE: number; EBITDA_MARGIN: number;
  ENTRY_MULTIPLE: number; EXIT_MULTIPLE: number; HOLD_YEARS: number;
  NET_DEBT_ENTRY: number; FCF_ANNUAL: number;
};

const FORMULAS: Record<string, string> = {
  NRR: '1 + EXPANSION_RATE - GROSS_CHURN',
  ARR_EXIT: 'ARR * NRR ^ HOLD_YEARS',
  REVENUE: 'ARR',
  EBITDA_ENTRY: 'ARR * EBITDA_MARGIN',
  EBITDA_EXIT: 'ARR_EXIT * EBITDA_MARGIN',
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

export function instantiateSaasTemplate(companyId: string, inputs: SaasInputs): Metric[] {
  const vocab = getActiveVocabulary('saas');
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
