import { describe, it, expect, vi } from 'vitest';
import { HttpDossierRepository, connectRepository } from './httpRepository';
import { LocalDossierRepository, type KeyValueStore } from './library';
import { RevisionConflict, DossierNotFound } from '../../dossier/repository';
import { toDossier } from '../../dossier/format';
import { initialState, reducer } from './store';

const file = toDossier(reducer(initialState('airline'), { type: 'setName', name: 'Air X / DD' }), 't');
const json = (status: number, body: unknown) => new Response(status === 204 ? null : JSON.stringify(body), { status });
const memory = (): KeyValueStore => { const m = new Map<string, string>(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => { m.set(k, v); } }; };

describe('http dossier repository', () => {
  it('PUTs the file with its base revision to an encoded URL', async () => {
    const fetchMock = vi.fn(async () => json(200, { revision: 3 }));
    const repo = new HttpDossierRepository('/api/dossiers', fetchMock);
    expect(await repo.save(file, 2)).toBe(3);
    expect(fetchMock).toHaveBeenCalledWith('/api/dossiers/Air%20X%20%2F%20DD', expect.objectContaining({
      method: 'PUT', body: JSON.stringify({ file, baseRevision: 2 }),
    }));
  });

  it('turns a 409 into a RevisionConflict carrying the current revision', async () => {
    const repo = new HttpDossierRepository('/api/dossiers', async () => json(409, { error: 'x', current: 4 }));
    await expect(repo.save(file, 2)).rejects.toEqual(new RevisionConflict('Air X / DD', 4));
  });

  it('turns a 404 into DossierNotFound and other errors into their message', async () => {
    await expect(new HttpDossierRepository('/a', async () => json(404, { error: 'x' })).read('n')).rejects.toBeInstanceOf(DossierNotFound);
    await expect(new HttpDossierRepository('/a', async () => json(422, { error: 'Levier invalide' })).save(file, null)).rejects.toThrow('Levier invalide');
  });

  it('DELETE sends the revision', async () => {
    const fetchMock = vi.fn(async () => json(204, null));
    await new HttpDossierRepository('/api/dossiers', fetchMock).remove('Air X', 2);
    expect(fetchMock).toHaveBeenCalledWith('/api/dossiers/Air%20X?revision=2', { method: 'DELETE' });
  });
});

describe('connectRepository', () => {
  it('uses the shared server when it answers', async () => {
    const r = await connectRepository(async () => json(200, []), memory());
    expect(r.where).toBe('server');
    expect(r.repo).toBeInstanceOf(HttpDossierRepository);
  });

  it('falls back to this browser when the server is down or absent', async () => {
    for (const f of [async () => { throw new TypeError('fetch failed'); }, async () => new Response('<html>', { status: 404 })]) {
      const r = await connectRepository(f as typeof fetch, memory());
      expect(r.where).toBe('browser');
      expect(r.repo).toBeInstanceOf(LocalDossierRepository);
    }
  });
});
