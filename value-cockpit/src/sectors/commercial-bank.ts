import type { SectorSpec } from './types';

// Umbrex « Commercial Bank » — 40 analyses, KPI Financial Services. Book-value family (P/BV, docs/16).
export const commercialBank: SectorSpec = {
  archetype: 'commercial-bank',
  label: 'Commercial Bank',
  umbrexType: 'Commercial Bank',
  kpiFile: 'Financial Services.md',
  family: 'book_value',
  baseInputs: ['TAX_RATE'],
  inputs: [
    { code: 'LOANS', unit: 'currency', sources: '#4 loan portfolio, #14 specialized lending' },
    { code: 'LOAN_GROWTH', unit: 'percent', sources: '#5, #9, #14' },
    { code: 'NET_INTEREST_MARGIN', unit: 'percent', sources: '#1, #10, #26, #27 ; KPI Net Interest Margin (NII / prêts)' },
    { code: 'NON_INTEREST_INCOME_SHARE', unit: 'percent', sources: '#2, #32, #33, #34, #37 ; KPI Non-interest income to total income' },
    { code: 'COST_INCOME_RATIO', unit: 'percent', sources: '#3, #28, #31 ; KPI Cost-to-Income Ratio' },
    { code: 'COST_OF_RISK', unit: 'percent', sources: '#4, #8, #15 ; KPI Provision for Loan Losses to Loans' },
  ],
  diagnostics: [
    { code: 'CET1_RATIO', unit: 'percent', sources: '#25 ; KPI Basel III Ratios' },
    { code: 'NPL_RATIO', unit: 'percent', sources: '#4, #8 ; KPI NPL Ratio' },
    { code: 'LOAN_TO_DEPOSIT_RATIO', unit: 'percent', sources: '#23, #24 ; KPI Loan-to-Deposit Ratio' },
    { code: 'LIQUIDITY_COVERAGE_RATIO', unit: 'ratio', sources: '#24 ; KPI LCR' },
    { code: 'COST_OF_FUNDS', unit: 'percent', sources: '#23' },
    { code: 'SECTOR_CONCENTRATION', unit: 'percent', sources: '#7' },
    { code: 'RWA_DENSITY', unit: 'percent', sources: '#22, #25 ; KPI Risk-Weighted Assets' },
  ],
  calculated: [
    { code: 'LOANS_EXIT', unit: 'currency' }, { code: 'NET_INTEREST_INCOME_EXIT', unit: 'currency' },
    { code: 'PROVISIONS_EXIT', unit: 'currency' },
  ],
  formulas: {
    LOANS_EXIT: 'LOANS * (1 + LOAN_GROWTH) ^ HOLD_YEARS',
    NET_INTEREST_INCOME_EXIT: 'LOANS_EXIT * NET_INTEREST_MARGIN',
    REVENUE_EXIT: 'NET_INTEREST_INCOME_EXIT / (1 - NON_INTEREST_INCOME_SHARE)',
    PROVISIONS_EXIT: 'LOANS_EXIT * COST_OF_RISK',
    NET_INCOME_EXIT: '(REVENUE_EXIT * (1 - COST_INCOME_RATIO) - PROVISIONS_EXIT) * (1 - TAX_RATE)',
  },
  levers: [
    { category: 'LOAN_PRICING', target: 'NET_INTEREST_MARGIN', delta: 0.001, sources: '#10, #27', analyses: [10, 27] },
    { category: 'DEPOSIT_FRANCHISE', target: 'NET_INTEREST_MARGIN', delta: 0.001, sources: '#23, #24, #26', analyses: [23, 24, 26] },
    { category: 'FEE_BUSINESS_GROWTH', target: 'NON_INTEREST_INCOME_SHARE', delta: 0.01, sources: '#2, #32, #33, #34, #37', analyses: [2, 32, 33, 34, 37] },
    { category: 'COST_TRANSFORMATION', target: 'COST_INCOME_RATIO', delta: -0.01, sources: '#3, #28, #31', analyses: [3, 28, 31] },
    { category: 'CREDIT_RISK_MANAGEMENT', target: 'COST_OF_RISK', delta: -0.001, sources: '#4, #5, #8, #15, #21', analyses: [4, 5, 8, 15, 21] },
    { category: 'ORIGINATION_GROWTH', target: 'LOAN_GROWTH', delta: 0.01, sources: '#9, #11, #12, #14, #35', analyses: [9, 11, 12, 14, 35] },
  ],
  baseLevers: [{ category: 'PRICING', analyses: [10, 37] }],
  causes: [
    { category: 'INTEREST_RATES', sources: '#1, #16, #26', analyses: [1, 16, 26], exogenous: true },
    { category: 'CREDIT_CYCLE', sources: '#4, #15, #16', analyses: [4, 15, 16], exogenous: true },
    { category: 'CYBER', sources: '#20', analyses: [20] },
  ],
  catalogMetrics: {
    LOANS: [4, 14], LOAN_GROWTH: [5, 9, 14], NET_INTEREST_MARGIN: [1, 10, 26, 27], NON_INTEREST_INCOME_SHARE: [2, 32, 33, 34],
    COST_INCOME_RATIO: [3, 28, 31], COST_OF_RISK: [4, 8, 15], CET1_RATIO: [25], NPL_RATIO: [4, 8],
    LOAN_TO_DEPOSIT_RATIO: [23, 24], LIQUIDITY_COVERAGE_RATIO: [24], COST_OF_FUNDS: [23], SECTOR_CONCENTRATION: [7],
    RWA_DENSITY: [22, 25],
  },
  demoInputs: {
    TAX_RATE: 0.25, LOANS: 10000, LOAN_GROWTH: 0.05, NET_INTEREST_MARGIN: 0.03, NON_INTEREST_INCOME_SHARE: 0.25,
    COST_INCOME_RATIO: 0.50, COST_OF_RISK: 0.004,
    BOOK_VALUE_ENTRY: 1200, NET_INCOME_ENTRY: 140, PAYOUT_RATIO: 0.4, ENTRY_MULTIPLE: 1.1, EXIT_MULTIPLE: 1.1, HOLD_YEARS: 5,
  },
  // L = 10000 × 1.05^5 ; rev = L × 0.03 / 0.75 ; (rev × 0.5 − L × 0.004) × 0.75
  reference: { NET_INCOME_EXIT: 153.15378750000002 },
  approximations: [
    'NIM rapportée aux prêts (pas aux actifs productifs) ; dépôts et titres via la NIM et en diagnostics.',
    'Commissions = part constante du revenu ; coût du risque constant sur le cycle (le cycle de crédit est une cause exogène).',
    'Croissance des prêts non plafonnée par le CET1 : la contrainte de capital reste un diagnostic.',
  ],
};
