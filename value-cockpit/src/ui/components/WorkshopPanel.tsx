import { useState, type Dispatch } from 'react';
import type { Metric } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import type { ActiveVocabulary } from '../../ontology/registry';
import type { Action, CockpitState } from '../state/store';
import { evaluateParsed, type ParsedFormula } from '../../workshop/formulas';
import { suggestMetrics, toMetricValue } from '../../workshop/observations';
import { formatValue } from '../model/format';
import { Panel } from './Panel';

interface Props {
  state: CockpitState; metrics: Metric[]; catalog: AnalysisRef[]; vocab: ActiveVocabulary;
  analysisId: string | null; onSelect: (id: string | null) => void; dispatch: Dispatch<Action>;
}

const today = () => new Date().toISOString().slice(0, 10);
const NONE = '';

function Calculator({ analysis, f, metricCodes, dispatch }: {
  analysis: AnalysisRef; f: ParsedFormula; metricCodes: string[]; dispatch: Dispatch<Action>;
}) {
  const [raw, setRaw] = useState<Record<string, string>>({});
  const suggested = suggestMetrics(analysis, f, metricCodes);
  const [metric, setMetric] = useState<string>(suggested[0] ?? NONE);
  const [note, setNote] = useState('');
  const values = Object.fromEntries(Object.entries(raw).filter(([, v]) => v.trim() !== '').map(([k, v]) => [k, Number(v)]));
  let result: string;
  try {
    result = `${formatValue(evaluateParsed(f, values), 'count')}${f.percentOutput ? ' %' : ''}`;
  } catch (e) {
    result = Object.keys(values).length < f.variables.length ? '—' : (e as Error).message;
  }
  const options = [...suggested, ...metricCodes.filter((c) => !suggested.includes(c))];

  return (
    <fieldset className="calc" aria-label={f.output}>
      <legend>{f.output}</legend>
      {f.step && <div className="muted">Étape : {f.step}</div>}
      <code className="muted">{f.source}</code>
      <div className="calc-grid">
        {f.variables.map((v) => (
          <label key={v}>{v}
            <input type="number" step="any" aria-label={v} value={raw[v] ?? ''} onChange={(e) => setRaw({ ...raw, [v]: e.target.value })} />
          </label>
        ))}
      </div>
      <p>Résultat (moteur) : <strong data-testid="result">{result}</strong></p>
      <div className="calc-save">
        <label>Métrique mesurée
          <select aria-label="Métrique mesurée" value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value={NONE}>— diagnostic non relié —</option>
            {options.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <input aria-label="Note" placeholder="Source des données, période…" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="button" onClick={() => dispatch({
          type: 'addObservation', analysisId: analysis.id, formula: f.output, values,
          metricCode: metric || null, note, today: today(),
        })}>Enregistrer l'observation</button>
      </div>
    </fieldset>
  );
}

/** Runs the analysis protocols on the company's own data; results are engine-computed observations. */
export function WorkshopPanel({ state, metrics, catalog, vocab, analysisId, onSelect, dispatch }: Props) {
  const analysis = catalog.find((a) => a.id === analysisId) ?? null;
  const inputCodes = metrics.filter((m) => !m.isCalculated).map((m) => m.code);
  const metricCodes = [...new Set([...inputCodes, ...(analysis?.relatedMetricCodes ?? [])])];
  const unitOf = (code: string) => vocab.metricMeta[code]?.unit ?? 'ratio';

  return (
    <Panel title="Atelier d'analyse" className="workshop">
      <label>Analyse à mener{' '}
        <select aria-label="Analyse à mener" value={analysisId ?? ''} onChange={(e) => onSelect(e.target.value || null)}>
          <option value="">Choisir une analyse du catalogue…</option>
          {catalog.map((a) => <option key={a.id} value={a.id}>{`${a.id} · ${a.title}${a.formulas.length ? '' : ' (protocole sans formule)'}`}</option>)}
        </select>
      </label>

      {analysis && (
        <div className="workshop-body">
          <p>{analysis.goal}</p>
          <details>
            <summary>Données à collecter ({analysis.dataRequired.length})</summary>
            <ul className="list">{analysis.dataRequired.map((d) => <li key={d}>{d}</li>)}</ul>
          </details>
          {analysis.formulas.length === 0
            ? <p className="muted">Ce protocole n'a pas de formule calculable : suivez ses étapes et saisissez les KPI obtenus dans Entreprise.</p>
            : analysis.formulas.map((f) => (
              <Calculator key={`${analysis.id}-${f.output}-${f.expression}`} analysis={analysis} f={f} metricCodes={metricCodes} dispatch={dispatch} />
            ))}
        </div>
      )}

      <h3>Observations du dossier</h3>
      {state.observations.length === 0 && <p className="muted">Aucune mesure enregistrée.</p>}
      <ul className="list" aria-label="Observations">
        {state.observations.map((o) => {
          let shown: string;
          try {
            shown = o.metricCode ? formatValue(toMetricValue(o, catalog, unitOf(o.metricCode)), unitOf(o.metricCode)) : formatValue(toMetricValue(o, catalog, 'ratio'), 'count');
          } catch (e) { shown = (e as Error).message; }
          const applicable = o.metricCode !== null && o.metricCode in state.inputs;
          return (
            <li key={o.id}>
              <strong>{o.metricCode ?? o.formula}</strong> = {shown}
              <span className="muted">{` · ${o.formula} · ${o.analysisId} · ${o.date}${o.note ? ` · ${o.note}` : ''}`}</span>
              {o.applied && <span className="badge badge-validated">appliquée</span>}
              <div className="actions">
                {applicable && !o.applied && (
                  <button type="button" onClick={() => dispatch({ type: 'applyObservation', id: o.id })}>Appliquer à l'entreprise</button>
                )}
                <button type="button" className="secondary" onClick={() => dispatch({ type: 'removeObservation', id: o.id })}>Supprimer</button>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
