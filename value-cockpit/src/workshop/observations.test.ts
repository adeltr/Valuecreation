import { describe, it, expect } from 'vitest';
import { observationValue, toMetricValue, suggestMetrics, findFormula, type Observation } from './observations';
import { getCatalog } from '../catalog';
import { TEMPLATES } from '../templates';

const catalog = getCatalog('airline');
const lfAnalysis = catalog.find((a) => a.formulas.some((f) => f.output === 'Load Factor'))!;
const obs = (over: Partial<Observation> = {}): Observation => ({
  id: 'o1', analysisId: lfAnalysis.id, formula: 'Load Factor',
  values: Object.fromEntries(findFormula(catalog, lfAnalysis.id, 'Load Factor')!.variables.map((v, i) => [v, i === 0 ? 78 : 100])),
  metricCode: 'LOAD_FACTOR', date: '2026-10-27', note: '', applied: false, ...over,
});

describe('observations (workshop results)', () => {
  it('the value is always recomputed by the engine from the analyst data', () => {
    expect(observationValue(obs(), catalog)).toBeCloseTo(78, 12);
  });

  it('a percentage protocol (× 100) feeding a percent metric is converted to a fraction', () => {
    expect(toMetricValue(obs(), catalog, 'percent')).toBeCloseTo(0.78, 12);
    expect(toMetricValue(obs(), catalog, 'ratio')).toBeCloseTo(78, 12);
  });

  it('suggests the ontology metrics an observation can measure: name match first', () => {
    const f = findFormula(catalog, lfAnalysis.id, 'Load Factor')!;
    const inputs = Object.keys(TEMPLATES.airline!.demoInputs);
    expect(suggestMetrics(lfAnalysis, f, inputs)[0]).toBe('LOAD_FACTOR');
  });

  it('fails loudly on an unknown analysis or formula', () => {
    expect(() => observationValue(obs({ analysisId: 'airline-99' }), catalog)).toThrow(/airline-99/);
    expect(() => observationValue(obs({ formula: 'Nope' }), catalog)).toThrow(/Nope/);
  });
});
