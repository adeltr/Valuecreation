#!/usr/bin/env tsx
/**
 * Converts raw vault analysis files (PDF-extracted: page footers, hard-wrapped
 * lines, "●" bullets) into the cleaned data/analysis-library format used by
 * aero: Obsidian tags + part, "N · Title" H1, six emoji sections.
 * Content is reflowed, never rewritten. Source files are left untouched.
 *
 * Usage: tsx scripts/import-analyses.ts <srcDir> <archetype> <tag> "<Index title>"
 *   e.g. tsx scripts/import-analyses.ts ~/vault/airline airline airline "How to Analyze an Airline Company"
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [srcDir, archetype, tag, indexTitle] = process.argv.slice(2);
if (!srcDir || !archetype || !tag || !indexTitle) {
  console.error('Usage: tsx scripts/import-analyses.ts <srcDir> <archetype> <tag> "<Index title>"');
  process.exit(1);
}

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'data/analysis-library', archetype);

const SECTIONS: [RegExp, string][] = [
  [/^goal/i, '## 🎯 Goal'],
  [/^data required/i, '## 📊 Data required'],
  [/^step-by-step/i, '## 🪜 Step-by-step'],
  [/^format of the output/i, '## 📤 Output format'],
  [/^how to interpret/i, '## 🔍 How to interpret the results'],
  [/^steps a company can take/i, '## 🚀 Steps to improve'],
];

const STEP_HEADING = /^\s*Detailed step[-‐ ]by[-‐ ]step instructions?( on how to conduct the analysis)?:?\s*$/i;

const isNoise = (line: string) =>
  /Find an independent consultant at www\.umbrex\.com/.test(line)
  || line.trim() === indexTitle
  || /^\*Catégorie :/.test(line.trim());

const isFormula = (line: string) => /^\s{10,}\S/.test(line) && line.includes('=');
const indentOf = (line: string) => line.length - line.trimStart().length;
const unfinished = (formula: string) => {
  const body = formula.replace(/`/g, '');
  return (body.match(/\(/g)?.length ?? 0) > (body.match(/\)/g)?.length ?? 0) || /[-+x*/(=,]$/.test(body.trim());
};
const endsSentence = (s: string) => /[.:;?!)]$/.test(s.trim());

/** Joins hard-wrapped lines into items; keeps bullets, numbered items and formulas apart. */
function reflow(lines: string[], boldStepTitles: boolean): string[] {
  const out: string[] = [];
  let cur = '';
  let titleOnly = false; // cur is a bare "N. Step title" line awaiting its paragraph
  let inFormula = false;  // last emitted item is a formula still open for wrapped lines
  let formulaIndent = 0;
  const flush = () => { if (cur.trim()) out.push(cur.trim()); cur = ''; titleOnly = false; };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const t = line.trim();
    if (!t) {
      inFormula = false;
      // A page break or blank line splits a sentence: keep joining if it is unfinished.
      if (titleOnly) { cur = cur.replace(/^(\d+\.\s+)(.+)$/, '$1**$2:**'); titleOnly = false; continue; }
      if (cur && endsSentence(cur)) flush();
      continue;
    }
    // Formulas: deeply indented, or right after a sentence announcing one ("…the formula:").
    // A formula wraps onto lines indented deeper than itself, or while it is visibly
    // unfinished; an example at the same indent ("For example, …") is ordinary text.
    if (inFormula && (indentOf(line) > formulaIndent || unfinished(out[out.length - 1]))) {
      out[out.length - 1] = out[out.length - 1].slice(0, -1) + ' ' + t + '`'; // wrapped formula
      continue;
    }
    inFormula = false;
    if (!/^(●|○|For example)/.test(t) && (isFormula(line) || (t.includes(' = ') && /:$/.test(cur || out.at(-1) || '')))) {
      flush(); out.push('`' + t + '`'); inFormula = true; formulaIndent = indentOf(line); continue;
    }
    if (/^\s{10,}\//.test(line) && out.at(-1)?.startsWith('`')) {
      out[out.length - 1] = out[out.length - 1].slice(0, -1) + ' ' + t + '`'; // formula resumed after a page break
      continue;
    }
    if (/^●/.test(t) || /^\d+\.\s/.test(t)) {
      flush(); cur = t;
      titleOnly = boldStepTitles && /^\d+\.\s/.test(t) && !t.includes(':') && !endsSentence(t);
      continue;
    }
    titleOnly = false;
    cur = cur ? `${cur} ${t}` : t;
  }
  flush();
  return out.map((item) => {
    const bullet = item.match(/^●\s*(.*)$/s);
    const body = bullet ? bullet[1] : item;
    if (/^\d+\.\s+\*\*/.test(item)) return item; // step title already bolded by reflow
    const titled = body.match(/^(\d+\.\s+)?([^:]{3,80}):\s+(.*)$/s);
    if (bullet) return titled ? `- **${titled[2]}:** ${titled[3]}` : `- ${body}`;
    if (/^\d+\.\s/.test(item)) return titled ? `${titled[1]}**${titled[2]}:** ${titled[3]}` : item;
    return item;
  });
}

mkdirSync(OUT_DIR, { recursive: true });
const files = readdirSync(srcDir).filter((f) => /^\d{2} - .*\.md$/.test(f)).sort();

for (const file of files) {
  // Some guides carry zero-width spaces after bullets and list numbers ("1.\u200b ").
  const text = readFileSync(join(srcDir, file), 'utf8').replace(/\r\n/g, '\n').replace(/\u200b/g, '');
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  const categorie = fm?.[1].match(/categorie:\s*"([A-Z])\.\s*(.+)"/);
  if (!categorie) throw new Error(`${file}: missing categorie in frontmatter`);
  const [, partLetter, partLabel] = categorie;
  const body = text.slice(fm![0].length).split('\n');

  const h1 = body.find((l) => l.startsWith('# '))!;
  const [, num, h1Title] = h1.match(/^#\s+(\d+)\.\s+(.+)$/)!;
  let title = h1Title;

  const sections: { heading: string; lines: string[] }[] = [];
  const preamble: string[] = [];
  // Some guides omit the "Goal" heading: text between the title and the first section is the goal.
  const open = (heading: string) => {
    const text = preamble.map((l) => l.trim()).filter(Boolean);
    if (sections.length === 0 && text.length) {
      // Before a "Goal" heading the preamble is the wrapped end of the title ("… Analysis");
      // without one, it is the goal paragraph itself.
      if (heading === SECTIONS[0][1]) title = `${title} ${text.join(' ')}`;
      else sections.push({ heading: SECTIONS[0][1], lines: preamble });
    }
    sections.push({ heading, lines: [] });
  };
  for (const line of body.slice(body.indexOf(h1) + 1)) {
    if (isNoise(line)) continue;
    // Most guides put the step-by-step heading on a plain line, not a ### heading.
    if (STEP_HEADING.test(line)) { open('## 🪜 Step-by-step'); continue; }
    const h = line.match(/^###\s+(.+)$/);
    if (h && /^[A-Z]/.test(h[1])) {
      const mapped = SECTIONS.find(([re]) => re.test(h[1]));
      if (!mapped) throw new Error(`${file}: unknown section "${h[1]}"`);
      open(mapped[1]);
      continue;
    }
    // A lowercase "### …" is a wrapped sentence the extractor mistook for a heading.
    (sections.at(-1)?.lines ?? preamble).push(h ? h[1] : line);
  }
  if (sections.length !== SECTIONS.length) throw new Error(`${file}: expected 6 sections, got ${sections.length}`);

  const out = [
    '---', 'tags:', `  - ${tag}`, `  - part/${partLetter}`, '---',
    `# ${Number(num)} · ${title}`, '',
    `> **Part:** [[${partLetter} - ${partLabel}]]  ·  **Index:** [[${indexTitle}]]`, '',
    ...sections.flatMap((s) => [s.heading, ...reflow(s.lines, s.heading.includes('Step-by-step')), '', '']),
  ].join('\n').replace(/\n{3,}$/, '\n');
  writeFileSync(join(OUT_DIR, file), out);
}
console.log(`✓ Imported ${files.length} analyses into data/analysis-library/${archetype}/`);
