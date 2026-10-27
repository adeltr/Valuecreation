import type { MetricMeta } from '../base';

// Operational inputs linked by formulas (data/analysis-library/airline/_curation.md, pile 1).
// Sources: KPI vault (ASK, Load Factor, Yield, CASK, Average Length of Haul) and analyses
// #13 (RPK/ASK), #3 (yield), #8 (CASK), #23 (ancillary per passenger), #33 (fuel CASM).
export const AIRLINE_FORMULA_INPUT_CODES = [
  'ASK', 'LOAD_FACTOR', 'YIELD', 'ANCILLARY_PER_PAX',
  'CASK_EX_FUEL', 'FUEL_CASK', 'AVG_TRIP_KM',
  'CAPACITY_GROWTH', // analyst choice — no Umbrex source
] as const;

// Diagnostic benchmarked inputs — no formula v1 (pile 2; cargo out of scope)
export const AIRLINE_DIAGNOSTIC_CODES = [
  'FLEET_UTILIZATION', 'AIRCRAFT_DOWNTIME', 'ON_TIME_PERFORMANCE', 'TURNAROUND_MINUTES',
  'LABOR_COST_PER_FLIGHT', 'MARKET_SHARE', 'BREAKEVEN_LOAD_FACTOR', 'LOYALTY_BREAKAGE_RATE',
] as const;

// Calculated metrics added by this extension
export const AIRLINE_CALCULATED_CODES = [
  'ASK_EXIT', 'RPK_EXIT', 'PASSENGERS_EXIT', 'REVENUE_EXIT', 'OPERATING_COSTS_EXIT',
] as const;

export const AIRLINE_METRIC_CODES = [
  ...AIRLINE_FORMULA_INPUT_CODES,
  ...AIRLINE_DIAGNOSTIC_CODES,
  ...AIRLINE_CALCULATED_CODES,
] as const;

export const AIRLINE_METRIC_META: Record<(typeof AIRLINE_METRIC_CODES)[number], MetricMeta> = {
  ASK:                   { unit: 'count' },
  LOAD_FACTOR:           { unit: 'percent' },
  YIELD:                 { unit: 'currency' },  // per RPK
  ANCILLARY_PER_PAX:     { unit: 'currency' },
  CASK_EX_FUEL:          { unit: 'currency' },  // per ASK, excluding D&A (EBITDA level)
  FUEL_CASK:             { unit: 'currency' },  // per ASK
  AVG_TRIP_KM:           { unit: 'count' },
  CAPACITY_GROWTH:       { unit: 'percent' },
  FLEET_UTILIZATION:     { unit: 'ratio' },     // flight hours per aircraft-day
  AIRCRAFT_DOWNTIME:     { unit: 'percent' },
  ON_TIME_PERFORMANCE:   { unit: 'percent' },
  TURNAROUND_MINUTES:    { unit: 'count' },
  LABOR_COST_PER_FLIGHT: { unit: 'currency' },
  MARKET_SHARE:          { unit: 'percent' },
  BREAKEVEN_LOAD_FACTOR: { unit: 'percent' },
  LOYALTY_BREAKAGE_RATE: { unit: 'percent' },
  ASK_EXIT:              { unit: 'count' },
  RPK_EXIT:              { unit: 'count' },
  PASSENGERS_EXIT:       { unit: 'count' },
  REVENUE_EXIT:          { unit: 'currency' },
  OPERATING_COSTS_EXIT:  { unit: 'currency' },
};

// "Steps to improve" lever categories (curation §2)
export const AIRLINE_LEVER_CATEGORIES = [
  'NETWORK_OPTIMIZATION', // LOAD_FACTOR, CAPACITY_GROWTH — #1–6, #13
  'REVENUE_MANAGEMENT',   // YIELD — #3, #6, #22, #25
  'ANCILLARY',            // ANCILLARY_PER_PAX — #23, #26, #27
  'FLEET_PRODUCTIVITY',   // CASK_EX_FUEL via utilization — #8, #11, #14, #18
  'FUEL_EFFICIENCY',      // FUEL_CASK — #10, #30, #33, #36
  'CREW_PRODUCTIVITY',    // CASK_EX_FUEL — #12, #17
  'AIRPORT_GROUND_COST',  // CASK_EX_FUEL — #16, #19, #20, #21, #35
  'FLEET_FINANCING',      // leases/debt — #9, #34; qualitative v1 (net debt is not a lever target)
  'ALLIANCES',            // LOAD_FACTOR, YIELD — #38, #39
] as const;

// Qualitative only, never formulas (invariant 1)
export const AIRLINE_CAUSE_CATEGORIES = [
  'REGULATORY', // #7 traffic rights, #30 emissions, #32 safety
  'FUEL_PRICE', // #10, #33, #36 — exogenous, never a lever
  'LABOR',      // #12, #17
] as const;
