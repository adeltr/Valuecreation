import { useMemo, useReducer, useState } from 'react';
import { initialState, reducer, selectBaseline, selectMetrics, selectScenario } from './state/store';
import { TEMPLATES } from '../templates';
import { getCatalog } from '../catalog';
import type { SectorArchetype } from '../ontology/registry';
import { DriverGraph } from './components/DriverGraph';
import { CompanyView } from './components/CompanyView';
import { CopilotPanel } from './components/CopilotPanel';
import { SimulationPanel } from './components/SimulationPanel';
import { HundredDayPlan } from './components/HundredDayPlan';
import { DossierBar } from './components/DossierBar';
import type { KeyValueStore } from './state/library';
import { hasUnsavedWork } from './state/unsaved';

export function App({ storage = window.localStorage }: { storage?: KeyValueStore } = {}) {
  const [state, dispatch] = useReducer(reducer, 'airline' as SectorArchetype, initialState);
  const metrics = useMemo(() => selectMetrics(state), [state]);
  const catalog = getCatalog(state.archetype);
  const [clean, setClean] = useState<string | null>(null);
  const mayReplace = () => !hasUnsavedWork(state, clean)
    || window.confirm('Les modifications non enregistrées du dossier en cours seront perdues. Continuer ?');

  // The engine may refuse an input set (e.g. a division by zero while typing): show it, never guess.
  let baseline = new Map<string, number>();
  let scenario = null;
  let engineError: string | null = null;
  try {
    baseline = selectBaseline(state);
    scenario = selectScenario(state);
  } catch (e) {
    engineError = (e as Error).message;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Value Creation Cockpit</h1>
        <label>
          Type d'entreprise{' '}
          <select value={state.archetype}
            onChange={(e) => mayReplace() && dispatch({ type: 'selectArchetype', archetype: e.target.value as SectorArchetype })}>
            {([2, 1] as const).map((level) => {
              const entries = Object.entries(TEMPLATES).filter(([, t]) => t!.level === level);
              return entries.length === 0 ? null : (
                <optgroup key={level} label={level === 2 ? 'Modèle sectoriel complet' : 'Modèle EBITDA générique'}>
                  {entries.sort(([, a], [, b]) => a!.label.localeCompare(b!.label))
                    .map(([a, t]) => <option key={a} value={a}>{t!.label}</option>)}
                </optgroup>
              );
            })}
          </select>
        </label>
      </header>
      <DossierBar state={state} dispatch={dispatch} storage={storage} mayReplace={mayReplace} markClean={setClean} />
      {state.error && (
        <div role="alert" className="banner">
          {state.error} <button type="button" className="secondary" onClick={() => dispatch({ type: 'clearError' })}>×</button>
        </div>
      )}
      <main className="grid">
        <DriverGraph metrics={metrics} baseline={baseline} catalog={catalog} />
        <CompanyView metrics={metrics} baseline={baseline} dispatch={dispatch} />
        <CopilotPanel archetype={state.archetype} levers={state.levers} rootCauses={state.rootCauses} dispatch={dispatch} />
        <SimulationPanel state={state} metrics={metrics} baseline={baseline} scenario={scenario} scenarioError={engineError} dispatch={dispatch} />
        <HundredDayPlan levers={state.levers} catalog={catalog} />
      </main>
    </div>
  );
}
