import { useEffect, useState, type Dispatch } from 'react';
import type { Lever, RootCause } from '../../domain/types';
import type { SectorArchetype } from '../../ontology/registry';
import type { Action } from '../state/store';
import { LeverForm } from './LeverForm';
import { Panel } from './Panel';

const STATUS_LABEL: Record<Lever['status'], string> = { hypothesis: 'hypothèse', validated: 'validé', rejected: 'rejeté' };
const today = () => new Date().toISOString().slice(0, 10);

interface Props {
  archetype: SectorArchetype; levers: Lever[]; rootCauses: RootCause[]; dispatch: Dispatch<Action>;
  onOpenCard: (leverId: string) => void;
  /** Codes of the model inputs: a lever on any other metric is qualitative. */
  inputCodes: string[];
  /** The current case as a dossier file, sent with the question so the copilot reasons on the company. */
  company: () => unknown;
  analyst: string;
  fetchImpl: typeof fetch;
}

export function CopilotPanel({ archetype, levers, rootCauses, dispatch, onOpenCard, inputCodes, company, analyst, fetchImpl }: Props) {
  const [message, setMessage] = useState('');
  const [raw, setRaw] = useState('');
  const [pending, setPending] = useState(false);
  // 'new', a lever id, or null. The store returns a new lever list only when it accepted the form.
  const [editing, setEditing] = useState<string | null>(null);
  useEffect(() => setEditing(null), [levers]);

  const ingest = (value: unknown) => dispatch({ type: 'ingestProposal', raw: value, today: today() });

  const ask = async () => {
    setPending(true);
    try {
      const res = await fetchImpl('/api/propose', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archetype, message, company: company() }),
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
      <div className="composer">
        <label htmlFor="copilot-msg">Question au copilote</label>
        <textarea id="copilot-msg" rows={2} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Pourquoi la marge de sortie est-elle sous le benchmark ?" />
        <div className="composer-foot">
          <p className="muted">Le copilote propose des causes et des leviers ; il ne produit jamais de chiffre. Tout arrive en hypothèse.</p>
          <button type="button" disabled={!message || pending} onClick={ask}>{pending ? 'En cours…' : 'Demander au copilote'}</button>
        </div>
        <details>
          <summary>Mode hors ligne : coller une réponse JSON</summary>
          <label htmlFor="copilot-raw">Réponse JSON du copilote</label>
          <textarea id="copilot-raw" rows={4} value={raw} onChange={(e) => setRaw(e.target.value)} />
          <button type="button" className="secondary" disabled={!raw} onClick={ingestRaw}>Ingérer</button>
        </details>
      </div>

      {rootCauses.length > 0 && (
        <>
          <h4>Causes racines</h4>
          <ul className="list">
            {rootCauses.map((c) => (
              <li key={c.id}><span className="tag">{c.category}</span> {c.description}{c.evidence && <span className="muted"> — {c.evidence}</span>}</li>
            ))}
          </ul>
        </>
      )}
      <div className="section-head">
        <h4>Leviers</h4>
        {editing === null && <button type="button" className="secondary" onClick={() => setEditing('new')}>Ajouter un levier</button>}
      </div>
      {editing === 'new' && (
        <LeverForm archetype={archetype} onCancel={() => setEditing(null)} onSubmit={(draft) => dispatch({ type: 'addLever', draft, by: analyst })} />
      )}
      {levers.length === 0 && editing !== 'new' && (
        <p className="empty">Aucun levier pour l'instant. Posez une question au copilote, ou ajoutez un levier à la main à partir de votre diagnostic.</p>
      )}
      <ul className="list levers">
        {levers.map((l) => (
          <li key={l.id} className={`lever lever-${l.status}`}>
            <div className="lever-head">
              <strong className="lever-title">{l.label}</strong>
              <span className={`badge badge-${l.status}`}>{STATUS_LABEL[l.status]}{l.decision && ` par ${l.decision.by}, ${l.decision.at}`}</span>
            </div>
            <p className="lever-effect">
              <span className="tag">{l.category}</span> → <code>{l.impactMetricCode}</code> {l.expectedDelta > 0 ? '+' : ''}{l.expectedDelta} ({l.deltaKind})
              {!inputCodes.includes(l.impactMetricCode) && <span className="tag tag-quiet" title="Cette métrique n'est pas un input du modèle : le levier n'est pas simulé"> qualitatif</span>}
            </p>
            <p className="muted">Confiance {l.confidence} — base : {l.confidenceBasis}</p>
            <div className="lever-actions">
              {l.status === 'hypothesis' && (
                <>
                  <button type="button" onClick={() => dispatch({ type: 'validateLever', id: l.id, by: analyst, at: today() })}>Valider</button>
                  <button type="button" className="secondary" onClick={() => dispatch({ type: 'rejectLever', id: l.id, by: analyst, at: today() })}>Rejeter</button>
                </>
              )}
              <button type="button" className="link" onClick={() => onOpenCard(l.id)} aria-label={`Fiche du levier ${l.label}`}>Fiche</button>
              <button type="button" className="link" onClick={() => setEditing(l.id)} aria-label={`Modifier le levier ${l.label}`}>Modifier</button>
            </div>
            {editing === l.id && (
              <LeverForm archetype={archetype} lever={l} onCancel={() => setEditing(null)}
                onSubmit={(patch) => dispatch({ type: 'updateLever', id: l.id, patch })} />
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
