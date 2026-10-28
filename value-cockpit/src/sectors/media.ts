import type { SectorSpec } from './types';

// Umbrex « Media & Entertainment Company » — 35 analyses (A–I), KPI Media & Entertainment.
export const media: SectorSpec = {
  archetype: 'media',
  label: 'Media & Entertainment',
  umbrexType: 'Media & Entertainment Company',
  kpiFile: 'Media & Entertainment.md',
  baseInputs: [],
  inputs: [
    { code: 'CONTENT_INVESTMENT', unit: 'currency', sources: '#1 Content Portfolio & ROI, #27 talent deals, #28 co-production' },
    { code: 'CONTENT_INVESTMENT_GROWTH', unit: 'percent', sources: '#1, #7, #17 FAST, #21 gaming, #22 sports rights' },
    { code: 'REVENUE_PER_CONTENT_DOLLAR', unit: 'ratio', sources: '#1 (content ROI), #2 windowing, #10, #19' },
    { code: 'LICENSING_ANCILLARY_RATIO', unit: 'ratio', sources: '#8, #11, #13, #14, #25, #32 (licensing, syndication, merch)' },
    { code: 'DISTRIBUTION_MARKETING_RATE', unit: 'percent', sources: '#5 award campaigns, #34 brand integration, #35 audience analytics' },
    { code: 'OVERHEAD_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'CONTENT_LIBRARY_SIZE', unit: 'count', sources: '#3, #25 ; KPI Content Library Size' },
    { code: 'HIT_RATE', unit: 'percent', sources: '#1 (titres au-dessus du seuil de ROI)' },
    { code: 'FRANCHISE_REVENUE_SHARE', unit: 'percent', sources: '#3, #4, #6' },
    { code: 'PIRACY_LOSS_RATE', unit: 'percent', sources: '#12' },
  ],
  calculated: [{ code: 'CONTENT_COST_EXIT', unit: 'currency' }],
  formulas: {
    CONTENT_COST_EXIT: 'CONTENT_INVESTMENT * (1 + CONTENT_INVESTMENT_GROWTH) ^ HOLD_YEARS',
    REVENUE_EXIT: 'CONTENT_COST_EXIT * REVENUE_PER_CONTENT_DOLLAR * (1 + LICENSING_ANCILLARY_RATIO)',
    // Content cost charged at EBITDA level (cash spend ≈ amortisation in steady state).
    EBITDA_EXIT: 'REVENUE_EXIT * (1 - DISTRIBUTION_MARKETING_RATE - OVERHEAD_RATE) - CONTENT_COST_EXIT',
  },
  levers: [
    { category: 'SLATE_DISCIPLINE', target: 'REVENUE_PER_CONTENT_DOLLAR', delta: 0.1, sources: '#1, #5, #7', analyses: [1, 5, 7] },
    { category: 'WINDOWING_OPTIMIZATION', target: 'REVENUE_PER_CONTENT_DOLLAR', delta: 0.05, sources: '#2, #10, #19', analyses: [2, 10, 19] },
    { category: 'IP_LICENSING', target: 'LICENSING_ANCILLARY_RATIO', delta: 0.05, sources: '#8, #9, #11, #13, #14, #25', analyses: [8, 9, 11, 13, 14, 25] },
    { category: 'FRANCHISE_MERCH', target: 'LICENSING_ANCILLARY_RATIO', delta: 0.05, sources: '#3, #4, #6, #32', analyses: [3, 4, 6, 32] },
    { category: 'AUDIENCE_TARGETING', target: 'DISTRIBUTION_MARKETING_RATE', delta: -0.01, sources: '#33, #34, #35', analyses: [33, 34, 35] },
    { category: 'CONTENT_SCALE', target: 'CONTENT_INVESTMENT_GROWTH', delta: 0.01, sources: '#17, #18, #21, #22', analyses: [17, 18, 21, 22] },
  ],
  baseLevers: [],
  causes: [
    { category: 'PIRACY', sources: '#12', analyses: [12] },
    { category: 'TALENT_COSTS', sources: '#27, #30', analyses: [27, 30] },
  ],
  catalogMetrics: {
    CONTENT_INVESTMENT: [1, 27, 28], CONTENT_INVESTMENT_GROWTH: [1, 7], REVENUE_PER_CONTENT_DOLLAR: [1, 2, 10, 19],
    LICENSING_ANCILLARY_RATIO: [8, 11, 13, 14, 25, 32], DISTRIBUTION_MARKETING_RATE: [5, 34, 35], CONTENT_LIBRARY_SIZE: [3, 25],
    HIT_RATE: [1], FRANCHISE_REVENUE_SHARE: [3, 4, 6], PIRACY_LOSS_RATE: [12],
  },
  demoInputs: {
    CONTENT_INVESTMENT: 300, CONTENT_INVESTMENT_GROWTH: 0.03, REVENUE_PER_CONTENT_DOLLAR: 1.8, LICENSING_ANCILLARY_RATIO: 0.25,
    DISTRIBUTION_MARKETING_RATE: 0.15, OVERHEAD_RATE: 0.15, EBITDA_ENTRY: 170, ENTRY_MULTIPLE: 9, EXIT_MULTIPLE: 9,
    HOLD_YEARS: 5, NET_DEBT_ENTRY: 600, FCF_ANNUAL: 50,
  },
  // c = 300 × 1.03^5 ; c × 1.8 × 1.25 × (1 − 0.15 − 0.15) − c
  reference: { EBITDA_EXIT: 199.97477781674996 },
  approximations: [
    'Rendement moyen par dollar de contenu : pas de distribution de hits/flops (HIT_RATE en diagnostic).',
    'Coût du contenu = dépense de l\'année (≈ amortissement en régime de croisière).',
    'OVERHEAD_RATE est un choix d\'analyste.',
  ],
};
