#!/usr/bin/env tsx
/**
 * Writes data/analysis-library/<archetype>/_curation.md: a keyword-based PROPOSAL of
 * catalog mappings onto the active vocabulary, for one analyst review (docs/11 D4).
 * Never writes frontmatters and never touches the vocabulary.
 *
 * Usage: tsx scripts/prefill-curation.ts <archetype> [<archetype> …]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getActiveVocabulary, type SectorArchetype } from '../src/ontology/registry.js';
import { parseAnalysis, suggestMapping } from '../src/catalog/prefill.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const cell = (xs: string[]) => (xs.length ? xs.join(', ') : '—');

for (const archetype of process.argv.slice(2) as SectorArchetype[]) {
  const dir = join(ROOT, 'data/analysis-library', archetype);
  const out = join(dir, '_curation.md');
  if (existsSync(out)) { console.error(`skip ${archetype}: _curation.md exists (never overwritten)`); continue; }
  const vocab = getActiveVocabulary(archetype);
  const rows = readdirSync(dir).filter((f) => /^\d{2} - .*\.md$/.test(f)).sort()
    .map((f) => { const a = parseAnalysis(readFileSync(join(dir, f), 'utf8')); return { a, m: suggestMapping(a, vocab) }; });

  const parts = [...new Map(rows.map(({ a }) => [a.part, a.partLabel])).entries()];
  const empty = rows.filter(({ m }) => !m.quant.length && !m.levers.length).length;
  const regulatory = rows.filter(({ m }) => m.regulatory).map(({ a }) => a.num);

  const md = [
    `# Curation ${archetype} — mapping pré-rempli (niveau 1)`, '',
    '> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire',
    `> actif \`${archetype}\` (base${vocab.metricCodes.length > getActiveVocabulary('generic').metricCodes.length ? ' ∪ extension' : ''}) :`,
    '> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.',
    '> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n\'est',
    '> appliqué aux fichiers avant ta validation ; aucun terme n\'est ajouté au vocabulaire.', '',
    `${rows.length} analyses · ${empty} sans métrique ni levier (qualitatives) · ${regulatory.length} à contenu réglementaire (cause REGULATORY).`, '',
    '## Mapping proposé', '',
    '| # | Partie | quant | levers | causes | indices |',
    '|---|---|---|---|---|---|',
    ...rows.map(({ a, m }) => `| ${a.num} | ${a.part} | ${cell(m.quant)} | ${cell(m.levers)} | ${cell(m.causes)} | ${m.evidence.join(' · ')} |`),
    '', `Libellés des parties : ${parts.map(([p, l]) => `${p} ${l}`).join(' · ')}.`, '',
    '## Arbitrages', '',
    '1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel',
    '   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).', '',
  ].join('\n');
  writeFileSync(out, md);
  console.log(`✓ ${archetype}: ${rows.length} analyses, ${empty} qualitatives, ${regulatory.length} réglementaires`);
}
