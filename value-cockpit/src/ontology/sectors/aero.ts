import type { MetricMeta } from '../base';

// Operational inputs linked by formulas (doc 05, analyses #1, #3, #9, #11, #15)
export const AERO_FORMULA_INPUT_CODES = [
  'BOOK_TO_BILL', 'FIXED_PRICE_SHARE', 'COST_OVERRUN_RATE',
] as const;

// Diagnostic benchmarked inputs — no formula v1
export const AERO_DIAGNOSTIC_CODES = [
  'BACKLOG', 'ON_TIME_DELIVERY', 'WIN_RATE',
  'TOP5_CONTRACT_SHARE', 'FACILITY_UTILIZATION', 'MRO_CYCLE_DAYS',
] as const;

// Calculated metrics added by this extension
export const AERO_CALCULATED_CODES = [
  'EBITDA_MARGIN_EXIT',
] as const;

export const AERO_METRIC_CODES = [
  ...AERO_FORMULA_INPUT_CODES,
  ...AERO_DIAGNOSTIC_CODES,
  ...AERO_CALCULATED_CODES,
] as const;

export const AERO_METRIC_META: Record<(typeof AERO_METRIC_CODES)[number], MetricMeta> = {
  BOOK_TO_BILL:       { unit: 'ratio' },
  FIXED_PRICE_SHARE:  { unit: 'percent' },
  COST_OVERRUN_RATE:  { unit: 'percent' },
  BACKLOG:            { unit: 'currency' },
  ON_TIME_DELIVERY:   { unit: 'percent' },
  WIN_RATE:           { unit: 'percent' },
  TOP5_CONTRACT_SHARE:  { unit: 'percent' },
  FACILITY_UTILIZATION: { unit: 'percent' },
  MRO_CYCLE_DAYS:     { unit: 'days' },
  EBITDA_MARGIN_EXIT: { unit: 'percent' },
};

// "Steps to improve" lever categories (doc 05, analyses #1, #3, #5, #9, #10, #11, #12, #16)
export const AERO_LEVER_CATEGORIES = [
  'PROGRAM_EXECUTION',    // COST_OVERRUN_RATE ↓ — EVM discipline
  'CONTRACT_MIX',         // FIXED_PRICE_SHARE — renegotiate fixed-price/cost-plus
  'COMMERCIAL_PIPELINE',  // BOOK_TO_BILL ↑ — bid/no-bid, win rate
  'EXPORT_FMS',           // BOOK_TO_BILL ↑ — FMS/DCS expansion
  'MRO_EFFICIENCY',       // MRO_CYCLE_DAYS ↓
  'CAPACITY_UTILIZATION', // FACILITY_UTILIZATION ↑
  'SUPPLY_CHAIN_CONTROL', // COST_OVERRUN_RATE ↓ — dual sourcing
  'OFFSET_STRATEGY',      // BOOK_TO_BILL ↑ — industrial participation
  'WC_MILESTONES',        // DSO ↓ — payment milestones
] as const;

// Risk categories — qualitative only, never formulas (doc 05 + invariant 1)
export const AERO_CAUSE_CATEGORIES = [
  'GEOPOLITICAL', // analyses #2, #8 — export controls, alliances
  'PROGRAM',      // execution drift on long-cycle programmes
] as const;
