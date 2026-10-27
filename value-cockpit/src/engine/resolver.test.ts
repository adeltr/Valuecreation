import { describe, it, expect } from 'vitest';
import { resolveMetrics } from './resolver';
import type { Metric } from '../domain/types';

export const m = (code: string, value: number | null, formula: string | null = null): Metric => ({
  id: code, companyId: 'c1', code, label: code,
  unit: 'currency', isCalculated: formula !== null, formula,
  currentValue: value, benchmarkValue: null, benchmarkSource: null,
});

describe('resolveMetrics', () => {
  it('computes chained calculated metrics', () => {
    const out = resolveMetrics([
      m('ARR', 100), m('GROSS_CHURN', 0.12), m('EXPANSION_RATE', 0.07), m('HOLD_YEARS', 4),
      m('NRR', null, '1 + EXPANSION_RATE - GROSS_CHURN'),
      m('ARR_EXIT', null, 'ARR * NRR ^ HOLD_YEARS'),
    ]);
    expect(out.get('NRR')).toBeCloseTo(0.95, 10);
    expect(out.get('ARR_EXIT')).toBeCloseTo(100 * 0.95 ** 4, 6);
  });
  it('throws when a dependency has no value', () => {
    expect(() => resolveMetrics([m('NRR', null, '1 + EXPANSION_RATE - GROSS_CHURN')]))
      .toThrow(/missing value/i);
  });
});
