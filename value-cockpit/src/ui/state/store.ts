import type { Lever, Metric, ScenarioResult } from '../../domain/types';
import { getActiveVocabulary, type SectorArchetype } from '../../ontology/registry';
import { SCENARIO_ASSUMPTION_CODES } from '../../ontology/base';
import { TEMPLATES } from '../../templates';
import { sanitizeProposal } from '../../copilot/proposal';
import { ingestProposal } from '../../copilot/ingest';
import { resolveMetrics } from '../../engine/resolver';
import { runScenario } from '../../engine/scenario';
import { parseDossier, type DossierCase } from '../../dossier/format';

export type { AssumptionCode } from '../../dossier/format';

export interface CockpitState extends DossierCase {
  error: string | null;
}

export type Action =
  | { type: 'selectArchetype'; archetype: SectorArchetype }
  | { type: 'setName'; name: string }
  | { type: 'loadDossier'; raw: unknown }
  | { type: 'setInput'; code: string; value: number }
  | { type: 'ingestProposal'; raw: unknown; today: string }
  | { type: 'validateLever'; id: string }
  | { type: 'rejectLever'; id: string }
  | { type: 'toggleScenarioLever'; id: string }
  | { type: 'setAppliedDelta'; id: string; value: number }
  | { type: 'setAssumption'; code: string; value: number }
  | { type: 'reportError'; message: string }
  | { type: 'clearError' };

const template = (archetype: SectorArchetype) => {
  const t = TEMPLATES[archetype];
  if (!t) throw new Error(`No template for archetype: ${archetype}`);
  return t;
};

export function initialState(archetype: SectorArchetype): CockpitState {
  return {
    name: '',
    archetype,
    inputs: { ...template(archetype).demoInputs },
    levers: [], rootCauses: [],
    scenario: { leverIds: [], applied: {}, assumptions: {} },
    nextId: 1, error: null,
  };
}

const withoutLever = (s: CockpitState['scenario'], id: string): CockpitState['scenario'] => {
  const { [id]: _removed, ...applied } = s.applied;
  return { ...s, leverIds: s.leverIds.filter((x) => x !== id), applied };
};

const setStatus = (levers: Lever[], id: string, status: Lever['status']) =>
  levers.map((l) => (l.id === id ? { ...l, status } : l));

/** Pure reducer. Every gate of docs/02 that the UI can reach is enforced here. */
export function reducer(state: CockpitState, action: Action): CockpitState {
  switch (action.type) {
    case 'selectArchetype':
      return initialState(action.archetype);

    case 'setName':
      return { ...state, name: action.name };

    case 'loadDossier':
      try {
        return { ...parseDossier(action.raw), error: null };
      } catch (e) {
        return { ...state, error: `Dossier refusé : ${(e as Error).message}` };
      }

    case 'setInput':
      return { ...state, inputs: { ...state.inputs, [action.code]: action.value } };

    case 'ingestProposal': {
      try {
        const clean = sanitizeProposal(action.raw, getActiveVocabulary(state.archetype));
        let n = state.nextId;
        const { levers, rootCauses } = ingestProposal(clean, () => `h${n++}`, () => action.today);
        return { ...state, levers: [...state.levers, ...levers], rootCauses: [...state.rootCauses, ...rootCauses], nextId: n, error: null };
      } catch (e) {
        return { ...state, error: `Proposition rejetée : ${(e as Error).message}` };
      }
    }

    case 'validateLever':
      return { ...state, levers: setStatus(state.levers, action.id, 'validated') };

    case 'rejectLever':
      return { ...state, levers: setStatus(state.levers, action.id, 'rejected'), scenario: withoutLever(state.scenario, action.id) };

    case 'toggleScenarioLever': {
      if (state.scenario.leverIds.includes(action.id)) return { ...state, scenario: withoutLever(state.scenario, action.id) };
      const lever = state.levers.find((l) => l.id === action.id);
      if (!lever || lever.status !== 'validated') {
        return { ...state, error: 'Seul un levier validé par l\'analyste peut entrer dans un scénario.' };
      }
      return {
        ...state,
        scenario: {
          ...state.scenario,
          leverIds: [...state.scenario.leverIds, lever.id],
          applied: { ...state.scenario.applied, [lever.id]: lever.expectedDelta },
        },
        error: null,
      };
    }

    case 'setAppliedDelta':
      if (!state.scenario.leverIds.includes(action.id)) return state;
      return { ...state, scenario: { ...state.scenario, applied: { ...state.scenario.applied, [action.id]: action.value } } };

    case 'setAssumption':
      if (!(SCENARIO_ASSUMPTION_CODES as readonly string[]).includes(action.code)) {
        return { ...state, error: `Hypothèse non autorisée : ${action.code} (assumption limitée à ${SCENARIO_ASSUMPTION_CODES.join(', ')})` };
      }
      return { ...state, scenario: { ...state.scenario, assumptions: { ...state.scenario.assumptions, [action.code]: action.value } } };

    case 'reportError':
      return { ...state, error: action.message };

    case 'clearError':
      return { ...state, error: null };
  }
}

export function selectMetrics(state: CockpitState): Metric[] {
  return template(state.archetype).instantiate('company', state.inputs);
}

/** Baseline: the engine on the analyst's inputs, no lever, no assumption. */
export function selectBaseline(state: CockpitState): Map<string, number> {
  return resolveMetrics(selectMetrics(state));
}

/** Scenario: always computed by the engine (computedBy = 'engine'). */
export function selectScenario(state: CockpitState): ScenarioResult[] {
  const scenarioLevers = state.scenario.leverIds.map((id) => ({
    scenarioId: 'ui', leverId: id,
    appliedDelta: state.scenario.applied[id],
    deltaKind: state.levers.find((l) => l.id === id)!.deltaKind,
  }));
  const assumptions = Object.entries(state.scenario.assumptions)
    .map(([metricCode, value]) => ({ scenarioId: 'ui', metricCode, value: value! }));
  return runScenario('ui', selectMetrics(state), state.levers, scenarioLevers, assumptions, template(state.archetype).interactions);
}
