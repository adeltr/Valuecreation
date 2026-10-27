import type { Metric } from '../domain/types';
import { makeTemplate, BRIDGE_FORMULAS } from './build';

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
  ...BRIDGE_FORMULAS,
};

const build = makeTemplate('cpg', FORMULAS);

export function instantiateCpgTemplate(companyId: string, inputs: CpgInputs): Metric[] {
  return build(companyId, inputs);
}
