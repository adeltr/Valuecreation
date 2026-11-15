import type { Metric } from '../domain/types';
import { makeTemplate, BRIDGE_FORMULAS, type EbitdaBridgeInputs } from './build';

export type SaasInputs = EbitdaBridgeInputs & {
  ARR: number; GROSS_CHURN: number; EXPANSION_RATE: number; EBITDA_MARGIN: number;
};

// EBITDA_ENTRY is the historical figure, an input: a lever on the margin never moves the entry price.

const FORMULAS: Record<string, string> = {
  NRR: '1 + EXPANSION_RATE - GROSS_CHURN',
  ARR_EXIT: 'ARR * NRR ^ HOLD_YEARS',
  REVENUE: 'ARR',
  REVENUE_EXIT: 'ARR_EXIT',
  EBITDA_EXIT: 'ARR_EXIT * EBITDA_MARGIN',
  ...BRIDGE_FORMULAS,
};

const build = makeTemplate('saas', FORMULAS);

export function instantiateSaasTemplate(companyId: string, inputs: SaasInputs): Metric[] {
  return build(companyId, inputs);
}
