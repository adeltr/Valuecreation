import type { SectorSpec } from './types';

// Umbrex « Retail Bank » — 45 analyses, KPI Financial Services. Book-value family (P/BV, docs/16).
export const retailBank: SectorSpec = {
  archetype: 'retail-bank',
  label: 'Retail Bank',
  umbrexType: 'Retail Bank',
  kpiFile: 'Financial Services.md',
  family: 'book_value',
  baseInputs: ['TAX_RATE'],
  inputs: [
    { code: 'CUSTOMERS', unit: 'count', sources: '#1, #35, #45 (millions)' },
    { code: 'CUSTOMER_GROWTH', unit: 'percent', sources: '#35, #45 ; #10, #42 (attrition)' },
    { code: 'REVENUE_PER_CUSTOMER', unit: 'currency', sources: '#4 (Annual Revenue per Customer), #9, #41' },
    { code: 'COST_TO_SERVE', unit: 'currency', sources: '#4 (Annual Cost to Serve), #9 ; #24 (Cost-to-Income)' },
    { code: 'LOANS_PER_CUSTOMER', unit: 'currency', sources: '#13, #14' },
    { code: 'COST_OF_RISK', unit: 'percent', sources: '#19, #21 ; KPI Provision for Loan Losses to Loans' },
  ],
  diagnostics: [
    { code: 'CROSS_SELL_RATIO', unit: 'ratio', sources: '#3, #41' },
    { code: 'NET_PROMOTER_SCORE', unit: 'ratio', sources: '#2 (NPS)' },
    { code: 'DIGITAL_ADOPTION_RATE', unit: 'percent', sources: '#7, #30' },
    { code: 'CUSTOMER_ATTRITION_RATE', unit: 'percent', sources: '#10, #42' },
    { code: 'NPL_RATIO', unit: 'percent', sources: '#16, #21 ; KPI NPL Ratio' },
    { code: 'CET1_RATIO', unit: 'percent', sources: '#26 ; KPI Basel III Ratios' },
    { code: 'DEPOSIT_GROWTH', unit: 'percent', sources: '#13, #36' },
  ],
  calculated: [
    { code: 'CUSTOMERS_EXIT', unit: 'count' }, { code: 'LOANS_EXIT', unit: 'currency' }, { code: 'PROVISIONS_EXIT', unit: 'currency' },
  ],
  formulas: {
    CUSTOMERS_EXIT: 'CUSTOMERS * (1 + CUSTOMER_GROWTH) ^ HOLD_YEARS',
    REVENUE_EXIT: 'CUSTOMERS_EXIT * REVENUE_PER_CUSTOMER',            // millions × $ = $m
    LOANS_EXIT: 'CUSTOMERS_EXIT * LOANS_PER_CUSTOMER',
    PROVISIONS_EXIT: 'LOANS_EXIT * COST_OF_RISK',
    NET_INCOME_EXIT: '(REVENUE_EXIT - CUSTOMERS_EXIT * COST_TO_SERVE - PROVISIONS_EXIT) * (1 - TAX_RATE)',
  },
  levers: [
    { category: 'CROSS_SELL', target: 'REVENUE_PER_CUSTOMER', delta: 5, sources: '#1, #3, #37, #41', analyses: [1, 3, 37, 41] },
    { category: 'DEPOSIT_PRICING', target: 'REVENUE_PER_CUSTOMER', delta: 3, sources: '#33, #34, #36', analyses: [33, 34, 36] },
    { category: 'DIGITAL_MIGRATION', target: 'COST_TO_SERVE', delta: -5, sources: '#7, #28, #30, #39', analyses: [7, 28, 30, 39] },
    { category: 'BRANCH_OPTIMIZATION', target: 'COST_TO_SERVE', delta: -5, sources: '#27, #29', analyses: [27, 29] },
    { category: 'ATTRITION_REDUCTION', target: 'CUSTOMER_GROWTH', delta: 0.005, sources: '#10, #15, #42', analyses: [10, 15, 42] },
    { category: 'CREDIT_RISK_MANAGEMENT', target: 'COST_OF_RISK', delta: -0.0005, sources: '#19, #21, #23', analyses: [19, 21, 23] },
    { category: 'FRAUD_PREVENTION', target: 'COST_OF_RISK', delta: -0.0002, sources: '#22', analyses: [22] },
  ],
  baseLevers: [{ category: 'PRICING', analyses: [34, 38] }],
  causes: [
    { category: 'INTEREST_RATES', sources: '#33, #43', analyses: [33, 43], exogenous: true },
    { category: 'CREDIT_CYCLE', sources: '#16, #19', analyses: [16, 19], exogenous: true },
    { category: 'FINTECH_COMPETITION', sources: '#7, #30, #45', analyses: [7, 30, 45] },
  ],
  catalogMetrics: {
    CUSTOMERS: [1, 35, 45], CUSTOMER_GROWTH: [35, 45], REVENUE_PER_CUSTOMER: [4, 9, 41], COST_TO_SERVE: [4, 9, 24],
    LOANS_PER_CUSTOMER: [13, 14], COST_OF_RISK: [19, 21], CROSS_SELL_RATIO: [3, 41], NET_PROMOTER_SCORE: [2],
    DIGITAL_ADOPTION_RATE: [7, 30], CUSTOMER_ATTRITION_RATE: [10, 42], NPL_RATIO: [16, 21], CET1_RATIO: [26],
    DEPOSIT_GROWTH: [13, 36],
  },
  demoInputs: {
    TAX_RATE: 0.25, CUSTOMERS: 3, CUSTOMER_GROWTH: 0.02, REVENUE_PER_CUSTOMER: 400, COST_TO_SERVE: 250,
    LOANS_PER_CUSTOMER: 8000, COST_OF_RISK: 0.003,
    BOOK_VALUE_ENTRY: 2500, NET_INCOME_ENTRY: 280, PAYOUT_RATIO: 0.5, ENTRY_MULTIPLE: 1.2, EXIT_MULTIPLE: 1.2, HOLD_YEARS: 5,
  },
  // c = 3 × 1.02^5 ; (c × 400 − c × 250 − c × 8000 × 0.003) × 0.75
  reference: { NET_INCOME_EXIT: 313.00690770720007 },
  approximations: [
    'Économie par client : revenu (marge d\'intérêt + commissions) et coût de service par client constants en termes réels.',
    'Le coût du risque s\'applique aux encours de prêts ; la fraude est comptée dans le coût du risque.',
    'Capital (CET1) et dépôts en diagnostics : la croissance n\'est pas plafonnée par le capital.',
  ],
};
