import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import type { AnalysisRef } from './types';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';

// Every archetype with a source library must ship a catalog that passes integrity.
const CATALOGS: SectorArchetype[] = ['aero', 'airline'];

describe.each(CATALOGS)('%s catalog – referential integrity', (archetype) => {
  const path = `src/catalog/${archetype}.catalog.json`;
  const entries: AnalysisRef[] = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : [];
  const vocab = getActiveVocabulary(archetype);

  it('exists', () => expect(existsSync(path), path).toBe(true));

  it('all ids are unique and prefixed by the archetype', () => {
    const ids = entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of entries) {
      expect(e.id).toMatch(new RegExp(`^${archetype}-\\d{2}$`));
      expect(e.archetype).toBe(archetype);
      expect(e.partLabel, e.id).toBeTruthy();
    }
  });

  it('every reference is in the active vocabulary', () => {
    for (const e of entries) {
      for (const c of e.relatedMetricCodes) expect(vocab.isMetricCode(c), `${e.id}: metric ${c}`).toBe(true);
      for (const c of e.relatedCauseCategories) expect(vocab.isCauseCategory(c), `${e.id}: cause ${c}`).toBe(true);
      for (const c of e.relatedLeverCategories) expect(vocab.isLeverCategory(c), `${e.id}: lever ${c}`).toBe(true);
    }
  });

  it('every sourcePath points to an existing file', () => {
    for (const e of entries) expect(existsSync(e.sourcePath), `${e.id}: ${e.sourcePath}`).toBe(true);
  });
});
