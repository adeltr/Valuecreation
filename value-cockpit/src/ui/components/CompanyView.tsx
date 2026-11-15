import type { Dispatch } from 'react';
import type { Metric } from '../../domain/types';
import type { Unit } from '../../ontology/base';
import type { Action } from '../state/store';
import { formatValue } from '../model/format';
import { MetricName } from './MetricName';
import { Panel } from './Panel';

interface Props {
  metrics: Metric[]; baseline: Map<string, number>; dispatch: Dispatch<Action>;
  archetype: string;
  /** Inputs of the family bridge (deal structure and cash): shown apart from the sector drivers. */
  bridgeInputs: string[];
}

const UNIT_HINT: Record<Unit, string> = {
  currency: 'montant', percent: 'fraction (0,05 = 5 %)', days: 'jours', years: 'ans', ratio: 'ratio', count: 'nombre',
};

export function CompanyView({ metrics, baseline, dispatch, archetype, bridgeInputs }: Props) {
  const inputs = metrics.filter((m) => !m.isCalculated);
  const calculated = metrics.filter((m) => m.isCalculated);
  const groups: [string, Metric[]][] = [
    ['Drivers du secteur', inputs.filter((m) => !bridgeInputs.includes(m.code))],
    ['Deal et cash', inputs.filter((m) => bridgeInputs.includes(m.code))],
  ];
  return (
    <Panel title="Entreprise" className="company">
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
                  <td className="muted">{UNIT_HINT[m.unit]}</td>
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
