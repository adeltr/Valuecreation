import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { getActiveVocabulary } from './registry';

describe('JSON-LD context', () => {
  const ctx = JSON.parse(readFileSync('src/ontology/context.jsonld', 'utf8'))['@context'];
  it('maps every active saas metric code to an IRI', () => {
    for (const code of getActiveVocabulary('saas').metricCodes) {
      expect(ctx[code], `${code} missing from context`).toBeDefined();
    }
  });
  it('declares the project namespace', () => {
    expect(ctx['vcc']).toBe('https://vcc.dev/ontology#');
  });
});
