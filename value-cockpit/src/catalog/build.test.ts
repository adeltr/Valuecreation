import { describe, it, expect } from 'vitest';
import { buildCatalog } from './build';

const file = (name: string, fm: string) => ({
  path: `data/analysis-library/airline/${name}`,
  content: `---\ntags:\n  - airline\n  - part/C\n${fm}---\n# 13 · Load Factor and Capacity Management Analysis\n\nbody\n`,
});

const good = `kind: analysis
id: airline-13
part: C
partLabel: Operational Efficiency
quant: [LOAD_FACTOR, ASK]
causes: [MARKET]
levers: [NETWORK_OPTIMIZATION, REVENUE_MANAGEMENT]
`;

describe('buildCatalog', () => {
  it('parses a VCC frontmatter next to the Obsidian tags block', () => {
    const { entries, errors } = buildCatalog('airline', [file('13 - x.md', good)]);
    expect(errors).toEqual([]);
    expect(entries).toEqual([{
      id: 'airline-13', archetype: 'airline',
      title: 'Load Factor and Capacity Management Analysis',
      part: 'C', partLabel: 'Operational Efficiency',
      relatedMetricCodes: ['LOAD_FACTOR', 'ASK'],
      relatedCauseCategories: ['MARKET'],
      relatedLeverCategories: ['NETWORK_OPTIMIZATION', 'REVENUE_MANAGEMENT'],
      sourcePath: 'data/analysis-library/airline/13 - x.md',
      goal: '', dataRequired: [], improve: [], formulas: [],
    }]);
  });

  it('keeps the analysis text an analyst needs: goal, data required, steps to improve (never values)', () => {
    const body = [
      '## 🎯 Goal', 'The goal is to compare fuel burn per aircraft type. It supports fleet decisions.', '',
      '## 📊 Data required', '- Fuel consumption per aircraft type', '- RPK and ASK per type', '',
      '## 🪜 Step-by-step', '1. **Gather data:** collect it.', '',
      '## 🚀 Steps to improve', '1. **Optimize Fleet Allocation by Route:** assign efficient aircraft.', '2. **Invest in Fuel-Efficient Aircraft:** renew.',
    ].join('\n');
    const f = file('13 - x.md', good);
    const { entries } = buildCatalog('airline', [{ ...f, content: f.content.replace('body', body) }]);
    expect(entries[0].goal).toBe('The goal is to compare fuel burn per aircraft type.');
    expect(entries[0].dataRequired).toEqual(['Fuel consumption per aircraft type', 'RPK and ASK per type']);
    expect(entries[0].improve).toEqual(['Optimize Fleet Allocation by Route', 'Invest in Fuel-Efficient Aircraft']);
  });

  it('carries the computable formulas of the protocol (structure only)', () => {
    const body = ['## 🪜 Step-by-step', '1. **Load factor:** Use:', '`Load Factor = (RPK / ASK) x 100`'].join('\n');
    const f = file('13 - x.md', good);
    const { entries } = buildCatalog('airline', [{ ...f, content: f.content.replace('body', body) }]);
    expect(entries[0].formulas).toEqual([{
      output: 'Load Factor', variables: ['RPK', 'ASK'], expression: '( v0 / v1 ) * 100', percentOutput: true,
      source: 'Load Factor = (RPK / ASK) x 100', step: 'Load factor',
    }]);
  });

  it('skips files without kind: analysis (not curated yet) and curation tables', () => {
    const { entries, errors } = buildCatalog('airline', [file('13 - x.md', ''), file('_curation.md', good)]);
    expect(entries).toEqual([]);
    expect(errors).toEqual([]);
  });

  it('accepts empty lists', () => {
    const { entries, errors } = buildCatalog('airline', [file('13 - x.md', good.replace('[LOAD_FACTOR, ASK]', '[]'))]);
    expect(errors).toEqual([]);
    expect(entries[0].relatedMetricCodes).toEqual([]);
  });

  it('reports references outside the archetype vocabulary (aero term in airline)', () => {
    const { errors } = buildCatalog('airline', [file('13 - x.md', good.replace('ASK]', 'BOOK_TO_BILL]'))]);
    expect(errors.join()).toMatch(/airline-13.*BOOK_TO_BILL/);
  });

  it('reports an id that is not <archetype>-NN, a missing partLabel, and duplicate ids', () => {
    expect(buildCatalog('airline', [file('a.md', good.replace('airline-13', 'aero-13'))]).errors.join()).toMatch(/id/);
    expect(buildCatalog('airline', [file('a.md', good.replace('partLabel: Operational Efficiency\n', ''))]).errors.join()).toMatch(/partLabel/);
    expect(buildCatalog('airline', [file('a.md', good), file('b.md', good)]).errors.join()).toMatch(/duplicate/i);
  });
});
