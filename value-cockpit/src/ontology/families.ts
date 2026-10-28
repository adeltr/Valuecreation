import type { MetricMeta } from './base';

/**
 * Bridge families (docs/16): how equity is valued at entry and exit.
 *  - ebitda     : EV = EBITDA × multiple, equity = EV − net debt (docs/01).
 *  - book_value : equity = book value × P/BV; book value grows with retained earnings (insurers, banks).
 *  - rnpv       : equity = risk-adjusted pipeline NPV × multiple + cash (pre-revenue biotech).
 * ENTRY_MULTIPLE / EXIT_MULTIPLE always mean "multiple of the family's valuation anchor".
 */
export const BRIDGE_FAMILIES = ['ebitda', 'book_value', 'rnpv'] as const;
export type BridgeFamily = (typeof BRIDGE_FAMILIES)[number];

// Base terms that only make sense for an EBITDA-valued company.
const EBITDA_ONLY_METRICS = [
  'EBITDA_ENTRY', 'EBITDA_EXIT', 'EBITDA_MARGIN', 'EBITDA_MARGIN_EXIT', 'NET_DEBT_ENTRY', 'NET_DEBT_EXIT',
  'FCF_ANNUAL', 'COGS', 'GROSS_PROFIT', 'DSO', 'DIO', 'DPO', 'WORKING_CAPITAL',
] as const;
const EBITDA_ONLY_LEVERS = ['WC_DSO', 'WC_DIO', 'WC_DPO'] as const;

export interface FamilyVocabulary {
  codes: readonly string[];
  meta: Record<string, MetricMeta>;
  /** Entry facts and payout policy: set by the analyst, never moved by a lever. */
  nonLever: readonly string[];
  excludedBaseMetrics: readonly string[];
  excludedBaseLevers: readonly string[];
}

export const FAMILY_VOCAB: Record<BridgeFamily, FamilyVocabulary> = {
  ebitda: { codes: [], meta: {}, nonLever: [], excludedBaseMetrics: [], excludedBaseLevers: [] },
  book_value: {
    codes: [
      'BOOK_VALUE_ENTRY', 'NET_INCOME_ENTRY', 'PAYOUT_RATIO', 'TAX_RATE',
      'NET_INCOME_EXIT', 'CUMULATIVE_NET_INCOME', 'BOOK_VALUE_EXIT', 'DIVIDENDS_CUMULATIVE', 'ROE_EXIT',
    ],
    meta: {
      BOOK_VALUE_ENTRY: { unit: 'currency' }, NET_INCOME_ENTRY: { unit: 'currency' },
      PAYOUT_RATIO: { unit: 'percent' }, TAX_RATE: { unit: 'percent' },
      NET_INCOME_EXIT: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:NetIncome' },
      CUMULATIVE_NET_INCOME: { unit: 'currency' }, BOOK_VALUE_EXIT: { unit: 'currency' },
      DIVIDENDS_CUMULATIVE: { unit: 'currency' }, ROE_EXIT: { unit: 'percent' },
    },
    nonLever: ['BOOK_VALUE_ENTRY', 'NET_INCOME_ENTRY', 'PAYOUT_RATIO', 'TAX_RATE'],
    excludedBaseMetrics: EBITDA_ONLY_METRICS,
    excludedBaseLevers: EBITDA_ONLY_LEVERS,
  },
  rnpv: {
    codes: ['RNPV_ENTRY', 'CASH_ENTRY', 'ANNUAL_BURN', 'RNPV_EXIT', 'CASH_EXIT', 'RUNWAY_YEARS'],
    meta: {
      RNPV_ENTRY: { unit: 'currency' }, CASH_ENTRY: { unit: 'currency' }, ANNUAL_BURN: { unit: 'currency' },
      RNPV_EXIT: { unit: 'currency' }, CASH_EXIT: { unit: 'currency' }, RUNWAY_YEARS: { unit: 'years' },
    },
    nonLever: ['RNPV_ENTRY', 'CASH_ENTRY'],
    excludedBaseMetrics: EBITDA_ONLY_METRICS,
    excludedBaseLevers: EBITDA_ONLY_LEVERS,
  },
};
