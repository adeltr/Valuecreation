import type { SectorSpec } from './types';

// Umbrex « Auto Insurance Company » — 39 analyses, KPI Insurance. Book-value family (P/BV, docs/16).
export const autoInsurance: SectorSpec = {
  archetype: 'auto-insurance',
  label: 'Auto Insurance',
  umbrexType: 'Auto Insurance Company',
  kpiFile: 'Insurance.md',
  family: 'book_value',
  baseInputs: ['TAX_RATE'],
  inputs: [
    { code: 'POLICIES_IN_FORCE', unit: 'count', sources: 'KPI Policy In-force (millions)' },
    { code: 'POLICY_GROWTH', unit: 'percent', sources: '#8 pay-per-mile, #13 telematics, #17 non-standard' },
    { code: 'AVERAGE_PREMIUM', unit: 'currency', sources: '#1 rate adequacy, #7 territorial rating ; KPI Average Premium per Policy' },
    { code: 'CLAIM_FREQUENCY', unit: 'percent', sources: '#22 ; KPI Claim Frequency (sinistres par police et par an)' },
    { code: 'CLAIM_SEVERITY', unit: 'currency', sources: '#22, #25 ; KPI Claim Severity' },
    { code: 'EXPENSE_RATIO', unit: 'percent', sources: 'KPI Expense Ratio ; #14 premium leakage' },
    { code: 'INVESTMENT_YIELD', unit: 'percent', sources: 'KPI Investment Yield' },
    { code: 'FLOAT_RATIO', unit: 'ratio', sources: '#30 reserves ; KPI Unearned Premium Reserve — placements / primes' },
  ],
  diagnostics: [
    { code: 'SUBROGATION_RECOVERY_RATE', unit: 'percent', sources: '#24 ; KPI Net Subrogation Recoveries' },
    { code: 'CLAIMS_SETTLEMENT_DAYS', unit: 'days', sources: '#23' },
    { code: 'TELEMATICS_PENETRATION', unit: 'percent', sources: '#13, #36' },
    { code: 'THEFT_RECOVERY_RATE', unit: 'percent', sources: '#28' },
    { code: 'POLICY_RETENTION_RATE', unit: 'percent', sources: 'KPI Policy Renewal Rate ; #12' },
    { code: 'DIRECT_REPAIR_SHARE', unit: 'percent', sources: '#26, #38' },
  ],
  calculated: [
    { code: 'POLICIES_EXIT', unit: 'count' }, { code: 'NET_PREMIUMS_EARNED_EXIT', unit: 'currency' },
    { code: 'LOSS_RATIO', unit: 'percent' }, { code: 'UNDERWRITING_RESULT_EXIT', unit: 'currency' },
    { code: 'INVESTMENT_INCOME_EXIT', unit: 'currency' },
  ],
  formulas: {
    POLICIES_EXIT: 'POLICIES_IN_FORCE * (1 + POLICY_GROWTH) ^ HOLD_YEARS',
    NET_PREMIUMS_EARNED_EXIT: 'POLICIES_EXIT * AVERAGE_PREMIUM',            // millions × $ = $m
    LOSS_RATIO: 'CLAIM_FREQUENCY * CLAIM_SEVERITY / AVERAGE_PREMIUM',       // #22 frequency × severity
    UNDERWRITING_RESULT_EXIT: 'NET_PREMIUMS_EARNED_EXIT * (1 - LOSS_RATIO - EXPENSE_RATIO)',
    INVESTMENT_INCOME_EXIT: 'NET_PREMIUMS_EARNED_EXIT * FLOAT_RATIO * INVESTMENT_YIELD',
    NET_INCOME_EXIT: '(UNDERWRITING_RESULT_EXIT + INVESTMENT_INCOME_EXIT) * (1 - TAX_RATE)',
  },
  levers: [
    { category: 'RATING_SOPHISTICATION', target: 'AVERAGE_PREMIUM', delta: 12, sources: '#1, #7, #11, #19', analyses: [1, 7, 11, 19] },
    { category: 'LEAKAGE_CONTROL', target: 'AVERAGE_PREMIUM', delta: 10, sources: '#14', analyses: [14] },
    { category: 'TELEMATICS_UBI', target: 'CLAIM_FREQUENCY', delta: -0.002, sources: '#8, #13, #18, #35', analyses: [8, 13, 18, 35] },
    { category: 'REPAIR_NETWORK', target: 'CLAIM_SEVERITY', delta: -50, sources: '#25, #26, #27, #37, #38', analyses: [25, 26, 27, 37, 38] },
    { category: 'RECOVERY_SALVAGE', target: 'CLAIM_SEVERITY', delta: -20, sources: '#24, #28', analyses: [24, 28] },
    { category: 'CLAIMS_EXCELLENCE', target: 'CLAIM_SEVERITY', delta: -20, sources: '#23, #37', analyses: [23, 37] },
    { category: 'SEGMENT_GROWTH', target: 'POLICY_GROWTH', delta: 0.01, sources: '#8, #17, #33, #34, #36', analyses: [8, 17, 33, 34, 36] },
  ],
  baseLevers: [{ category: 'PRICING', analyses: [1, 6, 11, 12] }],
  causes: [
    { category: 'REPAIR_COST_INFLATION', sources: '#25, #27, #32', analyses: [25, 27, 32], exogenous: true },
    { category: 'RESERVE_RISK', sources: '#30', analyses: [30] },
  ],
  catalogMetrics: {
    POLICIES_IN_FORCE: [17, 21], POLICY_GROWTH: [8, 13, 17], AVERAGE_PREMIUM: [1, 7, 14], CLAIM_FREQUENCY: [22, 29],
    CLAIM_SEVERITY: [22, 25, 26], LOSS_RATIO: [29], FLOAT_RATIO: [30], SUBROGATION_RECOVERY_RATE: [24],
    CLAIMS_SETTLEMENT_DAYS: [23], TELEMATICS_PENETRATION: [13, 36], THEFT_RECOVERY_RATE: [28], DIRECT_REPAIR_SHARE: [26, 38],
  },
  demoInputs: {
    TAX_RATE: 0.25, POLICIES_IN_FORCE: 2, POLICY_GROWTH: 0.03, AVERAGE_PREMIUM: 1200, CLAIM_FREQUENCY: 0.07,
    CLAIM_SEVERITY: 12000, EXPENSE_RATIO: 0.25, INVESTMENT_YIELD: 0.04, FLOAT_RATIO: 0.8,
    BOOK_VALUE_ENTRY: 1500, NET_INCOME_ENTRY: 80, PAYOUT_RATIO: 0.3, ENTRY_MULTIPLE: 1.3, EXIT_MULTIPLE: 1.3, HOLD_YEARS: 5,
  },
  // NPE = 2 × 1.03^5 × 1200 ; LR = 0.07 × 12000 / 1200 = 0.70 ; (NPE × 0.05 + NPE × 0.8 × 0.04) × 0.75
  reference: { NET_INCOME_EXIT: 171.10885336667985 },
  approximations: [
    'Prime moyenne et coût moyen en termes constants : l\'inflation des réparations est une cause exogène, la hausse tarifaire un levier.',
    'Fréquence × sévérité / prime = ratio de sinistres (#22) ; frais de gestion des sinistres inclus dans la sévérité.',
    'Réserves et solvabilité en diagnostics ; placements = primes × FLOAT_RATIO à rendement constant.',
  ],
};
