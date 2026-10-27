import { useState, type ChangeEvent, type Dispatch } from 'react';
import type { Action, CockpitState } from '../state/store';
import { fingerprint, type CaseContent } from '../state/unsaved';
import { toDossier } from '../state/dossier';
import { deleteDossier, listDossiers, readDossier, saveDossier, type DossierSummary, type KeyValueStore } from '../state/library';
import { TEMPLATES } from '../../templates';
import type { SectorArchetype } from '../../ontology/registry';

interface Props {
  state: CockpitState; dispatch: Dispatch<Action>; storage: KeyValueStore;
  /** Asks before discarding unsaved work; false = keep the current case. */
  mayReplace: () => boolean;
  /** Records the fingerprint of the case as last saved / opened. */
  markClean: (fp: string) => void;
}

const typeLabel = (a: string) => TEMPLATES[a as SectorArchetype]?.label ?? a;
// FileReader rather than Blob.text(): wider support (and the one jsdom implements).
const readText = (file: Blob) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = () => reject(r.error);
  r.readAsText(file);
});
const when = (iso: string) => new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

/** Save / open / export / import of a company case. Only analyst inputs and decisions are stored. */
export function DossierBar({ state, dispatch, storage, mayReplace, markClean }: Props) {
  const fail = (e: unknown) => dispatch({ type: 'reportError', message: (e as Error).message });
  const list = (): DossierSummary[] => { try { return listDossiers(storage); } catch (e) { fail(e); return []; } };

  const [saved, setSaved] = useState<DossierSummary[]>(() => { try { return listDossiers(storage); } catch { return []; } });
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState('');

  const save = () => {
    try {
      const file = toDossier(state, new Date().toISOString());
      saveDossier(storage, file);
      markClean(fingerprint({ ...state, name: file.name }));
      setSaved(list());
      setStatus(`Enregistré : ${file.name}, ${when(file.savedAt)}`);
      dispatch({ type: 'clearError' });
    } catch (e) { fail(e); }
  };

  const open = () => {
    if (!mayReplace()) return;
    try {
      const file = readDossier(storage, selected);
      dispatch({ type: 'loadDossier', raw: file });
      markClean(fingerprint(file));
      setStatus('');
    } catch (e) { fail(e); }
  };

  const remove = () => {
    if (!window.confirm(`Supprimer le dossier « ${selected} » de ce navigateur ?`)) return;
    try {
      deleteDossier(storage, selected);
      setSaved(list());
      setSelected('');
    } catch (e) { fail(e); }
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

  const importFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    if (!mayReplace()) { input.value = ''; return; }
    try {
      const raw = JSON.parse(await readText(file));
      dispatch({ type: 'loadDossier', raw });
      if (raw && typeof raw === 'object') markClean(fingerprint(raw as CaseContent));
      setStatus('');
    } catch {
      dispatch({ type: 'reportError', message: 'Dossier refusé : JSON illisible' });
    } finally {
      input.value = '';
    }
  };

  return (
    <section className="dossier-bar" aria-label="Dossier">
      <label>
        Nom du dossier{' '}
        <input value={state.name} placeholder="ex. Air X — due diligence"
          onChange={(e) => dispatch({ type: 'setName', name: e.target.value })} />
      </label>
      <button type="button" onClick={save}>Enregistrer</button>
      <label>
        Dossiers enregistrés{' '}
        <select value={selected} onChange={(e) => setSelected(e.target.value)} disabled={saved.length === 0}>
          <option value="">{saved.length ? 'Choisir…' : 'aucun'}</option>
          {saved.map((d) => <option key={d.name} value={d.name}>{`${d.name} · ${typeLabel(d.archetype)} · ${when(d.savedAt)}`}</option>)}
        </select>
      </label>
      <button type="button" className="secondary" onClick={open} disabled={!selected}>Ouvrir</button>
      <button type="button" className="secondary" onClick={remove} disabled={!selected}>Supprimer</button>
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
