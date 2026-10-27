import type { MetricMeta } from '../base';

// Formula inputs (data/analysis-library/cpg/_level2.md, pile 1). REVENUE = gross sales;
// every rate is a share of REVENUE (gross-to-net logic of analysis #43).
export const CPG_FORMULA_INPUT_CODES = [
  'VOLUME_GROWTH',    // #10, #27, #31, #36, #39 — Sales Growth (%)
  'PRICE_MIX_GROWTH', // #13, #21, #23 — discount depth, price-pack, mix
  'GROSS_MARGIN',     // #6, #11, #13, #19, #21, #23, #42, #43
  'TRADE_SPEND_RATE', // #16, #42, #43 ; KPI Trade Spend Efficiency
  'AP_RATE',          // #1, #4, #10, #15 — marketing spend behind ROMI
  'OVERHEAD_RATE',    // analyst choice — no rate in the sources
] as const;

// Diagnostic benchmarked inputs — no formula v1 (pile 2)
export const CPG_DIAGNOSTIC_CODES = [
  'MARKET_SHARE',             // #10, #11, #19, #22, #27
  'OUT_OF_STOCK_RATE',        // #17
  'PRIVATE_LABEL_SHARE',      // #22
  'RETAILER_CONCENTRATION',   // #14 ; KPI Customer Concentration Ratio
  'NEW_PRODUCT_SUCCESS_RATE', // #34
  'PROMO_ROI',                // #16, #20, #42, #43
] as const;

export const CPG_METRIC_CODES = [...CPG_FORMULA_INPUT_CODES, ...CPG_DIAGNOSTIC_CODES] as const;

export const CPG_METRIC_META: Record<(typeof CPG_METRIC_CODES)[number], MetricMeta> = {
  VOLUME_GROWTH:            { unit: 'percent' },
  PRICE_MIX_GROWTH:         { unit: 'percent' },
  GROSS_MARGIN:             { unit: 'percent' },
  TRADE_SPEND_RATE:         { unit: 'percent' },
  AP_RATE:                  { unit: 'percent' },
  OVERHEAD_RATE:            { unit: 'percent' },
  MARKET_SHARE:             { unit: 'percent' },
  OUT_OF_STOCK_RATE:        { unit: 'percent' },
  PRIVATE_LABEL_SHARE:      { unit: 'percent' },
  RETAILER_CONCENTRATION:   { unit: 'percent' },
  NEW_PRODUCT_SUCCESS_RATE: { unit: 'percent' },
  PROMO_ROI:                { unit: 'ratio' },
};

// CPG-specific levers; PRICING, MIX, COST_PROCUREMENT, COST_OPS, WC_DIO come from the base.
export const CPG_LEVER_CATEGORIES = [
  'TRADE_SPEND_OPTIMIZATION', // TRADE_SPEND_RATE ↓ — #14, #16, #42, #43
  'MARKETING_EFFECTIVENESS',  // AP_RATE ↓ / VOLUME_GROWTH ↑ — #1, #4, #10, #15, #20
  'ROUTE_TO_MARKET',          // VOLUME_GROWTH ↑ — #11, #12, #27, #31, #32
  'IN_STORE_EXECUTION',       // VOLUME_GROWTH ↑ (out-of-stock ↓) — #17, #18, #19, #20
  'INNOVATION_NPD',           // VOLUME_GROWTH, PRICE_MIX_GROWTH ↑ — #34, #35, #36, #39
] as const;

// Qualitative only, never formulas (invariant 1)
export const CPG_CAUSE_CATEGORIES = [
  'RETAILER_POWER',   // #14, #22 ; KPI Retailer Dependence
  'COMMODITY_PRICES', // #26, #40 ; KPI Commodity Price Sensitivity — exogenous, never a lever
] as const;
