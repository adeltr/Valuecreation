import type { SectorSpec } from './types';

// Umbrex « Retail Company » — 35 analyses (A–E), KPI Retail.
export const retail: SectorSpec = {
  archetype: 'retail',
  label: 'Retail',
  umbrexType: 'Retail Company',
  kpiFile: 'Retail.md',
  baseInputs: ['REVENUE'],
  inputs: [
    { code: 'LFL_GROWTH', unit: 'percent', sources: '#1 Same-Store Sales Growth ; KPI SSSG' },
    { code: 'NET_STORE_GROWTH', unit: 'percent', sources: '#17 closures, #18 expansion & cannibalisation' },
    { code: 'GROSS_MARGIN', unit: 'percent', sources: '#20, #26, #27, #30, #31 (Gross Profit Margin) ; KPI GMROI' },
    { code: 'MARKDOWN_RATE', unit: 'percent', sources: '#20, #30 (Markdown Percentage) ; KPI Average Discount Depth' },
    { code: 'SHRINKAGE_RATE', unit: 'percent', sources: '#34 (Shrinkage Rate) ; KPI Shrinkage Rate' },
    { code: 'STORE_LABOR_RATE', unit: 'percent', sources: '#16 (Labor Cost Percentage)' },
    { code: 'OCCUPANCY_COST_RATE', unit: 'percent', sources: '#15 (Rent-to-Sales Ratio) ; KPI Cost per Square Foot' },
    { code: 'SGA_RATE', unit: 'percent', sources: 'choix d\'analyste — siège, marketing, e-commerce' },
  ],
  diagnostics: [
    { code: 'CONVERSION_RATE', unit: 'percent', sources: '#2, #4, #17, #21, #25, #32 ; KPI Retail Conversion Rate' },
    { code: 'SALES_PER_SQ_FT', unit: 'currency', sources: '#4, #13, #15, #28 ; KPI Sales Per Square Foot' },
    { code: 'OUT_OF_STOCK_RATE', unit: 'percent', sources: '#11 ; KPI Stock-Out Rate' },
    { code: 'ONLINE_SALES_SHARE', unit: 'percent', sources: '#6, #14 ; KPI Online Sales as a % of Total' },
    { code: 'RETURN_RATE', unit: 'percent', sources: '#3, #6 ; KPI Product Return Rate' },
    { code: 'AVERAGE_TRANSACTION_VALUE', unit: 'currency', sources: '#8, #22, #23, #25 ; KPI ATV' },
    { code: 'GMROI', unit: 'ratio', sources: '#33 ; KPI Gross Margin Return on Inventory Investment' },
  ],
  calculated: [],
  formulas: {
    REVENUE_EXIT: 'REVENUE * ((1 + LFL_GROWTH) * (1 + NET_STORE_GROWTH)) ^ HOLD_YEARS',
    // GROSS_MARGIN = initial markup margin, before markdowns and shrinkage (#30, #34).
    EBITDA_MARGIN_EXIT: 'GROSS_MARGIN - MARKDOWN_RATE - SHRINKAGE_RATE - STORE_LABOR_RATE - OCCUPANCY_COST_RATE - SGA_RATE',
    EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN_EXIT',
  },
  levers: [
    { category: 'MERCHANDISING_ASSORTMENT', target: 'GROSS_MARGIN', delta: 0.01, sources: '#13, #26, #28, #29, #31', analyses: [13, 26, 28, 29, 31] },
    { category: 'MARKDOWN_OPTIMIZATION', target: 'MARKDOWN_RATE', delta: -0.01, sources: '#20, #21, #30', analyses: [20, 21, 30] },
    { category: 'LOSS_PREVENTION', target: 'SHRINKAGE_RATE', delta: -0.005, sources: '#34', analyses: [34] },
    { category: 'LABOR_SCHEDULING', target: 'STORE_LABOR_RATE', delta: -0.01, sources: '#16', analyses: [16] },
    { category: 'STORE_PORTFOLIO', target: 'OCCUPANCY_COST_RATE', delta: -0.01, sources: '#4, #15, #17, #18', analyses: [4, 15, 17, 18] },
    { category: 'OMNICHANNEL', target: 'LFL_GROWTH', delta: 0.01, sources: '#6, #12, #14', analyses: [6, 12, 14] },
    { category: 'CUSTOMER_LOYALTY', target: 'LFL_GROWTH', delta: 0.01, sources: '#2, #7, #22, #23, #24', analyses: [2, 7, 22, 23, 24] },
  ],
  baseLevers: [
    { category: 'PRICING', analyses: [20] },
    { category: 'MIX', analyses: [5, 29] },
    { category: 'COST_PROCUREMENT', analyses: [27, 35] },
    { category: 'WC_DIO', analyses: [10, 11] },
  ],
  causes: [
    { category: 'ECOMMERCE_SHIFT', sources: '#6, #12, #14', analyses: [6, 12, 14] },
    { category: 'SEASONALITY', sources: '#5 ; KPI Seasonality Index', analyses: [5], exogenous: true },
  ],
  catalogMetrics: {
    LFL_GROWTH: [1], NET_STORE_GROWTH: [17, 18], GROSS_MARGIN: [6, 8, 20, 26, 27, 30, 31], MARKDOWN_RATE: [20, 30],
    SHRINKAGE_RATE: [34], STORE_LABOR_RATE: [16], OCCUPANCY_COST_RATE: [15], CONVERSION_RATE: [2, 4, 17, 21, 25, 32],
    SALES_PER_SQ_FT: [4, 13, 15, 28], OUT_OF_STOCK_RATE: [11], ONLINE_SALES_SHARE: [6, 14], RETURN_RATE: [3, 6],
    AVERAGE_TRANSACTION_VALUE: [8, 22, 23, 25], GMROI: [33], DIO: [10],
  },
  demoInputs: {
    REVENUE: 800, LFL_GROWTH: 0.03, NET_STORE_GROWTH: 0.02, GROSS_MARGIN: 0.42, MARKDOWN_RATE: 0.05,
    SHRINKAGE_RATE: 0.015, STORE_LABOR_RATE: 0.11, OCCUPANCY_COST_RATE: 0.08, SGA_RATE: 0.07,
    EBITDA_ENTRY: 76, ENTRY_MULTIPLE: 7, EXIT_MULTIPLE: 7, HOLD_YEARS: 5, NET_DEBT_ENTRY: 250, FCF_ANNUAL: 25,
  },
  // 800 × (1.03 × 1.02)^5 × (0.42 − 0.05 − 0.015 − 0.11 − 0.08 − 0.07)
  reference: { EBITDA_EXIT: 97.27485108223809 },
  approximations: [
    'Croissance = like-for-like × surface nette ; pas de cannibalisation explicite (#18 en diagnostic).',
    'Coûts magasin en % des ventes : les loyers fixes ne baissent pas en % quand le LFL croît (levier opérationnel ignoré).',
    'SGA_RATE est un choix d\'analyste.',
  ],
};
