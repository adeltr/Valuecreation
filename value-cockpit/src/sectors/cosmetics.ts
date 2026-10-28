import type { SectorSpec } from './types';

// Umbrex « Cosmetics Company » — 45 analyses (A–F), KPI Cosmetics & Personal Care.
export const cosmetics: SectorSpec = {
  archetype: 'cosmetics',
  label: 'Cosmetics',
  umbrexType: 'Cosmetics Company',
  kpiFile: 'Cosmetics & Personal Care.md',
  baseInputs: ['REVENUE', 'PRICE_ELASTICITY'],
  inputs: [
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#20 loyalty, #29 channels, #32 e-commerce' },
    { code: 'PRICE_MIX_GROWTH', unit: 'percent', sources: '#27 limited editions, #28 luxury vs mass, #44 pricing' },
    { code: 'GROSS_MARGIN', unit: 'percent', sources: '#1 (Product Profit), #3 (Formulation Cost, Profit Margin)' },
    { code: 'AP_RATE', unit: 'percent', sources: '#18, #19 (influencer ROI), #32, #34 sampling' },
    { code: 'RD_RATE', unit: 'percent', sources: '#2 (R&D Cost per Product), #45' },
    { code: 'OVERHEAD_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'NEW_PRODUCT_SUCCESS_RATE', unit: 'percent', sources: '#2 (Innovation Success Rate)' },
    { code: 'CUSTOMER_RETENTION_RATE', unit: 'percent', sources: '#20 (Retention Rate), #33 ; KPI Beauty Box Subscription Retention' },
    { code: 'ONLINE_SALES_SHARE', unit: 'percent', sources: '#32' },
    { code: 'TIME_TO_MARKET', unit: 'days', sources: '#2 (Average Time to Market)' },
  ],
  calculated: [],
  formulas: {
    REVENUE_EXIT: 'REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS',
    EBITDA_MARGIN_EXIT: 'GROSS_MARGIN - AP_RATE - RD_RATE - OVERHEAD_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'FORMULATION_COST', target: 'GROSS_MARGIN', delta: 0.01, sources: '#3, #35', analyses: [3, 35] },
    { category: 'INFLUENCER_DIGITAL', target: 'AP_RATE', delta: -0.01, sources: '#18, #19, #32', analyses: [18, 19, 32] },
    { category: 'PREMIUMIZATION', target: 'PRICE_MIX_GROWTH', delta: 0.01, sources: '#26, #27, #28, #44', analyses: [26, 27, 28, 44] },
    { category: 'LOYALTY_SUBSCRIPTION', target: 'VOLUME_GROWTH', delta: 0.01, sources: '#20, #33, #34', analyses: [20, 33, 34] },
    { category: 'CHANNEL_EXPANSION', target: 'VOLUME_GROWTH', delta: 0.01, sources: '#22, #29, #30, #31', analyses: [22, 29, 30, 31] },
    { category: 'RD_PRODUCTIVITY', target: 'RD_RATE', delta: -0.005, sources: '#2, #11, #14', analyses: [2, 11, 14] },
  ],
  baseLevers: [
    { category: 'COST_PROCUREMENT', analyses: [35] },
    { category: 'WC_DIO', analyses: [1, 36] },
    { category: 'PRICING', analyses: [44] },
    { category: 'MIX', analyses: [1] },
  ],
  causes: [
    { category: 'CLEAN_BEAUTY_TRENDS', sources: '#21, #25', analyses: [21, 25] },
    { category: 'RETAILER_POWER', sources: '#30, #31', analyses: [30, 31] },
  ],
  catalogMetrics: {
    VOLUME_GROWTH: [20, 29, 32], PRICE_MIX_GROWTH: [27, 28, 44], GROSS_MARGIN: [1, 3], AP_RATE: [18, 19, 32, 34],
    RD_RATE: [2, 45], NEW_PRODUCT_SUCCESS_RATE: [2], CUSTOMER_RETENTION_RATE: [20, 33], ONLINE_SALES_SHARE: [32],
    TIME_TO_MARKET: [2], DIO: [1, 36],
  },
  interactions: [
    { source: 'PRICE_MIX_GROWTH', target: 'VOLUME_GROWTH', coefficient: 'PRICE_ELASTICITY', sources: "choix d'analyste — à calibrer sur #44 (pricing)" },
  ],
  demoInputs: {
    PRICE_ELASTICITY: -0.8,
    REVENUE: 400, VOLUME_GROWTH: 0.04, PRICE_MIX_GROWTH: 0.03, GROSS_MARGIN: 0.70, AP_RATE: 0.25, RD_RATE: 0.03,
    OVERHEAD_RATE: 0.22, EBITDA_ENTRY: 80, ENTRY_MULTIPLE: 12, EXIT_MULTIPLE: 12, HOLD_YEARS: 5, NET_DEBT_ENTRY: 300, FCF_ANNUAL: 30,
  },
  // 400 × (1.04 × 1.03)^5 × (0.70 − 0.25 − 0.03 − 0.22)
  reference: { EBITDA_EXIT: 112.83473337393349 },
  approximations: [
    'Volume et prix-mix composent indépendamment (pas d\'élasticité, phase 3).',
    'Les 17 analyses produit/R&D (efficacité, tests, stabilité) restent qualitatives : catalogue et diagnostics.',
    'OVERHEAD_RATE est un choix d\'analyste.',
  ],
};
