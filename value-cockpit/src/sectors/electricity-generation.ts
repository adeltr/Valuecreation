import type { SectorSpec } from './types';

// Umbrex « Electricity Generation Company » — 47 analyses (A–J), KPI Energy.
export const electricityGeneration: SectorSpec = {
  archetype: 'electricity-generation',
  label: 'Electricity Generation',
  umbrexType: 'Electricity Generation Company',
  kpiFile: 'Energy.md',
  baseInputs: [],
  inputs: [
    { code: 'INSTALLED_CAPACITY_GW', unit: 'count', sources: '#1 Generation Capacity ; KPI Baseload Capacity' },
    { code: 'CAPACITY_GROWTH', unit: 'percent', sources: '#31 renewables build-out, #36 storage, #37 distributed generation' },
    { code: 'CAPACITY_FACTOR', unit: 'percent', sources: '#1, #4 (Capacity Factor) ; KPI Capacity Factor' },
    { code: 'REALIZED_POWER_PRICE', unit: 'currency', sources: '#11 PPA, #13 hedging, #14 capacity payments, #17 spot price ($/MWh)' },
    { code: 'HEAT_RATE', unit: 'ratio', sources: '#2, #3 (Heat Rate) — GJ par MWh' },
    { code: 'FUEL_COST_PER_GJ', unit: 'currency', sources: '#7, #8, #29 (Fuel Cost Exposure)' },
    { code: 'OM_COST_PER_MWH', unit: 'currency', sources: '#6 start-up costs, #42 maintenance planning, #12 LCOE' },
  ],
  diagnostics: [
    { code: 'FORCED_OUTAGE_RATE', unit: 'percent', sources: '#4' },
    { code: 'CARBON_INTENSITY', unit: 'ratio', sources: '#18, #22 ; KPI Carbon Intensity' },
    { code: 'RESERVE_MARGIN', unit: 'percent', sources: '#39, #40' },
    { code: 'HEDGE_COVERAGE', unit: 'percent', sources: '#13, #29' },
    { code: 'RENEWABLE_SHARE', unit: 'percent', sources: '#31' },
    { code: 'CURTAILMENT_RATE', unit: 'percent', sources: '#45' },
  ],
  calculated: [{ code: 'GENERATION_TWH_EXIT', unit: 'count' }, { code: 'OPERATING_COSTS_EXIT', unit: 'currency' }],
  formulas: {
    // GW × capacity factor × 8.76 = TWh ; TWh × $/MWh = $m.
    GENERATION_TWH_EXIT: 'INSTALLED_CAPACITY_GW * (1 + CAPACITY_GROWTH) ^ HOLD_YEARS * CAPACITY_FACTOR * 8.76',
    REVENUE_EXIT: 'GENERATION_TWH_EXIT * REALIZED_POWER_PRICE',
    OPERATING_COSTS_EXIT: 'GENERATION_TWH_EXIT * (HEAT_RATE * FUEL_COST_PER_GJ + OM_COST_PER_MWH)',
    EBITDA_EXIT: 'REVENUE_EXIT - OPERATING_COSTS_EXIT',
  },
  levers: [
    { category: 'AVAILABILITY_IMPROVEMENT', target: 'CAPACITY_FACTOR', delta: 0.02, sources: '#1, #4, #42', analyses: [1, 4, 42] },
    { category: 'HEAT_RATE_IMPROVEMENT', target: 'HEAT_RATE', delta: -0.2, sources: '#2, #3, #33', analyses: [2, 3, 33] },
    { category: 'FUEL_PROCUREMENT', target: 'FUEL_COST_PER_GJ', delta: -0.2, sources: '#7, #8, #9', analyses: [7, 8, 9] },
    { category: 'COMMERCIAL_OPTIMIZATION', target: 'REALIZED_POWER_PRICE', delta: 2, sources: '#11, #13, #14, #16, #17', analyses: [11, 13, 14, 16, 17] },
    { category: 'OM_EFFICIENCY', target: 'OM_COST_PER_MWH', delta: -0.5, sources: '#6, #42, #43', analyses: [6, 42, 43] },
    { category: 'RENEWABLE_BUILDOUT', target: 'CAPACITY_GROWTH', delta: 0.01, sources: '#31, #36, #37', analyses: [31, 36, 37] },
  ],
  baseLevers: [{ category: 'CAPEX_DISCIPLINE', analyses: [42, 43, 44] }],
  causes: [
    { category: 'FUEL_PRICE', sources: '#8, #29', analyses: [8, 29], exogenous: true },
    { category: 'POWER_MARKET_PRICES', sources: '#13, #17', analyses: [13, 17], exogenous: true },
    { category: 'WEATHER_CLIMATE', sources: '#28, #32', analyses: [28, 32], exogenous: true },
  ],
  catalogMetrics: {
    INSTALLED_CAPACITY_GW: [1], CAPACITY_GROWTH: [31, 36, 37], CAPACITY_FACTOR: [1, 4], REALIZED_POWER_PRICE: [11, 13, 14, 17],
    HEAT_RATE: [2, 3], FUEL_COST_PER_GJ: [7, 8, 29], OM_COST_PER_MWH: [6, 12, 42], FORCED_OUTAGE_RATE: [4],
    CARBON_INTENSITY: [18, 22], RESERVE_MARGIN: [39, 40], HEDGE_COVERAGE: [13, 29], RENEWABLE_SHARE: [31],
    CURTAILMENT_RATE: [45], CAPEX: [42],
  },
  demoInputs: {
    INSTALLED_CAPACITY_GW: 3, CAPACITY_GROWTH: 0.02, CAPACITY_FACTOR: 0.55, REALIZED_POWER_PRICE: 70, HEAT_RATE: 7.5,
    FUEL_COST_PER_GJ: 4, OM_COST_PER_MWH: 8, EBITDA_ENTRY: 460, ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 5,
    NET_DEBT_ENTRY: 1800, FCF_ANNUAL: 150,
  },
  // g = 3 × 1.02^5 × 0.55 × 8.76 ; EBITDA = g × 70 − g × (7.5 × 4 + 8)
  reference: { EBITDA_EXIT: 510.6682857424896 },
  approximations: [
    'Un parc agrégé (une capacité, un facteur de charge, un heat rate moyens) ; pas de dispatch par centrale (#5).',
    'Prix réalisé et coût du combustible en hypothèses : spreads et couverture restent des causes et diagnostics.',
    'Revenus de capacité et services système inclus dans le prix réalisé (#14).',
  ],
};
