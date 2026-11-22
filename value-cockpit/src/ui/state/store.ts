import type { Lever, Metric, ScenarioResult } from '../../domain/types';
import { getActiveVocabulary, type SectorArchetype } from '../../ontology/registry';
import { SCENARIO_ASSUMPTION_CODES } from '../../ontology/base';
import { TEMPLATES } from '../../templates';
import { SCENARIO_OPTIONS } from '../../templates/build';
import { modelTargets } from '../../templates/targets';
import { sanitizeProposal } from '../../copilot/proposal';
import { makeLeverSchema } from '../../domain/schemas';
import { ingestProposal } from '../../copilot/ingest';
import { resolveMetrics } from '../../engine/resolver';
import { runScenario } from '../../engine/scenario';
import { checkObservation, parseDossier, DEFAULT_CONTEXT, type CompanyContext, type DossierCase, type PlanOverride, type Provenance } from '../../dossier/format';
import { getCatalog } from '../../catalog';
import { toMetricValue, type Observation } from '../../workshop/observations';

export type { AssumptionCode } from '../../dossier/format';

export interface CockpitState extends DossierCase {
  error: string | null;
}

/** What the analyst fills in for a lever; ids, source and status are set by the store. */
export type LeverDraft = Pick<Lever, 'label' | 'mechanism' | 'category' | 'impactMetricCode' | 'expectedDelta' | 'deltaKind'
  | 'timeToImpactDays' | 'effort' | 'confidence' | 'confidenceBasis' | 'implementationCost'>;

/** Same rules as a copilot proposal: vocabulary, model inputs, confidence basis (docs/02). */
function checkLever(lever: Lever, archetype: SectorArchetype): Lever {
  return makeLeverSchema(getActiveVocabulary(archetype), modelTargets(archetype).calculated).parse(lever) as Lever;
}

export type Action =
  | { type: 'selectArchetype'; archetype: SectorArchetype }
  | { type: 'setName'; name: string }
  | { type: 'setContext'; patch: Partial<CompanyContext> }
  | { type: 'setPlanItem'; id: string; patch: PlanOverride }
  | { type: 'addObservation'; analysisId: string; formula: string; values: Record<string, number>; metricCode: string | null; note: string; today: string }
  | { type: 'applyObservation'; id: string }
  | { type: 'removeObservation'; id: string }
  | { type: 'loadDossier'; raw: unknown }
  | { type: 'setInput'; code: string; value: number; by?: string; at?: string }
  | { type: 'confirmInput'; code: string; by: string; at: string }
  | { type: 'setProvenanceRef'; code: string; ref: string }
  | { type: 'setInputs'; values: Record<string, number>; source: Provenance['source']; ref: string; by: string; at: string }
  | { type: 'ingestProposal'; raw: unknown; today: string }
  | { type: 'addLever'; draft: LeverDraft; by?: string }
  | { type: 'updateLever'; id: string; patch: Partial<LeverDraft> }
  | { type: 'validateLever'; id: string; by: string; at: string }
  | { type: 'rejectLever'; id: string; by: string; at: string }
  | { type: 'toggleScenarioLever'; id: string }
  | { type: 'setAppliedDelta'; id: string; value: number }
  | { type: 'setAssumption'; code: string; value: number }
  | { type: 'saveScenario'; name: string }
  | { type: 'loadScenario'; name: string }
  | { type: 'deleteScenario'; name: string }
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
    context: { ...DEFAULT_CONTEXT },
    inputs: { ...template(archetype).demoInputs },
    provenance: {},
    levers: [], rootCauses: [],
    scenario: { leverIds: [], applied: {}, assumptions: {} },
    savedScenarios: {},
    plan: {},
    observations: [],
    nextId: 1, error: null,
  };
}

const withoutLever = (s: CockpitState['scenario'], id: string): CockpitState['scenario'] => {
  const { [id]: _removed, ...applied } = s.applied;
  return { ...s, leverIds: s.leverIds.filter((x) => x !== id), applied };
};

/** A validation error as `path: message; …` rather than the raw issue list. */
function readable(e: unknown): string {
  const issues = (e as { issues?: { path: (string | number)[]; message: string }[] }).issues;
  return issues ? issues.map((i) => `${i.path.join('.')} : ${i.message}`).join(' ; ') : (e as Error).message;
}

/** Pure reducer. Every gate of docs/02 that the UI can reach is enforced here. */
export function reducer(state: CockpitState, action: Action): CockpitState {
  const next = reduce(state, action);
  if (next.levers === state.levers || Object.keys(next.savedScenarios).length === 0) return next;
  // Levers changed: a saved scenario never keeps a lever that is no longer validated or quantified.
  const eligible = (id: string) => next.levers.some((l) => l.id === id && l.status === 'validated' && l.impactMetricCode in next.inputs);
  const savedScenarios = Object.fromEntries(Object.entries(next.savedScenarios).map(([name, sc]) => [
    name, sc.leverIds.reduce((acc, id) => (eligible(id) ? acc : withoutLever(acc, id)), sc),
  ]));
  return { ...next, savedScenarios };
}

function reduce(state: CockpitState, action: Action): CockpitState {
  switch (action.type) {
    case 'selectArchetype':
      return initialState(action.archetype);

    case 'setName':
      return { ...state, name: action.name };

    case 'setContext':
      return { ...state, context: { ...state.context, ...action.patch } };

    case 'addObservation': {
      const o: Observation = {
        id: `o${state.nextId}`, analysisId: action.analysisId, formula: action.formula, values: action.values,
        metricCode: action.metricCode, date: action.today, note: action.note, applied: false,
      };
      try {
        checkObservation(o, state.archetype);
      } catch (e) {
        return { ...state, error: `Observation refusée : ${(e as Error).message}` };
      }
      return { ...state, observations: [...state.observations, o], nextId: state.nextId + 1, error: null };
    }

    case 'applyObservation': {
      const o = state.observations.find((x) => x.id === action.id);
      if (!o) return state;
      if (!o.metricCode || !(o.metricCode in state.inputs)) {
        return { ...state, error: `${o.metricCode ?? 'Cette observation'} n'est pas un input du modèle : elle reste un diagnostic` };
      }
      const unit = getActiveVocabulary(state.archetype).metricMeta[o.metricCode].unit;
      return {
        ...state,
        inputs: { ...state.inputs, [o.metricCode]: toMetricValue(o, getCatalog(state.archetype), unit) },
        provenance: { ...state.provenance, [o.metricCode]: { source: 'observation', ref: `${o.analysisId} — ${o.formula}`, by: '', at: o.date } },
        observations: state.observations.map((x) => (x.id === o.id ? { ...x, applied: true } : x)),
        error: null,
      };
    }

    case 'removeObservation':
      return { ...state, observations: state.observations.filter((x) => x.id !== action.id) };

    case 'setPlanItem':
      return { ...state, plan: { ...state.plan, [action.id]: { ...state.plan[action.id], ...action.patch } } };

    case 'loadDossier':
      try {
        return { ...parseDossier(action.raw), error: null };
      } catch (e) {
        return { ...state, error: `Dossier refusé : ${(e as Error).message}` };
      }

    case 'setInput':
      return {
        ...state, inputs: { ...state.inputs, [action.code]: action.value },
        // A typed value keeps the reference already noted for that input.
        provenance: { ...state.provenance, [action.code]: { source: 'manual', ref: state.provenance[action.code]?.source === 'manual' ? state.provenance[action.code].ref : '', by: action.by ?? '', at: action.at ?? '' } },
      };

    case 'confirmInput':
      if (!(action.code in state.inputs)) return state;
      return { ...state, provenance: { ...state.provenance, [action.code]: { source: 'manual', ref: '', by: action.by, at: action.at } } };

    case 'setProvenanceRef':
      if (!state.provenance[action.code]) return state;
      return { ...state, provenance: { ...state.provenance, [action.code]: { ...state.provenance[action.code], ref: action.ref } } };

    case 'setInputs': {
      const unknown = Object.keys(action.values).filter((c) => !(c in state.inputs));
      const bad = Object.entries(action.values).filter(([, v]) => !Number.isFinite(v)).map(([c]) => c);
      if (unknown.length || bad.length) {
        return { ...state, error: `Import refusé — ${unknown.length ? `inputs inconnus du modèle : ${unknown.join(', ')}` : ''}${bad.length ? ` valeurs non numériques : ${bad.join(', ')}` : ''}` };
      }
      const mark = { source: action.source, ref: action.ref, by: action.by, at: action.at };
      return {
        ...state, error: null, inputs: { ...state.inputs, ...action.values },
        provenance: { ...state.provenance, ...Object.fromEntries(Object.keys(action.values).map((c) => [c, mark])) },
      };
    }

    case 'ingestProposal': {
      try {
        const clean = sanitizeProposal(action.raw, getActiveVocabulary(state.archetype), modelTargets(state.archetype).calculated);
        let n = state.nextId;
        const { levers, rootCauses } = ingestProposal(clean, () => `h${n++}`, () => action.today);
        return { ...state, levers: [...state.levers, ...levers], rootCauses: [...state.rootCauses, ...rootCauses], nextId: n, error: null };
      } catch (e) {
        return { ...state, error: `Proposition rejetée : ${readable(e)}` };
      }
    }

    case 'addLever': {
      try {
        const lever = checkLever({
          ...action.draft, id: `h${state.nextId}`, nodeId: action.draft.impactMetricCode, causeId: null,
          source: 'analyst', status: 'hypothesis', ...(action.by?.trim() ? { createdBy: action.by.trim() } : {}),
        }, state.archetype);
        return { ...state, levers: [...state.levers, lever], nextId: state.nextId + 1, error: null };
      } catch (e) {
        return { ...state, error: `Levier refusé : ${readable(e)}` };
      }
    }

    case 'updateLever': {
      const current = state.levers.find((l) => l.id === action.id);
      if (!current) return state;
      try {
        const lever = checkLever({ ...current, ...action.patch, nodeId: action.patch.impactMetricCode ?? current.nodeId }, state.archetype);
        const levers = state.levers.map((l) => (l.id === lever.id ? lever : l));
        if (!state.scenario.leverIds.includes(lever.id)) return { ...state, levers, error: null };
        // In the scenario: a qualitative target leaves it; a new delta replaces the applied one.
        const scenario = lever.impactMetricCode in state.inputs
          ? { ...state.scenario, applied: { ...state.scenario.applied, [lever.id]: lever.expectedDelta } }
          : withoutLever(state.scenario, lever.id);
        return { ...state, levers, scenario, error: null };
      } catch (e) {
        return { ...state, error: `Levier refusé : ${readable(e)}` };
      }
    }

    case 'validateLever':
    case 'rejectLever': {
      const by = action.by.trim();
      if (!by) return { ...state, error: 'Indiquez votre nom d\'analyste (champ Analyste, colonne de gauche) : une décision sur un levier est toujours signée.' };
      const status = action.type === 'validateLever' ? 'validated' as const : 'rejected' as const;
      const levers = state.levers.map((l) => (l.id === action.id ? { ...l, status, decision: { by, at: action.at } } : l));
      return {
        ...state, levers, error: null,
        scenario: status === 'rejected' ? withoutLever(state.scenario, action.id) : state.scenario,
      };
    }

    case 'toggleScenarioLever': {
      if (state.scenario.leverIds.includes(action.id)) return { ...state, scenario: withoutLever(state.scenario, action.id) };
      const lever = state.levers.find((l) => l.id === action.id);
      if (!lever || lever.status !== 'validated') {
        return { ...state, error: 'Seul un levier validé par l\'analyste peut entrer dans un scénario.' };
      }
      if (!(lever.impactMetricCode in state.inputs)) {
        return { ...state, error: `Levier qualitatif : ${lever.impactMetricCode} n'est pas un input du modèle, son impact n'est pas simulé.` };
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

    case 'saveScenario': {
      const name = action.name.trim();
      if (!name) return { ...state, error: 'Donnez un nom au scénario avant de l\'enregistrer' };
      return { ...state, savedScenarios: { ...state.savedScenarios, [name]: state.scenario }, error: null };
    }

    case 'loadScenario':
      return state.savedScenarios[action.name] ? { ...state, scenario: state.savedScenarios[action.name], error: null } : state;

    case 'deleteScenario': {
      const { [action.name]: _removed, ...savedScenarios } = state.savedScenarios;
      return { ...state, savedScenarios };
    }

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

/** Any scenario of the case, always computed by the engine (computedBy = 'engine'). */
export function runCaseScenario(state: CockpitState, scenario: CockpitState['scenario']): ScenarioResult[] {
  const scenarioLevers = scenario.leverIds.map((id) => ({
    scenarioId: 'ui', leverId: id,
    appliedDelta: scenario.applied[id],
    deltaKind: state.levers.find((l) => l.id === id)!.deltaKind,
  }));
  const assumptions = Object.entries(scenario.assumptions)
    .map(([metricCode, value]) => ({ scenarioId: 'ui', metricCode, value: value! }));
  return runScenario('ui', selectMetrics(state), state.levers, scenarioLevers, assumptions, template(state.archetype).interactions, SCENARIO_OPTIONS);
}

/** The scenario being edited. */
export function selectScenario(state: CockpitState): ScenarioResult[] {
  return runCaseScenario(state, state.scenario);
}
