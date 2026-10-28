import type { SectorSpec } from './types';

// Umbrex « Biotechnology Company » — 43 analyses, KPI Biotechnology. rNPV family (docs/16).
export const biotech: SectorSpec = {
  archetype: 'biotech',
  label: 'Biotechnology (pré-revenu)',
  umbrexType: 'Biotechnology Company',
  kpiFile: 'Biotechnology.md',
  family: 'rnpv',
  baseInputs: [],
  inputs: [
    { code: 'PEAK_SALES', unit: 'currency', sources: '#30 market size & commercial viability, #34 market access' },
    { code: 'PEAK_SALES_MULTIPLE', unit: 'ratio', sources: 'choix d\'analyste (valeur au lancement / ventes au pic) ; #40 comparables de licences' },
    { code: 'PROBABILITY_OF_SUCCESS', unit: 'percent', sources: '#1 pipeline, #2 clinical progress ; KPI Drug Pipeline Strength and Stage' },
    { code: 'YEARS_TO_LAUNCH', unit: 'years', sources: '#1, #19 regulatory pathways, #28 adaptive design' },
    { code: 'DISCOUNT_RATE', unit: 'percent', sources: 'choix d\'analyste' },
  ],
  diagnostics: [
    { code: 'TRIAL_ENROLLMENT_RATE', unit: 'percent', sources: '#24' },
    { code: 'PATENT_LIFE_YEARS', unit: 'years', sources: '#22, #38 ; KPI Patent Portfolio Strength' },
    { code: 'ORPHAN_DESIGNATIONS', unit: 'count', sources: '#21 ; KPI Number of Orphan Drug Designations' },
    { code: 'PIPELINE_ASSETS', unit: 'count', sources: '#1 ; KPI Number of New Molecular Entities in Development' },
    { code: 'PARTNERED_ASSET_SHARE', unit: 'percent', sources: '#40, #42, #43' },
  ],
  calculated: [],
  formulas: {
    // Lead asset (or pipeline aggregate): value at launch, risk-adjusted, discounted from the exit date.
    RNPV_EXIT: 'PEAK_SALES * PEAK_SALES_MULTIPLE * PROBABILITY_OF_SUCCESS / (1 + DISCOUNT_RATE) ^ max(YEARS_TO_LAUNCH - HOLD_YEARS, 0)',
  },
  levers: [
    { category: 'TRIAL_DESIGN', target: 'PROBABILITY_OF_SUCCESS', delta: 0.02, sources: '#2, #24, #27, #28', analyses: [2, 24, 27, 28] },
    { category: 'BIOMARKER_SELECTION', target: 'PROBABILITY_OF_SUCCESS', delta: 0.02, sources: '#7, #10, #18', analyses: [7, 10, 18] },
    { category: 'REGULATORY_STRATEGY', target: 'YEARS_TO_LAUNCH', delta: -0.5, sources: '#19, #21', analyses: [19, 21] },
    { category: 'MARKET_ACCESS', target: 'PEAK_SALES', delta: 20, sources: '#30, #31, #34', analyses: [30, 31, 34] },
    { category: 'LICENSING_BD', target: 'ANNUAL_BURN', delta: -5, sources: '#40, #42, #43 (partage des coûts)', analyses: [40, 42, 43] },
    { category: 'CASH_DISCIPLINE', target: 'ANNUAL_BURN', delta: -5, sources: '#39 (Cash Burn Rate, Cash Runway)', analyses: [39] },
  ],
  baseLevers: [{ category: 'COST_PROCUREMENT', analyses: [20, 23] }],
  causes: [
    { category: 'CLINICAL_FAILURE', sources: '#2, #8, #9', analyses: [2, 8, 9] },
    { category: 'FUNDING_MARKET', sources: '#39', analyses: [39], exogenous: true },
    { category: 'BIOSIMILAR_COMPETITION', sources: '#29, #32', analyses: [29, 32] },
  ],
  catalogMetrics: {
    PEAK_SALES: [30, 34], PROBABILITY_OF_SUCCESS: [1, 2], YEARS_TO_LAUNCH: [1, 19, 28], PEAK_SALES_MULTIPLE: [40],
    TRIAL_ENROLLMENT_RATE: [24], PATENT_LIFE_YEARS: [22, 38], ORPHAN_DESIGNATIONS: [21], PIPELINE_ASSETS: [1],
    PARTNERED_ASSET_SHARE: [40, 42, 43], ANNUAL_BURN: [39], RUNWAY_YEARS: [39],
  },
  demoInputs: {
    PEAK_SALES: 800, PEAK_SALES_MULTIPLE: 3, PROBABILITY_OF_SUCCESS: 0.45, YEARS_TO_LAUNCH: 7, DISCOUNT_RATE: 0.12,
    RNPV_ENTRY: 400, CASH_ENTRY: 350, ANNUAL_BURN: 60, ENTRY_MULTIPLE: 1, EXIT_MULTIPLE: 1, HOLD_YEARS: 5,
  },
  // 800 × 3 × 0.45 / 1.12^(7 − 5)
  reference: { RNPV_EXIT: 860.9693877551019 },
  approximations: [
    'Un actif principal (ou un agrégat du pipeline) : probabilité cumulée de succès vue depuis la sortie, valeur au lancement = multiple des ventes au pic.',
    'Trésorerie à la sortie = trésorerie − burn × durée ; une trésorerie négative est un besoin de financement, sans dilution modélisée.',
    'Le prix d\'entrée repose sur RNPV_ENTRY (donnée historique) : un levier ne change jamais le prix payé.',
  ],
};
