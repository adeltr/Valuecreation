import type { Dispatch } from 'react';
import type { InteractionRule, Lever, Metric, ScenarioResult } from '../../domain/types';
import type { Action, CockpitState } from '../state/store';
import { formatValue } from '../model/format';
import { Panel } from './Panel';

interface Props {
  state: CockpitState; metrics: Metric[]; baseline: Map<string, number>;
  scenario: ScenarioResult[] | null; scenarioError: string | null; dispatch: Dispatch<Action>;
  interactions: InteractionRule[];
  /** The bridge rows of the archetype's family (docs/16), MOIC last. */
  bridgeRows: string[];
}

export function SimulationPanel({ state, metrics, baseline, scenario, scenarioError, dispatch, interactions, bridgeRows }: Props) {
  const unit = (code: string) => metrics.find((m) => m.code === code)?.unit ?? 'currency';
  const scen = new Map(scenario?.map((r) => [r.metricCode, r.value]));
  const selectable = (l: Lever) => l.status === 'validated';
  const exitMultiple = state.scenario.assumptions.EXIT_MULTIPLE ?? state.inputs.EXIT_MULTIPLE;

  return (
    <Panel title="Simulation" className="simulation">
      <h3>Leviers du scénario</h3>
      {state.levers.filter((l) => l.status !== 'rejected').length === 0 && <p className="muted">Validez un levier dans le copilote pour le simuler.</p>}
      <ul className="list">
        {state.levers.filter((l) => l.status !== 'rejected').map((l) => {
          const on = state.scenario.leverIds.includes(l.id);
          return (
            <li key={l.id}>
              <label className={selectable(l) ? '' : 'muted'}>
                <input type="checkbox" checked={on} disabled={!selectable(l)}
                  onChange={() => dispatch({ type: 'toggleScenarioLever', id: l.id })} />
                {' '}{l.label}{!selectable(l) && ' (à valider)'}
              </label>
              {on && (
                <input aria-label={`Delta appliqué ${l.label}`} type="number" step="any" className="delta"
                  value={state.scenario.applied[l.id]}
                  onChange={(e) => dispatch({ type: 'setAppliedDelta', id: l.id, value: Number(e.target.value) })} />
              )}
            </li>
          );
        })}
      </ul>
      <label htmlFor="exit-multiple">Multiple de sortie (hypothèse analyste)</label>
      <input id="exit-multiple" type="number" step="0.5" value={exitMultiple}
        onChange={(e) => dispatch({ type: 'setAssumption', code: 'EXIT_MULTIPLE', value: Number(e.target.value) })} />

      <table className="bridge">
        <thead><tr><th>Bridge</th><th>Base</th><th>Scénario</th></tr></thead>
        <tbody>
          {bridgeRows.map((code) => (
            <tr key={code} className={code === 'MOIC' ? 'moic' : ''}>
              <th>{code}</th>
              <td className="num">{formatValue(baseline.get(code), unit(code))}</td>
              <td className="num" data-testid={code === 'MOIC' ? 'moic-scenario' : undefined}>{formatValue(scen.get(code), unit(code))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {scenarioError && <p role="alert" className="error">{scenarioError}</p>}
      {interactions.length > 0 && (
        <>
          <h3>Interactions appliquées par le moteur</h3>
          <ul className="list">
            {interactions.map((r) => (
              <li key={`${r.sourceCode}-${r.targetCode}`}>
                {`${r.sourceCode} → ${r.targetCode} : Δ cible = ${r.coefficientCode} × Δ source `}
                <span className="muted">{`(${r.coefficientCode} = ${(state.inputs[r.coefficientCode] ?? 0).toLocaleString('fr-FR')}, modifiable dans Entreprise)`}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="footnote">
        Chiffres calculés par le moteur (computedBy = engine), jamais par le copilote. Plusieurs leviers sur une
        même métrique se composent : (valeur + Σ deltas absolus) × Π(1 + deltas relatifs).
      </p>
    </Panel>
  );
}
