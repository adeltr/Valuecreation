import { describe, it, expect } from 'vitest';
import { parseCurationTable, applyFrontmatter, addTerm } from './curation';

const table = `# Curation
| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | REVENUE_GROWTH, EBITDA_MARGIN | VOLUME | COMMERCIAL, MARKET | VOLUME←expand |
| 02 | B | — | (cargo : à trancher) | REGULATORY | |
| 1x | A | ignored | x | y | |
`;

const file = `---
tags:
  - cpg
  - part/A
---
# 1 · Brand Portfolio Analysis

> **Part:** [[A - Marketing]]  ·  **Index:** [[How to Analyze a Consumer Packaged Goods Company]]
body
`;

describe('parseCurationTable', () => {
  it('reads numbered rows (5 or 6 columns), "—" and "(…)" cells are empty', () => {
    expect(parseCurationTable(table)).toEqual([
      { num: '01', part: 'A', quant: ['REVENUE_GROWTH', 'EBITDA_MARGIN'], levers: ['VOLUME'], causes: ['COMMERCIAL', 'MARKET'] },
      { num: '02', part: 'B', quant: [], levers: [], causes: ['REGULATORY'] },
    ]);
  });
});

describe('applyFrontmatter', () => {
  const row = parseCurationTable(table)[0];

  it('adds the VCC fields next to the Obsidian tags, part label read from the Part line', () => {
    const out = applyFrontmatter(file, row, 'cpg');
    expect(out).toContain('kind: analysis\nid: cpg-01\npart: A\npartLabel: Marketing\nquant: [REVENUE_GROWTH, EBITDA_MARGIN]\ncauses: [COMMERCIAL, MARKET]\nlevers: [VOLUME]\n---\n# 1 · Brand');
    expect(out).toContain('  - part/A');
  });

  it('is idempotent and replaces a previous mapping', () => {
    const once = applyFrontmatter(file, row, 'cpg');
    expect(applyFrontmatter(once, row, 'cpg')).toBe(once);
    const changed = applyFrontmatter(once, { ...row, levers: ['PRICING'] }, 'cpg');
    expect(changed.match(/^levers:/gm)).toHaveLength(1);
    expect(changed).toContain('levers: [PRICING]');
  });

  it('refuses a row whose part disagrees with the file', () => {
    expect(() => applyFrontmatter(file, { ...row, part: 'C' }, 'cpg')).toThrow(/part/i);
  });
});

describe('addTerm', () => {
  it('adds a term to a column of the given rows, once, keeping the other cells', () => {
    let md = addTerm(table, 'quant', 'GROSS_MARGIN', [1, 2]);
    md = addTerm(md, 'quant', 'GROSS_MARGIN', [1]);
    md = addTerm(md, 'causes', 'RETAILER_POWER', [2]);
    expect(parseCurationTable(md)).toEqual([
      { num: '01', part: 'A', quant: ['REVENUE_GROWTH', 'EBITDA_MARGIN', 'GROSS_MARGIN'], levers: ['VOLUME'], causes: ['COMMERCIAL', 'MARKET'] },
      { num: '02', part: 'B', quant: ['GROSS_MARGIN'], levers: [], causes: ['REGULATORY', 'RETAILER_POWER'] },
    ]);
    expect(md).toContain('VOLUME←expand');
  });
  it('fails loudly on a missing row', () => {
    expect(() => addTerm(table, 'quant', 'X', [7])).toThrow(/row 07/);
  });
});
