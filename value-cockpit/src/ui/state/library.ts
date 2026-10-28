import { parseDossier, type DossierFile } from '../../dossier/format';
import {
  DossierNotFound, RevisionConflict,
  type DossierRepository, type DossierSummary, type StoredDossier,
} from '../../dossier/repository';

/** The subset of the Web Storage API the library needs (window.localStorage in the app). */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const LIBRARY_KEY = 'value-cockpit.dossiers';

/** Dossiers kept in this browser only; same revision rules as the shared server. */
export class LocalDossierRepository implements DossierRepository {
  constructor(private readonly store: KeyValueStore) {}

  private readAll(): Record<string, StoredDossier> {
    const raw = this.store.getItem(LIBRARY_KEY);
    if (raw === null) return {};
    let all: unknown;
    try { all = JSON.parse(raw); } catch { /* reported below */ }
    if (!all || typeof all !== 'object' || Array.isArray(all)) {
      throw new Error('Bibliothèque de dossiers illisible dans ce navigateur : rien n\'a été écrasé');
    }
    // The first version stored bare files, without a revision.
    return Object.fromEntries(Object.entries(all as Record<string, StoredDossier | DossierFile>)
      .map(([k, v]) => [k, 'format' in v ? { file: v, revision: 1 } : v]));
  }

  private current(name: string): number | null {
    return this.readAll()[name]?.revision ?? null;
  }

  async list(): Promise<DossierSummary[]> {
    return Object.values(this.readAll())
      .map(({ file: { name, archetype, savedAt }, revision }) => ({ name, archetype, savedAt, revision }))
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  }

  async read(name: string): Promise<StoredDossier> {
    const stored = this.readAll()[name];
    if (!stored) throw new DossierNotFound(name);
    return stored;
  }

  async save(file: DossierFile, baseRevision: number | null): Promise<number> {
    parseDossier(file);
    const all = this.readAll();
    const current = this.current(file.name);
    if (current !== baseRevision) throw new RevisionConflict(file.name, current);
    const revision = (current ?? 0) + 1;
    this.store.setItem(LIBRARY_KEY, JSON.stringify({ ...all, [file.name]: { file, revision } }));
    return revision;
  }

  async remove(name: string, revision: number): Promise<void> {
    const { [name]: removed, ...rest } = this.readAll();
    if ((removed?.revision ?? null) !== revision) throw new RevisionConflict(name, removed?.revision ?? null);
    this.store.setItem(LIBRARY_KEY, JSON.stringify(rest));
  }
}
