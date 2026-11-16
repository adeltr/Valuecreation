import { describe, it, expect, vi } from 'vitest';
import { HttpDossierRepository, connectRepository } from './httpRepository';
import { authFetch } from './session';
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

describe('session: shared password and analyst name', () => {
  it('authFetch adds the password and the URL-encoded analyst name to every call', async () => {
    const base = vi.fn(async () => json(200, []));
    await authFetch(base, () => ({ analyst: 'Léa Martin', password: 's3cret' }))('/api/dossiers', { method: 'GET', headers: { Accept: 'x' } });
    expect(base).toHaveBeenCalledWith('/api/dossiers', { method: 'GET', headers: { Accept: 'x', 'X-VCC-Password': 's3cret', 'X-VCC-Analyst': 'L%C3%A9a%20Martin' } });
  });

  it('a server that refuses the password is reported as locked — never a silent fallback to the browser', async () => {
    const f = async (url: string) => (url.endsWith('/session') ? json(200, { passwordRequired: true }) : json(401, { error: 'x' }));
    const r = await connectRepository(f as typeof fetch, memory());
    expect(r.where).toBe('locked');
    await expect(r.repo.list()).rejects.toThrow(/mot de passe/i);
  });
});

