import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileDossierRepository } from './fileRepository';
import { RevisionConflict, DossierNotFound } from '../dossier/repository';
import { toDossier } from '../dossier/format';
import { initialState, reducer } from '../ui/state/store';

const file = (name: string, savedAt = '2026-10-27T10:00:00Z', lf = 0.82) =>
  toDossier(reducer(reducer(initialState('airline'), { type: 'setName', name }), { type: 'setInput', code: 'LOAD_FACTOR', value: lf }), savedAt);

let dir: string;
let repo: FileDossierRepository;
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'vcc-')); repo = new FileDossierRepository(dir); });
afterEach(() => rm(dir, { recursive: true, force: true }));

describe('file dossier repository', () => {
  it('creates a dossier at revision 1 and reads it back', async () => {
    expect(await repo.save(file('Air X'), null)).toBe(1);
    const stored = await repo.read('Air X');
    expect(stored).toEqual({ file: file('Air X'), revision: 1 });
  });

  it('lists dossiers most recent first, with their revision', async () => {
    await repo.save(file('Air X', '2026-10-27T10:00:00Z'), null);
    await repo.save(file('Air Y', '2026-10-27T11:00:00Z'), null);
    expect(await repo.list()).toEqual([
      { name: 'Air Y', archetype: 'airline', savedAt: '2026-10-27T11:00:00Z', revision: 1 },
      { name: 'Air X', archetype: 'airline', savedAt: '2026-10-27T10:00:00Z', revision: 1 },
    ]);
  });

  it('an update from the current revision bumps it', async () => {
    await repo.save(file('Air X'), null);
    expect(await repo.save(file('Air X', 't2', 0.7), 1)).toBe(2);
    expect((await repo.read('Air X')).file.inputs.LOAD_FACTOR).toBe(0.7);
  });

  it('refuses a stale save: two analysts started from the same revision', async () => {
    await repo.save(file('Air X'), null);
    await repo.save(file('Air X', 't2', 0.7), 1);
    await expect(repo.save(file('Air X', 't3', 0.6), 1)).rejects.toEqual(new RevisionConflict('Air X', 2));
    expect((await repo.read('Air X')).file.inputs.LOAD_FACTOR).toBe(0.7);
  });

  it('refuses to create over an existing dossier', async () => {
    await repo.save(file('Air X'), null);
    await expect(repo.save(file('Air X'), null)).rejects.toBeInstanceOf(RevisionConflict);
  });

  it('concurrent saves from the same revision: exactly one wins', async () => {
    await repo.save(file('Air X'), null);
    const results = await Promise.allSettled([repo.save(file('Air X', 'a', 0.7), 1), repo.save(file('Air X', 'b', 0.6), 1)]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect((await repo.read('Air X')).revision).toBe(2);
  });

  it('never stores an invalid dossier', async () => {
    const bad = { ...file('Air X'), inputs: { MOIC: 3 } };
    await expect(repo.save(bad, null)).rejects.toThrow(/inputs/i);
    expect(await repo.list()).toEqual([]);
  });

  it('names cannot escape the storage directory', async () => {
    await repo.save(file('../../etc/passwd'), null);
    expect((await readdir(dir)).every((f) => /^[0-9a-f]{64}\.json$/.test(f))).toBe(true);
    expect((await repo.read('../../etc/passwd')).file.name).toBe('../../etc/passwd');
  });

  it('removes only from the current revision', async () => {
    await repo.save(file('Air X'), null);
    await expect(repo.remove('Air X', 3)).rejects.toBeInstanceOf(RevisionConflict);
    await repo.remove('Air X', 1);
    await expect(repo.read('Air X')).rejects.toBeInstanceOf(DossierNotFound);
  });

  it('skips unreadable files in the listing instead of failing the whole library', async () => {
    await repo.save(file('Air X'), null);
    await writeFile(join(dir, `${'0'.repeat(64)}.json`), '{oops');
    expect((await repo.list()).map((d) => d.name)).toEqual(['Air X']);
  });
});
