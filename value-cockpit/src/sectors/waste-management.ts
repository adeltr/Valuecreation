import type { SectorSpec } from './types';

// Umbrex « Waste Management Company » — 50 analyses (A–J), KPI Waste Management.
export const wasteManagement: SectorSpec = {
  archetype: 'waste-management',
  label: 'Waste Management',
  umbrexType: 'Waste Management Company',
  kpiFile: 'Waste Management.md',
  baseInputs: [],
  inputs: [
    { code: 'TONS_COLLECTED_MT', unit: 'count', sources: '#4 MSW growth, #25, #29 (Mt par an)' },
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#4 (Annual Growth Rate), #44 acquisitions' },
    { code: 'PRICE_PER_TON', unit: 'currency', sources: '#41 franchise fees, #42 contracts, #45 tipping fees' },
    { code: 'PRICE_GROWTH', unit: 'percent', sources: '#42, #45 — indexation contractuelle' },
    { code: 'RECYCLING_RATE', unit: 'percent', sources: '#8, #9 (Recycling Rate), #13, #38' },
    { code: 'COMMODITY_PRICE_PER_TON', unit: 'currency', sources: '#10 (Recycling Revenue), #11, #14' },
    { code: 'COLLECTION_COST_PER_TON', unit: 'currency', sources: '#25 route density, #26 transfer stations, #27 fleet' },
    { code: 'DISPOSAL_COST_PER_TON', unit: 'currency', sources: '#3 residuals, #20 landfill gas, #21 WTE' },
  ],
  diagnostics: [
    { code: 'REMAINING_LANDFILL_LIFE', unit: 'years', sources: '#1' },
    { code: 'ROUTE_DENSITY', unit: 'ratio', sources: '#25 (tons/mile)' },
    { code: 'DIVERSION_RATE', unit: 'percent', sources: '#13, #17, #28' },
    { code: 'MRF_RECOVERY_RATE', unit: 'percent', sources: '#8' },
    { code: 'LANDFILL_CLOSURE_LIABILITY', unit: 'currency', sources: '#1, #36' },
  ],
  calculated: [{ code: 'TONS_COLLECTED_EXIT', unit: 'count' }, { code: 'OPERATING_COSTS_EXIT', unit: 'currency' }],
  formulas: {
    TONS_COLLECTED_EXIT: 'TONS_COLLECTED_MT * (1 + VOLUME_GROWTH) ^ HOLD_YEARS',
    // Mt × $/t = $m. Recycled tons earn the commodity price and avoid disposal.
    REVENUE_EXIT: 'TONS_COLLECTED_EXIT * (PRICE_PER_TON * (1 + PRICE_GROWTH) ^ HOLD_YEARS + RECYCLING_RATE * COMMODITY_PRICE_PER_TON)',
    OPERATING_COSTS_EXIT: 'TONS_COLLECTED_EXIT * (COLLECTION_COST_PER_TON + DISPOSAL_COST_PER_TON * (1 - RECYCLING_RATE))',
    EBITDA_EXIT: 'REVENUE_EXIT - OPERATING_COSTS_EXIT',
  },
  levers: [
    { category: 'ROUTE_OPTIMIZATION', target: 'COLLECTION_COST_PER_TON', delta: -1, sources: '#25, #26, #29', analyses: [25, 26, 29] },
    { category: 'FLEET_CONVERSION', target: 'COLLECTION_COST_PER_TON', delta: -0.5, sources: '#27', analyses: [27] },
    { category: 'PRICING_DISCIPLINE', target: 'PRICE_GROWTH', delta: 0.01, sources: '#41, #42, #43, #45', analyses: [41, 42, 43, 45] },
    { category: 'DISPOSAL_INTERNALIZATION', target: 'DISPOSAL_COST_PER_TON', delta: -1, sources: '#3, #12, #26', analyses: [3, 12, 26] },
    { category: 'RECYCLING_VALUE', target: 'RECYCLING_RATE', delta: 0.02, sources: '#8, #9, #10, #14, #50', analyses: [8, 9, 10, 14, 50] },
    { category: 'WASTE_TO_ENERGY', target: 'DISPOSAL_COST_PER_TON', delta: -0.5, sources: '#7, #19, #20, #21', analyses: [7, 19, 20, 21] },
    { category: 'TUCK_IN_ACQUISITIONS', target: 'VOLUME_GROWTH', delta: 0.01, sources: '#44', analyses: [44] },
  ],
  baseLevers: [{ category: 'CAPEX_DISCIPLINE', analyses: [5, 12, 50] }],
  causes: [
    { category: 'COMMODITY_PRICES', sources: '#10, #11', analyses: [10, 11], exogenous: true },
    { category: 'ENVIRONMENTAL_LIABILITY', sources: '#1, #2, #36, #39', analyses: [1, 2, 36, 39] },
  ],
  catalogMetrics: {
    TONS_COLLECTED_MT: [4, 25, 29], VOLUME_GROWTH: [4, 44], PRICE_PER_TON: [41, 42, 45], PRICE_GROWTH: [42, 45],
    RECYCLING_RATE: [8, 9, 13, 38], COMMODITY_PRICE_PER_TON: [10, 11, 14], COLLECTION_COST_PER_TON: [25, 26, 27],
    DISPOSAL_COST_PER_TON: [3, 20, 21], REMAINING_LANDFILL_LIFE: [1], ROUTE_DENSITY: [25], DIVERSION_RATE: [13, 17, 28],
    MRF_RECOVERY_RATE: [8], LANDFILL_CLOSURE_LIABILITY: [1, 36], CAPEX: [5, 12, 50],
  },
  demoInputs: {
    TONS_COLLECTED_MT: 5, VOLUME_GROWTH: 0.02, PRICE_PER_TON: 110, PRICE_GROWTH: 0.02, RECYCLING_RATE: 0.20,
    COMMODITY_PRICE_PER_TON: 60, COLLECTION_COST_PER_TON: 45, DISPOSAL_COST_PER_TON: 35, EBITDA_ENTRY: 245,
    ENTRY_MULTIPLE: 11, EXIT_MULTIPLE: 11, HOLD_YEARS: 5, NET_DEBT_ENTRY: 1500, FCF_ANNUAL: 120,
  },
  // t = 5 × 1.02^5 ; t × (110 × 1.02^5 + 0.20 × 60) − t × (45 + 35 × 0.8)
  reference: { EBITDA_EXIT: 333.7022860211163 },
  approximations: [
    'Collecte, tri et élimination agrégés par tonne ; SG&A inclus dans les coûts par tonne.',
    'Le recyclage évite l\'élimination et rapporte le prix matière ; la volatilité de ce prix est une cause exogène.',
    'Pas de modélisation de la durée de vie des décharges ni des provisions de fermeture (diagnostics #1, #36).',
  ],
};
