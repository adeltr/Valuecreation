#!/usr/bin/env tsx
/**
 * Parses VCC frontmatters from data/analysis-library/aero/*.md and emits
 * src/catalog/aero.catalog.json. Exits non-zero if any reference is outside
 * the aero active vocabulary (referential integrity gate).
 *
 * Usage: tsx scripts/build-catalog.ts
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getActiveVocabulary } from '../src/ontology/registry.js';
import type { AnalysisRef } from '../src/catalog/types.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'data/analysis-library/aero');
const OUT_PATH = join(ROOT, 'src/catalog/aero.catalog.json');

const vocab = getActiveVocabulary('aero');

// ── Minimal inline YAML parser ────────────────────────────────────────────────
// Handles only the VCC frontmatter fields. Ignores Obsidian tags block.
function extractFrontmatter(content: string): Record<string, string | string[]> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const result: Record<string, string | string[]> = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const [, key, raw] = m;
    const val = raw.trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      result[key] = val.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ── Extract title from first H1 after frontmatter ─────────────────────────────
function extractTitle(content: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/^\d+\s*·\s*/, '').trim() : '(untitled)';
}

// ── Process all .md files ─────────────────────────────────────────────────────
const files = readdirSync(SOURCE_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

const entries: AnalysisRef[] = [];
const errors: string[] = [];

for (const file of files) {
  const filePath = join(SOURCE_DIR, file);
  const content = readFileSync(filePath, 'utf8');
  const fm = extractFrontmatter(content);

  if (!fm || fm['kind'] !== 'analysis') continue; // skip if no VCC frontmatter yet

  const id = String(fm['id'] ?? '');
  const part = String(fm['part'] ?? '');
  const title = extractTitle(content);
  const relatedMetricCodes = (fm['quant'] as string[]) ?? [];
  const relatedCauseCategories = (fm['causes'] as string[]) ?? [];
  const relatedLeverCategories = (fm['levers'] as string[]) ?? [];
  const sourcePath = relative(ROOT, filePath).replace(/\\/g, '/');

  // Referential integrity checks
  for (const code of relatedMetricCodes) {
    if (!vocab.isMetricCode(code)) errors.push(`${id}: metric "${code}" not in aero vocabulary`);
  }
  for (const cat of relatedCauseCategories) {
    if (!vocab.isCauseCategory(cat)) errors.push(`${id}: cause "${cat}" not in aero vocabulary`);
  }
  for (const cat of relatedLeverCategories) {
    if (!vocab.isLeverCategory(cat)) errors.push(`${id}: lever "${cat}" not in aero vocabulary`);
  }

  entries.push({ id, title, part, relatedMetricCodes, relatedCauseCategories, relatedLeverCategories, sourcePath });
}

if (errors.length > 0) {
  console.error('\n❌ Referential integrity violations:\n' + errors.map((e) => '  · ' + e).join('\n'));
  process.exit(1);
}

writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2) + '\n');
console.log(`✓ Wrote ${entries.length} entries to src/catalog/aero.catalog.json`);
