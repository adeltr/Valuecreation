import type { SectorSpec } from './types';

// Umbrex « Pharmaceutical Company » — 37 analyses (A–G), KPI Pharmaceuticals.
export const pharma: SectorSpec = {
  archetype: 'pharma',
  label: 'Pharmaceutical',
  umbrexType: 'Pharmaceutical Company',
  kpiFile: 'Pharmaceuticals.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'BASE_PORTFOLIO_GROWTH', unit: 'percent', sources: '#21 pricing & reimbursement, #26, #31 generics share' },
    { code: 'LOE_REVENUE_AT_RISK', unit: 'percent', sources: '#34 patent expiry, #35 market exclusivity' },
    { code: 'GENERIC_EROSION_RATE', unit: 'percent', sources: '#17 (Market Erosion) biosimilars' },
    { code: 'LAUNCH_REVENUE_RATIO', unit: 'ratio', sources: '#1, #2, #5 (pipeline, risk-adjusted), #25 launch sequencing' },
    { code: 'GROSS_MARGIN', unit: 'percent', sources: '#12 GMP, #16 supply chain — choix d\'analyste' },
    { code: 'RD_RATE', unit: 'percent', sources: '#1, #3 (Cost per Candidate), #8 adaptive trials' },
    { code: 'SGA_RATE', unit: 'percent', sources: '#28 HCP engagement, #32 sales force, #33 specialty pharmacy' },
  ],
  diagnostics: [
    { code: 'CLINICAL_TRIAL_SUCCESS_RATE', unit: 'percent', sources: '#2 (Phase success rates)' },
    { code: 'PIPELINE_ATTRITION_RATE', unit: 'percent', sources: '#5' },
    { code: 'TIME_TO_MARKET', unit: 'days', sources: '#6, #9 (time saved with BTD)' },
    { code: 'COLD_CHAIN_DEVIATION_RATE', unit: 'percent', sources: '#16' },
    { code: 'PATIENT_ADHERENCE_RATE', unit: 'percent', sources: '#18' },
  ],
  calculated: [],
  formulas: {
    // Existing portfolio grows, then loses exclusivity on part of it; launches add revenue by exit.
    REVENUE_EXIT: 'REVENUE * (1 + BASE_PORTFOLIO_GROWTH) ^ HOLD_YEARS * (1 - LOE_REVENUE_AT_RISK * GENERIC_EROSION_RATE) + REVENUE * LAUNCH_REVENUE_RATIO',
    EBITDA_MARGIN_EXIT: 'GROSS_MARGIN - RD_RATE - SGA_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'PIPELINE_PRODUCTIVITY', target: 'LAUNCH_REVENUE_RATIO', delta: 0.02, sources: '#1, #2, #3, #5, #8', analyses: [1, 2, 3, 5, 8] },
    { category: 'LICENSING_BD', target: 'LAUNCH_REVENUE_RATIO', delta: 0.02, sources: '#29, #30', analyses: [29, 30] },
    { category: 'LIFECYCLE_MANAGEMENT', target: 'GENERIC_EROSION_RATE', delta: -0.05, sources: '#15, #18, #34, #35', analyses: [15, 18, 34, 35] },
    { category: 'MARKET_ACCESS', target: 'BASE_PORTFOLIO_GROWTH', delta: 0.005, sources: '#21, #22, #36', analyses: [21, 22, 36] },
    { category: 'SALES_FORCE_EFFECTIVENESS', target: 'SGA_RATE', delta: -0.01, sources: '#28, #32, #33', analyses: [28, 32, 33] },
    { category: 'RD_PRODUCTIVITY', target: 'RD_RATE', delta: -0.005, sources: '#3, #8, #23', analyses: [3, 8, 23] },
  ],
  baseLevers: [],
  causes: [
    { category: 'PATENT_CLIFF', sources: '#34, #35', analyses: [34, 35] },
    { category: 'BIOSIMILAR_COMPETITION', sources: '#17, #31', analyses: [17, 31] },
    { category: 'DRUG_PRICING_REGULATION', sources: '#14, #21, #27', analyses: [14, 21, 27], exogenous: true },
  ],
  catalogMetrics: {
    BASE_PORTFOLIO_GROWTH: [21, 26, 31], LOE_REVENUE_AT_RISK: [34, 35], GENERIC_EROSION_RATE: [17], LAUNCH_REVENUE_RATIO: [1, 2, 5, 25],
    GROSS_MARGIN: [12, 16], RD_RATE: [1, 3, 8], SGA_RATE: [28, 32, 33], CLINICAL_TRIAL_SUCCESS_RATE: [2],
    PIPELINE_ATTRITION_RATE: [5], TIME_TO_MARKET: [6, 9], COLD_CHAIN_DEVIATION_RATE: [16], PATIENT_ADHERENCE_RATE: [18],
  },
  demoInputs: {
    REVENUE: 2000, BASE_PORTFOLIO_GROWTH: 0.02, LOE_REVENUE_AT_RISK: 0.25, GENERIC_EROSION_RATE: 0.7, LAUNCH_REVENUE_RATIO: 0.15,
    GROSS_MARGIN: 0.75, RD_RATE: 0.18, SGA_RATE: 0.27, EBITDA_ENTRY: 600, ENTRY_MULTIPLE: 12, EXIT_MULTIPLE: 12,
    HOLD_YEARS: 5, NET_DEBT_ENTRY: 3000, FCF_ANNUAL: 300,
  },
  // (2000 × 1.02^5 × (1 − 0.25 × 0.7) + 2000 × 0.15) × (0.75 − 0.18 − 0.27)
  reference: { EBITDA_EXIT: 636.5199975840001 },
  approximations: [
    'Lancements en ratio du chiffre d\'affaires d\'entrée, déjà ajustés du risque : pas de rNPV par molécule (diagnostics).',
    'Érosion à la perte d\'exclusivité appliquée en une fois sur la part à risque pendant la détention.',
    'GROSS_MARGIN est un choix d\'analyste (aucune analyse de coût de revient).',
  ],
};
