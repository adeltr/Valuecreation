import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';
import { TEMPLATES } from './index';

export interface ModelTargets {
  /** Inputs of the template a lever may move: the engine computes their impact. */
  quantified: string[];
  /** Vocabulary metrics outside the model: a lever on them is qualitative, never simulated. */
  diagnostic: string[];
  /** Outputs of the model: never a lever target (a lever acts on an input). */
  calculated: string[];
}

/** What a lever can target for an archetype, given its template (docs/06). */
export function modelTargets(archetype: SectorArchetype): ModelTargets {
  const vocab = getActiveVocabulary(archetype);
  const t = TEMPLATES[archetype];
  const metrics = t ? t.instantiate('targets', t.demoInputs) : [];
  const inputs = metrics.filter((m) => !m.isCalculated).map((m) => m.code);
  const calculated = metrics.filter((m) => m.isCalculated).map((m) => m.code);
  const targets = vocab.metricCodes.filter((c) => vocab.isLeverTarget(c));
  return {
    quantified: targets.filter((c) => inputs.includes(c)),
    diagnostic: targets.filter((c) => !inputs.includes(c) && !calculated.includes(c)),
    calculated,
  };
}
