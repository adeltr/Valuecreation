import type { InteractionRule, Lever, Metric } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import { buildLeverCard } from '../model/leverCard';
import { toMetricValue, type Observation } from '../../workshop/observations';
import { formatValue } from '../model/format';
import { Panel } from './Panel';

interface Props {
  lever: Lever; metrics: Metric[]; catalog: AnalysisRef[]; interactions: InteractionRule[];
  onClose: () => void;
  observations: Observation[];
  onOpenAnalysis: (analysisId: string) => void;
}

const signed = (v: number) => `${v > 0 ? '+' : ''}${formatValue(v, 'ratio')}`;

/** What a lever is, how it reaches the MOIC, and how to diagnose it. Every figure comes from the engine. */
export function LeverCardPanel({ lever, metrics, catalog, interactions, onClose, observations, onOpenAnalysis }: Props) {
  let c: ReturnType<typeof buildLeverCard>;
  try {
    c = buildLeverCard(lever, metrics, catalog, interactions);
  } catch (e) {
    return (
      <Panel title="Fiche levier" className="card">
        <div className="card-head">
          <strong>{lever.label}</strong>
          <button type="button" className="secondary" onClick={onClose}>Fermer</button>
        </div>
        <p role="alert" className="error">{`Fiche indisponible : le moteur refuse les inputs actuels (${(e as Error).message}).`}</p>
      </Panel>
    );
  }
  const step = c.sensitivity?.step;
  return (
    <Panel title="Fiche levier" className="card">
      <div className="card-head">
        <div>
          <strong>{lever.label}</strong> <span className="tag">{lever.category}</span>
          <p>{c.summary}</p>
        </div>
        <button type="button" className="secondary" onClick={onClose}>Fermer</button>
      </div>

      <h3>Comment il agit</h3>
      {c.path.length > 0
        ? <p className="path">{c.path.map((s) => s.code).join(' → ')}</p>
        : <p className="muted">{c.target.code} n'entre dans aucune formule du modèle : levier qualitatif ou diagnostic.</p>}
      {c.path.length > 1 && (
        <ul className="list formulas">
          {c.path.filter((s) => s.formula).map((s) => <li key={s.code}><code>{s.code} = {s.formula}</code></li>)}
        </ul>
      )}
      {c.interactions.map((r) => (
        <p key={r.targetCode} className="muted">
          {`Déclenche aussi la règle ${r.sourceCode} → ${r.targetCode} (× ${r.coefficientCode}).`}
        </p>
      ))}

      <h3>Ce que ça vaut</h3>
      {c.sensitivity && step && (
        <p>
          {`Sensibilité du modèle : ${step.kind === 'absolute' ? '+1 pt' : '+1 %'} de ${c.target.code} `}
          {`(actuel ${formatValue(c.target.current, c.target.unit)}) ⇒ MOIC ${signed(c.sensitivity.moicDelta)}`}
        </p>
      )}
      {c.impact
        ? <p><strong>{`Impact du levier (validé) : MOIC ${formatValue(c.impact.moicBefore, 'ratio')} → ${formatValue(c.impact.moicAfter, 'ratio')}`}</strong></p>
        : <p className="muted">L'impact propre du levier est calculé par le moteur après validation par l'analyste.</p>}
      <p className="muted">{`Délai J+${lever.timeToImpactDays} · effort ${lever.effort} · confiance ${lever.confidence} — ${lever.confidenceBasis}`}</p>

      {(() => {
        const measured = observations.filter((o) => o.metricCode === c.target.code);
        if (measured.length === 0) return null;
        return (
          <>
            <h3>Mesures de l'atelier sur {c.target.code}</h3>
            <ul className="list">
              {measured.map((o) => {
                let v: string;
                try { v = formatValue(toMetricValue(o, catalog, c.target.unit), c.target.unit); } catch (e) { v = (e as Error).message; }
                return <li key={o.id}>{`${v} — ${o.analysisId}, ${o.date}${o.applied ? ' (appliquée au modèle)' : ''}`}</li>;
              })}
            </ul>
          </>
        );
      })()}

      <h3>Analyses pour le diagnostiquer</h3>
      {c.analyses.length === 0 && <p className="muted">Aucune analyse du catalogue n'est liée à ce levier.</p>}
      <ul className="list">
        {c.analyses.slice(0, 5).map((a) => (
          <li key={a.id}>
            <strong>{a.title}</strong> <span className="muted">{a.id} · {a.partLabel}</span>
            <div className="muted">{a.goal}</div>
            <button type="button" className="link" onClick={() => onOpenAnalysis(a.id)} aria-label={`Ouvrir dans l'atelier ${a.id}`}>
              Ouvrir dans l'atelier{a.formulas.length ? ` (${a.formulas.length} formule${a.formulas.length > 1 ? 's' : ''})` : ''}
            </button>
          </li>
        ))}
      </ul>
      {c.dataToCollect.length > 0 && (
        <details>
          <summary>Données à collecter ({c.dataToCollect.length})</summary>
          <ul className="list">{c.dataToCollect.map((d) => <li key={d}>{d}</li>)}</ul>
        </details>
      )}
      {c.improve.length > 0 && (
        <>
          <h3>Pistes d'action (analyses Umbrex)</h3>
          <ul className="list">{c.improve.map((d) => <li key={d}>{d}</li>)}</ul>
        </>
      )}
    </Panel>
  );
}
