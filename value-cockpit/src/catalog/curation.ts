/** Applies an analyst-validated _curation.md table to the analysis frontmatters (docs/08). */

export interface CurationRow { num: string; part: string; quant: string[]; levers: string[]; causes: string[] }

const VCC_KEYS = ['kind', 'id', 'part', 'partLabel', 'quant', 'causes', 'levers'];

const cell = (c: string) => {
  const t = c.trim();
  return t === '—' || t === '' || t.startsWith('(') ? [] : t.split(',').map((x) => x.trim());
};

export function parseCurationTable(md: string): CurationRow[] {
  return [...md.matchAll(/^\| (\d{2}) \| ([A-Z]) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|/gm)]
    .map(([, num, part, q, l, c]) => ({ num, part, quant: cell(q), levers: cell(l), causes: cell(c) }));
}

export function applyFrontmatter(content: string, row: CurationRow, archetype: string): string {
  const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
  const partLine = content.match(/\*\*Part:\*\* \[\[([A-Z]) - (.+?)\]\]/);
  if (!fm || !partLine) throw new Error(`analysis ${row.num}: missing frontmatter or Part line`);
  if (partLine[1] !== row.part) throw new Error(`analysis ${row.num}: table part ${row.part} ≠ file part ${partLine[1]}`);
  const kept = fm[1].split('\n').filter((l) => !VCC_KEYS.some((k) => l.startsWith(`${k}:`)));
  const vcc = [
    'kind: analysis', `id: ${archetype}-${row.num}`, `part: ${row.part}`, `partLabel: ${partLine[2]}`,
    `quant: [${row.quant.join(', ')}]`, `causes: [${row.causes.join(', ')}]`, `levers: [${row.levers.join(', ')}]`,
  ];
  return `---\n${[...kept, ...vcc].join('\n')}\n---\n${content.slice(fm[0].length)}`;
}
