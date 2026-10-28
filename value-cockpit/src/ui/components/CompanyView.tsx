import type { Dispatch } from 'react';
import type { Metric } from '../../domain/types';
import type { Action } from '../state/store';
import { formatValue } from '../model/format';
import { Panel } from './Panel';

interface Props { metrics: Metric[]; baseline: Map<string, number>; dispatch: Dispatch<Action> }

export function CompanyView({ metrics, baseline, dispatch }: Props) {
  const inputs = metrics.filter((m) => !m.isCalculated);
  const calculated = metrics.filter((m) => m.isCalculated);
  return (
    <Panel title="Entreprise" className="company">
      <h3>Inputs analyste</h3>
      <table className="kv">
        <tbody>
          {inputs.map((m) => (
            <tr key={m.code}>
              <th><label htmlFor={`in-${m.code}`}>{m.code}</label></th>
              <td>
                <input
                  id={`in-${m.code}`} type="number" step="any" value={m.currentValue ?? ''}
                  onChange={(e) => dispatch({ type: 'setInput', code: m.code, value: Number(e.target.value) })}
                />
              </td>
              <td className="muted">{m.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Calculé par le moteur</h3>
      <table className="kv">
        <tbody>
          {calculated.map((m) => (
            <tr key={m.code}>
              <th title={m.formula ?? ''}>{m.code}</th>
              <td className="num">{formatValue(baseline.get(m.code), m.unit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
