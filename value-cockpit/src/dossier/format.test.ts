import { describe, it, expect } from 'vitest';
import { initialState, reducer, type CockpitState } from '../ui/state/store';
import { toDossier, parseDossier, DOSSIER_FORMAT } from './format';

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
  s = reducer(s, { type: 'setName', name: 'Air X' });
  s = reducer(s, { type: 'setInput', code: 'LOAD_FACTOR', value: 0.8 });
  s = reducer(s, { type: 'ingestProposal', raw: proposal, today: '2026-10-27' });
  const id = s.levers[0].id;
  s = reducer(s, { type: 'validateLever', id });
  s = reducer(s, { type: 'toggleScenarioLever', id });
  s = reducer(s, { type: 'setAppliedDelta', id, value: -0.001 });
  s = reducer(s, { type: 'setAssumption', code: 'EXIT_MULTIPLE', value: 7 });
  s = reducer(s, { type: 'setPlanItem', id, patch: { owner: 'COO', status: 'in_progress' } });
  return reducer(s, { type: 'setPlanItem', id: 'f-governance', patch: { owner: 'CFO', note: 'PMO interne' } });
}

const roundTrip = (s: CockpitState) => parseDossier(JSON.parse(JSON.stringify(toDossier(s, '2026-10-27T10:00:00Z'))));

describe('dossier file', () => {
  it('round-trips a worked case: inputs, levers, causes, scenario', () => {
    const s = workedCase();
    const { error: _error, ...content } = s;
    const back = roundTrip(s);
    expect(back).toEqual(content);
    expect(back.name).toBe('Air X');
  });

  it('stores analyst inputs only — never an engine output (invariant 1)', () => {
    const file = toDossier(workedCase(), '2026-10-27T10:00:00Z');
    expect(file.format).toBe(DOSSIER_FORMAT);
    expect(Object.keys(file.inputs)).not.toContain('MOIC');
    expect(JSON.stringify(file)).not.toMatch(/computedBy|EBITDA_EXIT|MOIC/);
  });

  it('a dossier needs a name', () => {
    expect(() => toDossier(initialState('airline'), 't')).toThrow(/nom/i);
  });

  it('rejects a file that is not a dossier', () => {
    expect(() => parseDossier({ hello: 'world' })).toThrow(/dossier/i);
  });

  it('rejects an unknown archetype', () => {
    const file = { ...toDossier(workedCase(), 't'), archetype: 'telecom' };
    expect(() => parseDossier(file)).toThrow(/telecom/);
  });

  it('rejects inputs that do not match the template (no silent default)', () => {
    const file = toDossier(workedCase(), 't');
    const { LOAD_FACTOR: _missing, ...inputs } = file.inputs;
    expect(() => parseDossier({ ...file, inputs })).toThrow(/LOAD_FACTOR/);
    expect(() => parseDossier({ ...file, inputs: { ...file.inputs, MOIC: 3 } })).toThrow(/MOIC/);
  });

  it('rejects a lever outside the archetype vocabulary (invariant 3)', () => {
    const file = toDossier(workedCase(), 't');
    const levers = [{ ...file.levers[0], category: 'BOOK_TO_BILL' }];
    expect(() => parseDossier({ ...file, levers })).toThrow(/vocabulary/i);
  });

  it('rejects a lever without confidenceBasis (invariant 2)', () => {
    const file = toDossier(workedCase(), 't');
    const levers = [{ ...file.levers[0], confidenceBasis: '' }];
    expect(() => parseDossier({ ...file, levers })).toThrow(/confidenceBasis/);
  });

  it('rejects a scenario that references a non-validated lever (invariant 4)', () => {
    const file = toDossier(workedCase(), 't');
    const levers = [{ ...file.levers[0], status: 'hypothesis' }];
    expect(() => parseDossier({ ...file, levers })).toThrow(/valid/i);
  });

  it('rejects an assumption other than EXIT_MULTIPLE / HOLD_YEARS', () => {
    const file = toDossier(workedCase(), 't');
    expect(() => parseDossier({ ...file, scenario: { ...file.scenario, assumptions: { ENTRY_MULTIPLE: 5 } } })).toThrow(/ENTRY_MULTIPLE/);
  });

  it('never reuses an existing lever id after loading', () => {
    const file = toDossier(workedCase(), 't');
    const back = parseDossier({ ...file, nextId: 1 });
    const s = reducer({ ...back, error: null }, { type: 'ingestProposal', raw: proposal, today: '2026-10-28' });
    const ids = [...s.levers, ...s.rootCauses].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('stores the 100-day plan decisions of the analyst (owner, status, note)', () => {
    const back = roundTrip(workedCase());
    expect(back.plan).toEqual({ h1: { owner: 'COO', status: 'in_progress' }, 'f-governance': { owner: 'CFO', note: 'PMO interne' } });
  });

  it('opens a version-1 dossier (before the plan) with an empty plan', () => {
    const { plan: _plan, ...v1 } = toDossier(workedCase(), 't');
    expect(parseDossier({ ...v1, version: 1 }).plan).toEqual({});
  });

  it('rejects a plan entry for an unknown workstream or with an unknown status', () => {
    const file = toDossier(workedCase(), 't');
    expect(() => parseDossier({ ...file, plan: { h99: { owner: 'x' } } })).toThrow(/h99/);
    expect(() => parseDossier({ ...file, plan: { h1: { status: 'finished' } } })).toThrow(/status/);
  });
});

