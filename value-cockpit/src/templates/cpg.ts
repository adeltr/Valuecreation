import type { Metric } from '../domain/types';
import { getActiveVocabulary } from '../ontology/registry';

export type CpgInputs = {
  REVENUE: number;
  VOLUME_GROWTH: number;
  PRICE_MIX_GROWTH: number;
  GROSS_MARGIN: number;
  TRADE_SPEND_RATE: number;
  AP_RATE: number;
  OVERHEAD_RATE: number;
  EBITDA_ENTRY: number;
  ENTRY_MULTIPLE: number;
  EXIT_MULTIPLE: number;
  HOLD_YEARS: number;
  NET_DEBT_ENTRY: number;
  FCF_ANNUAL: number;
};

// Linkage formulas from data/analysis-library/cpg/_level2.md (analyst defaults: REVENUE = gross sales).
// Approximations (documented):
// - Gross-to-net margin of analysis #43: trade spend, A&P and overheads as shares of gross sales.
// - Volume and price-mix compound independently: no price elasticity of volume (lever
//   interactions = phase 3), so a price-mix lever never reduces volume by itself.
// - EBITDA_ENTRY is the historical input, so levers only move the exit year.
const FORMULAS: Record<string, string> = {
  REVENUE_EXIT: 'REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS',
  EBITDA_MARGIN_EXIT: 'GROSS_MARGIN - TRADE_SPEND_RATE - AP_RATE - OVERHEAD_RATE',
  EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

export function instantiateCpgTemplate(companyId: string, inputs: CpgInputs): Metric[] {
  const vocab = getActiveVocabulary('cpg');
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
