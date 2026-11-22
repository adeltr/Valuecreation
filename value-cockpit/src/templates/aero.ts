import type { Metric } from '../domain/types';
import { makeTemplate, BRIDGE_FORMULAS, type EbitdaBridgeInputs } from './build';

export type AeroInputs = EbitdaBridgeInputs & {
  REVENUE: number;
  EBITDA_MARGIN: number;
  BOOK_TO_BILL: number;
  FIXED_PRICE_SHARE: number;
  COST_OVERRUN_RATE: number;
};

// Formulas encode the key insight from analysis #1:
// cost overruns destroy margin ONLY on fixed-price contracts — on cost-plus they are rebilled.
// Hence: EBITDA_MARGIN_EXIT = EBITDA_MARGIN - COST_OVERRUN_RATE * FIXED_PRICE_SHARE
// This makes contract mix directly simulable as a lever (doc 05).
const FORMULAS: Record<string, string> = {
  REVENUE_EXIT: 'REVENUE * BOOK_TO_BILL ^ HOLD_YEARS',
  EBITDA_MARGIN_EXIT: 'EBITDA_MARGIN - COST_OVERRUN_RATE * FIXED_PRICE_SHARE',
  // EBITDA_ENTRY is the historical figure, an input: levers only move the exit year.
  EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  ...BRIDGE_FORMULAS,
};

const build = makeTemplate('aero', FORMULAS);

export function instantiateAeroTemplate(companyId: string, inputs: AeroInputs): Metric[] {
  return build(companyId, inputs);
}
