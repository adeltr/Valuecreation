import { describe, it, expect } from 'vitest';
import { initialState, reducer } from './store';
import { toDossier } from '../../dossier/format';
import { listDossiers, saveDossier, readDossier, deleteDossier, LIBRARY_KEY, type KeyValueStore } from './library';

function memory(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => { data.set(k, v); } };
}

const file = (name: string, archetype: 'airline' | 'cpg', savedAt: string) =>
  toDossier(reducer(initialState(archetype), { type: 'setName', name }), savedAt);

describe('dossier library', () => {
  it('is empty at first', () => {
    expect(listDossiers(memory())).toEqual([]);
  });

  it('lists saved dossiers, most recent first', () => {
    const store = memory();
    saveDossier(store, file('Air X', 'airline', '2026-10-27T10:00:00Z'));
    saveDossier(store, file('Brand Co', 'cpg', '2026-10-27T11:00:00Z'));
    expect(listDossiers(store)).toEqual([
      { name: 'Brand Co', archetype: 'cpg', savedAt: '2026-10-27T11:00:00Z' },
      { name: 'Air X', archetype: 'airline', savedAt: '2026-10-27T10:00:00Z' },
    ]);
  });

  it('saving under an existing name replaces that dossier', () => {
    const store = memory();
    saveDossier(store, file('Air X', 'airline', 't1'));
    saveDossier(store, file('Air X', 'cpg', 't2'));
    expect(listDossiers(store)).toEqual([{ name: 'Air X', archetype: 'cpg', savedAt: 't2' }]);
  });

  it('reads back the stored file and deletes it', () => {
    const store = memory();
    const f = file('Air X', 'airline', 't1');
    saveDossier(store, f);
    expect(readDossier(store, 'Air X')).toEqual(f);
    deleteDossier(store, 'Air X');
    expect(listDossiers(store)).toEqual([]);
    expect(() => readDossier(store, 'Air X')).toThrow(/Air X/);
  });

  it('never overwrites an unreadable library (no silent data loss)', () => {
    const store = memory();
    store.setItem(LIBRARY_KEY, '{not json');
    expect(() => listDossiers(store)).toThrow(/illisible/);
    expect(() => saveDossier(store, file('Air X', 'airline', 't1'))).toThrow(/illisible/);
    expect(store.data.get(LIBRARY_KEY)).toBe('{not json');
  });
});
