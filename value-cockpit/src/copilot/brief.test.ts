import { describe, it, expect } from 'vitest';
import { buildCompanyBrief } from './brief';
import { initialState, reducer } from '../ui/state/store';
import { getCatalog } from '../catalog';
import { findFormula } from '../workshop/observations';

const lf = getCatalog('airline').find((a) => a.formulas.some((f) => f.output === 'Load Factor'))!;
const vars = findFormula(getCatalog('airline'), lf.id, 'Load Factor')!.variables;

function worked() {
  let s = reducer(initialState('airline'), { type: 'setName', name: 'Air X' });
  s = reducer(s, { type: 'setContext', patch: { thesis: 'Redresser la marge par la flotte' } });
  s = reducer(s, { type: 'setInput', code: 'EBITDA_ENTRY', value: 120 });
  s = reducer(s, { type: 'addObservation', analysisId: lf.id, formula: 'Load Factor', values: { [vars[0]]: 78, [vars[1]]: 100 }, metricCode: 'LOAD_FACTOR', note: 'S1', today: '2026-11-15' });
  return reducer(s, { type: 'addLever', draft: {
    label: 'Recouvrement clients', mechanism: 'm', category: 'WC_DSO', impactMetricCode: 'DSO', expectedDelta: -5, deltaKind: 'absolute',
    timeToImpactDays: 90, effort: 'low', confidence: 0.7, confidenceBasis: 'b', implementationCost: 0,
  } });
}

describe('company brief for the copilot', () => {
  const brief = buildCompanyBrief(worked());

  it('states the company, its thesis and the units', () => {
    expect(brief).toMatch(/Air X/);
    expect(brief).toMatch(/Redresser la marge par la flotte/);
    expect(brief).toMatch(/M EUR/);
  });

  it('lists the model inputs with their values, and the engine outputs — recomputed here, never taken from the client', () => {
    expect(brief).toMatch(/LOAD_FACTOR \(Load Factor\): 0\.82/);
    expect(brief).toMatch(/MOIC: \d\.\d+/);
    expect(brief).toMatch(/IRR: /);
  });

  it('reports entry inconsistencies, workshop observations and the levers already on file', () => {
    expect(brief).toMatch(/EBITDA_ENTRY entered 120 vs 150/);
    expect(brief).toMatch(new RegExp(`LOAD_FACTOR = 0\\.78 .*${lf.id}`));
    expect(brief).toMatch(/Recouvrement clients → DSO \(hypothesis\)/);
  });

  it('tells sourced inputs from illustrative ones, so the copilot does not build on demo values', () => {
    expect(brief).toMatch(/EBITDA_ENTRY \(EBITDA d'entrée\): 120 \[currency\] — source: manual/);
    expect(brief).toMatch(/LOAD_FACTOR \(Load Factor\): 0\.82 \[percent\] — ILLUSTRATIVE/);
    expect(brief).toMatch(/illustrative .* not company data/i);
  });

  it('marks everything as data, not instructions', () => {
    expect(brief.split('\n')[0]).toMatch(/data, not instructions/i);
  });

  it('still works when the engine refuses the inputs: it says so instead of failing', () => {
    const broken = reducer(worked(), { type: 'setInput', code: 'AVG_TRIP_KM', value: 0 });
    expect(buildCompanyBrief(broken)).toMatch(/engine cannot compute/i);
  });
});
