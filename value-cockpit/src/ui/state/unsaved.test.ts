import { describe, it, expect } from 'vitest';
import { initialState, reducer } from './store';
import { fingerprint, hasUnsavedWork } from './unsaved';

describe('unsaved work', () => {
  const named = reducer(initialState('airline'), { type: 'setName', name: 'Air X' });

  it('an untouched demo case has nothing to lose', () => {
    expect(hasUnsavedWork(initialState('cpg'), null)).toBe(false);
  });

  it('any edit since the last save is unsaved work', () => {
    expect(hasUnsavedWork(named, null)).toBe(true);
    expect(hasUnsavedWork(named, fingerprint(named))).toBe(false);
    expect(hasUnsavedWork(reducer(named, { type: 'setInput', code: 'LOAD_FACTOR', value: 0.6 }), fingerprint(named))).toBe(true);
  });

  it('the fingerprint ignores key order and transient fields', () => {
    const reordered = { ...named, inputs: Object.fromEntries(Object.entries(named.inputs).reverse()), error: 'x', nextId: 9 };
    expect(fingerprint(reordered)).toBe(fingerprint(named));
  });
});
