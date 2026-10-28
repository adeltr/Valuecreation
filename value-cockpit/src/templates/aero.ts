import type { Metric } from '../domain/types';
import { makeTemplate } from './build';

export type AeroInputs = {
  REVENUE: number;
  EBITDA_MARGIN: number;
  BOOK_TO_BILL: number;
  FIXED_PRICE_SHARE: number;
  COST_OVERRUN_RATE: number;
  ENTRY_MULTIPLE: number;
  EXIT_MULTIPLE: number;
  HOLD_YEARS: number;
  NET_DEBT_ENTRY: number;
  FCF_ANNUAL: number;
};

// Formulas encode the key insight from analysis #1:
// cost overruns destroy margin ONLY on fixed-price contracts — on cost-plus they are rebilled.
// Hence: EBITDA_MARGIN_EXIT = EBITDA_MARGIN - COST_OVERRUN_RATE * FIXED_PRICE_SHARE
// This makes contract mix directly simulable as a lever (doc 05).
const FORMULAS: Record<string, string> = {
  REVENUE_EXIT: 'REVENUE * BOOK_TO_BILL ^ HOLD_YEARS',
  EBITDA_MARGIN_EXIT: 'EBITDA_MARGIN - COST_OVERRUN_RATE * FIXED_PRICE_SHARE',
  EBITDA_ENTRY: 'REVENUE * EBITDA_MARGIN',
  EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

const build = makeTemplate('aero', FORMULAS);

export function instantiateAeroTemplate(companyId: string, inputs: AeroInputs): Metric[] {
  return build(companyId, inputs);
}
