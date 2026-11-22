import type { Dispatch } from 'react';
import type { Action } from '../state/store';
import { PLAN_STATUSES, type PlanStatus } from '../../dossier/format';
import type { HundredDayPlan, Milestone, Phase, Quadrant } from '../model/plan';
import { formatValue } from '../model/format';
import { Panel } from './Panel';
import { Icon } from './Icon';
import { describeMetric } from '../../ontology/labels';

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


const PERF_ROWS: { code: string | 'ANCHOR'; unit: 'ratio' | 'percent' | 'currency' }[] = [
  { code: 'MOIC', unit: 'ratio' }, { code: 'IRR', unit: 'percent' }, { code: 'ANCHOR', unit: 'currency' }, { code: 'EQUITY_EXIT', unit: 'currency' },
];
const gap = (v: number, unit: 'ratio' | 'percent' | 'currency') =>
  unit === 'percent' ? `${v > 0 ? '+' : ''}${(v * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} pts` : signed(v, unit);

/** What the plan does to the deal (engine): a comparison table, then the MOIC bridge workstream by workstream. */
function Performance({ plan, archetype }: { plan: HundredDayPlan; archetype: string }) {
  const { performance: p, totals } = plan;
  const rows = PERF_ROWS.map((r) => ({ ...r, code: r.code === 'ANCHOR' ? totals.anchorCode : r.code }))
    .filter((r) => r.code in p.base && !(r.code === 'EQUITY_EXIT' && totals.anchorCode === 'EQUITY_EXIT'));
  const steps = [
    { label: 'MOIC sans levier', value: p.base.MOIC, kind: 'total' as const },
    ...plan.workstreams.filter((w) => w.value).map((w) => ({ label: w.title, value: w.value!.moic, kind: 'step' as const })),
    ...(Math.abs(p.combinedMoic) >= 0.005 ? [{ label: 'Effet combiné des leviers', value: p.combinedMoic, kind: 'step' as const }] : []),
    { label: 'MOIC du plan', value: p.plan.MOIC, kind: 'total' as const },
  ];
  // Running position of each bar on a zero-based axis.
  let at = 0;
  const bars = steps.map((st) => {
    const from = st.kind === 'total' ? 0 : at;
    const to = st.kind === 'total' ? st.value : at + st.value;
    at = to;
    return { ...st, lo: Math.min(from, to), hi: Math.max(from, to) };
  });
  const max = Math.max(...bars.map((b) => b.hi), 0.01) * 1.08;
  const pct = (v: number) => `${(100 * v) / max}%`;
  const status = plan.workstreams.reduce<Record<string, number>>((n, w) => ({ ...n, [w.status]: (n[w.status] ?? 0) + 1 }), {});

  return (
    <div className="sheet perf">
      <h4>Performance du plan <span className="mark mark-engine">moteur</span></h4>
      <div className="perf-grid">
        <table className="bridge compact" aria-label="Performance du plan">
          <thead><tr><th>Indicateur</th><th>Sans levier</th><th>À J100</th><th>Plan complet</th><th>Écart</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className={r.code === 'MOIC' ? 'moic-row' : ''}>
                <th>{describeMetric(r.code, archetype).label}</th>
                <td className="num">{formatValue(p.base[r.code], r.unit)}</td>
                <td className="num">{formatValue(p.by100[r.code], r.unit)}</td>
                <td className="num strong">{formatValue(p.plan[r.code], r.unit)}</td>
                <td className={`num ${p.plan[r.code] - p.base[r.code] < 0 ? 'neg' : 'pos'}`}>{gap(p.plan[r.code] - p.base[r.code], r.unit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {plan.workstreams.length === 0
            ? <p className="empty">Aucun chantier validé : le plan reprend le cas sans levier. Validez des leviers à l'étape Leviers pour voir leur effet ici.</p>
            : (
              <>
                <h5>Du MOIC sans levier au MOIC du plan</h5>
                <ul className="waterfall" aria-label="Du MOIC sans levier au MOIC du plan">
                  {bars.map((b) => (
                    <li key={b.label} className={`wf-${b.kind}`}>
                      <span className="wf-label">{b.label}</span>
                      <span className="wf-track">
                        <span className={`wf-bar ${b.kind === 'step' && b.value < 0 ? 'wf-neg' : ''}`}
                          style={{ left: pct(b.lo), width: `max(2px, ${pct(b.hi - b.lo)})` }}
                          title={`${b.label} : ${b.kind === 'total' ? formatValue(b.value, 'ratio') : signed(b.value, 'ratio')}`} />
                      </span>
                      <span className="wf-value">{b.kind === 'total' ? formatValue(b.value, 'ratio') : signed(b.value, 'ratio')}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
        </div>
      </div>
      {plan.workstreams.length > 0 && (
        <p className="muted perf-progress">
          {`Avancement sur ${plan.workstreams.length} chantier${plan.workstreams.length > 1 ? 's' : ''} : `}
          {(['done', 'in_progress', 'todo', 'blocked'] as PlanStatus[]).filter((k) => status[k]).map((k) => `${status[k]} ${STATUS_LABEL[k].toLowerCase()}`).join(', ')}
          {'. Dans le pont, chaque chantier est chiffré seul ; l\'effet combiné apparaît quand les leviers se composent.'}
        </p>
      )}
    </div>
  );
}

/** 100-day plan: diagnose J0–30, design J30–60, execute J60–100. Values come from the engine. */
export function PlanPanel({ plan, engineError, dispatch, onExportSlide, archetype }: {
  plan: HundredDayPlan | null; engineError: string | null; dispatch: Dispatch<Action>; onExportSlide: () => void; archetype: string;
}) {
  if (!plan) {
    return (
      <Panel title="Plan 100 jours" className="plan" bare>
        <p role="alert" className="error">{`Plan indisponible : le moteur refuse les inputs actuels (${engineError ?? 'erreur'}).`}</p>
      </Panel>
    );
  }
  const { totals } = plan;
  return (
    <Panel title="Plan 100 jours" className="plan" bare>
      <div className="sheet plan-toolbar">
        <p className="plan-summary">
          {`${plan.workstreams.length} chantier(s) de valeur · MOIC ${formatValue(totals.moicBase, 'ratio')} → `}
          <strong>{formatValue(totals.moicAll, 'ratio')}</strong>
          {` avec tous les leviers validés, dont ${formatValue(totals.moicBy100, 'ratio')} captés d'ici J100 (moteur).`}
        </p>
        <button type="button" className="secondary" onClick={onExportSlide} disabled={plan.workstreams.length === 0}>
          <Icon name="download" /> Exporter le slide de restitution (.pptx)
        </button>
      </div>
      <Performance plan={plan} archetype={archetype} />

      <div className="sheet">
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
      </div>

      {plan.workstreams.length > 0 && (
        <div className="sheet">
          <h4>Valeur, KPI et jalons <span className="mark mark-engine">moteur</span></h4>
          <table className="plan-table">
            <thead><tr><th>Chantier</th><th>KPI : actuel → cible</th><th className="num">{`Δ ${totals.anchorCode}`}</th><th className="num">Δ MOIC</th><th>Priorité</th><th>Jalons</th></tr></thead>
            <tbody>
              {plan.workstreams.map((w) => (
                <tr key={w.id}>
                  <td>{w.title}<div className="muted">{w.category} · effort {w.effort}{w.cost > 0 && ` · coût ${formatValue(w.cost, 'currency')}`}</div>
                    {w.beyondExit && <div className="warn">Impact après la sortie : sans effet sur le MOIC</div>}</td>
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
        </div>
      )}
      {plan.risks.length > 0 && (
        <div className="sheet">
          <h4>Risques à suivre</h4>
          <ul className="list">{plan.risks.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      )}
    </Panel>
  );
}
