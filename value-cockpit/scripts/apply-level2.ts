#!/usr/bin/env tsx
/**
 * Level 2 from a sector spec (src/sectors/<archetype>.ts, docs/14):
 *  1. adds the spec's terms to the rows of _curation.md it cites (catalog links),
 *  2. re-applies the frontmatters and rebuilds <archetype>.catalog.json (integrity-checked),
 *  3. writes _level2.md, the human-readable view of the spec.
 *
 * Usage: tsx scripts/apply-level2.ts <archetype> [<archetype> …]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SPECS } from '../src/sectors/index.js';
import type { SectorSpec } from '../src/sectors/types.js';
import { addTerm, parseCurationTable, applyFrontmatter } from '../src/catalog/curation.js';
import { buildCatalog } from '../src/catalog/build.js';
import type { SectorArchetype } from '../src/ontology/registry.js';

const list = (ns: number[]) => ns.map((n) => `#${n}`).join(', ');

function doc(s: SectorSpec): string {
  const term = (t: { code: string; unit: string; sources: string }) => `| \`${t.code}\` | ${t.unit} | ${t.sources} |`;
  return [
    `# ${s.label} — niveau 2 (spec \`src/sectors/${s.archetype}.ts\`)`, '',
    `> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par`,
    `> \`scripts/apply-level2.ts\` — modifier la spec, pas ce fichier. Sources : Umbrex « ${s.umbrexType} »,`,
    `> \`data/kpi-library/${s.kpiFile}\`, analyses #n de ce dossier.`, '',
    '## Formules', '', '```',
    ...Object.entries(s.formulas).map(([k, f]) => `${k.padEnd(22)} = ${f}`),
    '```', 'Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).', '',
    '**Approximations :**', ...s.approximations.map((a) => `- ${a}`), '',
    ...(s.interactions?.length ? ['## Interactions (moteur, scénarios)', '',
      ...s.interactions.map((r) => `- \`${r.source}\` → \`${r.target}\` : Δ cible = \`${r.coefficient}\` (démo ${s.demoInputs[r.coefficient]}) × Δ source — ${r.sources}`), ''] : []),
    '## Inputs liés par formule', '', '| Code | Unité | Sources |', '|---|---|---|', ...s.inputs.map(term), '',
    '## Diagnostics benchmarkés', '', '| Code | Unité | Sources |', '|---|---|---|', ...s.diagnostics.map(term), '',
    '## Leviers', '', '| Catégorie | Cible | Test (delta absolu) | Analyses |', '|---|---|---|---|',
    ...s.levers.map((l) => `| \`${l.category}\` | ${l.target ?? '— (qualitatif)'} | ${l.target ? l.delta : '—'} | ${list(l.analyses)} |`),
    ...s.baseLevers.map((l) => `| \`${l.category}\` (base) | — | — | ${list(l.analyses)} |`), '',
    '## Causes', '', ...s.causes.map((c) => `- \`${c.category}\`${c.exogenous ? ' (exogène, jamais un levier)' : ''} — ${c.sources}`), '',
    `Référence moteur (démo) : EBITDA_EXIT = ${s.reference.EBITDA_EXIT}.`, '',
  ].join('\n');
}

for (const a of process.argv.slice(2)) {
  const spec = (SPECS as Record<string, SectorSpec>)[a];
  if (!spec) throw new Error(`no spec for ${a}`);
  const dir = join('data/analysis-library', a);
  let md = readFileSync(join(dir, '_curation.md'), 'utf8');
  for (const [code, nums] of Object.entries(spec.catalogMetrics)) md = addTerm(md, 'quant', code, nums);
  for (const l of [...spec.levers, ...spec.baseLevers]) md = addTerm(md, 'levers', l.category, l.analyses);
  for (const c of spec.causes) md = addTerm(md, 'causes', c.category, c.analyses);
  writeFileSync(join(dir, '_curation.md'), md);

  const files = readdirSync(dir).filter((f) => /^\d{2} - .*\.md$/.test(f));
  for (const row of parseCurationTable(md)) {
    const f = files.find((x) => x.startsWith(`${row.num} - `))!;
    writeFileSync(join(dir, f), applyFrontmatter(readFileSync(join(dir, f), 'utf8'), row, a));
  }
  const { entries, errors } = buildCatalog(a as SectorArchetype, files.sort().map((f) => ({ path: `${dir}/${f}`, content: readFileSync(join(dir, f), 'utf8') })));
  if (errors.length) throw new Error(`${a}: ${errors.join('; ')}`);
  writeFileSync(`src/catalog/${a}.catalog.json`, JSON.stringify(entries, null, 2) + '\n');
  writeFileSync(join(dir, '_level2.md'), doc(spec));
  console.log(`✓ ${a}: catalog ${entries.length} entries enriched, _level2.md written`);
}
