import type { SectorSpec } from './types';

// Umbrex « Medical Device Company » — 50 analyses (A–J), KPI Medical Devices.
export const medicalDevice: SectorSpec = {
  archetype: 'medical-device',
  label: 'Medical Device',
  umbrexType: 'Medical Device Company',
  kpiFile: 'Medical Devices.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'PROCEDURE_VOLUME_GROWTH', unit: 'percent', sources: '#22 market entry, #38 adoption, #39 KOL, #40 training ; KPI Adoption Rate for New Devices' },
    { code: 'ASP_GROWTH', unit: 'percent', sources: '#19 reimbursement & coding, #20 HEOR, #23, #24 HTA' },
    { code: 'GROSS_MARGIN', unit: 'percent', sources: '#28, #30 scalability, #33, #37' },
    { code: 'RD_RATE', unit: 'percent', sources: '#25 pipeline & R&D portfolio, #29' },
    { code: 'SALES_MARKETING_RATE', unit: 'percent', sources: '#21, #22, #38, #39, #40' },
    { code: 'QUALITY_REGULATORY_COST_RATE', unit: 'percent', sources: '#1–#10 (réglementaire), #12 PMS, #17 recall readiness' },
    { code: 'OVERHEAD_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'CLINICAL_TRIAL_SUCCESS_RATE', unit: 'percent', sources: '#11, #13, #15 ; KPI Clinical Trial Success Rate' },
    { code: 'TIME_TO_MARKET', unit: 'days', sources: '#1, #4, #25' },
    { code: 'RECALL_RATE', unit: 'percent', sources: '#12, #17' },
    { code: 'NEW_PRODUCT_REVENUE_SHARE', unit: 'percent', sources: '#25, #26' },
    { code: 'REIMBURSEMENT_COVERAGE', unit: 'percent', sources: '#19, #24' },
  ],
  calculated: [],
  formulas: {
    REVENUE_EXIT: 'REVENUE * ((1 + PROCEDURE_VOLUME_GROWTH) * (1 + ASP_GROWTH)) ^ HOLD_YEARS',
    EBITDA_MARGIN_EXIT: 'GROSS_MARGIN - RD_RATE - SALES_MARKETING_RATE - QUALITY_REGULATORY_COST_RATE - OVERHEAD_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'PHYSICIAN_ADOPTION', target: 'PROCEDURE_VOLUME_GROWTH', delta: 0.01, sources: '#38, #39, #40, #43', analyses: [38, 39, 40, 43] },
    { category: 'MARKET_ACCESS', target: 'ASP_GROWTH', delta: 0.005, sources: '#19, #20, #23, #24', analyses: [19, 20, 23, 24] },
    { category: 'MANUFACTURING_SCALE', target: 'GROSS_MARGIN', delta: 0.01, sources: '#28, #30, #33, #37', analyses: [28, 30, 33, 37] },
    { category: 'REGULATORY_STRATEGY', target: 'QUALITY_REGULATORY_COST_RATE', delta: -0.005, sources: '#1, #4, #5, #6, #7', analyses: [1, 4, 5, 6, 7] },
    { category: 'PORTFOLIO_LIFECYCLE', target: 'RD_RATE', delta: -0.005, sources: '#25, #26, #29, #36', analyses: [25, 26, 29, 36] },
    { category: 'COMMERCIAL_EFFICIENCY', target: 'SALES_MARKETING_RATE', delta: -0.01, sources: '#21, #22', analyses: [21, 22] },
  ],
  baseLevers: [{ category: 'COST_PROCUREMENT', analyses: [31] }],
  causes: [
    { category: 'REIMBURSEMENT_PRESSURE', sources: '#19, #23', analyses: [19, 23], exogenous: true },
    { category: 'PRODUCT_QUALITY_RISK', sources: '#12, #17, #34', analyses: [12, 17, 34] },
  ],
  catalogMetrics: {
    PROCEDURE_VOLUME_GROWTH: [22, 38], ASP_GROWTH: [19, 20, 23], GROSS_MARGIN: [28, 30], RD_RATE: [25],
    SALES_MARKETING_RATE: [21, 38, 39, 40], QUALITY_REGULATORY_COST_RATE: [1, 2, 6, 7, 12, 17],
    CLINICAL_TRIAL_SUCCESS_RATE: [11, 13, 15], TIME_TO_MARKET: [1, 4, 25], RECALL_RATE: [12, 17],
    NEW_PRODUCT_REVENUE_SHARE: [25, 26], REIMBURSEMENT_COVERAGE: [19, 24],
  },
  demoInputs: {
    REVENUE: 300, PROCEDURE_VOLUME_GROWTH: 0.06, ASP_GROWTH: -0.01, GROSS_MARGIN: 0.68, RD_RATE: 0.09,
    SALES_MARKETING_RATE: 0.28, QUALITY_REGULATORY_COST_RATE: 0.04, OVERHEAD_RATE: 0.08, EBITDA_ENTRY: 57,
    ENTRY_MULTIPLE: 14, EXIT_MULTIPLE: 14, HOLD_YEARS: 5, NET_DEBT_ENTRY: 250, FCF_ANNUAL: 25,
  },
  // 300 × (1.06 × 0.99)^5 × (0.68 − 0.09 − 0.28 − 0.04 − 0.08)
  reference: { EBITDA_EXIT: 72.54043490269905 },
  approximations: [
    'Un portefeuille agrégé : pas de courbe d\'adoption par dispositif ni de pipeline probabilisé (diagnostics).',
    'Coût qualité-réglementaire en % du chiffre d\'affaires ; les ruptures (rappel, refus) sont des causes.',
    'OVERHEAD_RATE est un choix d\'analyste.',
  ],
};
