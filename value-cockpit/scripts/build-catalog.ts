#!/usr/bin/env tsx
/**
 * Parses VCC frontmatters from data/analysis-library/<archetype>/*.md and emits
 * src/catalog/<archetype>.catalog.json. Exits non-zero if any reference is
 * outside the archetype's active vocabulary (referential integrity gate).
 *
 * Usage: tsx scripts/build-catalog.ts <archetype>     (npm run catalog:build -- airline)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTOR_ARCHETYPES, type SectorArchetype } from '../src/ontology/registry.js';
import { buildCatalog } from '../src/catalog/build.js';

const archetype = process.argv[2] as SectorArchetype;
if (!(SECTOR_ARCHETYPES as readonly string[]).includes(archetype)) {
  console.error(`Usage: tsx scripts/build-catalog.ts <${SECTOR_ARCHETYPES.join('|')}>`);
  process.exit(1);
}

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const dir = `data/analysis-library/${archetype}`;
const files = readdirSync(join(ROOT, dir))
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => ({ path: `${dir}/${f}`, content: readFileSync(join(ROOT, dir, f), 'utf8') }));

const { entries, errors } = buildCatalog(archetype, files);
if (errors.length > 0) {
  console.error('\n❌ Referential integrity violations:\n' + errors.map((e) => '  · ' + e).join('\n'));
  process.exit(1);
}

const out = `src/catalog/${archetype}.catalog.json`;
writeFileSync(join(ROOT, out), JSON.stringify(entries, null, 2) + '\n');
console.log(`✓ Wrote ${entries.length} entries to ${out}`);
