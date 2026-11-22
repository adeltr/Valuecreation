import { describe, it, expect } from 'vitest';
import { evaluateFormula, extractDependencies } from './formula';

describe('formula', () => {
  it('evaluates arithmetic over metric codes', () => {
    expect(evaluateFormula('REVENUE - COGS - OPEX', { REVENUE: 120, COGS: 80, OPEX: 22 })).toBe(18);
  });
  it('supports power (needed for NRR ^ HOLD_YEARS)', () => {
    expect(evaluateFormula('ARR * NRR ^ HOLD_YEARS', { ARR: 100, NRR: 1.1, HOLD_YEARS: 2 })).toBeCloseTo(121, 6);
  });
  it('extracts referenced codes', () => {
    expect(extractDependencies('ARR * NRR ^ HOLD_YEARS').sort()).toEqual(['ARR', 'HOLD_YEARS', 'NRR']);
  });
  it('throws on a non-finite result', () => {
    expect(() => evaluateFormula('A / B', { A: 1, B: 0 })).toThrow(/finite/i);
  });
  it('treats function names (min, max) as functions, not metric dependencies', () => {
    expect(extractDependencies('min(A ^ N, 1 / B)').sort()).toEqual(['A', 'B', 'N']);
    expect(evaluateFormula('min(A ^ N, 1 / B)', { A: 1.1, N: 2, B: 0.8 })).toBeCloseTo(1.21, 10);
  });
});
