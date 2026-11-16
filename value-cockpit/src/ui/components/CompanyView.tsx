import type { Dispatch } from 'react';
import type { Metric } from '../../domain/types';
import type { Unit } from '../../ontology/base';
import type { Action } from '../state/store';
import { formatValue } from '../model/format';
import { MetricName } from './MetricName';
import { FilingsLookup } from './FilingsLookup';
import { SCALES, type CompanyContext, type Provenance } from '../../dossier/format';
import type { EntryCheck } from '../model/entryChecks';
import { inputsTemplateCsv, parseInputsCsv } from '../model/inputsCsv';
import { Panel } from './Panel';

interface Props {
  metrics: Metric[]; baseline: Map<string, number>; dispatch: Dispatch<Action>;
  archetype: string;
  /** Inputs of the family bridge (deal structure and cash): shown apart from the sector drivers. */
  bridgeInputs: string[];
  context: CompanyContext;
  checks: EntryCheck[];
  provenance: Record<string, Provenance>;
  analyst: string;
  fetchImpl: typeof fetch;
}

const today = () => new Date().toISOString().slice(0, 10);
const SOURCE_LABEL: Record<Provenance['source'], string> = {
  manual: 'saisi', observation: 'mesuré en atelier', import: 'importé', filing: 'comptes publics',
};

const inputs0 = (metrics: Metric[]) => metrics.filter((m) => !m.isCalculated);

const UNIT_HINT: Record<Unit, string> = {
  currency: 'montant', percent: 'fraction (0,05 = 5 %)', days: 'jours', years: 'ans', ratio: 'ratio', count: 'nombre',
};

export function CompanyView({ metrics, baseline, dispatch, archetype, bridgeInputs, context, checks, provenance, analyst, fetchImpl }: Props) {
  const sourced = inputs0(metrics).filter((m) => provenance[m.code]).length;
  const total = inputs0(metrics).length;
  const money = `${context.scale} ${context.currency}`;
  const inputs = metrics.filter((m) => !m.isCalculated);
  const calculated = metrics.filter((m) => m.isCalculated);
  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([`\uFEFF${inputsTemplateCsv(metrics, archetype)}`], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = `modele-inputs-${archetype}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importCsv = (file: File | undefined, input: HTMLInputElement) => {
    input.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { values, errors } = parseInputsCsv(String(reader.result), inputs.map((m) => m.code));
      const n = Object.keys(values).length;
      if (n) dispatch({ type: 'setInputs', values, source: 'import', ref: file.name, by: analyst.trim(), at: today() });
      if (errors.length || !n) {
        dispatch({ type: 'reportError', message: `${n} input${n > 1 ? 's' : ''} importé${n > 1 ? 's' : ''} depuis ${file.name}. Lignes non utilisées — ${errors.join(' ; ') || 'aucune valeur trouvée'}` });
      }
    };
    reader.readAsText(file);
  };
  const groups: [string, Metric[]][] = [
    ['Drivers du secteur', inputs.filter((m) => !bridgeInputs.includes(m.code))],
    ['Deal et cash', inputs.filter((m) => bridgeInputs.includes(m.code))],
  ];
  return (
    <Panel title="Entreprise" className="company">
      <div className="context">
        <label>Devise{' '}
          <input aria-label="Devise" value={context.currency} maxLength={3} size={4}
            onChange={(e) => dispatch({ type: 'setContext', patch: { currency: e.target.value.toUpperCase() } })} />
        </label>
        <label>Échelle{' '}
          <select aria-label="Échelle" value={context.scale}
            onChange={(e) => dispatch({ type: 'setContext', patch: { scale: e.target.value as CompanyContext['scale'] } })}>
            {SCALES.map((s) => <option key={s} value={s}>{{ k: 'milliers (k)', M: 'millions (M)', Md: 'milliards (Md)' }[s]}</option>)}
          </select>
        </label>
        <label className="wide">Thèse d'investissement
          <textarea aria-label="Thèse d'investissement" rows={2} value={context.thesis} placeholder="Pourquoi ce deal, et d'où viendra la valeur"
            onChange={(e) => dispatch({ type: 'setContext', patch: { thesis: e.target.value } })} />
        </label>
      </div>
      <p className={sourced === total ? 'muted' : 'warn'} role="status">
        {`${sourced} input${sourced > 1 ? 's' : ''} sur ${total} ${sourced > 1 ? 'ont' : 'a'} une source. `}
        {sourced < total && 'Les autres sont des valeurs de démo : remplacez-les ou confirmez-les.'}
      </p>
      <div className="import">
        <button type="button" className="secondary" onClick={downloadTemplate}>Télécharger le modèle (.csv)</button>
        <label className="file">
          Importer des données (.csv)
          <input type="file" accept=".csv,text/csv" onChange={(e) => importCsv(e.target.files?.[0], e.target)} />
        </label>
      </div>
      <FilingsLookup inputUnits={Object.fromEntries(inputs.map((m) => [m.code, m.unit]))} context={context}
        analyst={analyst} fetchImpl={fetchImpl} dispatch={dispatch} />
      {checks.filter((c) => !c.ok).map((c) => (
        <p key={c.entryCode} className="warn" role="status">
          {`Incohérence à l'entrée : ${c.entryCode} saisi ${formatValue(c.entered, 'currency')}, alors que les drivers donnent ${formatValue(c.model, 'currency')} à l'année 0 (${c.modelCode}). Vérifiez la donnée d'entrée ou les drivers.`}
        </p>
      ))}
      {groups.map(([title, rows]) => (
        <div key={title}>
          <h3>{title}</h3>
          <table className="kv">
            <tbody>
              {rows.map((m) => (
                <tr key={m.code}>
                  <th><label htmlFor={`in-${m.code}`}><MetricName code={m.code} archetype={archetype} /></label></th>
                  <td>
                    <input
                      id={`in-${m.code}`} type="number" step="any" value={m.currentValue ?? ''}
                      onChange={(e) => dispatch({ type: 'setInput', code: m.code, value: Number(e.target.value), by: analyst.trim(), at: today() })}
                    />
                  </td>
                  {/* Sector drivers in currency may be unit prices (yield, cost per seat-km): only deal and cash amounts carry the scale. */}
                  <td className="muted">{m.unit === 'currency' && bridgeInputs.includes(m.code) ? money : UNIT_HINT[m.unit]}</td>
                  <td className="source">
                    {provenance[m.code] ? (
                      <>
                        <span className="tag src-ok">{`${SOURCE_LABEL[provenance[m.code].source]}${provenance[m.code].by ? ` par ${provenance[m.code].by}` : ''}${provenance[m.code].at ? `, ${provenance[m.code].at}` : ''}`}</span>
                        <input aria-label={`${m.code} : référence de la source`} className="ref" value={provenance[m.code].ref} placeholder="Document, page…"
                          onChange={(e) => dispatch({ type: 'setProvenanceRef', code: m.code, ref: e.target.value })} />
                      </>
                    ) : (
                      <>
                        <span className="tag src-demo" title="Valeur illustrative du modèle : à remplacer ou à confirmer">démo</span>{' '}
                        <button type="button" className="link" aria-label={`${m.code} : confirmer la valeur`}
                          onClick={() => dispatch({ type: 'confirmInput', code: m.code, by: analyst.trim(), at: today() })}>confirmer</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <h3>Calculé par le moteur</h3>
      <table className="kv">
        <tbody>
          {calculated.map((m) => (
            <tr key={m.code}>
              <th title={m.formula ?? ''}><MetricName code={m.code} archetype={archetype} /></th>
              <td className="num">{formatValue(baseline.get(m.code), m.unit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
