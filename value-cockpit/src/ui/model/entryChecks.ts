import type { Metric } from '../../domain/types';
import type { BridgeFamily } from '../../ontology/families';
import { FAMILY_BRIDGE, SCENARIO_OPTIONS } from '../../templates/build';
import { resolveMetrics } from '../../engine/resolver';

export interface EntryCheck {
  entryCode: string; modelCode: string;
  entered: number;
  /** What the drivers give when the model is read at year 0. */
  model: number;
  /** entered / model − 1. */
  gap: number;
  ok: boolean;
}

const TOLERANCE = 0.05;

/**
 * Entry facts (EBITDA, working capital, net income, rNPV) are inputs: nothing forces them to agree
 * with the drivers. This reads the model at year 0 and reports the gap — it never corrects it.
 */
export function entryChecks(metrics: Metric[], family: BridgeFamily): EntryCheck[] {
  const atEntry = metrics.map((m) => (m.code === SCENARIO_OPTIONS.horizonYearsCode ? { ...m, currentValue: 0 } : m));
  const out: EntryCheck[] = [];
  for (const [entryCode, modelCode] of FAMILY_BRIDGE[family].entryPairs) {
    const entered = metrics.find((m) => m.code === entryCode && !m.isCalculated)?.currentValue;
    if (entered === null || entered === undefined) continue;
    try {
      const model = resolveMetrics(atEntry, [modelCode]).get(modelCode);
      if (model === undefined) continue;
      const scale = Math.max(Math.abs(model), Math.abs(entered));
      const gap = model === 0 ? (entered === 0 ? 0 : Infinity) : entered / model - 1;
      out.push({ entryCode, modelCode, entered, model, gap, ok: scale === 0 || Math.abs(entered - model) <= TOLERANCE * scale });
    } catch { /* the model cannot be read at year 0: no check rather than a guess */ }
  }
  return out;
}
