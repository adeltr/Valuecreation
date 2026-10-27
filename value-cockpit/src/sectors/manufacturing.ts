import type { SectorSpec } from './types';

// Umbrex « Manufacturing Company » — 47 analyses (A–G), KPI Manufacturing.
export const manufacturing: SectorSpec = {
  archetype: 'manufacturing',
  label: 'Manufacturing',
  umbrexType: 'Manufacturing Company',
  kpiFile: 'Manufacturing.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#8, #12, #17 (capacity vs demand)' },
    { code: 'PRICE_GROWTH', unit: 'percent', sources: 'choix d\'analyste — aucune analyse de prix' },
    { code: 'PLANT_UTILIZATION', unit: 'percent', sources: '#1, #8, #17, #46 ; KPI Capacity Utilization Rate' },
    { code: 'MATERIAL_COST_RATE', unit: 'percent', sources: '#18 BOM, #21, #32 ; KPI Materials Usage Variance' },
    { code: 'SCRAP_RATE', unit: 'percent', sources: '#7, #39 ; KPI Scrap Rate, First Pass Yield' },
    { code: 'CONVERSION_COST_RATE', unit: 'percent', sources: '#2 OEE, #5 lean, #10, #29, #32' },
    { code: 'MAINTENANCE_COST_RATE', unit: 'percent', sources: '#9, #27, #28 ; KPI Maintenance Costs as a % of Revenue' },
    { code: 'SGA_RATE', unit: 'percent', sources: 'choix d\'analyste — frais commerciaux et généraux' },
  ],
  diagnostics: [
    { code: 'OEE', unit: 'percent', sources: '#2, #11 ; KPI Overall Equipment Effectiveness' },
    { code: 'FIRST_PASS_YIELD', unit: 'percent', sources: '#7, #20, #39 ; KPI First Pass Yield' },
    { code: 'SUPPLIER_ON_TIME_DELIVERY', unit: 'percent', sources: '#19, #20, #21 ; KPI Supplier On-Time Delivery Rate' },
    { code: 'MANUFACTURING_LEAD_TIME', unit: 'days', sources: '#4, #29, #37 ; KPI Manufacturing Lead Time' },
    { code: 'MACHINE_DOWNTIME_RATE', unit: 'percent', sources: '#9, #27 ; KPI Machine Downtime Rate' },
  ],
  calculated: [{ code: 'VOLUME_INDEX_EXIT', unit: 'ratio' }],
  formulas: {
    // Volume cannot outgrow the installed capacity without capex (#1, #8, #17).
    VOLUME_INDEX_EXIT: 'min((1 + VOLUME_GROWTH) ^ HOLD_YEARS, 1 / PLANT_UTILIZATION)',
    REVENUE_EXIT: 'REVENUE * VOLUME_INDEX_EXIT * (1 + PRICE_GROWTH) ^ HOLD_YEARS',
    // Scrap consumes material: material per good unit = material at zero scrap / (1 − scrap) (#39).
    EBITDA_MARGIN_EXIT: '1 - MATERIAL_COST_RATE / (1 - SCRAP_RATE) - CONVERSION_COST_RATE - MAINTENANCE_COST_RATE - SGA_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'LEAN_OEE', target: 'CONVERSION_COST_RATE', delta: -0.02, sources: '#2, #5, #10, #11, #13, #29', analyses: [2, 5, 10, 11, 13, 29] },
    { category: 'QUALITY_YIELD', target: 'SCRAP_RATE', delta: -0.02, sources: '#7, #20, #39', analyses: [7, 20, 39] },
    { category: 'PREDICTIVE_MAINTENANCE', target: 'MAINTENANCE_COST_RATE', delta: -0.01, sources: '#9, #27, #28', analyses: [9, 27, 28] },
    { category: 'AUTOMATION', target: 'CONVERSION_COST_RATE', delta: -0.01, sources: '#24, #25, #26', analyses: [24, 25, 26] },
    { category: 'CAPACITY_DEBOTTLENECKING', target: 'PLANT_UTILIZATION', delta: -0.05, sources: '#1, #8, #17, #46 (more capacity → lower utilisation, more headroom)', analyses: [1, 8, 17, 46] },
  ],
  baseLevers: [
    { category: 'COST_PROCUREMENT', analyses: [18, 19, 21, 22] },
    { category: 'WC_DIO', analyses: [6, 14, 16, 22, 35] },
    { category: 'CAPEX_DISCIPLINE', analyses: [31, 33, 34] },
    { category: 'COST_OPS', analyses: [15, 30, 42] },
  ],
  causes: [
    { category: 'SUPPLIER_RISK', sources: '#19, #21, #23', analyses: [19, 21, 23] },
    { category: 'ENERGY_PRICES', sources: '#30, #42', analyses: [30, 42], exogenous: true },
  ],
  catalogMetrics: {
    PLANT_UTILIZATION: [1, 8, 17, 46], CONVERSION_COST_RATE: [2, 5, 10, 29, 32], MATERIAL_COST_RATE: [18, 21, 32],
    SCRAP_RATE: [7, 39], MAINTENANCE_COST_RATE: [9, 27, 28], VOLUME_GROWTH: [8, 12, 17], OEE: [2, 11],
    FIRST_PASS_YIELD: [7, 20, 39], SUPPLIER_ON_TIME_DELIVERY: [19, 20, 21], MANUFACTURING_LEAD_TIME: [4, 29, 37],
    MACHINE_DOWNTIME_RATE: [9, 27], DIO: [6, 14, 16, 35], CAPEX: [31, 33, 34],
  },
  demoInputs: {
    REVENUE: 500, VOLUME_GROWTH: 0.05, PRICE_GROWTH: 0.02, PLANT_UTILIZATION: 0.85,
    MATERIAL_COST_RATE: 0.40, SCRAP_RATE: 0.04, CONVERSION_COST_RATE: 0.22, MAINTENANCE_COST_RATE: 0.04, SGA_RATE: 0.12,
    EBITDA_ENTRY: 100, ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 5, NET_DEBT_ENTRY: 350, FCF_ANNUAL: 30,
  },
  // 500 × min(1.05^5, 1/0.85) × 1.02^5 × (1 − 0.40/0.96 − 0.22 − 0.04 − 0.12)
  reference: { EBITDA_EXIT: 132.05672352 },
  approximations: [
    'Coûts en % du chiffre d\'affaires : pas de levier opérationnel (coûts fixes) quand le volume croît.',
    'La capacité plafonne le volume ; l\'investissement qui la lève passe par PLANT_UTILIZATION (levier) et CAPEX (diagnostic).',
    'PRICE_GROWTH et SGA_RATE sont des choix d\'analyste (aucune analyse Umbrex dédiée).',
  ],
};
