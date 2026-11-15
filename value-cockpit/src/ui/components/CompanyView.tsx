import type { Dispatch } from 'react';
import type { Metric } from '../../domain/types';
import type { Unit } from '../../ontology/base';
import type { Action } from '../state/store';
import { formatValue } from '../model/format';
import { MetricName } from './MetricName';
import { SCALES, type CompanyContext } from '../../dossier/format';
import type { EntryCheck } from '../model/entryChecks';
import { Panel } from './Panel';

interface Props {
  metrics: Metric[]; baseline: Map<string, number>; dispatch: Dispatch<Action>;
  archetype: string;
  /** Inputs of the family bridge (deal structure and cash): shown apart from the sector drivers. */
  bridgeInputs: string[];
  context: CompanyContext;
  checks: EntryCheck[];
}

const UNIT_HINT: Record<Unit, string> = {
  currency: 'montant', percent: 'fraction (0,05 = 5 %)', days: 'jours', years: 'ans', ratio: 'ratio', count: 'nombre',
};

export function CompanyView({ metrics, baseline, dispatch, archetype, bridgeInputs, context, checks }: Props) {
  const money = `${context.scale} ${context.currency}`;
  const inputs = metrics.filter((m) => !m.isCalculated);
  const calculated = metrics.filter((m) => m.isCalculated);
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
                      onChange={(e) => dispatch({ type: 'setInput', code: m.code, value: Number(e.target.value) })}
                    />
                  </td>
                  {/* Sector drivers in currency may be unit prices (yield, cost per seat-km): only deal and cash amounts carry the scale. */}
                  <td className="muted">{m.unit === 'currency' && bridgeInputs.includes(m.code) ? money : UNIT_HINT[m.unit]}</td>
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
