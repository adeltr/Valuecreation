import type { SectorSpec } from './types';

// Umbrex « Agriculture Company » — 39 analyses (A–F), KPI Agriculture.
export const agriculture: SectorSpec = {
  archetype: 'agriculture',
  label: 'Agriculture',
  umbrexType: 'Agriculture Company',
  kpiFile: 'Agriculture.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'AREA_GROWTH', unit: 'percent', sources: '#4 rotation, #7 land-use, #29 greenhouse conversion' },
    { code: 'CROP_YIELD_GROWTH', unit: 'percent', sources: '#1 Crop Yield and Farm Productivity ; KPI Crop Yield' },
    { code: 'PRICE_GROWTH', unit: 'percent', sources: '#31 specialty/organic premium ; prix de marché = choix d\'analyste' },
    { code: 'INPUT_COST_RATE', unit: 'percent', sources: '#2, #5, #10, #11, #14 (semences, engrais, phyto, alimentation)' },
    { code: 'WATER_ENERGY_COST_RATE', unit: 'percent', sources: '#20 irrigation, #22 on-farm energy' },
    { code: 'LABOR_MACHINERY_COST_RATE', unit: 'percent', sources: '#28 machinery utilisation, #25 ; KPI Agricultural Worker Turnover' },
    { code: 'SGA_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'SOIL_ORGANIC_MATTER', unit: 'percent', sources: '#2, #8' },
    { code: 'LIVESTOCK_MORTALITY_RATE', unit: 'percent', sources: '#12, #18' },
    { code: 'IRRIGATION_EFFICIENCY', unit: 'percent', sources: '#20' },
    { code: 'CROP_INSURANCE_COVERAGE', unit: 'percent', sources: '#37' },
    { code: 'ORGANIC_SHARE', unit: 'percent', sources: '#31, #34' },
  ],
  calculated: [],
  formulas: {
    REVENUE_EXIT: 'REVENUE * ((1 + AREA_GROWTH) * (1 + CROP_YIELD_GROWTH) * (1 + PRICE_GROWTH)) ^ HOLD_YEARS',
    EBITDA_MARGIN_EXIT: '1 - INPUT_COST_RATE - WATER_ENERGY_COST_RATE - LABOR_MACHINERY_COST_RATE - SGA_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'PRECISION_AGRONOMY', target: 'CROP_YIELD_GROWTH', delta: 0.01, sources: '#1, #2, #3, #10, #11, #25', analyses: [1, 2, 3, 10, 11, 25] },
    { category: 'INPUT_OPTIMIZATION', target: 'INPUT_COST_RATE', delta: -0.01, sources: '#5, #11, #13, #14', analyses: [5, 11, 13, 14] },
    { category: 'WATER_ENERGY_EFFICIENCY', target: 'WATER_ENERGY_COST_RATE', delta: -0.01, sources: '#20, #22', analyses: [20, 22] },
    { category: 'MECHANIZATION', target: 'LABOR_MACHINERY_COST_RATE', delta: -0.01, sources: '#25, #28', analyses: [25, 28] },
    { category: 'PREMIUM_CHANNELS', target: 'PRICE_GROWTH', delta: 0.01, sources: '#31, #33, #34, #35', analyses: [31, 33, 34, 35] },
    { category: 'LAND_EXPANSION', target: 'AREA_GROWTH', delta: 0.01, sources: '#4, #7, #29', analyses: [4, 7, 29] },
  ],
  baseLevers: [
    { category: 'COST_PROCUREMENT', analyses: [14] },
    { category: 'WC_DIO', analyses: [30] },
  ],
  causes: [
    { category: 'WEATHER_CLIMATE', sources: '#21, #37', analyses: [21, 37], exogenous: true },
    { category: 'COMMODITY_PRICES', sources: '#37 ; prix agricoles', analyses: [37], exogenous: true },
    { category: 'PESTS_DISEASE', sources: '#3, #6, #18', analyses: [3, 6, 18] },
  ],
  catalogMetrics: {
    AREA_GROWTH: [4, 7, 29], CROP_YIELD_GROWTH: [1, 9, 26], PRICE_GROWTH: [31], INPUT_COST_RATE: [2, 5, 10, 11, 14],
    WATER_ENERGY_COST_RATE: [20, 22], LABOR_MACHINERY_COST_RATE: [25, 28], SOIL_ORGANIC_MATTER: [2, 8],
    LIVESTOCK_MORTALITY_RATE: [12, 18], IRRIGATION_EFFICIENCY: [20], CROP_INSURANCE_COVERAGE: [37], ORGANIC_SHARE: [31, 34],
  },
  demoInputs: {
    REVENUE: 200, AREA_GROWTH: 0.02, CROP_YIELD_GROWTH: 0.015, PRICE_GROWTH: 0.01, INPUT_COST_RATE: 0.35,
    WATER_ENERGY_COST_RATE: 0.10, LABOR_MACHINERY_COST_RATE: 0.18, SGA_RATE: 0.07,
    EBITDA_ENTRY: 60, ENTRY_MULTIPLE: 7, EXIT_MULTIPLE: 7, HOLD_YEARS: 5, NET_DEBT_ENTRY: 150, FCF_ANNUAL: 15,
  },
  // 200 × (1.02 × 1.015 × 1.01)^5 × (1 − 0.35 − 0.10 − 0.18 − 0.07)
  reference: { EBITDA_EXIT: 75.00482279765205 },
  approximations: [
    'Modèle centré cultures (surface × rendement × prix) ; l\'élevage (#12–#19) reste en diagnostic et dans le catalogue.',
    'Rendement et prix composent sans aléa climatique : le climat est une cause exogène, pas un scénario stochastique.',
    'SGA_RATE est un choix d\'analyste.',
  ],
};
