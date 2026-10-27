import type { Metric } from '../domain/types';
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
