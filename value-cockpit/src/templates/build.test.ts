import { describe, it, expect } from 'vitest';
import { makeTemplate } from './build';
import { getActiveVocabulary, SECTOR_ARCHETYPES } from '../ontology/registry';

describe('makeTemplate', () => {
  const t = makeTemplate('retail', { REVENUE_EXIT: 'REVENUE * 2' });

  it('emits inputs then calculated metrics, with units from the archetype vocabulary', () => {
    const m = t('c', { REVENUE: 10 });
    expect(m.map((x) => [x.code, x.isCalculated, x.unit])).toEqual([['REVENUE', false, 'currency'], ['REVENUE_EXIT', true, 'currency']]);
    expect(m[1].formula).toBe('REVENUE * 2');
  });

  it('refuses a code outside the vocabulary (input or formula)', () => {
    expect(() => t('c', { LOAD_FACTOR: 1 })).toThrow(/unknown code/i);
    expect(() => makeTemplate('retail', { NOPE: '1' })('c', {})).toThrow(/unknown code/i);
  });
});

describe('vocabulary consistency across extensions', () => {
  it('a code shared by several archetypes always has the same unit', () => {
    const seen = new Map<string, string>();
    for (const a of SECTOR_ARCHETYPES) {
      const v = getActiveVocabulary(a);
      for (const code of v.metricCodes) {
        const unit = v.metricMeta[code].unit;
        expect(seen.get(code) ?? unit, `${code} (${a})`).toBe(unit);
        seen.set(code, unit);
      }
    }
  });
});
