import type { DossierFile } from '../../dossier/format';
import {
  DossierNotFound, RevisionConflict,
  type DossierRepository, type DossierSummary, type StoredDossier,
} from '../../dossier/repository';
import { LocalDossierRepository, type KeyValueStore } from './library';

type Fetch = typeof fetch;

/** The shared dossier store served by `npm run server` (src/server/dossierRoutes.ts). */
export class HttpDossierRepository implements DossierRepository {
  constructor(private readonly base: string, private readonly fetchImpl: Fetch = (...a) => fetch(...a)) {}

  private url(name: string) { return `${this.base}/${encodeURIComponent(name)}`; }

  private async call<T>(name: string, input: string, init?: RequestInit): Promise<T> {
    const res = await this.fetchImpl(input, init);
    if (res.status === 204) return undefined as T;
    const body = await res.json().catch(() => ({}));
    if (res.ok) return body as T;
    if (res.status === 409) throw new RevisionConflict(name, body.current ?? null);
    if (res.status === 404) throw new DossierNotFound(name);
    throw new Error(body.error ?? `Serveur de dossiers : erreur ${res.status}`);
  }

  list(): Promise<DossierSummary[]> {
    return this.call('', this.base);
  }

  read(name: string): Promise<StoredDossier> {
    return this.call(name, this.url(name));
  }

  async save(file: DossierFile, baseRevision: number | null): Promise<number> {
    const { revision } = await this.call<{ revision: number }>(file.name, this.url(file.name), {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, baseRevision }),
    });
    return revision;
  }

  remove(name: string, revision: number): Promise<void> {
    return this.call(name, `${this.url(name)}?revision=${revision}`, { method: 'DELETE' });
  }
}

export type DossierLocation = 'server' | 'browser';

/** The shared server when it answers, otherwise this browser's own library. */
export async function connectRepository(
  fetchImpl: Fetch, store: KeyValueStore, base = '/api/dossiers',
): Promise<{ repo: DossierRepository; where: DossierLocation }> {
  try {
    const res = await fetchImpl(base);
    if (res.ok && Array.isArray(await res.json())) return { repo: new HttpDossierRepository(base, fetchImpl), where: 'server' };
  } catch { /* server down: fall back */ }
  return { repo: new LocalDossierRepository(store), where: 'browser' };
}
