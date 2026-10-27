import type { DossierFile } from './dossier';

/** The subset of the Web Storage API the library needs (window.localStorage in the app). */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const LIBRARY_KEY = 'value-cockpit.dossiers';

export interface DossierSummary { name: string; archetype: string; savedAt: string }

// Files are stored as written and re-validated by parseDossier when opened.
function readAll(store: KeyValueStore): Record<string, DossierFile> {
  const raw = store.getItem(LIBRARY_KEY);
  if (raw === null) return {};
  try {
    const all = JSON.parse(raw);
    if (all && typeof all === 'object' && !Array.isArray(all)) return all;
  } catch { /* reported below */ }
  throw new Error('Bibliothèque de dossiers illisible dans ce navigateur : rien n\'a été écrasé');
}

export function listDossiers(store: KeyValueStore): DossierSummary[] {
  return Object.values(readAll(store))
    .map(({ name, archetype, savedAt }) => ({ name, archetype, savedAt }))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveDossier(store: KeyValueStore, file: DossierFile): void {
  store.setItem(LIBRARY_KEY, JSON.stringify({ ...readAll(store), [file.name]: file }));
}

export function readDossier(store: KeyValueStore, name: string): DossierFile {
  const file = readAll(store)[name];
  if (!file) throw new Error(`Dossier introuvable : ${name}`);
  return file;
}

export function deleteDossier(store: KeyValueStore, name: string): void {
  const { [name]: _removed, ...rest } = readAll(store);
  store.setItem(LIBRARY_KEY, JSON.stringify(rest));
}
