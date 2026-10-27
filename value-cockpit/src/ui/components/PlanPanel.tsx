import type { Dispatch } from 'react';
import type { Action } from '../state/store';
import { PLAN_STATUSES, type PlanStatus } from '../../dossier/format';
import type { HundredDayPlan, Milestone, Phase, Quadrant } from '../model/plan';
import { formatValue } from '../model/format';
import { Panel } from './Panel';

const STATUS_LABEL: Record<PlanStatus, string> = { todo: 'À lancer', in_progress: 'En cours', done: 'Fait', blocked: 'Bloqué' };
const PHASE_LABEL: Record<Phase, string> = { diagnose: 'Diagnostic', design: 'Conception', execute: 'Exécution' };
const QUADRANT_LABEL: Record<Quadrant, string> = {
  quick_win: 'Quick win', strategic: 'Stratégique', fill_in: 'Complément', reconsider: 'À reconsidérer',
};
const pct = (day: number) => `${Math.min(day, 100)}%`;
const signed = (v: number, unit: 'ratio' | 'currency') => `${v > 0 ? '+' : ''}${formatValue(v, unit)}`;

function Row({ id, title, owner, status, children, dispatch }: {
  id: string; title: string; owner: string; status: PlanStatus; children: React.ReactNode; dispatch: Dispatch<Action>;
}) {
  return (
    <div className="gantt-row">
      <div className="gantt-label">
        <strong>{title}</strong>
        <div className="gantt-edit">
          <input aria-label={`Responsable — ${title}`} value={owner === 'À désigner' ? '' : owner} placeholder="À désigner"
            onChange={(e) => dispatch({ type: 'setPlanItem', id, patch: { owner: e.target.value } })} />
          <select aria-label={`Statut — ${title}`} value={status} className={`status-${status}`}
            onChange={(e) => dispatch({ type: 'setPlanItem', id, patch: { status: e.target.value as PlanStatus } })}>
            {PLAN_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
      </div>
      <div className="gantt-track">{children}</div>
    </div>
  );
}

const Milestones = ({ items }: { items: Milestone[] }) => (
  <>{items.map((m) => <span key={`${m.day}-${m.label}`} className="milestone" style={{ left: pct(m.day) }} title={`J${m.day} — ${m.label}`} />)}</>
);

/** 100-day plan: diagnose J0–30, design J30–60, execute J60–100. Values come from the engine. */
export function PlanPanel({ plan, engineError, dispatch, onExportSlide }: {
  plan: HundredDayPlan | null; engineError: string | null; dispatch: Dispatch<Action>; onExportSlide: () => void;
}) {
  if (!plan) {
    return (
      <Panel title="Plan 100 jours" className="plan">
        <p role="alert" className="error">{`Plan indisponible : le moteur refuse les inputs actuels (${engineError ?? 'erreur'}).`}</p>
      </Panel>
    );
  }
  const { totals } = plan;
  return (
    <Panel title="Plan 100 jours" className="plan">
      <p>
        {`${plan.workstreams.length} chantier(s) de valeur · MOIC ${formatValue(totals.moicBase, 'ratio')} → `}
        <strong>{formatValue(totals.moicAll, 'ratio')}</strong>
        {` avec tous les leviers validés, dont ${formatValue(totals.moicBy100, 'ratio')} captés d'ici J100 (moteur).`}
      </p>
      <button type="button" className="secondary" onClick={onExportSlide} disabled={plan.workstreams.length === 0}>
        Exporter le slide de restitution (.pptx)
      </button>
      {plan.workstreams.length === 0 && <p className="muted">Validez des leviers dans le copilote : chacun devient un chantier.</p>}

      <div className="gantt" role="table" aria-label="Calendrier">
        <div className="gantt-row gantt-head">
          <div className="gantt-label" />
          <div className="gantt-track">
            {[0, 30, 60, 100].map((d) => <span key={d} className="tick" style={{ left: pct(d) }}>J{d}</span>)}
          </div>
        </div>
        <div className="gantt-section">Chantiers de valeur</div>
        {plan.workstreams.map((w) => (
          <Row key={w.id} id={w.id} title={w.title} owner={w.owner} status={w.status} dispatch={dispatch}>
            {w.bars.map((b) => (
              <span key={b.phase} className={`bar bar-${b.phase}`} style={{ left: pct(b.from), width: `${Math.max(Math.min(b.to, 100) - b.from, 1)}%` }}
                title={`${PHASE_LABEL[b.phase]} J${b.from}–J${b.to}`} />
            ))}
            <Milestones items={w.milestones} />
            {w.beyond100 && <span className="beyond">→ J+{w.impactDay}</span>}
          </Row>
        ))}
        <div className="gantt-section">Fondations</div>
        {plan.foundations.map((f) => (
          <Row key={f.id} id={f.id} title={f.title} owner={f.owner} status={f.status} dispatch={dispatch}>
            <Milestones items={f.milestones} />
          </Row>
        ))}
        <div className="legend">
          {(['diagnose', 'design', 'execute'] as Phase[]).map((p) => <span key={p}><span className={`swatch bar-${p}`} />{PHASE_LABEL[p]}</span>)}
          <span><span className="swatch milestone-swatch" />Jalon</span>
        </div>
      </div>

      {plan.workstreams.length > 0 && (
        <>
          <h3>Valeur, KPI et jalons</h3>
          <table className="plan-table">
            <thead><tr><th>Chantier</th><th>KPI : actuel → cible</th><th className="num">{`Δ ${totals.anchorCode}`}</th><th className="num">Δ MOIC</th><th>Priorité</th><th>Jalons</th></tr></thead>
            <tbody>
              {plan.workstreams.map((w) => (
                <tr key={w.id}>
                  <td>{w.title}<div className="muted">{w.category} · effort {w.effort}</div></td>
                  <td>{w.kpi ? `${w.kpi.code} : ${formatValue(w.kpi.baseline, w.kpi.unit)} → ${formatValue(w.kpi.target, w.kpi.unit)}` : '—'}</td>
                  <td className="num">{w.value ? signed(w.value.anchorDelta, 'currency') : '—'}</td>
                  <td className="num">{w.value ? signed(w.value.moic, 'ratio') : '—'}</td>
                  <td><span className={`tag q-${w.quadrant}`}>{QUADRANT_LABEL[w.quadrant]}</span></td>
                  <td><ul className="milestones">{w.milestones.map((m) => <li key={m.label}>{`J${m.day} — ${m.label}`}</li>)}</ul></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="footnote">Δ calculés par le moteur, levier par levier ; l'ensemble tient compte des interactions déclarées par le modèle.</p>
        </>
      )}
      {plan.risks.length > 0 && (
        <>
          <h3>Risques à suivre</h3>
          <ul className="list">{plan.risks.map((r) => <li key={r}>{r}</li>)}</ul>
        </>
      )}
    </Panel>
  );
}
