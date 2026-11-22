import { describe, it, expect } from 'vitest';
import { parseFormula, evaluateParsed, extractFormulas } from './formulas';

describe('parseFormula — natural-language analysis formulas into calculators', () => {
  it('names, variables and an engine expression', () => {
    const f = parseFormula('Load Factor = (RPK / ASK) x 100')!;
    expect(f.output).toBe('Load Factor');
    expect(f.variables).toEqual(['RPK', 'ASK']);
    expect(evaluateParsed(f, { RPK: 82, ASK: 100 })).toBeCloseTo(82, 12);
  });

  it('keeps an abbreviation in parentheses as part of the variable name', () => {
    const f = parseFormula('Load Factor = (Revenue Passenger Kilometers (RPK) / Available Seat Kilometers (ASK)) x 100')!;
    expect(f.variables).toEqual(['Revenue Passenger Kilometers (RPK)', 'Available Seat Kilometers (ASK)']);
  });

  it('handles ×, ÷, −, multi-word names, numbers and repeated variables', () => {
    const f = parseFormula('Route Profitability = (Route Revenue − Route Cost) ÷ Route Revenue × 100')!;
    expect(f.variables).toEqual(['Route Revenue', 'Route Cost']);
    expect(evaluateParsed(f, { 'Route Revenue': 200, 'Route Cost': 150 })).toBeCloseTo(25, 12);
  });

  it('flags a percentage output (× 100)', () => {
    expect(parseFormula('Market Share = (A / B) x 100')!.percentOutput).toBe(true);
    expect(parseFormula('Yield = Total Revenue / RPK')!.percentOutput).toBe(false);
  });

  it('refuses what it cannot compute (no silent guess)', () => {
    expect(parseFormula('Sharpe = average of returns')).toBeNull();
    expect(parseFormula('No equals sign here')).toBeNull();
    expect(parseFormula('CLV = Σ (Revenue_t − Cost_t) / (1 + r)^t')).toBeNull();
  });

  it('stops at the end of the sentence: trailing prose is not a variable', () => {
    const f = parseFormula('Loss Ratio = Incurred Losses / Earned Premium. Perform this calculation for each segment')!;
    expect(f.variables).toEqual(['Incurred Losses', 'Earned Premium']);
  });

  it('rejects prose that slipped into a variable name', () => {
    expect(parseFormula('Coverage = Reserves / Losses This shows how well the bank reserves cover losses')).toBeNull();
    expect(parseFormula('Gap = A - high-risk premiums align with actual claims experience')).toBeNull();
    expect(parseFormula('Share = Loyalty Sales / Total Transactions by Loyalty Members Compare these to non-members')).toBeNull();
  });

  it('an evaluation needs every variable and a finite result', () => {
    const f = parseFormula('Yield = Total Revenue / RPK')!;
    expect(() => evaluateParsed(f, { 'Total Revenue': 10 })).toThrow(/RPK/);
    expect(() => evaluateParsed(f, { 'Total Revenue': 10, RPK: 0 })).toThrow(/finite/);
  });
});

describe('extractFormulas — from an analysis file', () => {
  const md = [
    '## 🪜 Step-by-step',
    '1. **Calculate Fuel Efficiency Metrics:** For each aircraft:',
    '- **Fuel per RPK:** Fuel Efficiency (RPK) = Total Fuel Consumed / RPK.',
    '4. **Assess Impact of Load Factors:** Use:',
    '`Load Factor = (RPK / ASK) x 100`',
    '`Load Factor = (RPK / ASK) x 100`',
    '## 📤 Output format',
    '`Not = a step`',
  ].join('\n');

  it('takes backtick and inline formulas of the step-by-step section, deduplicated, with their step', () => {
    const fs = extractFormulas(md);
    expect(fs.map((f) => f.output)).toEqual(['Fuel Efficiency (RPK)', 'Load Factor']);
    expect(fs[1].step).toBe('Assess Impact of Load Factors');
  });
});
