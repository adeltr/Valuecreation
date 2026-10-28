import type { Metric } from '../domain/types';
import type { BridgeFamily } from '../ontology/families';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';

/**
 * Builds a template: analyst inputs first, then the linkage formulas. Every emitted code
 * must belong to the archetype's active vocabulary (invariant 3), units come from it.
 */
export function makeTemplate(archetype: SectorArchetype, formulas: Record<string, string>) {
  return (companyId: string, inputs: Record<string, number>): Metric[] => {
    const vocab = getActiveVocabulary(archetype);
    const make = (code: string, value: number | null, formula: string | null): Metric => {
      if (!vocab.isMetricCode(code)) throw new Error(`Template emits unknown code: ${code}`);
      return {
        id: `${companyId}:${code}`, companyId, code, label: code,
        unit: vocab.metricMeta[code].unit, isCalculated: formula !== null, formula,
        currentValue: value, benchmarkValue: null, benchmarkSource: null,
      };
    };
    return [
      ...Object.entries(inputs).map(([code, value]) => make(code, value, null)),
      ...Object.entries(formulas).map(([code, formula]) => make(code, null, formula)),
    ];
  };
}

/** The two-point bridge shared by every EBITDA-family template (docs/01). */
export const BRIDGE_FORMULAS: Record<string, string> = {
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

export interface FamilyBridge {
  /** Exit metric the sector formulas must define; the family bridge reads it. */
  anchor: string;
  /** Bridge inputs the analyst sets (entry facts, multiples, hold, policy). */
  inputs: string[];
  formulas: Record<string, string>;
  /** Rows of the simulation's bridge table, MOIC last. */
  summaryRows: string[];
  /** What ENTRY_MULTIPLE / EXIT_MULTIPLE multiply, for display. */
  multipleLabel: string;
}

// Approximations (docs/16): book value accumulates net income on a straight line from the
// entry to the exit run-rate; rNPV equity adds cash at exit, a negative cash meaning a
// funding need (no dilution modelled).
export const FAMILY_BRIDGE: Record<BridgeFamily, FamilyBridge> = {
  ebitda: {
    anchor: 'EBITDA_EXIT',
    inputs: ['EBITDA_ENTRY', 'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS', 'NET_DEBT_ENTRY', 'FCF_ANNUAL'],
    formulas: BRIDGE_FORMULAS,
    summaryRows: ['EBITDA_ENTRY', 'EQUITY_ENTRY', 'EBITDA_EXIT', 'NET_DEBT_EXIT', 'EQUITY_EXIT', 'MOIC'],
    multipleLabel: 'EV/EBITDA',
  },
  book_value: {
    anchor: 'NET_INCOME_EXIT',
    inputs: ['BOOK_VALUE_ENTRY', 'NET_INCOME_ENTRY', 'PAYOUT_RATIO', 'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS'],
    formulas: {
      CUMULATIVE_NET_INCOME: 'HOLD_YEARS * (NET_INCOME_ENTRY + NET_INCOME_EXIT) / 2',
      BOOK_VALUE_EXIT: 'BOOK_VALUE_ENTRY + CUMULATIVE_NET_INCOME * (1 - PAYOUT_RATIO)',
      DIVIDENDS_CUMULATIVE: 'CUMULATIVE_NET_INCOME * PAYOUT_RATIO',
      ROE_EXIT: 'NET_INCOME_EXIT / BOOK_VALUE_EXIT',
      EQUITY_ENTRY: 'BOOK_VALUE_ENTRY * ENTRY_MULTIPLE',
      EQUITY_EXIT: 'BOOK_VALUE_EXIT * EXIT_MULTIPLE',
      MOIC: '(EQUITY_EXIT + DIVIDENDS_CUMULATIVE) / EQUITY_ENTRY',
    },
    summaryRows: ['BOOK_VALUE_ENTRY', 'EQUITY_ENTRY', 'NET_INCOME_EXIT', 'BOOK_VALUE_EXIT', 'DIVIDENDS_CUMULATIVE', 'EQUITY_EXIT', 'MOIC'],
    multipleLabel: 'P/BV',
  },
  rnpv: {
    anchor: 'RNPV_EXIT',
    inputs: ['RNPV_ENTRY', 'CASH_ENTRY', 'ANNUAL_BURN', 'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS'],
    formulas: {
      CASH_EXIT: 'CASH_ENTRY - ANNUAL_BURN * HOLD_YEARS',
      RUNWAY_YEARS: 'CASH_ENTRY / ANNUAL_BURN',
      EQUITY_ENTRY: 'RNPV_ENTRY * ENTRY_MULTIPLE + CASH_ENTRY',
      EQUITY_EXIT: 'RNPV_EXIT * EXIT_MULTIPLE + CASH_EXIT',
      MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
    },
    summaryRows: ['RNPV_ENTRY', 'EQUITY_ENTRY', 'RNPV_EXIT', 'CASH_EXIT', 'RUNWAY_YEARS', 'EQUITY_EXIT', 'MOIC'],
    multipleLabel: '× rNPV',
  },
};
