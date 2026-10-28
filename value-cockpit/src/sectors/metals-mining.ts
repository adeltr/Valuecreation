import type { SectorSpec } from './types';

// Umbrex « Metals & Mining Company » — 47 analyses (A–J), KPI Metals & Mining.
export const metalsMining: SectorSpec = {
  archetype: 'metals-mining',
  label: 'Metals & Mining',
  umbrexType: 'Metals & Mining Company',
  kpiFile: 'Metals & Mining.md',
  baseInputs: [],
  inputs: [
    { code: 'ORE_THROUGHPUT_MT', unit: 'count', sources: '#9 production capacity, #11 throughput (Mt de minerai)' },
    { code: 'THROUGHPUT_GROWTH', unit: 'percent', sources: '#9, #11, #39' },
    { code: 'HEAD_GRADE', unit: 'percent', sources: '#1 cut-off grade, #8, #15 dilution' },
    { code: 'RECOVERY_RATE', unit: 'percent', sources: '#8, #38, #40, #46 (Recovery Rate)' },
    { code: 'METAL_PRICE', unit: 'currency', sources: '#24, #29 ($ par tonne de métal) — hypothèse de marché' },
    { code: 'MINING_COST_PER_TONNE', unit: 'currency', sources: '#5 stripping ratio, #10 cash cost, #13, #14' },
    { code: 'PROCESSING_COST_PER_TONNE', unit: 'currency', sources: '#20 water & energy, #44, #46 (Processing Cost per Unit)' },
    { code: 'ROYALTY_RATE', unit: 'percent', sources: '#27, #43 (Royalty Payment)' },
  ],
  diagnostics: [
    { code: 'STRIPPING_RATIO', unit: 'ratio', sources: '#5' },
    { code: 'MINE_LIFE', unit: 'years', sources: '#9' },
    { code: 'RESERVE_REPLACEMENT_RATE', unit: 'ratio', sources: '#2 (RRR)' },
    { code: 'EQUIPMENT_UTILIZATION', unit: 'percent', sources: '#11, #12' },
    { code: 'LTIFR', unit: 'ratio', sources: '#36' },
    { code: 'CARBON_INTENSITY', unit: 'ratio', sources: '#18 (Emission Intensity)' },
  ],
  calculated: [
    { code: 'ORE_MILLED_EXIT', unit: 'count' }, { code: 'METAL_PRODUCED_EXIT', unit: 'count' },
    { code: 'OPERATING_COSTS_EXIT', unit: 'currency' },
  ],
  formulas: {
    ORE_MILLED_EXIT: 'ORE_THROUGHPUT_MT * (1 + THROUGHPUT_GROWTH) ^ HOLD_YEARS',
    METAL_PRODUCED_EXIT: 'ORE_MILLED_EXIT * HEAD_GRADE * RECOVERY_RATE',
    // Mt of metal × $/t = $m ; Mt of ore × $/t = $m.
    REVENUE_EXIT: 'METAL_PRODUCED_EXIT * METAL_PRICE',
    OPERATING_COSTS_EXIT: 'ORE_MILLED_EXIT * (MINING_COST_PER_TONNE + PROCESSING_COST_PER_TONNE)',
    EBITDA_EXIT: 'REVENUE_EXIT * (1 - ROYALTY_RATE) - OPERATING_COSTS_EXIT',
  },
  levers: [
    { category: 'GRADE_CONTROL', target: 'HEAD_GRADE', delta: 0.0003, sources: '#6, #15, #38', analyses: [6, 15, 38] },
    { category: 'RECOVERY_OPTIMIZATION', target: 'RECOVERY_RATE', delta: 0.01, sources: '#8, #40, #46', analyses: [8, 40, 46] },
    { category: 'THROUGHPUT_DEBOTTLENECKING', target: 'THROUGHPUT_GROWTH', delta: 0.01, sources: '#11, #12, #39', analyses: [11, 12, 39] },
    { category: 'MINING_COST_EFFICIENCY', target: 'MINING_COST_PER_TONNE', delta: -0.5, sources: '#5, #10, #13, #14', analyses: [5, 10, 13, 14] },
    { category: 'PROCESSING_ENERGY_EFFICIENCY', target: 'PROCESSING_COST_PER_TONNE', delta: -0.5, sources: '#20, #28, #44', analyses: [20, 28, 44] },
    { category: 'OFFTAKE_ROYALTY', target: 'ROYALTY_RATE', delta: -0.005, sources: '#27, #43', analyses: [27, 43] },
  ],
  baseLevers: [
    { category: 'CAPEX_DISCIPLINE', analyses: [16, 25] },
    { category: 'WC_DIO', analyses: [33] },
  ],
  causes: [
    { category: 'COMMODITY_PRICES', sources: '#24, #29, #30', analyses: [24, 29, 30], exogenous: true },
    { category: 'GEOTECHNICAL_RISK', sources: '#34, #35', analyses: [34, 35] },
    { category: 'GEOPOLITICAL', sources: '#41, #42', analyses: [41, 42] },
  ],
  catalogMetrics: {
    ORE_THROUGHPUT_MT: [9, 11], THROUGHPUT_GROWTH: [9, 11], HEAD_GRADE: [1, 8, 15], RECOVERY_RATE: [8, 38, 40, 46],
    METAL_PRICE: [24, 29], MINING_COST_PER_TONNE: [5, 10, 13, 14], PROCESSING_COST_PER_TONNE: [20, 44, 46],
    ROYALTY_RATE: [27, 43], STRIPPING_RATIO: [5], MINE_LIFE: [9], RESERVE_REPLACEMENT_RATE: [2],
    EQUIPMENT_UTILIZATION: [11, 12], LTIFR: [36], CARBON_INTENSITY: [18], CAPEX: [16, 25],
  },
  demoInputs: {
    ORE_THROUGHPUT_MT: 20, THROUGHPUT_GROWTH: 0.02, HEAD_GRADE: 0.006, RECOVERY_RATE: 0.88, METAL_PRICE: 9000,
    MINING_COST_PER_TONNE: 9, PROCESSING_COST_PER_TONNE: 12, ROYALTY_RATE: 0.04, EBITDA_ENTRY: 490,
    ENTRY_MULTIPLE: 6, EXIT_MULTIPLE: 6, HOLD_YEARS: 5, NET_DEBT_ENTRY: 1200, FCF_ANNUAL: 150,
  },
  // o = 20 × 1.02^5 ; o × 0.006 × 0.88 × 9000 × 0.96 − o × (9 + 12)
  reference: { EBITDA_EXIT: 543.631722202829 },
  approximations: [
    'Un minerai, un métal payable : pas de sous-produits ni de pénalités de concentré (#40 en catalogue).',
    'Teneur et coûts constants jusqu\'à la sortie : la séquence de mine (#5, #9) reste en diagnostic.',
    'METAL_PRICE est une hypothèse de marché (cause COMMODITY_PRICES), jamais un levier.',
  ],
};
