import type { SectorSpec } from './types';

// Umbrex « Life Insurance Company » — 49 analyses, KPI Insurance. Book-value family (P/BV, docs/16).
export const lifeInsurance: SectorSpec = {
  archetype: 'life-insurance',
  label: 'Life Insurance',
  umbrexType: 'Life Insurance Company',
  kpiFile: 'Insurance.md',
  family: 'book_value',
  baseInputs: ['TAX_RATE'],
  inputs: [
    { code: 'RESERVES', unit: 'currency', sources: 'KPI Life Insurance In-Force, Change in Insurance Reserves ; #7' },
    { code: 'RESERVE_GROWTH', unit: 'percent', sources: '#22 (Premium Growth, New Business Growth) ; KPI Annuity Net Flows' },
    { code: 'INVESTMENT_SPREAD', unit: 'percent', sources: '#29 (Investment Return) moins taux crédité ; KPI Investment Yield' },
    { code: 'GROSS_PREMIUMS', unit: 'currency', sources: 'KPI Premiums Written ; #22' },
    { code: 'PREMIUM_GROWTH', unit: 'percent', sources: '#22, #33 (Premium Growth)' },
    { code: 'BENEFITS_RATIO', unit: 'percent', sources: 'KPI Benefits Ratio ; #8, #13 (mortalité), #18, #20 (Claim/Loss Ratio)' },
    { code: 'EXPENSE_RATIO', unit: 'percent', sources: '#42 (Expense Ratio), #31 (Cost Ratio)' },
  ],
  diagnostics: [
    { code: 'LAPSE_RATE', unit: 'percent', sources: '#1, #4, #42 (Lapse Rate) ; KPI Policy Lapse Ratio' },
    { code: 'PERSISTENCY_RATE', unit: 'percent', sources: '#2, #5 ; KPI Persistency Ratio' },
    { code: 'SOLVENCY_RATIO', unit: 'ratio', sources: '#23, #24, #25 ; KPI Solvency Ratio' },
    { code: 'VNB_MARGIN', unit: 'percent', sources: '#14 (VNB)' },
    { code: 'MORTALITY_EXPERIENCE_RATIO', unit: 'ratio', sources: '#8, #12, #13 (actual / expected)' },
    { code: 'DURATION_GAP', unit: 'years', sources: '#29 ; KPI Asset-Liability Duration Gap' },
  ],
  calculated: [
    { code: 'RESERVES_EXIT', unit: 'currency' }, { code: 'GROSS_PREMIUMS_EXIT', unit: 'currency' },
    { code: 'SPREAD_INCOME_EXIT', unit: 'currency' }, { code: 'UNDERWRITING_MARGIN_EXIT', unit: 'currency' },
  ],
  formulas: {
    RESERVES_EXIT: 'RESERVES * (1 + RESERVE_GROWTH) ^ HOLD_YEARS',
    GROSS_PREMIUMS_EXIT: 'GROSS_PREMIUMS * (1 + PREMIUM_GROWTH) ^ HOLD_YEARS',
    SPREAD_INCOME_EXIT: 'RESERVES_EXIT * INVESTMENT_SPREAD',
    UNDERWRITING_MARGIN_EXIT: 'GROSS_PREMIUMS_EXIT * (1 - BENEFITS_RATIO - EXPENSE_RATIO)',
    NET_INCOME_EXIT: '(SPREAD_INCOME_EXIT + UNDERWRITING_MARGIN_EXIT) * (1 - TAX_RATE)',
  },
  levers: [
    { category: 'PERSISTENCY_PROGRAM', target: 'RESERVE_GROWTH', delta: 0.005, sources: '#1, #2, #3, #4, #39', analyses: [1, 2, 3, 4, 39] },
    { category: 'ALM_OPTIMIZATION', target: 'INVESTMENT_SPREAD', delta: 0.001, sources: '#29, #30', analyses: [29, 30] },
    { category: 'PRODUCT_MIX_OPTIMIZATION', target: 'BENEFITS_RATIO', delta: -0.01, sources: '#15, #16, #17, #18', analyses: [15, 16, 17, 18] },
    { category: 'MORTALITY_UNDERWRITING', target: 'BENEFITS_RATIO', delta: -0.005, sources: '#8, #12, #13, #41', analyses: [8, 12, 13, 41] },
    { category: 'REINSURANCE_OPTIMIZATION', target: 'BENEFITS_RATIO', delta: -0.003, sources: '#28, #34', analyses: [28, 34] },
    { category: 'DISTRIBUTION_EFFICIENCY', target: 'EXPENSE_RATIO', delta: -0.005, sources: '#31, #32, #42', analyses: [31, 32, 42] },
    { category: 'ADMIN_AUTOMATION', target: 'EXPENSE_RATIO', delta: -0.005, sources: '#38, #40', analyses: [38, 40] },
  ],
  baseLevers: [{ category: 'PRICING', analyses: [6, 21] }],
  causes: [
    { category: 'INTEREST_RATES', sources: '#25, #29, #30', analyses: [25, 29, 30], exogenous: true },
    { category: 'LONGEVITY_RISK', sources: '#28, #35', analyses: [28, 35] },
  ],
  catalogMetrics: {
    RESERVES: [7, 11], RESERVE_GROWTH: [22], INVESTMENT_SPREAD: [29], GROSS_PREMIUMS: [22], PREMIUM_GROWTH: [22, 33],
    BENEFITS_RATIO: [8, 13, 18, 20], EXPENSE_RATIO: [42, 31], LAPSE_RATE: [1, 4, 42], PERSISTENCY_RATE: [2, 5],
    SOLVENCY_RATIO: [23, 24, 25], VNB_MARGIN: [14], MORTALITY_EXPERIENCE_RATIO: [8, 12, 13], DURATION_GAP: [29],
  },
  demoInputs: {
    TAX_RATE: 0.25, RESERVES: 20000, RESERVE_GROWTH: 0.04, INVESTMENT_SPREAD: 0.012, GROSS_PREMIUMS: 2000,
    PREMIUM_GROWTH: 0.03, BENEFITS_RATIO: 0.80, EXPENSE_RATIO: 0.12,
    BOOK_VALUE_ENTRY: 2500, NET_INCOME_ENTRY: 280, PAYOUT_RATIO: 0.4, ENTRY_MULTIPLE: 0.9, EXIT_MULTIPLE: 0.9, HOLD_YEARS: 5,
  },
  // (20000 × 1.04^5 × 0.012 + 2000 × 1.03^5 × (1 − 0.80 − 0.12)) × 0.75
  reference: { NET_INCOME_EXIT: 358.11041134799996 },
  approximations: [
    'Résultat = marge financière (provisions × spread) + marge technique (primes × (1 − prestations − frais)) : pas d\'embedded value ni d\'IFRS 17 (CSM).',
    'Les prestations incluent la variation des provisions ; mortalité et longévité tenues à leur niveau d\'expérience.',
    'Solvabilité, VNB et duration gap en diagnostics ; le dividende n\'est pas plafonné par le capital requis.',
  ],
};
