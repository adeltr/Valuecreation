import { describe, it, expect } from 'vitest';
import { BASE_METRIC_CODES, BASE_METRIC_META, BASE_LEVER_CATEGORIES, DELTA_KINDS } from './base';

describe('base vocabulary', () => {
  it('covers the two-point bridge', () => {
    for (const code of ['EBITDA_ENTRY','EBITDA_EXIT','ENTRY_MULTIPLE','EXIT_MULTIPLE',
                        'NET_DEBT_ENTRY','NET_DEBT_EXIT','EQUITY_ENTRY','EQUITY_EXIT',
                        'MOIC','HOLD_YEARS','FCF_ANNUAL']) {
      expect(BASE_METRIC_CODES).toContain(code);
    }
  });
  it('gives every base code a unit', () => {
    for (const code of BASE_METRIC_CODES) expect(BASE_METRIC_META[code]?.unit).toBeTypeOf('string');
  });
  it('does NOT offer multiple expansion as a lever category', () => {
    expect(BASE_LEVER_CATEGORIES).not.toContain('MULTIPLE_EXPANSION');
  });
  it('defines delta kinds', () => {
    expect(DELTA_KINDS).toEqual(['absolute', 'percent']);
  });
});

describe('base vocabulary – generic EBITDA bridge', () => {
  it('holds REVENUE_GROWTH (input) and REVENUE_EXIT (calculated) for every archetype', () => {
    expect(BASE_METRIC_CODES).toContain('REVENUE_GROWTH');
    expect(BASE_METRIC_CODES).toContain('REVENUE_EXIT');
    expect(BASE_METRIC_META.REVENUE_GROWTH.unit).toBe('percent');
  });
});
