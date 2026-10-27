import type { SectorSpec } from './types';

// Umbrex « Chemical Company » — 41 analyses (A–G), KPI Chemicals.
export const chemical: SectorSpec = {
  archetype: 'chemical',
  label: 'Chemical',
  umbrexType: 'Chemical Company',
  kpiFile: 'Chemicals.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#25 end-market demand, #27 expansion ; KPI Production Volume' },
    { code: 'PRICE_GROWTH', unit: 'percent', sources: '#13 pricing by segment, #26 specialty vs commodity' },
    { code: 'PLANT_UTILIZATION', unit: 'percent', sources: '#1 (CUR) ; KPI Plant Utilization Against Planned Capacity' },
    { code: 'FEEDSTOCK_COST_RATE', unit: 'percent', sources: '#36 ; KPI Feedstock Costs as a % of Sales' },
    { code: 'PRODUCT_YIELD', unit: 'percent', sources: '#3 (Product Yield), #8 (Reaction Efficiency) ; KPI Yield on Key Reactions' },
    { code: 'ENERGY_COST_RATE', unit: 'percent', sources: '#2 (Energy Cost per Unit) ; KPI Energy Intensity' },
    { code: 'MAINTENANCE_COST_RATE', unit: 'percent', sources: '#6 (Maintenance Cost per Unit) ; KPI Maintenance Cost as a % of Replacement Value' },
    { code: 'SGA_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'SPECIALTY_REVENUE_SHARE', unit: 'percent', sources: '#26, #33, #34' },
    { code: 'CATALYST_EFFICIENCY', unit: 'ratio', sources: '#4, #10' },
    { code: 'PROCESS_SAFETY_INCIDENTS', unit: 'count', sources: '#18 ; KPI Process Safety Incidents' },
    { code: 'CARBON_INTENSITY', unit: 'ratio', sources: '#16 ; KPI Carbon Emissions per Unit of Output' },
    { code: 'INNOVATION_RATE', unit: 'percent', sources: '#35 (Innovation Rate)' },
  ],
  calculated: [{ code: 'VOLUME_INDEX_EXIT', unit: 'ratio' }],
  formulas: {
    VOLUME_INDEX_EXIT: 'min((1 + VOLUME_GROWTH) ^ HOLD_YEARS, 1 / PLANT_UTILIZATION)',
    REVENUE_EXIT: 'REVENUE * VOLUME_INDEX_EXIT * (1 + PRICE_GROWTH) ^ HOLD_YEARS',
    // Feedstock per sellable unit = feedstock at 100 % yield / actual yield (#3, #8).
    EBITDA_MARGIN_EXIT: '1 - FEEDSTOCK_COST_RATE / PRODUCT_YIELD - ENERGY_COST_RATE - MAINTENANCE_COST_RATE - SGA_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'YIELD_IMPROVEMENT', target: 'PRODUCT_YIELD', delta: 0.02, sources: '#3, #4, #8, #10', analyses: [3, 4, 8, 10] },
    { category: 'ENERGY_EFFICIENCY', target: 'ENERGY_COST_RATE', delta: -0.01, sources: '#2, #16', analyses: [2, 16] },
    { category: 'FEEDSTOCK_SOURCING', target: 'FEEDSTOCK_COST_RATE', delta: -0.01, sources: '#14, #36, #38, #39', analyses: [14, 36, 38, 39] },
    { category: 'RELIABILITY_MAINTENANCE', target: 'MAINTENANCE_COST_RATE', delta: -0.005, sources: '#6, #9', analyses: [6, 9] },
    { category: 'SPECIALTY_MIX_SHIFT', target: 'PRICE_GROWTH', delta: 0.01, sources: '#13, #24, #26, #33, #34', analyses: [13, 24, 26, 33, 34] },
    { category: 'CAPACITY_DEBOTTLENECKING', target: 'PLANT_UTILIZATION', delta: -0.05, sources: '#1, #5, #12', analyses: [1, 5, 12] },
  ],
  baseLevers: [
    { category: 'WC_DIO', analyses: [11] },
    { category: 'WC_DSO', analyses: [11] },
    { category: 'CAPEX_DISCIPLINE', analyses: [12] },
    { category: 'PRICING', analyses: [13] },
  ],
  causes: [
    { category: 'COMMODITY_PRICES', sources: '#14, #36, #39 ; KPI Raw Material Price Volatility', analyses: [14, 36, 39], exogenous: true },
    { category: 'ENERGY_PRICES', sources: '#2, #16', analyses: [2, 16], exogenous: true },
  ],
  catalogMetrics: {
    VOLUME_GROWTH: [25, 27], PRICE_GROWTH: [13, 26], PLANT_UTILIZATION: [1, 5], FEEDSTOCK_COST_RATE: [36],
    PRODUCT_YIELD: [3, 8, 10], ENERGY_COST_RATE: [2], MAINTENANCE_COST_RATE: [6, 9], SPECIALTY_REVENUE_SHARE: [26, 33, 34],
    CATALYST_EFFICIENCY: [4, 10], PROCESS_SAFETY_INCIDENTS: [18], CARBON_INTENSITY: [16], INNOVATION_RATE: [35],
    DIO: [11], DSO: [11], DPO: [11], CAPEX: [12],
  },
  demoInputs: {
    REVENUE: 600, VOLUME_GROWTH: 0.05, PRICE_GROWTH: 0.01, PLANT_UTILIZATION: 0.88, FEEDSTOCK_COST_RATE: 0.45,
    PRODUCT_YIELD: 0.92, ENERGY_COST_RATE: 0.08, MAINTENANCE_COST_RATE: 0.04, SGA_RATE: 0.10,
    EBITDA_ENTRY: 175, ENTRY_MULTIPLE: 9, EXIT_MULTIPLE: 9, HOLD_YEARS: 5, NET_DEBT_ENTRY: 500, FCF_ANNUAL: 50,
  },
  // 600 × min(1.05^5, 1/0.88) × 1.01^5 × (1 − 0.45/0.92 − 0.08 − 0.04 − 0.10)
  reference: { EBITDA_EXIT: 208.43647930342894 },
  approximations: [
    'Le prix et le coût matière évoluent séparément : pas de spread produit–feedstock modélisé (cyclicité = cause COMMODITY_PRICES).',
    'La capacité plafonne le volume (#1) ; coûts en % du chiffre d\'affaires.',
    'SGA_RATE est un choix d\'analyste.',
  ],
};
