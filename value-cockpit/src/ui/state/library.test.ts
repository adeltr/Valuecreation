import { describe, it, expect } from 'vitest';
import { initialState, reducer } from './store';
import { toDossier } from '../../dossier/format';
import { RevisionConflict, DossierNotFound } from '../../dossier/repository';
import { LocalDossierRepository, LIBRARY_KEY, type KeyValueStore } from './library';

function memory(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => { data.set(k, v); } };
}

const file = (name: string, archetype: 'airline' | 'cpg', savedAt: string) =>
  toDossier(reducer(initialState(archetype), { type: 'setName', name }), savedAt);

describe('browser dossier library', () => {
  it('is empty at first', async () => {
    expect(await new LocalDossierRepository(memory()).list()).toEqual([]);
  });

  it('lists saved dossiers, most recent first', async () => {
    const repo = new LocalDossierRepository(memory());
    await repo.save(file('Air X', 'airline', '2026-10-27T10:00:00Z'), null);
    await repo.save(file('Brand Co', 'cpg', '2026-10-27T11:00:00Z'), null);
    expect(await repo.list()).toEqual([
      { name: 'Brand Co', archetype: 'cpg', savedAt: '2026-10-27T11:00:00Z', revision: 1 },
      { name: 'Air X', archetype: 'airline', savedAt: '2026-10-27T10:00:00Z', revision: 1 },
    ]);
  });

  it('same revision rules as the server: update from the current one, stale save refused', async () => {
    const repo = new LocalDossierRepository(memory());
    await repo.save(file('Air X', 'airline', 't1'), null);
    expect(await repo.save(file('Air X', 'cpg', 't2'), 1)).toBe(2);
    await expect(repo.save(file('Air X', 'airline', 't3'), 1)).rejects.toEqual(new RevisionConflict('Air X', 2));
    await expect(repo.save(file('Air X', 'airline', 't3'), null)).rejects.toBeInstanceOf(RevisionConflict);
  });

  it('reads back the stored file and deletes it', async () => {
    const repo = new LocalDossierRepository(memory());
    const f = file('Air X', 'airline', 't1');
    await repo.save(f, null);
    expect(await repo.read('Air X')).toEqual({ file: f, revision: 1 });
    await repo.remove('Air X', 1);
    expect(await repo.list()).toEqual([]);
    await expect(repo.read('Air X')).rejects.toBeInstanceOf(DossierNotFound);
  });

  it('reads dossiers saved by the previous version (no revision) as revision 1', async () => {
    const store = memory();
    const f = file('Air X', 'airline', 't1');
    store.setItem(LIBRARY_KEY, JSON.stringify({ 'Air X': f }));
    expect(await new LocalDossierRepository(store).read('Air X')).toEqual({ file: f, revision: 1 });
  });

  it('never stores an invalid dossier', async () => {
    const repo = new LocalDossierRepository(memory());
    await expect(repo.save({ ...file('Air X', 'airline', 't1'), inputs: { MOIC: 3 } }, null)).rejects.toThrow(/inputs/i);
  });

  it('never overwrites an unreadable library (no silent data loss)', async () => {
    const store = memory();
    store.setItem(LIBRARY_KEY, '{not json');
    const repo = new LocalDossierRepository(store);
    await expect(repo.list()).rejects.toThrow(/illisible/);
    await expect(repo.save(file('Air X', 'airline', 't1'), null)).rejects.toThrow(/illisible/);
    expect(store.data.get(LIBRARY_KEY)).toBe('{not json');
  });
});
