import type { Lever } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import { buildHundredDayPlan, type PlanItem } from '../model/hundredDay';
import { Panel } from './Panel';

function Items({ items }: { items: PlanItem[] }) {
  if (items.length === 0) return <p className="muted">—</p>;
  return (
    <ul className="list">
      {items.map(({ lever, analyses }) => (
        <li key={lever.id}>
          <strong>{lever.label}</strong> <span className="muted">J+{lever.timeToImpactDays} · effort {lever.effort}</span>
          {analyses.length > 0 && <div className="muted">Analyses : {analyses.map((a) => a.id).join(', ')}</div>}
        </li>
      ))}
    </ul>
  );
}

export function HundredDayPlan({ levers, catalog }: { levers: Lever[]; catalog: AnalysisRef[] }) {
  const plan = buildHundredDayPlan(levers, catalog);
  return (
    <Panel title="Plan 100 jours" className="plan">
      <h3>Quick wins (≤ 100 jours)</h3>
      <Items items={plan.quickWins} />
      <h3>Au-delà de 100 jours</h3>
      <Items items={plan.later} />
    </Panel>
  );
}
