import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import type { AnalysisRef } from './types';
import { getActiveVocabulary } from '../ontology/registry';

const entries: AnalysisRef[] = JSON.parse(
  readFileSync('src/catalog/aero.catalog.json', 'utf8'),
);
const vocab = getActiveVocabulary('aero');

describe('aero catalog – referential integrity', () => {
  it('all ids are unique', () => {
    const ids = entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every relatedMetricCode is in the aero active vocabulary', () => {
    for (const e of entries) {
      for (const code of e.relatedMetricCodes) {
        expect(vocab.isMetricCode(code), `${e.id}: metric "${code}" not in vocab`).toBe(true);
      }
    }
  });

  it('every relatedCauseCategory is in the aero active vocabulary', () => {
    for (const e of entries) {
      for (const cat of e.relatedCauseCategories) {
        expect(vocab.isCauseCategory(cat), `${e.id}: cause "${cat}" not in vocab`).toBe(true);
      }
    }
  });

  it('every relatedLeverCategory is in the aero active vocabulary', () => {
    for (const e of entries) {
      for (const cat of e.relatedLeverCategories) {
        expect(vocab.isLeverCategory(cat), `${e.id}: lever "${cat}" not in vocab`).toBe(true);
      }
    }
  });

  it('every sourcePath points to an existing file', () => {
    for (const e of entries) {
      expect(existsSync(e.sourcePath), `${e.id}: "${e.sourcePath}" not found`).toBe(true);
    }
  });
});
