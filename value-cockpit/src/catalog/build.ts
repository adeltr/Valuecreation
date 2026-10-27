import type { AnalysisRef } from './types';
import { dataRequired, goalSentence, improveTitles } from './markdown';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';

export interface SourceFile { path: string; content: string }

// Minimal inline YAML parser: handles only the flat VCC fields (`key: value`,
// `key: [a, b]`). The Obsidian tags block (indented list) is ignored.
function extractFrontmatter(content: string): Record<string, string | string[]> | null {
  const match = content.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const result: Record<string, string | string[]> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const val = m[2].trim();
    result[m[1]] = val.startsWith('[') && val.endsWith(']')
      ? val.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean)
      : val;
  }
  return result;
}

function extractTitle(content: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/^\d+\s*·\s*/, '').trim() : '(untitled)';
}

const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : []);

/**
 * Parses curated frontmatters into AnalysisRef[] and collects every referential
 * integrity violation against the archetype's active vocabulary.
 * Files without `kind: analysis` (not curated yet) and `_`-prefixed files are skipped.
 */
export function buildCatalog(archetype: SectorArchetype, files: SourceFile[]): { entries: AnalysisRef[]; errors: string[] } {
  const vocab = getActiveVocabulary(archetype);
  const entries: AnalysisRef[] = [];
  const errors: string[] = [];

  for (const { path, content } of files) {
    if (path.split('/').pop()!.startsWith('_')) continue;
    const fm = extractFrontmatter(content);
    if (!fm || fm.kind !== 'analysis') continue;

    const id = String(fm.id ?? '');
    const entry: AnalysisRef = {
      id, archetype,
      title: extractTitle(content),
      part: String(fm.part ?? ''),
      partLabel: String(fm.partLabel ?? ''),
      relatedMetricCodes: list(fm.quant),
      relatedCauseCategories: list(fm.causes),
      relatedLeverCategories: list(fm.levers),
      sourcePath: path,
      goal: goalSentence(content), dataRequired: dataRequired(content), improve: improveTitles(content),
    };

    if (!new RegExp(`^${archetype}-\\d{2}$`).test(id)) errors.push(`${path}: id "${id}" is not ${archetype}-NN`);
    if (!/^[A-Z]$/.test(entry.part)) errors.push(`${id}: part "${entry.part}" is not a single letter`);
    if (!entry.partLabel) errors.push(`${id}: partLabel is required`);
    for (const c of entry.relatedMetricCodes) if (!vocab.isMetricCode(c)) errors.push(`${id}: metric "${c}" not in ${archetype} vocabulary`);
    for (const c of entry.relatedCauseCategories) if (!vocab.isCauseCategory(c)) errors.push(`${id}: cause "${c}" not in ${archetype} vocabulary`);
    for (const c of entry.relatedLeverCategories) if (!vocab.isLeverCategory(c)) errors.push(`${id}: lever "${c}" not in ${archetype} vocabulary`);
    if (entries.some((e) => e.id === id)) errors.push(`${id}: duplicate id`);
    entries.push(entry);
  }
  return { entries, errors };
}
