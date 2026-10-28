import type { SectorSpec } from './types';

// Umbrex « Health Payor Company » — 41 analyses, KPI Healthcare. EBITDA-valued (managed care).
export const healthPayor: SectorSpec = {
  archetype: 'health-payor',
  label: 'Health Payor',
  umbrexType: 'Health Payor Company',
  kpiFile: 'Healthcare.md',
  baseInputs: [],
  inputs: [
    { code: 'MEMBERS', unit: 'count', sources: '#11 onboarding & retention, #40 MA / Medicaid, #41 enrollment (millions)' },
    { code: 'MEMBER_GROWTH', unit: 'percent', sources: '#11, #40, #41' },
    { code: 'PREMIUM_PMPM', unit: 'currency', sources: '#2 premium rate setting (per member per month)' },
    { code: 'PREMIUM_TREND', unit: 'percent', sources: '#2 ; choix d\'analyste pour la tendance' },
    { code: 'MEDICAL_LOSS_RATIO', unit: 'percent', sources: '#1 (MLR)' },
    { code: 'ADMIN_EXPENSE_RATIO', unit: 'percent', sources: '#30 claims processing, #41 enrollment efficiency' },
  ],
  diagnostics: [
    { code: 'CLAIMS_DENIAL_RATE', unit: 'percent', sources: '#31' },
    { code: 'READMISSION_RATE', unit: 'percent', sources: '#21' },
    { code: 'CUSTOMER_RETENTION_RATE', unit: 'percent', sources: '#11 (member retention)' },
    { code: 'IN_NETWORK_UTILIZATION_RATE', unit: 'percent', sources: '#37' },
    { code: 'STAR_RATING', unit: 'ratio', sources: '#33, #40 (quality, Medicare Advantage stars)' },
    { code: 'NET_PROMOTER_SCORE', unit: 'ratio', sources: '#12 (NPS)' },
  ],
  calculated: [{ code: 'MEMBERS_EXIT', unit: 'count' }],
  formulas: {
    MEMBERS_EXIT: 'MEMBERS * (1 + MEMBER_GROWTH) ^ HOLD_YEARS',
    // millions of members × $ PMPM × 12 months = $m
    REVENUE_EXIT: 'MEMBERS_EXIT * PREMIUM_PMPM * 12 * (1 + PREMIUM_TREND) ^ HOLD_YEARS',
    EBITDA_EXIT: 'REVENUE_EXIT * (1 - MEDICAL_LOSS_RATIO - ADMIN_EXPENSE_RATIO)',
  },
  levers: [
    { category: 'CARE_MANAGEMENT', target: 'MEDICAL_LOSS_RATIO', delta: -0.005, sources: '#3, #16, #17, #18, #21, #22', analyses: [3, 16, 17, 18, 21, 22] },
    { category: 'PHARMACY_MANAGEMENT', target: 'MEDICAL_LOSS_RATIO', delta: -0.005, sources: '#6, #7', analyses: [6, 7] },
    { category: 'VALUE_BASED_CONTRACTING', target: 'MEDICAL_LOSS_RATIO', delta: -0.005, sources: '#9, #24, #25, #26', analyses: [9, 24, 25, 26] },
    { category: 'PAYMENT_INTEGRITY', target: 'MEDICAL_LOSS_RATIO', delta: -0.003, sources: '#31, #32', analyses: [31, 32] },
    { category: 'ADMIN_AUTOMATION', target: 'ADMIN_EXPENSE_RATIO', delta: -0.005, sources: '#30, #38, #41', analyses: [30, 38, 41] },
    { category: 'MEMBER_ENGAGEMENT', target: 'MEMBER_GROWTH', delta: 0.01, sources: '#11, #12, #13, #40', analyses: [11, 12, 13, 40] },
    { category: 'RATE_ADEQUACY', target: 'PREMIUM_TREND', delta: 0.005, sources: '#2', analyses: [2] },
  ],
  baseLevers: [{ category: 'COST_OPS', analyses: [30, 39] }],
  causes: [
    { category: 'MEDICAL_COST_TREND', sources: '#7 specialty drugs, #8 high-cost claimants', analyses: [7, 8], exogenous: true },
    { category: 'RISK_POOL_SELECTION', sources: '#5, #27', analyses: [5, 27] },
  ],
  catalogMetrics: {
    MEMBERS: [11, 40, 41], MEMBER_GROWTH: [11, 40, 41], PREMIUM_PMPM: [2], PREMIUM_TREND: [2], MEDICAL_LOSS_RATIO: [1, 3, 16],
    ADMIN_EXPENSE_RATIO: [30, 41], CLAIMS_DENIAL_RATE: [31], READMISSION_RATE: [21], CUSTOMER_RETENTION_RATE: [11],
    IN_NETWORK_UTILIZATION_RATE: [37], STAR_RATING: [33, 40], NET_PROMOTER_SCORE: [12],
  },
  demoInputs: {
    MEMBERS: 0.5, MEMBER_GROWTH: 0.03, PREMIUM_PMPM: 450, PREMIUM_TREND: 0.04, MEDICAL_LOSS_RATIO: 0.85,
    ADMIN_EXPENSE_RATIO: 0.10, EBITDA_ENTRY: 135, ENTRY_MULTIPLE: 12, EXIT_MULTIPLE: 12, HOLD_YEARS: 5,
    NET_DEBT_ENTRY: 500, FCF_ANNUAL: 60,
  },
  // 0.5 × 1.03^5 × 450 × 12 × 1.04^5 × (1 − 0.85 − 0.10)
  reference: { EBITDA_EXIT: 190.40861256851278 },
  approximations: [
    'MLR et ratio de frais tenus constants à la sortie : la tendance des primes compense celle des coûts médicaux.',
    'Membres en millions, prime par membre et par mois ; revenus de services (PBM, care delivery) non séparés.',
    'Capital réglementaire (RBC) non modélisé : bridge EBITDA, comme les payors cotés valorisés sur résultat.',
  ],
};
