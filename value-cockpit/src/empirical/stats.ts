import type { SectorArchetype } from '../ontology/registry';
import type { SizeBucket, WindowRecord } from './edgar';

/** Below this many companies a distribution is not shown: too few to be an empirical benchmark. */
export const MIN_SAMPLE = 8;

export interface Quantiles { n: number; p10: number; p25: number; p50: number; p75: number; p90: number }

export function quantiles(values: number[]): Quantiles {
  const v = [...values].sort((a, b) => a - b);
  const q = (p: number) => {
    const i = (v.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
    return v[lo] + (v[hi] - v[lo]) * (i - lo);
  };
  return { n: v.length, p10: q(0.1), p25: q(0.25), p50: q(0.5), p75: q(0.75), p90: q(0.9) };
}

export interface BenchmarkFilter {
  archetype: SectorArchetype; years: number;
  sizes?: SizeBucket[]; countries?: string[];
  deals?: 'all' | 'with' | 'without';   // windows with / without a completed acquisition (8-K 2.01)
}

export type DeltaMetric = keyof WindowRecord['deltas'];

export function select(records: WindowRecord[], f: BenchmarkFilter): WindowRecord[] {
  return records.filter((r) => r.archetype === f.archetype && r.endYear - r.startYear === f.years
    && (!f.sizes?.length || f.sizes.includes(r.sizeBucket))
    && (!f.countries?.length || f.countries.includes(r.country))
    && (!f.deals || f.deals === 'all' || (f.deals === 'with') === r.acquisition));
}

/** Distribution of a metric change across the selected company windows; null under MIN_SAMPLE. */
export function benchmark(records: WindowRecord[], metric: DeltaMetric, f: BenchmarkFilter): Quantiles | null {
  const values = select(records, f).map((r) => r.deltas[metric]).filter((x): x is number => x !== undefined && Number.isFinite(x));
  return values.length >= MIN_SAMPLE ? quantiles(values) : null;
}

/** Share of observations below `value` (ties count half), in %. */
export function percentileRank(value: number, values: number[]): number {
  const below = values.filter((x) => x < value).length, equal = values.filter((x) => x === value).length;
  return Math.round(((below + equal / 2) / values.length) * 100);
}
