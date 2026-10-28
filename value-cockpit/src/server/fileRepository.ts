import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseDossier, type DossierFile } from '../dossier/format';
import {
  DossierNotFound, RevisionConflict,
  type DossierRepository, type DossierSummary, type StoredDossier,
} from '../dossier/repository';

/**
 * One JSON file per dossier, named by the SHA-256 of the dossier name (a name can never
 * reach the file system). Writes go through a temp file + rename, and are serialized so
 * that the revision check and the write are atomic within this process.
 */
export class FileDossierRepository implements DossierRepository {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly dir: string) {}

  private path(name: string) {
    return join(this.dir, `${createHash('sha256').update(name).digest('hex')}.json`);
  }

  private exclusive<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(task, task);
    this.queue = run.catch(() => undefined);
    return run;
  }

  private async load(name: string): Promise<StoredDossier | null> {
    try {
      return JSON.parse(await readFile(this.path(name), 'utf8')) as StoredDossier;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw e;
    }
  }

  async list(): Promise<DossierSummary[]> {
    await mkdir(this.dir, { recursive: true });
    const out: DossierSummary[] = [];
    for (const f of (await readdir(this.dir)).filter((x) => /^[0-9a-f]{64}\.json$/.test(x))) {
      try {
        const { file, revision } = JSON.parse(await readFile(join(this.dir, f), 'utf8')) as StoredDossier;
        out.push({ name: file.name, archetype: file.archetype, savedAt: file.savedAt, revision });
      } catch {
        console.warn(`[dossiers] fichier illisible ignoré : ${f}`);
      }
    }
    return out.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  }

  async read(name: string): Promise<StoredDossier> {
    const stored = await this.load(name);
    if (!stored) throw new DossierNotFound(name);
    return stored;
  }

  async save(file: DossierFile, baseRevision: number | null): Promise<number> {
    parseDossier(file); // throws on an invalid dossier: nothing invalid is ever stored
    return this.exclusive(async () => {
      const current = (await this.load(file.name))?.revision ?? null;
      if (current !== baseRevision) throw new RevisionConflict(file.name, current);
      const revision = (current ?? 0) + 1;
      await mkdir(this.dir, { recursive: true });
      const tmp = join(this.dir, `.${randomUUID()}.tmp`);
      await writeFile(tmp, JSON.stringify({ file, revision } satisfies StoredDossier, null, 2));
      await rename(tmp, this.path(file.name));
      return revision;
    });
  }

  remove(name: string, revision: number): Promise<void> {
    return this.exclusive(async () => {
      const current = (await this.load(name))?.revision ?? null;
      if (current !== revision) throw new RevisionConflict(name, current);
      await rm(this.path(name));
    });
  }
}
