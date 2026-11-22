import { useState, type Dispatch } from 'react';
import type { InteractionRule, Lever, Metric, ScenarioResult } from '../../domain/types';
import type { Action, CockpitState } from '../state/store';
import { formatValue } from '../model/format';
import { MetricName } from './MetricName';
import { compareScenarios, sensitivityGrid } from '../state/scenarios';
import { Panel } from './Panel';

interface Props {
  state: CockpitState; metrics: Metric[]; baseline: Map<string, number>;
  scenario: ScenarioResult[] | null; scenarioError: string | null; dispatch: Dispatch<Action>;
  interactions: InteractionRule[];
  /** The bridge of the archetype's family (docs/16): table rows (MOIC last) and multiple label. */
  bridgeRows: string[];
  multipleLabel: string;
  archetype: string;
  /** Inputs still holding the template's illustrative value. */
  demoInputs: number;
}

export function SimulationPanel({ state, metrics, baseline, scenario, scenarioError, dispatch, interactions, bridgeRows, multipleLabel, archetype, demoInputs }: Props) {
  const unit = (code: string) => metrics.find((m) => m.code === code)?.unit ?? 'currency';
  const scen = new Map(scenario?.map((r) => [r.metricCode, r.value]));
  const quantified = (l: Lever) => l.impactMetricCode in state.inputs;
  const selectable = (l: Lever) => l.status === 'validated' && quantified(l);
  const exitMultiple = state.scenario.assumptions.EXIT_MULTIPLE ?? state.inputs.EXIT_MULTIPLE;
  const [scenarioName, setScenarioName] = useState('');
  const comparison = compareScenarios(state);
  const grid = sensitivityGrid(state);
  const hold = state.scenario.assumptions.HOLD_YEARS ?? state.inputs.HOLD_YEARS;
  const holdDays = (state.scenario.assumptions.HOLD_YEARS ?? state.inputs.HOLD_YEARS) * 365;

  return (
    <Panel title="Simulation" className="simulation">
      <div className="sim-grid">
      <div className="sim-inputs">
      <h4>Leviers du scénario</h4>
      {state.levers.filter((l) => l.status !== 'rejected').length === 0 && <p className="muted">Validez un levier dans le copilote pour le simuler.</p>}
      <ul className="list">
        {state.levers.filter((l) => l.status !== 'rejected').map((l) => {
          const on = state.scenario.leverIds.includes(l.id);
          return (
            <li key={l.id}>
              <label className={selectable(l) ? '' : 'muted'}>
                <input type="checkbox" checked={on} disabled={!selectable(l)}
                  onChange={() => dispatch({ type: 'toggleScenarioLever', id: l.id })} />
                {' '}{l.label}{!quantified(l) ? ' (qualitatif, non simulé)' : l.status !== 'validated' && ' (à valider)'}
                {l.timeToImpactDays > holdDays && ` (J+${l.timeToImpactDays} : après la sortie, sans effet sur le MOIC)`}
              </label>
              {on && (
                <span className="applied"><span className="muted" aria-hidden="true">Δ appliqué</span><input aria-label={`Delta appliqué ${l.label}`} type="number" step="any" className="delta"
                  value={state.scenario.applied[l.id]}
                  onChange={(e) => dispatch({ type: 'setAppliedDelta', id: l.id, value: Number(e.target.value) })} /></span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="field">
        <label htmlFor="exit-multiple">{`Multiple de sortie (${multipleLabel}, hypothèse analyste)`}</label>
        <input id="exit-multiple" type="number" step="0.5" value={exitMultiple}
          onChange={(e) => dispatch({ type: 'setAssumption', code: 'EXIT_MULTIPLE', value: Number(e.target.value) })} />
      </div>
      </div>
      <div className="sim-result">
      <h4>Bridge de valeur <span className="mark mark-engine">moteur</span></h4>

      {demoInputs > 0 && (
        <p className="notice notice-warn" role="status">
          {`Résultat indicatif : ${demoInputs} input${demoInputs > 1 ? 's sont' : ' est'} encore ${demoInputs > 1 ? 'des valeurs' : 'une valeur'} de démo (voir Entreprise).`}
        </p>
      )}
      <table className="bridge">
        <thead><tr><th>Poste</th><th>Base</th><th>Scénario</th></tr></thead>
        <tbody>
          {bridgeRows.map((code) => (
            <tr key={code} className={code === 'MOIC' ? 'moic' : ''}>
              <th><MetricName code={code} archetype={archetype} /></th>
              <td className="num">{formatValue(baseline.get(code), unit(code))}</td>
              <td className="num" data-testid={code === 'MOIC' ? 'moic-scenario' : undefined}>{formatValue(scen.get(code), unit(code))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {scenarioError && <p role="alert" className="error">{scenarioError}</p>}
      </div>
      </div>
      <div className="sim-grid sim-compare">
      <div>
      <h4>Scénarios</h4>
      <div className="scenario-save">
        <input aria-label="Nom du scénario" value={scenarioName} placeholder="Base, prudent, ambitieux…" onChange={(e) => setScenarioName(e.target.value)} />
        <button type="button" className="secondary" onClick={() => { dispatch({ type: 'saveScenario', name: scenarioName }); setScenarioName(''); }}>
          Enregistrer le scénario
        </button>
      </div>
      <table className="bridge compact" aria-label="Comparaison des scénarios">
        <thead><tr><th>Scénario</th><th>Leviers</th><th>Multiple</th><th>MOIC</th><th>TRI</th><th /></tr></thead>
        <tbody>
          {comparison.map((r, i) => (
            <tr key={r.name}>
              <th>{r.name}</th>
              <td className="num">{r.levers}</td>
              <td className="num">{formatValue(r.exitMultiple, 'ratio')}</td>
              <td className="num">{formatValue(r.MOIC, 'ratio')}</td>
              <td className="num">{formatValue(r.IRR, 'percent')}</td>
              <td>{i > 0 && (<>
                <button type="button" className="link" aria-label={`Charger le scénario ${r.name}`} onClick={() => dispatch({ type: 'loadScenario', name: r.name })}>charger</button>{' '}
                <button type="button" className="link" aria-label={`Supprimer le scénario ${r.name}`} onClick={() => dispatch({ type: 'deleteScenario', name: r.name })}>supprimer</button>
              </>)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
      <div>
      <h4>Sensibilité du MOIC (scénario en cours)</h4>
      <table className="bridge compact sensitivity" aria-label="Sensibilité du MOIC">
        <thead><tr><th>Multiple de sortie</th>{grid.years.map((y) => <th key={y} className={y === hold ? 'current' : ''}>{formatValue(y, 'years')}</th>)}</tr></thead>
        <tbody>
          {grid.multiples.map((m, i) => (
            <tr key={m} className={m === exitMultiple ? 'current' : ''}>
              <th>{formatValue(m, 'ratio')}</th>
              {grid.moic[i].map((v, j) => <td key={grid.years[j]} className={`num ${grid.years[j] === hold ? 'current' : ''}`}>{v === null ? '—' : formatValue(v, 'ratio')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
      {interactions.length > 0 && (
        <>
          <h4>Interactions appliquées par le moteur</h4>
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
        même métrique se composent : (valeur + Σ deltas absolus) × Π(1 + deltas relatifs). Un levier dont le
        premier impact arrive après la sortie ne compte pas ; son coût de mise en œuvre, lui, est déduit du cash.
      </p>
    </Panel>
  );
}
