import { describe, it, expect } from 'vitest';
import { FAMILY_BRIDGE } from './build';
import { evaluateFormula } from '../engine/formula';
import { BRIDGE_FAMILIES } from '../ontology/families';

/** Resolves a bridge by hand-ordered evaluation (the anchor is given as an input here). */
function resolve(formulas: Record<string, string>, inputs: Record<string, number>) {
  const scope: Record<string, number> = { ...inputs };
  let left = Object.entries(formulas);
  while (left.length) {
    const next = left.filter(([code, f]) => {
      try { scope[code] = evaluateFormula(f, scope); return false; } catch { return true; }
    });
    if (next.length === left.length) throw new Error(`unresolved: ${next.map(([c]) => c)}`);
    left = next;
  }
  return scope;
}

describe('bridge formulas per family (docs/16)', () => {
  it('ebitda: cash builds from EBITDA conversion, capex and working capital; net debt falls by it', () => {
    const v = resolve(FAMILY_BRIDGE.ebitda.formulas, {
      EBITDA_ENTRY: 100, EBITDA_EXIT: 150, REVENUE_EXIT: 1000, ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 5, NET_DEBT_ENTRY: 300,
      CASH_CONVERSION: 0.6, CAPEX: 30, DSO: 36.5, DIO: 73, DPO: 36.5, COGS_RATIO: 0.5, WORKING_CAPITAL: 120, PLAN_ONE_OFF_COSTS: 10,
    });
    expect(v.EQUITY_ENTRY).toBe(500);
    // NWC exit = 1000 × (36.5 + (73 − 36.5) × 0.5) / 365 = 150
    expect(v.WORKING_CAPITAL_EXIT).toBeCloseTo(150, 10);
    // 5 × ((100 + 150) / 2 × 0.6 − 30) − (150 − 120) − 10 = 185
    expect(v.CUMULATIVE_FCF).toBeCloseTo(185, 10);
    expect(v.FCF_ANNUAL).toBeCloseTo(37, 10);
    expect(v.NET_DEBT_EXIT).toBeCloseTo(115, 10);
    expect(v.MOIC).toBeCloseTo((1200 - 115) / 500, 12);
    expect(v.IRR).toBeCloseTo(2.17 ** (1 / 5) - 1, 12);
  });

  it('a working-capital or capex lever is worth cash: 10 days of DSO on 1 000 of revenue = 27.4', () => {
    const inputs = {
      EBITDA_ENTRY: 100, EBITDA_EXIT: 150, REVENUE_EXIT: 1000, ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 5, NET_DEBT_ENTRY: 300,
      CASH_CONVERSION: 0.6, CAPEX: 30, DSO: 36.5, DIO: 73, DPO: 36.5, COGS_RATIO: 0.5, WORKING_CAPITAL: 120, PLAN_ONE_OFF_COSTS: 0,
    };
    const base = resolve(FAMILY_BRIDGE.ebitda.formulas, inputs);
    const dso = resolve(FAMILY_BRIDGE.ebitda.formulas, { ...inputs, DSO: 26.5 });
    expect(dso.CUMULATIVE_FCF - base.CUMULATIVE_FCF).toBeCloseTo(1000 * 10 / 365, 10);
    const capex = resolve(FAMILY_BRIDGE.ebitda.formulas, { ...inputs, CAPEX: 25 });
    expect(capex.CUMULATIVE_FCF - base.CUMULATIVE_FCF).toBeCloseTo(25, 10);
    expect(capex.MOIC).toBeGreaterThan(base.MOIC);
  });

  it('book_value: retained earnings grow book value, dividends count in the MOIC', () => {
    const v = resolve(FAMILY_BRIDGE.book_value.formulas, {
      BOOK_VALUE_ENTRY: 1000, NET_INCOME_ENTRY: 100, NET_INCOME_EXIT: 140, PAYOUT_RATIO: 0.4,
      ENTRY_MULTIPLE: 1.2, EXIT_MULTIPLE: 1.2, HOLD_YEARS: 5, PLAN_ONE_OFF_COSTS: 0,
    });
    // cumulative NI = 5 × (100 + 140) / 2 = 600 ; BV exit = 1000 + 600 × 0.6 = 1360 ; dividends = 240
    expect(v.CUMULATIVE_NET_INCOME).toBe(600);
    expect(v.BOOK_VALUE_EXIT).toBe(1360);
    expect(v.EQUITY_ENTRY).toBe(1200);
    expect(v.MOIC).toBeCloseTo((1360 * 1.2 + 240) / 1200, 12);
    expect(v.ROE_EXIT).toBeCloseTo(140 / 1360, 12);
    expect(v.IRR).toBeCloseTo(((1360 * 1.2 + 240) / 1200) ** (1 / 5) - 1, 12); // dividends counted at exit
    const costly = resolve(FAMILY_BRIDGE.book_value.formulas, {
      BOOK_VALUE_ENTRY: 1000, NET_INCOME_ENTRY: 100, NET_INCOME_EXIT: 140, PAYOUT_RATIO: 0.4,
      ENTRY_MULTIPLE: 1.2, EXIT_MULTIPLE: 1.2, HOLD_YEARS: 5, PLAN_ONE_OFF_COSTS: 60,
    });
    expect(costly.BOOK_VALUE_EXIT).toBe(1300);
  });

  it('rnpv: equity = rNPV × multiple + cash; burn consumes cash over the hold', () => {
    const v = resolve(FAMILY_BRIDGE.rnpv.formulas, {
      RNPV_ENTRY: 300, RNPV_EXIT: 500, CASH_ENTRY: 100, ANNUAL_BURN: 30, ENTRY_MULTIPLE: 1, EXIT_MULTIPLE: 1, HOLD_YEARS: 4,
      PLAN_ONE_OFF_COSTS: 0,
    });
    expect(v.CASH_EXIT).toBe(-20);
    expect(v.EQUITY_ENTRY).toBe(400);
    expect(v.MOIC).toBeCloseTo(480 / 400, 12);
    expect(v.RUNWAY_YEARS).toBeCloseTo(100 / 30, 12);
    expect(v.IRR).toBeCloseTo(1.2 ** (1 / 4) - 1, 12);
    const wiped = resolve(FAMILY_BRIDGE.rnpv.formulas, {
      RNPV_ENTRY: 300, RNPV_EXIT: 0, CASH_ENTRY: 100, ANNUAL_BURN: 30, ENTRY_MULTIPLE: 1, EXIT_MULTIPLE: 1, HOLD_YEARS: 4,
      PLAN_ONE_OFF_COSTS: 15,
    });
    expect(wiped.CASH_EXIT).toBe(-35);
    expect(wiped.IRR).toBe(-1); // equity wiped out: −100 %, never a complex number
  });

  it('each family names its anchor, its analyst inputs and the rows the simulation shows', () => {
    for (const f of BRIDGE_FAMILIES) {
      const b = FAMILY_BRIDGE[f];
      expect(Object.keys(b.formulas)).toEqual(expect.arrayContaining(['EQUITY_ENTRY', 'EQUITY_EXIT', 'MOIC']));
      expect(b.summaryRows).toContain(b.anchor);
      expect(b.summaryRows.slice(-2)).toEqual(['MOIC', 'IRR']);
      expect(b.inputs).toContain('PLAN_ONE_OFF_COSTS');
      for (const i of b.inputs) expect(Object.keys(b.formulas)).not.toContain(i);
    }
    expect(FAMILY_BRIDGE.ebitda.anchor).toBe('EBITDA_EXIT');
    expect(FAMILY_BRIDGE.book_value.anchor).toBe('NET_INCOME_EXIT');
    expect(FAMILY_BRIDGE.rnpv.anchor).toBe('RNPV_EXIT');
  });
});
