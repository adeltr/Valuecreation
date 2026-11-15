import { describe, it, expect } from 'vitest';
import { modelTargets } from './targets';
import { getActiveVocabulary, SECTOR_ARCHETYPES } from '../ontology/registry';

describe('lever targets of a model (docs/06)', () => {
  it('quantified = inputs of the template the vocabulary lets a lever move', () => {
    const t = modelTargets('airline');
    expect(t.quantified).toContain('FUEL_CASK');
    expect(t.quantified).not.toContain('EXIT_MULTIPLE');       // deal structure
    expect(t.quantified).not.toContain('EBITDA_EXIT');         // computed
  });

  it('calculated metrics are never a target; vocabulary metrics outside the model are diagnostic', () => {
    const t = modelTargets('airline');
    expect(t.calculated).toEqual(expect.arrayContaining(['EBITDA_EXIT', 'REVENUE_EXIT', 'MOIC']));
    expect(t.diagnostic).toEqual(expect.arrayContaining(['ON_TIME_PERFORMANCE', 'MARKET_SHARE']));
    expect(t.diagnostic).not.toContain('FUEL_CASK');
  });

  it('the three sets are disjoint and cover every lever target of the vocabulary, for every archetype', () => {
    for (const a of SECTOR_ARCHETYPES) {
      const t = modelTargets(a);
      const v = getActiveVocabulary(a);
      const all = [...t.quantified, ...t.diagnostic];
      expect(new Set(all).size, a).toBe(all.length);
      expect(all.filter((c) => t.calculated.includes(c)), a).toEqual([]);
      expect([...all, ...t.calculated.filter((c) => v.isLeverTarget(c))].sort(), a).toEqual(v.metricCodes.filter((c) => v.isLeverTarget(c)).sort());
    }
  });

  it('an archetype without a template has only diagnostic targets', () => {
    expect(modelTargets('generic').quantified).toEqual([]);
  });
});
