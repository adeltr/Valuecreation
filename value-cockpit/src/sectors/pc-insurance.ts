import type { SectorSpec } from './types';

// Umbrex « P&C Insurance Company » — 45 analyses, KPI Insurance. Book-value family (P/BV, docs/16).
export const pcInsurance: SectorSpec = {
  archetype: 'pc-insurance',
  label: 'P&C Insurance',
  umbrexType: 'P&C Insurance Company',
  kpiFile: 'Insurance.md',
  family: 'book_value',
  baseInputs: ['TAX_RATE'],
  inputs: [
    { code: 'NET_PREMIUMS_EARNED', unit: 'currency', sources: 'KPI Premiums Written ; #38 (Premiums per Channel)' },
    { code: 'PREMIUM_GROWTH', unit: 'percent', sources: '#7 (New Business Growth Rate) ; KPI Direct Premiums Written Growth Rate' },
    { code: 'LOSS_RATIO', unit: 'percent', sources: '#1, #3, #11 (Loss Ratio) ; KPI Loss Ratio' },
    { code: 'EXPENSE_RATIO', unit: 'percent', sources: '#2, #3 (Expense Ratio) ; KPI Expense Ratio' },
    { code: 'INVESTMENT_YIELD', unit: 'percent', sources: '#34 (Portfolio Return) ; KPI Investment Yield' },
    { code: 'FLOAT_RATIO', unit: 'ratio', sources: 'KPI Unearned Premium Reserve, IBNR ; #15, #33 (réserves) — placements / primes' },
  ],
  diagnostics: [
    { code: 'RESERVE_DEVELOPMENT_RATIO', unit: 'percent', sources: '#15, #33, #36 (Reserve Development Ratio)' },
    { code: 'POLICY_RETENTION_RATE', unit: 'percent', sources: '#6, #13, #42 ; KPI Policy Renewal Rate' },
    { code: 'CATASTROPHE_LOSS_RATIO', unit: 'percent', sources: '#22, #24, #30 ; KPI Catastrophe Loss Ratio' },
    { code: 'SOLVENCY_RATIO', unit: 'ratio', sources: '#28, #45 (RBC Ratio) ; KPI Solvency Ratio' },
    { code: 'REINSURANCE_CEDED_RATIO', unit: 'percent', sources: '#25, #32 ; KPI Reinsurance Ratio' },
    { code: 'CLAIMS_SETTLEMENT_DAYS', unit: 'days', sources: '#16 (Average Settlement Time)' },
    { code: 'LITIGATION_RATE', unit: 'percent', sources: '#19, #31 (Litigation Frequency)' },
  ],
  calculated: [
    { code: 'NET_PREMIUMS_EARNED_EXIT', unit: 'currency' }, { code: 'COMBINED_RATIO', unit: 'percent' },
    { code: 'UNDERWRITING_RESULT_EXIT', unit: 'currency' }, { code: 'INVESTMENT_INCOME_EXIT', unit: 'currency' },
  ],
  formulas: {
    NET_PREMIUMS_EARNED_EXIT: 'NET_PREMIUMS_EARNED * (1 + PREMIUM_GROWTH) ^ HOLD_YEARS',
    COMBINED_RATIO: 'LOSS_RATIO + EXPENSE_RATIO',                         // #3
    UNDERWRITING_RESULT_EXIT: 'NET_PREMIUMS_EARNED_EXIT * (1 - COMBINED_RATIO)',
    INVESTMENT_INCOME_EXIT: 'NET_PREMIUMS_EARNED_EXIT * FLOAT_RATIO * INVESTMENT_YIELD',
    NET_INCOME_EXIT: '(UNDERWRITING_RESULT_EXIT + INVESTMENT_INCOME_EXIT) * (1 - TAX_RATE)',
  },
  levers: [
    { category: 'UNDERWRITING_DISCIPLINE', target: 'LOSS_RATIO', delta: -0.01, sources: '#4, #11, #12, #27', analyses: [4, 11, 12, 27] },
    { category: 'CLAIMS_EXCELLENCE', target: 'LOSS_RATIO', delta: -0.005, sources: '#16, #17, #19, #31', analyses: [16, 17, 19, 31] },
    { category: 'PORTFOLIO_STEERING', target: 'LOSS_RATIO', delta: -0.005, sources: '#8, #9, #37', analyses: [8, 9, 37] },
    { category: 'REINSURANCE_OPTIMIZATION', target: 'EXPENSE_RATIO', delta: -0.003, sources: '#25, #32', analyses: [25, 32] },
    { category: 'DISTRIBUTION_EFFICIENCY', target: 'EXPENSE_RATIO', delta: -0.005, sources: '#2, #21, #38', analyses: [2, 21, 38] },
    { category: 'RETENTION_GROWTH', target: 'PREMIUM_GROWTH', delta: 0.01, sources: '#6, #7, #13, #42', analyses: [6, 7, 13, 42] },
    { category: 'INVESTMENT_ALLOCATION', target: 'INVESTMENT_YIELD', delta: 0.0025, sources: '#34, #35', analyses: [34, 35] },
  ],
  baseLevers: [{ category: 'PRICING', analyses: [4, 27, 40] }],
  causes: [
    { category: 'CATASTROPHE_EXPOSURE', sources: '#24, #26, #30', analyses: [24, 26, 30], exogenous: true },
    { category: 'SOCIAL_INFLATION', sources: '#18, #31', analyses: [18, 31], exogenous: true },
    { category: 'RESERVE_RISK', sources: '#15, #20, #33, #36', analyses: [15, 20, 33, 36] },
  ],
  catalogMetrics: {
    NET_PREMIUMS_EARNED: [7, 38], PREMIUM_GROWTH: [7], LOSS_RATIO: [1, 3, 11, 37], EXPENSE_RATIO: [2, 3, 37],
    INVESTMENT_YIELD: [34], FLOAT_RATIO: [15, 33], RESERVE_DEVELOPMENT_RATIO: [15, 33, 36], POLICY_RETENTION_RATE: [6, 13, 42],
    CATASTROPHE_LOSS_RATIO: [22, 24, 30], SOLVENCY_RATIO: [28, 45], REINSURANCE_CEDED_RATIO: [25, 32],
    CLAIMS_SETTLEMENT_DAYS: [16], LITIGATION_RATE: [19, 31], COMBINED_RATIO: [3, 37, 38],
  },
  demoInputs: {
    TAX_RATE: 0.25, NET_PREMIUMS_EARNED: 1000, PREMIUM_GROWTH: 0.05, LOSS_RATIO: 0.65, EXPENSE_RATIO: 0.30,
    INVESTMENT_YIELD: 0.04, FLOAT_RATIO: 1.5, BOOK_VALUE_ENTRY: 1200, NET_INCOME_ENTRY: 60, PAYOUT_RATIO: 0.3,
    ENTRY_MULTIPLE: 1.4, EXIT_MULTIPLE: 1.4, HOLD_YEARS: 5,
  },
  // NPE = 1000 × 1.05^5 ; (NPE × (1 − 0.95) + NPE × 1.5 × 0.04) × 0.75
  reference: { NET_INCOME_EXIT: 105.29322890625002 },
  approximations: [
    'Ratios de sinistres et de frais nets de réassurance ; coût de la réassurance porté par le ratio de frais.',
    'Placements = primes × FLOAT_RATIO (réserves techniques), rendement moyen constant ; plus-values non modélisées.',
    'Développement des réserves et capital de solvabilité en diagnostics : le dividende n\'est pas plafonné par le RBC.',
  ],
};
