#!/usr/bin/env tsx
/**
 * Builds src/ontology/kpi-definitions.json: per archetype, for every metric code whose name
 * matches exactly a KPI of that archetype's Umbrex glossary (data/kpi-library), the KPI name and
 * its description, verbatim. A glossary of another sector is never used.
 * No fuzzy matching: a code without an exact match gets no definition (docs/21).
 *
 * Usage: tsx scripts/build-labels.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTOR_ARCHETYPES, getActiveVocabulary } from '../src/ontology/registry.js';
import { SPECS } from '../src/sectors/index.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const dir = join(ROOT, 'data/kpi-library');
// Hand-written extensions name their glossary here; spec-derived ones carry it (SectorSpec.kpiFile).
const KPI_FILE: Record<string, string> = {
  saas: 'Software.md', aero: 'Aerospace & Defense.md', airline: 'Travel & Logistics.md', cpg: 'Consumer Packaged Goods.md',
  ...Object.fromEntries(Object.values(SPECS).map((s) => [s.archetype, s.kpiFile])),
};
const key = (name: string) => name.replace(/\(.*?\)/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');

const out: Record<string, Record<string, { label: string; definition: string }>> = {};
let total = 0;
for (const a of SECTOR_ARCHETYPES) {
  const file = KPI_FILE[a];
  if (!file) continue;
  const kpis = new Map<string, { label: string; definition: string }>();
  for (const line of readFileSync(join(dir, file), 'utf8').split('\n')) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!m || m[1] === 'KPI' || /^-+$/.test(m[1])) continue;
    if (!kpis.has(key(m[1]))) kpis.set(key(m[1]), { label: m[1].replace(/\s*\(.*?\)\s*/g, ' ').trim(), definition: m[2] });
  }
  const hits = getActiveVocabulary(a).metricCodes.filter((c) => kpis.has(c));
  if (hits.length) out[a] = Object.fromEntries(hits.map((c) => [c, kpis.get(c)!]));
  total += hits.length;
}
writeFileSync(join(ROOT, 'src/ontology/kpi-definitions.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`✓ ${total} definitions for ${Object.keys(out).length} archetypes → src/ontology/kpi-definitions.json`);
