import type { Metric } from '../domain/types';
import type { SectorArchetype } from '../ontology/registry';
import { makeTemplate, BRIDGE_FORMULAS } from './build';

export type EbitdaInputs = {
  REVENUE: number;
  REVENUE_GROWTH: number;
  EBITDA_MARGIN: number;
  EBITDA_ENTRY: number;
  ENTRY_MULTIPLE: number;
  EXIT_MULTIPLE: number;
  HOLD_YEARS: number;
  NET_DEBT_ENTRY: number;
  FCF_ANNUAL: number;
};

// Generic two-point bridge on base codes only (docs/11 level 1): any EBITDA-family
// archetype without its own sector template uses it.
// Approximations (documented): constant growth and margin to exit; EBITDA_ENTRY is the
// historical input, so levers on growth or margin never move the entry price.
const FORMULAS: Record<string, string> = {
  REVENUE_EXIT: 'REVENUE * (1 + REVENUE_GROWTH) ^ HOLD_YEARS',
  EBITDA_EXIT: 'REVENUE_EXIT * EBITDA_MARGIN',
  ...BRIDGE_FORMULAS,
};

export function instantiateEbitdaTemplate(companyId: string, inputs: EbitdaInputs, archetype: SectorArchetype): Metric[] {
  return makeTemplate(archetype, FORMULAS)(companyId, inputs);
}
