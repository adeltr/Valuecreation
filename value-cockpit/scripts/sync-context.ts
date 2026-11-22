#!/usr/bin/env tsx
/**
 * Adds the missing IRIs of every active term to src/ontology/context.jsonld (invariant 3:
 * a term and its IRI land in the same commit). Existing IRIs are never changed.
 * Metrics → vcc:CamelCase · levers → vcc:lever/CamelCase · causes → vcc:cause/CamelCase.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { SECTOR_ARCHETYPES, getActiveVocabulary } from '../src/ontology/registry.js';

const path = 'src/ontology/context.jsonld';
const doc = JSON.parse(readFileSync(path, 'utf8'));
const ctx = doc['@context'];
const camel = (t: string) => t.toLowerCase().split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const added: string[] = [];
const add = (term: string, iri: string) => { if (!(term in ctx)) { ctx[term] = iri; added.push(term); } };
for (const a of SECTOR_ARCHETYPES) {
  const v = getActiveVocabulary(a);
  v.metricCodes.forEach((c) => add(c, `vcc:${camel(c)}`));
  v.leverCategories.forEach((c) => add(c, `vcc:lever/${camel(c)}`));
  v.causeCategories.forEach((c) => add(c, `vcc:cause/${camel(c)}`));
}
writeFileSync(path, JSON.stringify(doc, null, 2) + '\n');
console.log(added.length ? `✓ added ${added.length} IRIs: ${added.join(', ')}` : '✓ context complete');
