import { describe, it, expect } from 'vitest';
import { quantiles, benchmark, percentileRank, MIN_SAMPLE } from './stats';
import type { WindowRecord } from './edgar';

const rec = (i: number, over: Partial<WindowRecord> = {}): WindowRecord => ({
  cik: i, name: `C${i}`, archetype: 'airline', country: 'United States', startYear: 2015, endYear: 2018,
  sizeBucket: '1–5B', acquisition: false, deltas: { EBITDA_MARGIN: i / 100, DSO: -i }, source: 's', ...over,
});

describe('empirical statistics', () => {
  it('quantiles with linear interpolation', () => {
    expect(quantiles([1, 2, 3, 4, 5])).toEqual({ n: 5, p10: 1.4, p25: 2, p50: 3, p75: 4, p90: 4.6 });
  });

  it('benchmark filters by archetype, window, size, country and deal flag', () => {
    const data = [
      ...Array.from({ length: 10 }, (_, i) => rec(i + 1)),
      ...Array.from({ length: 10 }, (_, i) => rec(100 + i, { country: 'United Kingdom', deltas: { EBITDA_MARGIN: 0.5 } })),
      rec(200, { archetype: 'cpg' }), rec(201, { endYear: 2020 }),
    ];
    const us = benchmark(data, 'EBITDA_MARGIN', { archetype: 'airline', years: 3, countries: ['United States'] })!;
    expect(us.n).toBe(10);
    expect(us.p50).toBeCloseTo(0.055, 12);
    expect(benchmark(data, 'EBITDA_MARGIN', { archetype: 'airline', years: 3 })!.n).toBe(20);
    expect(benchmark(data, 'EBITDA_MARGIN', { archetype: 'airline', years: 3, sizes: ['<50M'] })).toBeNull();
    expect(benchmark(data, 'EBITDA_MARGIN', { archetype: 'airline', years: 3, deals: 'with' })).toBeNull();
  });

  it('refuses a statistic on a sample below the minimum', () => {
    expect(MIN_SAMPLE).toBe(8);
    const data = Array.from({ length: MIN_SAMPLE - 1 }, (_, i) => rec(i));
    expect(benchmark(data, 'EBITDA_MARGIN', { archetype: 'airline', years: 3 })).toBeNull();
  });

  it('percentile rank of a plan value within the observed distribution', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentileRank(10.5, values)).toBe(100);
    expect(percentileRank(5, values)).toBe(45);
    expect(percentileRank(0, values)).toBe(0);
  });
});
