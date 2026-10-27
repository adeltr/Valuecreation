#!/usr/bin/env tsx
/**
 * Applies the analyst-validated table of data/analysis-library/<archetype>/_curation.md
 * to the analysis frontmatters (idempotent), then run `npm run catalog:build -- <archetype>`.
 *
 * Usage: tsx scripts/apply-curation.ts <archetype> [<archetype> …]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCurationTable, applyFrontmatter } from '../src/catalog/curation.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

for (const archetype of process.argv.slice(2)) {
  const dir = join(ROOT, 'data/analysis-library', archetype);
  const rows = parseCurationTable(readFileSync(join(dir, '_curation.md'), 'utf8'));
  const files = readdirSync(dir).filter((f) => /^\d{2} - .*\.md$/.test(f));
  if (rows.length !== files.length) throw new Error(`${archetype}: ${rows.length} table rows for ${files.length} analyses`);
  for (const row of rows) {
    const file = files.find((f) => f.startsWith(`${row.num} - `));
    if (!file) throw new Error(`${archetype}: no analysis file for row ${row.num}`);
    const path = join(dir, file);
    writeFileSync(path, applyFrontmatter(readFileSync(path, 'utf8'), row, archetype));
  }
  console.log(`✓ ${archetype}: ${rows.length} frontmatters applied`);
}
