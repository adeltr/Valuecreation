import type { SectorSpec } from './types';

// Umbrex « Healthcare Provider » — 47 analyses (A–J), KPI Healthcare.
export const healthcareProvider: SectorSpec = {
  archetype: 'healthcare-provider',
  label: 'Healthcare Provider',
  umbrexType: 'Healthcare Provider',
  kpiFile: 'Healthcare.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#1 (Growth Rate), #38, #39 service lines / outpatient' },
    { code: 'REIMBURSEMENT_GROWTH', unit: 'percent', sources: '#10 CDI (Case Mix Index), #16 payer mix, #18, #19' },
    { code: 'BED_OCCUPANCY_RATE', unit: 'percent', sources: '#5, #46 (Bed Occupancy Rate) ; KPI BOR' },
    { code: 'REVENUE_LEAKAGE_RATE', unit: 'percent', sources: '#15 (Denial Rate, Write-Off Rate), #17' },
    { code: 'LABOR_COST_RATE', unit: 'percent', sources: '#30, #42 (Revenue per Staff Member), #43' },
    { code: 'SUPPLY_COST_RATE', unit: 'percent', sources: '#13, #14 (Cost per Discharge)' },
    { code: 'OTHER_OPEX_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'AVERAGE_LENGTH_OF_STAY', unit: 'days', sources: '#5 ; KPI ALOS' },
    { code: 'READMISSION_RATE', unit: 'percent', sources: '#3, #5, #12' },
    { code: 'CASE_MIX_INDEX', unit: 'ratio', sources: '#10 (CMI)' },
    { code: 'DAYS_IN_AR', unit: 'days', sources: '#15' },
    { code: 'OR_UTILIZATION', unit: 'percent', sources: '#8' },
    { code: 'STAFF_TURNOVER_RATE', unit: 'percent', sources: '#34, #42, #43' },
    { code: 'NO_SHOW_RATE', unit: 'percent', sources: '#21, #25, #36' },
  ],
  calculated: [{ code: 'VOLUME_INDEX_EXIT', unit: 'ratio' }],
  formulas: {
    // Beds cap the patient volume; a shorter stay frees bed-days (#5, #46).
    VOLUME_INDEX_EXIT: 'min((1 + VOLUME_GROWTH) ^ HOLD_YEARS, 1 / BED_OCCUPANCY_RATE)',
    // REVENUE = expected net revenue before denials and write-offs (#15).
    REVENUE_EXIT: 'REVENUE * VOLUME_INDEX_EXIT * (1 + REIMBURSEMENT_GROWTH) ^ HOLD_YEARS * (1 - REVENUE_LEAKAGE_RATE)',
    EBITDA_MARGIN_EXIT: '1 - LABOR_COST_RATE - SUPPLY_COST_RATE - OTHER_OPEX_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'LOS_OPTIMIZATION', target: 'BED_OCCUPANCY_RATE', delta: -0.03, sources: '#5, #6, #12, #46', analyses: [5, 6, 12, 46] },
    { category: 'REVENUE_CYCLE', target: 'REVENUE_LEAKAGE_RATE', delta: -0.01, sources: '#15, #17', analyses: [15, 17] },
    { category: 'WORKFORCE_PRODUCTIVITY', target: 'LABOR_COST_RATE', delta: -0.01, sources: '#30, #42, #43', analyses: [30, 42, 43] },
    { category: 'SUPPLY_STANDARDIZATION', target: 'SUPPLY_COST_RATE', delta: -0.01, sources: '#6, #13, #14', analyses: [6, 13, 14] },
    { category: 'CDI_PAYER_MIX', target: 'REIMBURSEMENT_GROWTH', delta: 0.005, sources: '#10, #16, #18, #19', analyses: [10, 16, 18, 19] },
    { category: 'SERVICE_LINE_GROWTH', target: null, delta: 0, sources: '#1, #22, #38, #39 — qualitatif tant que les lits plafonnent le volume', analyses: [1, 22, 38, 39] },
  ],
  baseLevers: [
    { category: 'WC_DSO', analyses: [15] },
    { category: 'CAPEX_DISCIPLINE', analyses: [45] },
  ],
  causes: [
    { category: 'REIMBURSEMENT_PRESSURE', sources: '#16, #17, #19', analyses: [16, 17, 19], exogenous: true },
    { category: 'LABOR', sources: '#42, #43', analyses: [42, 43] },
  ],
  catalogMetrics: {
    VOLUME_GROWTH: [1, 38, 39], REIMBURSEMENT_GROWTH: [10, 16], BED_OCCUPANCY_RATE: [5, 46], REVENUE_LEAKAGE_RATE: [15, 17],
    LABOR_COST_RATE: [30, 42], SUPPLY_COST_RATE: [13, 14], AVERAGE_LENGTH_OF_STAY: [5], READMISSION_RATE: [3, 5, 12],
    CASE_MIX_INDEX: [10], DAYS_IN_AR: [15], OR_UTILIZATION: [8], STAFF_TURNOVER_RATE: [34, 42, 43], NO_SHOW_RATE: [21, 25, 36],
    DSO: [15], CAPEX: [45],
  },
  demoInputs: {
    REVENUE: 1200, VOLUME_GROWTH: 0.04, REIMBURSEMENT_GROWTH: 0.02, BED_OCCUPANCY_RATE: 0.85, REVENUE_LEAKAGE_RATE: 0.04,
    LABOR_COST_RATE: 0.52, SUPPLY_COST_RATE: 0.17, OTHER_OPEX_RATE: 0.19, EBITDA_ENTRY: 138, ENTRY_MULTIPLE: 10,
    EXIT_MULTIPLE: 10, HOLD_YEARS: 5, NET_DEBT_ENTRY: 700, FCF_ANNUAL: 60,
  },
  // 1200 × min(1.04^5, 1/0.85) × 1.02^5 × 0.96 × (1 − 0.52 − 0.17 − 0.19)
  reference: { EBITDA_EXIT: 179.56250615807988 },
  approximations: [
    'Volume plafonné par les lits : quand le plafond est atteint, seule la réduction de durée de séjour libère de la croissance.',
    'Coûts en % du revenu net ; pas de distinction hospitalisation / ambulatoire.',
    'OTHER_OPEX_RATE est un choix d\'analyste.',
  ],
};
