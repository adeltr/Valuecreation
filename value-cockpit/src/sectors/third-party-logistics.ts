import type { SectorSpec } from './types';

// Umbrex « Third Party Logistics Company » — 40 analyses (A–I), KPI Travel & Logistics.
export const thirdPartyLogistics: SectorSpec = {
  archetype: 'third-party-logistics',
  label: 'Third Party Logistics',
  umbrexType: 'Third Party Logistics Company',
  kpiFile: 'Travel & Logistics.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#25, #26 omni-channel, #28 I2M, #35 cross-border' },
    { code: 'PRICE_GROWTH', unit: 'percent', sources: '#21 contract & pricing structures, #23 gainsharing' },
    { code: 'ACCESSORIAL_REVENUE_RATIO', unit: 'ratio', sources: '#38 accessorial & ancillary fees, #33 reclassification' },
    { code: 'PURCHASED_TRANSPORT_RATE', unit: 'percent', sources: '#2 carriers, #9 ocean, #36 modal mix (Cost per Mile)' },
    { code: 'EMPTY_MILES_RATE', unit: 'percent', sources: '#10, #39 (Empty Miles Reduction)' },
    { code: 'WAREHOUSE_LABOR_RATE', unit: 'percent', sources: '#11–#14 (Units per Labor Hour)' },
    { code: 'FACILITY_COST_RATE', unit: 'percent', sources: '#1 network footprint, #12 slotting, #27 multi-client facilities' },
    { code: 'SGA_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'ON_TIME_DELIVERY', unit: 'percent', sources: '#3, #9 (On-Time Delivery / Arrival Rate) ; KPI OTIF' },
    { code: 'TRAILER_UTILIZATION', unit: 'percent', sources: '#4' },
    { code: 'UNITS_PER_LABOR_HOUR', unit: 'ratio', sources: '#14' },
    { code: 'CONSOLIDATION_RATE', unit: 'percent', sources: '#8' },
    { code: 'DRIVER_TURNOVER_RATE', unit: 'percent', sources: '#40' },
    { code: 'FACILITY_UTILIZATION', unit: 'percent', sources: '#1, #27' },
  ],
  calculated: [{ code: 'CORE_REVENUE_EXIT', unit: 'currency' }, { code: 'OPERATING_COSTS_EXIT', unit: 'currency' }],
  formulas: {
    CORE_REVENUE_EXIT: 'REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_GROWTH)) ^ HOLD_YEARS',
    REVENUE_EXIT: 'CORE_REVENUE_EXIT * (1 + ACCESSORIAL_REVENUE_RATIO)',
    // Transport bought per loaded mile; empty miles inflate it like scrap inflates material (#10, #39).
    OPERATING_COSTS_EXIT: 'CORE_REVENUE_EXIT * (PURCHASED_TRANSPORT_RATE / (1 - EMPTY_MILES_RATE) + WAREHOUSE_LABOR_RATE + FACILITY_COST_RATE + SGA_RATE)',
    EBITDA_EXIT: 'REVENUE_EXIT - OPERATING_COSTS_EXIT',
  },
  levers: [
    { category: 'CARRIER_PROCUREMENT', target: 'PURCHASED_TRANSPORT_RATE', delta: -0.01, sources: '#2, #9, #19, #24', analyses: [2, 9, 19, 24] },
    { category: 'BACKHAUL_OPTIMIZATION', target: 'EMPTY_MILES_RATE', delta: -0.03, sources: '#10, #39', analyses: [10, 39] },
    { category: 'WAREHOUSE_AUTOMATION', target: 'WAREHOUSE_LABOR_RATE', delta: -0.01, sources: '#11, #12, #13, #14', analyses: [11, 12, 13, 14] },
    { category: 'NETWORK_OPTIMIZATION', target: 'FACILITY_COST_RATE', delta: -0.01, sources: '#1, #6, #27, #34', analyses: [1, 6, 27, 34] },
    { category: 'ACCESSORIAL_PRICING', target: 'ACCESSORIAL_REVENUE_RATIO', delta: 0.01, sources: '#21, #23, #33, #37, #38', analyses: [21, 23, 33, 37, 38] },
    { category: 'VALUE_ADDED_SERVICES', target: 'VOLUME_GROWTH', delta: 0.01, sources: '#25, #26, #28', analyses: [25, 26, 28] },
  ],
  baseLevers: [{ category: 'COST_OPS', analyses: [15, 16, 17, 20] }],
  causes: [
    { category: 'FREIGHT_RATES', sources: '#19, #36', analyses: [19, 36], exogenous: true },
    { category: 'LABOR', sources: '#40', analyses: [40] },
  ],
  catalogMetrics: {
    VOLUME_GROWTH: [25, 26, 28, 35], PRICE_GROWTH: [21, 23], ACCESSORIAL_REVENUE_RATIO: [33, 38], PURCHASED_TRANSPORT_RATE: [2, 9, 36],
    EMPTY_MILES_RATE: [10, 39], WAREHOUSE_LABOR_RATE: [11, 12, 13, 14], FACILITY_COST_RATE: [1, 12, 27],
    ON_TIME_DELIVERY: [3, 9], TRAILER_UTILIZATION: [4], UNITS_PER_LABOR_HOUR: [14], CONSOLIDATION_RATE: [8],
    DRIVER_TURNOVER_RATE: [40], FACILITY_UTILIZATION: [1, 27],
  },
  demoInputs: {
    REVENUE: 900, VOLUME_GROWTH: 0.04, PRICE_GROWTH: 0.01, ACCESSORIAL_REVENUE_RATIO: 0.03, PURCHASED_TRANSPORT_RATE: 0.55,
    EMPTY_MILES_RATE: 0.15, WAREHOUSE_LABOR_RATE: 0.12, FACILITY_COST_RATE: 0.06, SGA_RATE: 0.06, EBITDA_ENTRY: 128,
    ENTRY_MULTIPLE: 9, EXIT_MULTIPLE: 9, HOLD_YEARS: 5, NET_DEBT_ENTRY: 500, FCF_ANNUAL: 50,
  },
  // c = 900 × (1.04 × 1.01)^5 ; c × 1.03 − c × (0.55/0.85 + 0.12 + 0.06 + 0.06)
  reference: { EBITDA_EXIT: 164.50285022528476 },
  approximations: [
    'Activités transport et entreposage agrégées en taux de coût sur le chiffre d\'affaires cœur.',
    'Kilomètres à vide appliqués à tout le transport acheté (approximation des contrats au kilomètre).',
    'SGA_RATE est un choix d\'analyste.',
  ],
};
