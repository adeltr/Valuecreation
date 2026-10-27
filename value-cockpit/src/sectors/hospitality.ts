import type { SectorSpec } from './types';

// Umbrex « Hospitality Company » (hotels) — 33 analyses (A–G), KPI Restaurant (lié à Hospitality).
export const hospitality: SectorSpec = {
  archetype: 'hospitality',
  label: 'Hospitality',
  umbrexType: 'Hospitality Company',
  kpiFile: 'Restaurant.md',
  baseInputs: [],
  inputs: [
    { code: 'ROOMS', unit: 'count', sources: '#1 (Occupancy Rate, ADR) — clés en exploitation' },
    { code: 'ROOM_GROWTH', unit: 'percent', sources: '#26 franchise vs management contracts, #28 — pipeline = choix d\'analyste' },
    { code: 'OCCUPANCY_RATE', unit: 'percent', sources: '#1, #2 (RevPAR), #4, #6, #15' },
    { code: 'ADR', unit: 'currency', sources: '#1, #2, #5, #13 (Average Daily Rate)' },
    { code: 'ADR_GROWTH', unit: 'percent', sources: '#2 RevPAR trend, #13 — choix d\'analyste' },
    { code: 'ANCILLARY_REVENUE_RATIO', unit: 'ratio', sources: '#8, #12, #19, #22, #29–#31 (F&B, spa, MICE) en multiple du revenu chambres' },
    { code: 'DEPARTMENTAL_COST_RATE', unit: 'percent', sources: '#17 housekeeping, #20 menu engineering, #23 (F&B Cost %, Labor Cost %), #27 USALI' },
    { code: 'UNDISTRIBUTED_COST_RATE', unit: 'percent', sources: '#27 USALI, #3 distribution (commissions), #24 marketing' },
  ],
  diagnostics: [
    { code: 'GUEST_SATISFACTION_SCORE', unit: 'ratio', sources: '#14 ; KPI Customer Satisfaction' },
    { code: 'DIRECT_BOOKING_SHARE', unit: 'percent', sources: '#3, #7' },
    { code: 'GROUP_MIX_SHARE', unit: 'percent', sources: '#4, #30' },
    { code: 'MEETING_SPACE_UTILIZATION', unit: 'percent', sources: '#29 (Utilization Rate)' },
    { code: 'AVERAGE_LENGTH_OF_STAY', unit: 'days', sources: '#5, #11, #18' },
  ],
  calculated: [{ code: 'ROOMS_REVENUE_EXIT', unit: 'currency' }],
  formulas: {
    // rooms × 365 × occupancy × ADR, in millions.
    ROOMS_REVENUE_EXIT: 'ROOMS * (1 + ROOM_GROWTH) ^ HOLD_YEARS * 365 * OCCUPANCY_RATE * ADR * (1 + ADR_GROWTH) ^ HOLD_YEARS / 1000000',
    REVENUE_EXIT: 'ROOMS_REVENUE_EXIT * (1 + ANCILLARY_REVENUE_RATIO)',
    EBITDA_MARGIN_EXIT: '1 - DEPARTMENTAL_COST_RATE - UNDISTRIBUTED_COST_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'REVENUE_MANAGEMENT', target: 'ADR', delta: 5, sources: '#2, #5, #6, #13', analyses: [2, 5, 6, 13] },
    { category: 'OCCUPANCY_DRIVE', target: 'OCCUPANCY_RATE', delta: 0.02, sources: '#4, #11, #15, #24', analyses: [4, 11, 15, 24] },
    { category: 'CHANNEL_MIX', target: 'UNDISTRIBUTED_COST_RATE', delta: -0.01, sources: '#3, #7', analyses: [3, 7] },
    { category: 'ANCILLARY_UPSELL', target: 'ANCILLARY_REVENUE_RATIO', delta: 0.02, sources: '#8, #12, #18, #19, #22, #31', analyses: [8, 12, 18, 19, 22, 31] },
    { category: 'DEPARTMENTAL_EFFICIENCY', target: 'DEPARTMENTAL_COST_RATE', delta: -0.01, sources: '#17, #20, #23, #27, #32', analyses: [17, 20, 23, 27, 32] },
    { category: 'PORTFOLIO_GROWTH', target: 'ROOM_GROWTH', delta: 0.01, sources: '#26, #28', analyses: [26, 28] },
  ],
  baseLevers: [{ category: 'COST_PROCUREMENT', analyses: [20, 21] }],
  causes: [
    { category: 'ALTERNATIVE_ACCOMMODATION', sources: '#25', analyses: [25] },
    { category: 'SEASONALITY', sources: '#13', analyses: [13], exogenous: true },
  ],
  catalogMetrics: {
    ROOMS: [1], OCCUPANCY_RATE: [1, 2, 4, 6], ADR: [1, 2, 5, 13], ANCILLARY_REVENUE_RATIO: [8, 12, 19, 22, 29, 30, 31],
    DEPARTMENTAL_COST_RATE: [17, 20, 23, 27], UNDISTRIBUTED_COST_RATE: [3, 27], GUEST_SATISFACTION_SCORE: [14],
    DIRECT_BOOKING_SHARE: [3, 7], GROUP_MIX_SHARE: [4, 30], MEETING_SPACE_UTILIZATION: [29], AVERAGE_LENGTH_OF_STAY: [5, 11, 18],
  },
  demoInputs: {
    ROOMS: 3000, ROOM_GROWTH: 0.02, OCCUPANCY_RATE: 0.72, ADR: 180, ADR_GROWTH: 0.03, ANCILLARY_REVENUE_RATIO: 0.45,
    DEPARTMENTAL_COST_RATE: 0.38, UNDISTRIBUTED_COST_RATE: 0.27, EBITDA_ENTRY: 72, ENTRY_MULTIPLE: 11, EXIT_MULTIPLE: 11,
    HOLD_YEARS: 5, NET_DEBT_ENTRY: 400, FCF_ANNUAL: 30,
  },
  // 3000 × 1.02^5 × 365 × 0.72 × 180 × 1.03^5 / 1e6 × 1.45 × (1 − 0.38 − 0.27)
  reference: { EBITDA_EXIT: 92.18115589989677 },
  approximations: [
    'EBITDA ≈ GOP de l\'USALI (#27) : frais de gestion / redevances de franchise inclus dans les coûts non distribués.',
    'Revenus annexes proportionnels au revenu chambres ; pas de saisonnalité infra-annuelle (#13 = cause).',
    'ROOM_GROWTH et ADR_GROWTH sont des choix d\'analyste.',
  ],
};
