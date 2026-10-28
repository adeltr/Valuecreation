import { describe, it, expect } from 'vitest';
import { BRIDGE_FAMILIES, FAMILY_VOCAB } from './families';
import { composeVocabulary, getActiveVocabulary, getBridgeFamily } from './registry';
import { BASE_METRIC_CODES } from './base';

describe('bridge families (docs/16)', () => {
  it('three families: EV/EBITDA, P/BV on book value, rNPV', () => {
    expect([...BRIDGE_FAMILIES]).toEqual(['ebitda', 'book_value', 'rnpv']);
  });

  it("every EBITDA-family archetype keeps exactly today's vocabulary", () => {
    expect(getBridgeFamily('airline')).toBe('ebitda');
    expect(getActiveVocabulary('generic').metricCodes).toEqual([...BASE_METRIC_CODES]);
  });

  it('a book-value company has no EBITDA, net debt or working-capital terms', () => {
    const v = composeVocabulary('book_value');
    for (const c of ['EBITDA_ENTRY', 'EBITDA_EXIT', 'NET_DEBT_ENTRY', 'NET_DEBT_EXIT', 'FCF_ANNUAL', 'DSO', 'EBITDA_MARGIN']) {
      expect(v.isMetricCode(c), c).toBe(false);
    }
    expect(v.isLeverCategory('WC_DSO')).toBe(false);
    for (const c of ['BOOK_VALUE_ENTRY', 'NET_INCOME_ENTRY', 'NET_INCOME_EXIT', 'BOOK_VALUE_EXIT', 'PAYOUT_RATIO', 'TAX_RATE', 'MOIC', 'EXIT_MULTIPLE']) {
      expect(v.isMetricCode(c), c).toBe(true);
    }
  });

  it('entry facts and deal structure are never lever targets, whatever the family', () => {
    const book = composeVocabulary('book_value');
    for (const c of ['BOOK_VALUE_ENTRY', 'NET_INCOME_ENTRY', 'PAYOUT_RATIO', 'EXIT_MULTIPLE', 'HOLD_YEARS']) expect(book.isLeverTarget(c), c).toBe(false);
    const rnpv = composeVocabulary('rnpv');
    for (const c of ['RNPV_ENTRY', 'CASH_ENTRY', 'ENTRY_MULTIPLE']) expect(rnpv.isLeverTarget(c), c).toBe(false);
    expect(rnpv.isLeverTarget('ANNUAL_BURN')).toBe(true);
  });

  it('family codes are disjoint from the base vocabulary (one term, one concept)', () => {
    for (const f of BRIDGE_FAMILIES) {
      for (const c of FAMILY_VOCAB[f].codes) expect((BASE_METRIC_CODES as readonly string[]).includes(c), `${f}:${c}`).toBe(false);
    }
  });
});
