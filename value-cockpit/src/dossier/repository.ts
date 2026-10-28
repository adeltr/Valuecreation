import type { DossierFile } from './format';

export interface DossierSummary { name: string; archetype: string; savedAt: string; revision: number }
export interface StoredDossier { file: DossierFile; revision: number }

/** Saving over a version you did not start from. `current` is the stored revision (null: none). */
export class RevisionConflict extends Error {
  constructor(public readonly name: string, public readonly current: number | null) {
    super(current === null
      ? `Le dossier « ${name} » n'existe plus`
      : `Le dossier « ${name} » a été modifié depuis son ouverture (révision ${current})`);
  }
}

export class DossierNotFound extends Error {
  constructor(name: string) { super(`Dossier introuvable : ${name}`); }
}

/**
 * Where dossiers live. Optimistic concurrency: `save` and `remove` name the revision they
 * start from (null = create), and a mismatch is a RevisionConflict, never a silent overwrite.
 */
export interface DossierRepository {
  list(): Promise<DossierSummary[]>;
  read(name: string): Promise<StoredDossier>;
  save(file: DossierFile, baseRevision: number | null): Promise<number>;
  remove(name: string, revision: number): Promise<void>;
}
