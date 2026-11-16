import type { Metric } from '../domain/types';
import { makeTemplate, BRIDGE_FORMULAS, type EbitdaBridgeInputs } from './build';

export type AirlineInputs = EbitdaBridgeInputs & {
  ASK: number;
  LOAD_FACTOR: number;
  YIELD: number;
  ANCILLARY_PER_PAX: number;
  AVG_TRIP_KM: number;
  CASK_EX_FUEL: number;
  FUEL_CASK: number;
  CAPACITY_GROWTH: number;
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
  ...BRIDGE_FORMULAS,
};

const build = makeTemplate('airline', FORMULAS);

export function instantiateAirlineTemplate(companyId: string, inputs: AirlineInputs): Metric[] {
  return build(companyId, inputs);
}
