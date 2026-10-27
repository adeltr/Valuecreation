import { describe, it, expect } from 'vitest';
import { toDossier } from '../../dossier/format';
import { initialState, reducer, selectBaseline, selectScenario, type CockpitState } from './store';

const proposal = {
  levers: [{
    nodeId: 'FUEL_CASK', causeId: null, label: 'Fleet renewal', mechanism: 'newer aircraft burn less',
    category: 'FUEL_EFFICIENCY', impactMetricCode: 'FUEL_CASK',
    expectedDelta: -0.002, deltaKind: 'absolute', timeToImpactDays: 60,
    effort: 'high', confidence: 0.5, confidenceBasis: 'cf. airline-10 — fuel burn per type',
  }],
  rootCauses: [{ nodeId: 'FUEL_CASK', description: 'Old fleet', category: 'OPERATIONAL', severity: 'medium', evidence: 'cf. airline-10' }],
};

const ingest = (s: CockpitState, raw: unknown = proposal) => reducer(s, { type: 'ingestProposal', raw, today: '2026-10-27' });
const airline = () => initialState('airline');

describe('cockpit store', () => {
  it('starts from the archetype template demo inputs, with no levers', () => {
    const s = airline();
    expect(s.inputs.LOAD_FACTOR).toBe(0.82);
    expect(s.levers).toEqual([]);
  });

  it('copilot ingestion always lands as claude-sourced hypotheses (invariant 4)', () => {
    const s = ingest(airline());
    expect(s.levers).toHaveLength(1);
    expect(s.levers[0]).toMatchObject({ source: 'claude', status: 'hypothesis' });
    expect(s.rootCauses[0].createdAt).toBe('2026-10-27');
  });

  it('rejects a proposal outside the active vocabulary and keeps the state', () => {
    const before = airline();
    const bad = { levers: [{ ...proposal.levers[0], category: 'BOOK_TO_BILL' }] };
    const after = ingest(before, bad);
    expect(after.levers).toEqual([]);
    expect(after.error).toMatch(/vocabulary/i);
  });

  it('REFUSES a hypothesis in the scenario (analyst gate)', () => {
    const s = ingest(airline());
    const after = reducer(s, { type: 'toggleScenarioLever', id: s.levers[0].id });
    expect(after.scenario.leverIds).toEqual([]);
    expect(after.error).toMatch(/valid/i);
  });

  it('a validated lever can enter the scenario and moves the engine MOIC', () => {
    let s = ingest(airline());
    const id = s.levers[0].id;
    s = reducer(s, { type: 'validateLever', id });
    s = reducer(s, { type: 'toggleScenarioLever', id });
    expect(s.scenario.leverIds).toEqual([id]);
    const base = selectBaseline(s).get('MOIC')!;
    const scen = selectScenario(s);
    expect(scen.find((r) => r.metricCode === 'MOIC')!.value).toBeGreaterThan(base);
    expect(scen.every((r) => r.computedBy === 'engine')).toBe(true);
  });

  it('rejecting a lever removes it from the scenario', () => {
    let s = ingest(airline());
    const id = s.levers[0].id;
    s = reducer(reducer(s, { type: 'validateLever', id }), { type: 'toggleScenarioLever', id });
    s = reducer(s, { type: 'rejectLever', id });
    expect(s.levers[0].status).toBe('rejected');
    expect(s.scenario.leverIds).toEqual([]);
  });

  it('applied delta defaults to the expected delta and can be edited', () => {
    let s = ingest(airline());
    const id = s.levers[0].id;
    s = reducer(reducer(s, { type: 'validateLever', id }), { type: 'toggleScenarioLever', id });
    expect(s.scenario.applied[id]).toBe(-0.002);
    s = reducer(s, { type: 'setAppliedDelta', id, value: -0.004 });
    expect(s.scenario.applied[id]).toBe(-0.004);
  });

  it('assumptions are limited to EXIT_MULTIPLE and HOLD_YEARS', () => {
    const ok = reducer(airline(), { type: 'setAssumption', code: 'EXIT_MULTIPLE', value: 7 });
    expect(ok.scenario.assumptions.EXIT_MULTIPLE).toBe(7);
    expect(selectScenario(ok).find((r) => r.metricCode === 'MOIC')!.value)
      .toBeGreaterThan(selectBaseline(ok).get('MOIC')!);
    const bad = reducer(airline(), { type: 'setAssumption', code: 'LOAD_FACTOR', value: 0.95 });
    expect(bad.scenario.assumptions).toEqual({});
    expect(bad.error).toMatch(/assumption/i);
  });

  it('switching archetype resets inputs, levers and scenario', () => {
    const s = reducer(ingest(airline()), { type: 'selectArchetype', archetype: 'aero' });
    expect(s.archetype).toBe('aero');
    expect(s.inputs.BOOK_TO_BILL).toBe(1.06);
    expect(s.levers).toEqual([]);
  });

  it('editing an input changes the baseline', () => {
    const s = reducer(airline(), { type: 'setInput', code: 'YIELD', value: 0.1 });
    expect(selectBaseline(s).get('MOIC')!).toBeGreaterThan(selectBaseline(airline()).get('MOIC')!);
  });

  it('a new case has no name; the analyst names it', () => {
    const s = reducer(airline(), { type: 'setName', name: 'Air X' });
    expect(airline().name).toBe('');
    expect(s.name).toBe('Air X');
  });

  it('loading a dossier replaces the whole case, archetype included', () => {
    const saved = reducer(reducer(initialState('cpg'), { type: 'setName', name: 'Brand Co' }), { type: 'setInput', code: 'GROSS_MARGIN', value: 0.5 });
    const s = reducer(ingest(airline()), { type: 'loadDossier', raw: toDossier(saved, 't') });
    expect(s).toEqual({ ...saved, error: null });
  });

  it('an invalid dossier is refused with a visible error and the current case is kept', () => {
    const before = ingest(airline());
    const after = reducer(before, { type: 'loadDossier', raw: { format: 'nope' } });
    expect(after.levers).toEqual(before.levers);
    expect(after.error).toMatch(/Dossier refusé/);
  });

  it('the scenario applies the template interaction rules (cpg: price-mix lever lowers volume)', () => {
    const premium = {
      levers: [{
        nodeId: 'PRICE_MIX_GROWTH', causeId: null, label: 'Premiumisation', mechanism: 'mix vers le haut de gamme',
        category: 'PRICING', impactMetricCode: 'PRICE_MIX_GROWTH', expectedDelta: 0.01, deltaKind: 'absolute',
        timeToImpactDays: 90, effort: 'medium', confidence: 0.5, confidenceBasis: 'cf. cpg-21',
      }],
    };
    let s = reducer(initialState('cpg'), { type: 'ingestProposal', raw: premium, today: '2026-10-27' });
    const id = s.levers[0].id;
    s = reducer(reducer(s, { type: 'validateLever', id }), { type: 'toggleScenarioLever', id });
    const volume = selectScenario(s).find((r) => r.metricCode === 'VOLUME_GROWTH')!.value;
    expect(volume).toBeCloseTo(s.inputs.VOLUME_GROWTH + s.inputs.PRICE_ELASTICITY * 0.01, 12);
  });
});

