import { describe, it, expect } from 'vitest';
import { initialState, reducer, type CockpitState } from './store';
import { toDossier, parseDossier, DOSSIER_FORMAT } from './dossier';

const proposal = {
  levers: [{
    nodeId: 'FUEL_CASK', causeId: null, label: 'Fleet renewal', mechanism: 'newer aircraft burn less',
    category: 'FUEL_EFFICIENCY', impactMetricCode: 'FUEL_CASK',
    expectedDelta: -0.002, deltaKind: 'absolute', timeToImpactDays: 60,
    effort: 'high', confidence: 0.5, confidenceBasis: 'cf. airline-10 — fuel burn per type',
  }],
  rootCauses: [{ nodeId: 'FUEL_CASK', description: 'Old fleet', category: 'OPERATIONAL', severity: 'medium', evidence: 'cf. airline-10' }],
};

/** An airline case worked by the analyst: edited input, validated lever in the scenario, assumption. */
function workedCase(): CockpitState {
  let s = initialState('airline');
  s = reducer(s, { type: 'setInput', code: 'LOAD_FACTOR', value: 0.8 });
  s = reducer(s, { type: 'ingestProposal', raw: proposal, today: '2026-10-27' });
  const id = s.levers[0].id;
  s = reducer(s, { type: 'validateLever', id });
  s = reducer(s, { type: 'toggleScenarioLever', id });
  s = reducer(s, { type: 'setAppliedDelta', id, value: -0.001 });
  return reducer(s, { type: 'setAssumption', code: 'EXIT_MULTIPLE', value: 7 });
}

const roundTrip = (s: CockpitState) => parseDossier(JSON.parse(JSON.stringify(toDossier(s, 'Air X', '2026-10-27T10:00:00Z'))));

describe('dossier file', () => {
  it('round-trips a worked case: inputs, levers, causes, scenario', () => {
    const s = workedCase();
    const back = roundTrip(s);
    expect(back.name).toBe('Air X');
    expect(back.state).toEqual({ ...s, error: null });
  });

  it('stores analyst inputs only — never an engine output (invariant 1)', () => {
    const file = toDossier(workedCase(), 'Air X', '2026-10-27T10:00:00Z');
    expect(file.format).toBe(DOSSIER_FORMAT);
    expect(Object.keys(file.inputs)).not.toContain('MOIC');
    expect(JSON.stringify(file)).not.toMatch(/computedBy|EBITDA_EXIT|MOIC/);
  });

  it('rejects a file that is not a dossier', () => {
    expect(() => parseDossier({ hello: 'world' })).toThrow(/dossier/i);
  });

  it('rejects an unknown archetype', () => {
    const file = { ...toDossier(workedCase(), 'Air X', 't'), archetype: 'telecom' };
    expect(() => parseDossier(file)).toThrow(/telecom/);
  });

  it('rejects inputs that do not match the template (no silent default)', () => {
    const file = toDossier(workedCase(), 'Air X', 't');
    const { LOAD_FACTOR: _missing, ...inputs } = file.inputs;
    expect(() => parseDossier({ ...file, inputs })).toThrow(/LOAD_FACTOR/);
    expect(() => parseDossier({ ...file, inputs: { ...file.inputs, MOIC: 3 } })).toThrow(/MOIC/);
  });

  it('rejects a lever outside the archetype vocabulary (invariant 3)', () => {
    const file = toDossier(workedCase(), 'Air X', 't');
    const levers = [{ ...file.levers[0], category: 'BOOK_TO_BILL' }];
    expect(() => parseDossier({ ...file, levers })).toThrow(/vocabulary/i);
  });

  it('rejects a lever without confidenceBasis (invariant 2)', () => {
    const file = toDossier(workedCase(), 'Air X', 't');
    const levers = [{ ...file.levers[0], confidenceBasis: '' }];
    expect(() => parseDossier({ ...file, levers })).toThrow(/confidenceBasis/);
  });

  it('rejects a scenario that references a non-validated lever (invariant 4)', () => {
    const file = toDossier(workedCase(), 'Air X', 't');
    const levers = [{ ...file.levers[0], status: 'hypothesis' }];
    expect(() => parseDossier({ ...file, levers })).toThrow(/valid/i);
  });

  it('rejects an assumption other than EXIT_MULTIPLE / HOLD_YEARS', () => {
    const file = toDossier(workedCase(), 'Air X', 't');
    expect(() => parseDossier({ ...file, scenario: { ...file.scenario, assumptions: { ENTRY_MULTIPLE: 5 } } })).toThrow(/ENTRY_MULTIPLE/);
  });

  it('never reuses an existing lever id after loading', () => {
    const file = toDossier(workedCase(), 'Air X', 't');
    const back = parseDossier({ ...file, nextId: 1 });
    const s = reducer(back.state, { type: 'ingestProposal', raw: proposal, today: '2026-10-28' });
    const ids = [...s.levers, ...s.rootCauses].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
