import { useState, type Dispatch } from 'react';
import type { Lever, RootCause } from '../../domain/types';
import type { SectorArchetype } from '../../ontology/registry';
import type { Action } from '../state/store';
import { Panel } from './Panel';

const STATUS_LABEL: Record<Lever['status'], string> = { hypothesis: 'hypothèse', validated: 'validé', rejected: 'rejeté' };
const today = () => new Date().toISOString().slice(0, 10);

interface Props {
  archetype: SectorArchetype; levers: Lever[]; rootCauses: RootCause[]; dispatch: Dispatch<Action>;
  onOpenCard: (leverId: string) => void;
}

export function CopilotPanel({ archetype, levers, rootCauses, dispatch, onOpenCard }: Props) {
  const [message, setMessage] = useState('');
  const [raw, setRaw] = useState('');
  const [pending, setPending] = useState(false);

  const ingest = (value: unknown) => dispatch({ type: 'ingestProposal', raw: value, today: today() });

  const ask = async () => {
    setPending(true);
    try {
      const res = await fetch('/api/propose', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archetype, message }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? res.statusText);
      ingest(body);
    } catch (e) {
      dispatch({ type: 'reportError', message: `Copilote indisponible : ${(e as Error).message}` });
    } finally {
      setPending(false);
    }
  };

  const ingestRaw = () => {
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { dispatch({ type: 'reportError', message: 'Proposition rejetée : JSON illisible' }); return; }
    ingest(parsed);
    setRaw('');
  };

  return (
    <Panel title="Copilote" className="copilot">
      <p className="muted">Le copilote propose des causes et des leviers ; il ne produit jamais de chiffre. Tout arrive en hypothèse.</p>
      <label htmlFor="copilot-msg">Question au copilote</label>
      <textarea id="copilot-msg" rows={2} value={message} onChange={(e) => setMessage(e.target.value)}
        placeholder="Pourquoi la marge de sortie est-elle sous le benchmark ?" />
      <button type="button" disabled={!message || pending} onClick={ask}>{pending ? 'En cours…' : 'Demander au copilote'}</button>
      <details>
        <summary>Mode hors ligne</summary>
        <label htmlFor="copilot-raw">Réponse JSON du copilote</label>
        <textarea id="copilot-raw" rows={4} value={raw} onChange={(e) => setRaw(e.target.value)} />
        <button type="button" disabled={!raw} onClick={ingestRaw}>Ingérer</button>
      </details>

      {rootCauses.length > 0 && (
        <>
          <h3>Causes racines</h3>
          <ul className="list">
            {rootCauses.map((c) => (
              <li key={c.id}><span className="tag">{c.category}</span> {c.description}{c.evidence && <span className="muted"> — {c.evidence}</span>}</li>
            ))}
          </ul>
        </>
      )}
      <h3>Leviers</h3>
      {levers.length === 0 && <p className="muted">Aucun levier pour l'instant.</p>}
      <ul className="list">
        {levers.map((l) => (
          <li key={l.id} className={`lever lever-${l.status}`}>
            <div>
              <span className={`badge badge-${l.status}`}>{STATUS_LABEL[l.status]}</span> <strong>{l.label}</strong>
              <span className="tag">{l.category}</span> → {l.impactMetricCode} {l.expectedDelta > 0 ? '+' : ''}{l.expectedDelta} ({l.deltaKind})
            </div>
            <div className="muted">Confiance {l.confidence} — base : {l.confidenceBasis}</div>
            <button type="button" className="link" onClick={() => onOpenCard(l.id)} aria-label={`Fiche du levier ${l.label}`}>Fiche</button>
            {l.status === 'hypothesis' && (
              <div className="actions">
                <button type="button" onClick={() => dispatch({ type: 'validateLever', id: l.id })}>Valider</button>
                <button type="button" className="secondary" onClick={() => dispatch({ type: 'rejectLever', id: l.id })}>Rejeter</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
