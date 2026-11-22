import { describe, it, expect } from 'vitest';
import { describeMetric, humanize } from './labels';
import { BASE_METRIC_CODES } from './base';
import { BRIDGE_FAMILIES, FAMILY_VOCAB } from './families';
import { SECTOR_ARCHETYPES, getActiveVocabulary } from './registry';
import { TEMPLATES } from '../templates';

describe('metric labels and definitions', () => {
  it('the backbone of the model (base, bridge and family codes) has a French label and a definition', () => {
    const backbone = [...BASE_METRIC_CODES, ...BRIDGE_FAMILIES.flatMap((f) => FAMILY_VOCAB[f].codes)];
    for (const code of backbone) {
      const d = describeMetric(code);
      expect(d.source, code).toBe('cockpit');
      expect(d.label, code).not.toBe(humanize(code));
      expect(d.definition!.length, code).toBeGreaterThan(15);
    }
  });

  it('a sector KPI found in the Umbrex glossaries carries its definition, with the source', () => {
    const d = describeMetric('LOAD_FACTOR', 'airline');
    expect(d).toMatchObject({ label: 'Load Factor', source: 'umbrex' });
    expect(d.definition).toMatch(/seating capacity/);
    expect(describeMetric('LOAD_FACTOR').source).toBeNull(); // never the glossary of another sector
  });

  it('every factor of every company model is explained: a definition the analyst can read in the bubble', () => {
    for (const [a, t] of Object.entries(TEMPLATES)) {
      for (const m of t!.instantiate('x', t!.demoInputs)) {
        const d = describeMetric(m.code, a);
        expect(d.definition?.length ?? 0, `${a} ${m.code}`).toBeGreaterThan(15);
        expect(d.label, `${a} ${m.code}`).not.toBe('');
      }
    }
    expect(describeMetric('CASK_EX_FUEL', 'airline')).toMatchObject({ label: 'Coût par siège-km hors carburant', source: 'cockpit' });
  });

  it('any other code falls back to a readable name, without inventing a definition', () => {
    expect(describeMetric('SOME_UNKNOWN_CODE', 'airline')).toEqual({ label: 'Some unknown code', definition: null, source: null });
    expect(humanize('WC_DSO')).toBe('Wc dso');
  });

  it('every metric of every vocabulary gets a non-empty label', () => {
    for (const a of SECTOR_ARCHETYPES) for (const c of getActiveVocabulary(a).metricCodes) expect(describeMetric(c, a).label, c).toBeTruthy();
  });
});
