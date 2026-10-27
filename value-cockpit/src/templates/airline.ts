import type { Metric } from '../domain/types';
import { getActiveVocabulary } from '../ontology/registry';

export type AirlineInputs = {
  ASK: number;
  LOAD_FACTOR: number;
  YIELD: number;
  ANCILLARY_PER_PAX: number;
  AVG_TRIP_KM: number;
  CASK_EX_FUEL: number;
  FUEL_CASK: number;
  CAPACITY_GROWTH: number;
  EBITDA_ENTRY: number;
  ENTRY_MULTIPLE: number;
  EXIT_MULTIPLE: number;
  HOLD_YEARS: number;
  NET_DEBT_ENTRY: number;
  FCF_ANNUAL: number;
};

// Linkage formulas validated in data/analysis-library/airline/_curation.md.
// Approximations (documented):
// - EBITDA_ENTRY is the historical figure, an INPUT: levers perturb the drivers, which
//   only feed the exit year, so a lever never moves the entry price.
// - Drivers (load factor, yield, CASK, ancillary) are held at their perturbed value for
//   the exit year; capacity compounds at CAPACITY_GROWTH (analyst choice, no Umbrex source).
// - CASK_EX_FUEL excludes D&A so the result stays at EBITDA level (EBITDA, not EBITDAR).
// - Passengers = RPK / AVG_TRIP_KM: constant average trip length (KPI "Average Length of Haul").
const FORMULAS: Record<string, string> = {
  ASK_EXIT: 'ASK * (1 + CAPACITY_GROWTH) ^ HOLD_YEARS',
  RPK_EXIT: 'ASK_EXIT * LOAD_FACTOR',                              // #13 Load Factor = RPK / ASK
  PASSENGERS_EXIT: 'RPK_EXIT / AVG_TRIP_KM',
  REVENUE_EXIT: 'RPK_EXIT * YIELD + PASSENGERS_EXIT * ANCILLARY_PER_PAX', // #3 yield, #23 ancillary
  OPERATING_COSTS_EXIT: 'ASK_EXIT * (CASK_EX_FUEL + FUEL_CASK)',   // #8 CASK, #33 fuel CASM
  EBITDA_EXIT: 'REVENUE_EXIT - OPERATING_COSTS_EXIT',
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

export function instantiateAirlineTemplate(companyId: string, inputs: AirlineInputs): Metric[] {
  const vocab = getActiveVocabulary('airline');
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
    ...Object.entries(FORMULAS).map(([code, formula]) => make(code, null, formula)),
  ];
}
