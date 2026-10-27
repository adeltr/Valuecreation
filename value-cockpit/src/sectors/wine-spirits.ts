import type { SectorSpec } from './types';

// Umbrex « Wine, Beer & Spirits Company » — 48 analyses (A–H), KPI Wine, Beer, and Spirits.
export const wineSpirits: SectorSpec = {
  archetype: 'wine-spirits',
  label: 'Wine, Beer & Spirits',
  umbrexType: 'Wine, Beer & Spirits Company',
  kpiFile: 'Wine, Beer, and Spirits.md',
  baseInputs: ['REVENUE', 'PRICE_ELASTICITY'],
  inputs: [
    { code: 'VOLUME_GROWTH', unit: 'percent', sources: '#2 emerging markets, #5 channels, #7 e-commerce' },
    { code: 'PRICE_MIX_GROWTH', unit: 'percent', sources: '#12 premiumization (price elasticity), #15, #16, #41' },
    { code: 'GROSS_MARGIN', unit: 'percent', sources: '#41 (Gross Margin), #25, #32, #33' },
    { code: 'EXCISE_TAX_RATE', unit: 'percent', sources: '#40 (Tax Burden per Unit)' },
    { code: 'AP_RATE', unit: 'percent', sources: '#13, #14, #18, #43 (marketing ROI)' },
    { code: 'DISTRIBUTION_COST_RATE', unit: 'percent', sources: '#27, #44 (Cost-to-Revenue Ratio)' },
    { code: 'OVERHEAD_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'ONLINE_SALES_SHARE', unit: 'percent', sources: '#7, #42' },
    { code: 'DISTRIBUTOR_DEPENDENCY', unit: 'percent', sources: '#27 (Dependency Ratio)' },
    { code: 'AGING_INVENTORY_YEARS', unit: 'years', sources: '#23, #34' },
    { code: 'HARVEST_YIELD_VARIANCE', unit: 'percent', sources: '#29, #31' },
    { code: 'CUSTOMER_RETENTION_RATE', unit: 'percent', sources: '#46 (Churn Rate, CLV)' },
  ],
  calculated: [],
  formulas: {
    REVENUE_EXIT: 'REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS',
    // REVENUE gross of excise; excise, A&P and distribution as shares of it (#40, #43, #44).
    EBITDA_MARGIN_EXIT: 'GROSS_MARGIN - EXCISE_TAX_RATE - AP_RATE - DISTRIBUTION_COST_RATE - OVERHEAD_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'PREMIUMIZATION', target: 'PRICE_MIX_GROWTH', delta: 0.01, sources: '#12, #15, #16, #45', analyses: [12, 15, 16, 45] },
    { category: 'ROUTE_TO_MARKET', target: 'DISTRIBUTION_COST_RATE', delta: -0.01, sources: '#5, #27, #44', analyses: [5, 27, 44] },
    { category: 'MARKETING_EFFECTIVENESS', target: 'AP_RATE', delta: -0.01, sources: '#13, #14, #18, #43', analyses: [13, 14, 18, 43] },
    { category: 'DTC_EXPANSION', target: 'VOLUME_GROWTH', delta: 0.01, sources: '#7, #8, #42', analyses: [7, 8, 42] },
    { category: 'INNOVATION_NPD', target: 'VOLUME_GROWTH', delta: 0.01, sources: '#20, #21, #22', analyses: [20, 21, 22] },
    { category: 'PRODUCTION_EFFICIENCY', target: 'GROSS_MARGIN', delta: 0.01, sources: '#25, #32, #33', analyses: [25, 32, 33] },
    { category: 'TAX_TARIFF_OPTIMIZATION', target: 'EXCISE_TAX_RATE', delta: -0.005, sources: '#40', analyses: [40] },
  ],
  baseLevers: [
    { category: 'WC_DIO', analyses: [23, 34] },
    { category: 'COST_PROCUREMENT', analyses: [26, 28] },
    { category: 'PRICING', analyses: [41] },
  ],
  causes: [
    { category: 'WEATHER_CLIMATE', sources: '#29, #30, #31', analyses: [29, 30, 31], exogenous: true },
    { category: 'DISTRIBUTOR_POWER', sources: '#27', analyses: [27] },
  ],
  catalogMetrics: {
    VOLUME_GROWTH: [2, 5, 7], PRICE_MIX_GROWTH: [12, 15, 16, 41], GROSS_MARGIN: [25, 32, 33, 41], EXCISE_TAX_RATE: [40],
    AP_RATE: [13, 14, 18, 43], DISTRIBUTION_COST_RATE: [27, 44], ONLINE_SALES_SHARE: [7, 42], DISTRIBUTOR_DEPENDENCY: [27],
    AGING_INVENTORY_YEARS: [23, 34], HARVEST_YIELD_VARIANCE: [29, 31], CUSTOMER_RETENTION_RATE: [46], DIO: [34],
  },
  interactions: [
    { source: 'PRICE_MIX_GROWTH', target: 'VOLUME_GROWTH', coefficient: 'PRICE_ELASTICITY', sources: "choix d'analyste — #12 premiumisation (price elasticity) pour calibrer" },
  ],
  demoInputs: {
    PRICE_ELASTICITY: -0.8,
    REVENUE: 500, VOLUME_GROWTH: 0.03, PRICE_MIX_GROWTH: 0.03, GROSS_MARGIN: 0.58, EXCISE_TAX_RATE: 0.10, AP_RATE: 0.12,
    DISTRIBUTION_COST_RATE: 0.08, OVERHEAD_RATE: 0.10, EBITDA_ENTRY: 90, ENTRY_MULTIPLE: 13, EXIT_MULTIPLE: 13,
    HOLD_YEARS: 5, NET_DEBT_ENTRY: 400, FCF_ANNUAL: 35,
  },
  // 500 × (1.03 × 1.03)^5 × (0.58 − 0.10 − 0.12 − 0.08 − 0.10)
  reference: { EBITDA_EXIT: 120.95247414097092 },
  approximations: [
    'Volume et prix-mix composent indépendamment (pas d\'élasticité, phase 3).',
    'Le vieillissement des stocks pèse sur le BFR (DIO, AGING_INVENTORY_YEARS), pas sur la marge.',
    'OVERHEAD_RATE est un choix d\'analyste.',
  ],
};
