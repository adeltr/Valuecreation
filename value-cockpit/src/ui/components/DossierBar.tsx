import { useCallback, useEffect, useState, type ChangeEvent, type Dispatch } from 'react';
import type { Action, CockpitState } from '../state/store';
import { parseDossier, toDossier, type DossierFile } from '../../dossier/format';
import { RevisionConflict, type DossierRepository, type DossierSummary } from '../../dossier/repository';
import type { DossierLocation } from '../state/httpRepository';
import { fingerprint } from '../state/unsaved';
import { TEMPLATES } from '../../templates';
import type { SectorArchetype } from '../../ontology/registry';

/** The stored dossier the current case comes from: what a save starts from. */
export interface SavedRef { name: string; revision: number; fingerprint: string }

interface Props {
  state: CockpitState; dispatch: Dispatch<Action>;
  repo: DossierRepository; where: DossierLocation;
  /** Asks before discarding unsaved work; false = keep the current case. */
  mayReplace: () => boolean;
  saved: SavedRef | null;
  onSaved: (ref: SavedRef | null) => void;
}

const WHERE_LABEL: Record<DossierLocation, string> = {
  server: 'Stockage : serveur partagé',
  browser: 'Stockage : ce navigateur uniquement',
};

const typeLabel = (a: string) => TEMPLATES[a as SectorArchetype]?.label ?? a;
// FileReader rather than Blob.text(): wider support (and the one jsdom implements).
const readText = (file: Blob) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = () => reject(r.error);
  r.readAsText(file);
});
const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
};

function conflictQuestion(c: RevisionConflict, base: number | null): string {
  if (c.current === null) return `Le dossier « ${c.name} » a été supprimé entre-temps. Le recréer avec ta version ?`;
  if (base === null) return `Un dossier « ${c.name} » existe déjà (révision ${c.current}). Le remplacer par ta version ?`;
  return `${c.message}, par quelqu'un d'autre ou dans un autre onglet. Écraser cette version avec la tienne ?`;
}

/** Save / open / export / import of a company case. Only analyst inputs and decisions are stored. */
export function DossierBar({ state, dispatch, repo, where, mayReplace, saved, onSaved }: Props) {
  const fail = useCallback((e: unknown) => dispatch({ type: 'reportError', message: (e as Error).message }), [dispatch]);
  const [list, setList] = useState<DossierSummary[]>([]);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try { setList(await repo.list()); } catch (e) { fail(e); }
  }, [repo, fail]);
  useEffect(() => { void refresh(); }, [refresh]);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    try { await task(); } catch (e) { fail(e); } finally { setBusy(false); }
  };

  const save = () => run(async () => {
    setStatus('');
    const file = toDossier(state, new Date().toISOString());
    let base = saved?.name === file.name ? saved.revision : null;
    let revision: number;
    try {
      revision = await repo.save(file, base);
    } catch (e) {
      if (!(e instanceof RevisionConflict)) throw e;
      if (!window.confirm(conflictQuestion(e, base))) {
        throw new Error(`« ${file.name} » n'a pas été enregistré : ouvre la dernière version ou enregistre sous un autre nom`);
      }
      base = e.current;
      revision = await repo.save(file, base);
    }
    onSaved({ name: file.name, revision, fingerprint: fingerprint(state) });
    setStatus(`Enregistré : ${file.name}, révision ${revision}, ${when(file.savedAt)}`);
    dispatch({ type: 'clearError' });
    await refresh();
  });

  /** Validates before dispatching, so the case is marked clean only when it really loaded. */
  const load = (raw: unknown, ref: (file: DossierFile) => SavedRef | null) => {
    try { parseDossier(raw); } catch (e) {
      dispatch({ type: 'reportError', message: `Dossier refusé : ${(e as Error).message}` });
      return;
    }
    dispatch({ type: 'loadDossier', raw });
    onSaved(ref(raw as DossierFile));
    setStatus('');
  };

  const open = () => {
    if (!mayReplace()) return;
    return run(async () => {
      const { file, revision } = await repo.read(selected);
      load(file, (f) => ({ name: f.name, revision, fingerprint: fingerprint(parseDossier(f)) }));
    });
  };

  const remove = () => {
    const entry = list.find((d) => d.name === selected);
    if (!entry || !window.confirm(`Supprimer le dossier « ${entry.name} » (${WHERE_LABEL[where].toLowerCase()}) ?`)) return;
    return run(async () => {
      await repo.remove(entry.name, entry.revision);
      if (saved?.name === entry.name) onSaved(null);
      setSelected('');
      await refresh();
    });
  };

  const exportFile = () => {
    try {
      const file = toDossier(state, new Date().toISOString());
      const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url; a.download = `${file.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
      dispatch({ type: 'clearError' });
    } catch (e) { fail(e); }
  };

  // An imported file is a new case: its first save creates (or knowingly replaces) a stored dossier.
  const importFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !mayReplace()) return;
    let raw: unknown;
    try { raw = JSON.parse(await readText(file)); } catch {
      dispatch({ type: 'reportError', message: 'Dossier refusé : JSON illisible' });
      return;
    }
    load(raw, () => null);
  };

  return (
    <section className="dossier-bar" aria-label="Dossier">
      <label>
        Nom du dossier{' '}
        <input value={state.name} placeholder="ex. Air X — due diligence"
          onChange={(e) => dispatch({ type: 'setName', name: e.target.value })} />
      </label>
      <button type="button" onClick={save} disabled={busy}>Enregistrer</button>
      <label>
        Dossiers enregistrés{' '}
        <select value={selected} onChange={(e) => setSelected(e.target.value)} disabled={list.length === 0}>
          <option value="">{list.length ? 'Choisir…' : 'aucun'}</option>
          {list.map((d) => <option key={d.name} value={d.name}>{`${d.name} · ${typeLabel(d.archetype)} · ${when(d.savedAt)}`}</option>)}
        </select>
      </label>
      <button type="button" className="secondary" onClick={open} disabled={!selected || busy}>Ouvrir</button>
      <button type="button" className="secondary" onClick={remove} disabled={!selected || busy}>Supprimer</button>
      <button type="button" className="secondary" onClick={() => void refresh()} aria-label="Rafraîchir la liste" title="Rafraîchir la liste">↻</button>
      <span className={`where ${where}`}>{WHERE_LABEL[where]}</span>
      <span className="spacer" />
      <button type="button" className="secondary" onClick={exportFile}>Exporter</button>
      <label className="file">
        Importer (.json)
        <input type="file" accept="application/json,.json" onChange={importFile} />
      </label>
      {status && <span className="muted" role="status">{status}</span>}
    </section>
  );
}
