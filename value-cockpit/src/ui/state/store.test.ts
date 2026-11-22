import { describe, it, expect } from 'vitest';
import { toDossier } from '../../dossier/format';
import { getCatalog } from '../../catalog';
import { findFormula } from '../../workshop/observations';
import { reliability } from './provenance';
import { compareScenarios, sensitivityGrid } from './scenarios';
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
    s = reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' });
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
    s = reducer(reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id });
    s = reducer(s, { type: 'rejectLever', id, by: 'Léa', at: '2026-11-16' });
    expect(s.levers[0].status).toBe('rejected');
    expect(s.scenario.leverIds).toEqual([]);
  });

  it('applied delta defaults to the expected delta and can be edited', () => {
    let s = ingest(airline());
    const id = s.levers[0].id;
    s = reducer(reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id });
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
    s = reducer(reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id });
    const volume = selectScenario(s).find((r) => r.metricCode === 'VOLUME_GROWTH')!.value;
    expect(volume).toBeCloseTo(s.inputs.VOLUME_GROWTH + s.inputs.PRICE_ELASTICITY * 0.01, 12);
  });

  it('plan decisions merge per workstream; switching type clears them', () => {
    let s = reducer(airline(), { type: 'setPlanItem', id: 'f-kpi', patch: { owner: 'CFO' } });
    s = reducer(s, { type: 'setPlanItem', id: 'f-kpi', patch: { status: 'done' } });
    expect(s.plan).toEqual({ 'f-kpi': { owner: 'CFO', status: 'done' } });
    expect(reducer(s, { type: 'selectArchetype', archetype: 'cpg' }).plan).toEqual({});
  });

  it('a malformed proposal is refused with a readable message (field path, no raw JSON)', () => {
    const { nodeId: _n, ...noNode } = proposal.levers[0];
    const after = ingest(airline(), { levers: [noNode] });
    expect(after.error).toMatch(/levers\.0\.nodeId/);
    expect(after.error).not.toMatch(/\[\s*\{/);
  });

  describe('lever targets the model cannot compute', () => {
    const on = (code: string, category = 'FUEL_EFFICIENCY') => ({ levers: [{ ...proposal.levers[0], impactMetricCode: code, nodeId: code, category }] });

    it('refuses a lever on a metric the model computes (a lever acts on an input)', () => {
      const s = ingest(airline(), on('EBITDA_EXIT'));
      expect(s.levers).toEqual([]);
      expect(s.error).toMatch(/EBITDA_EXIT.*calcul/);
    });

    it('accepts a lever on a diagnostic metric as qualitative, but never simulates it', () => {
      let s = ingest(airline(), on('ON_TIME_PERFORMANCE', 'AIRPORT_GROUND_COST'));
      expect(s.levers).toHaveLength(1);
      const id = s.levers[0].id;
      s = reducer(reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id });
      expect(s.scenario.leverIds).toEqual([]);
      expect(s.error).toMatch(/qualitatif/);
      expect(() => selectScenario(s)).not.toThrow();
    });
  });

  it('the scenario runs with the cockpit options: horizon = holding period, lever costs hit the cash', () => {
    let s = ingest(airline());
    const id = s.levers[0].id;
    s = reducer(reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id });
    const moic = (x: CockpitState) => selectScenario(x).find((r) => r.metricCode === 'MOIC')!.value;
    const base = selectBaseline(s).get('MOIC')!;
    expect(moic(s)).toBeGreaterThan(base);
    const late = { ...s, levers: s.levers.map((l) => ({ ...l, timeToImpactDays: 10 * 365 })) };
    expect(moic(late)).toBeCloseTo(base, 12);
    const costly = { ...s, levers: s.levers.map((l) => ({ ...l, implementationCost: 30 })) };
    expect(moic(costly)).toBeLessThan(moic(s));
    expect(selectScenario(costly).find((r) => r.metricCode === 'PLAN_ONE_OFF_COSTS')!.value).toBe(30);
  });

  describe('levers written by the analyst', () => {
    const draft = {
      label: 'Recouvrement clients', mechanism: 'relances automatisées', category: 'WC_DSO', impactMetricCode: 'DSO',
      expectedDelta: -5, deltaKind: 'absolute' as const, timeToImpactDays: 90, effort: 'low' as const,
      confidence: 0.7, confidenceBasis: 'balance âgée analysée', implementationCost: 2,
    };
    const add = (s: CockpitState, d: object = draft) => reducer(s, { type: 'addLever', draft: d as typeof draft });

    it('adds an analyst lever as a hypothesis: the gate is the same for everyone (invariant 4)', () => {
      const s = add(airline());
      expect(s.levers[0]).toMatchObject({ ...draft, id: 'h1', source: 'analyst', status: 'hypothesis', nodeId: 'DSO', causeId: null });
      expect(s.nextId).toBe(2);
    });

    it('applies the same rules as the copilot: vocabulary, model inputs, confidence basis', () => {
      expect(add(airline(), { ...draft, category: 'BOOK_TO_BILL' }).error).toMatch(/Levier refusé.*category/);
      expect(add(airline(), { ...draft, impactMetricCode: 'EBITDA_EXIT' }).error).toMatch(/calculé/);
      expect(add(airline(), { ...draft, confidenceBasis: '' }).error).toMatch(/confidenceBasis/);
      expect(add(airline(), { ...draft, implementationCost: -1 }).error).toMatch(/implementationCost/);
      expect(add(airline(), { ...draft, label: '' }).levers).toEqual([]);
    });

    it('once validated it is simulated: 5 days of DSO are worth cash, the cost is deducted', () => {
      let s = add(airline());
      s = reducer(reducer(s, { type: 'validateLever', id: 'h1', by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id: 'h1' });
      const r = new Map(selectScenario(s).map((x) => [x.metricCode, x.value]));
      const base = selectBaseline(s);
      expect(r.get('CUMULATIVE_FCF')! - base.get('CUMULATIVE_FCF')!).toBeCloseTo(base.get('REVENUE_EXIT')! * 5 / 365 - 2, 8);
    });

    it('editing a lever re-validates it and keeps the scenario consistent', () => {
      let s = add(airline());
      s = reducer(reducer(s, { type: 'validateLever', id: 'h1', by: 'Léa', at: '2026-11-16' }), { type: 'toggleScenarioLever', id: 'h1' });
      s = reducer(s, { type: 'updateLever', id: 'h1', patch: { expectedDelta: -8, implementationCost: 0 } });
      expect(s.levers[0]).toMatchObject({ expectedDelta: -8, implementationCost: 0, status: 'validated' });
      expect(s.scenario.applied.h1).toBe(-8);
      const bad = reducer(s, { type: 'updateLever', id: 'h1', patch: { impactMetricCode: 'MOIC' } });
      expect(bad.error).toMatch(/calculé/);
      expect(bad.levers[0].impactMetricCode).toBe('DSO');
      const qualitative = reducer(s, { type: 'updateLever', id: 'h1', patch: { impactMetricCode: 'ON_TIME_PERFORMANCE' } });
      expect(qualitative.scenario.leverIds).toEqual([]);
    });
  });

  describe('audit trail of analyst decisions', () => {
    it('validating or rejecting a lever records who decided and when', () => {
      let s = ingest(airline());
      const id = s.levers[0].id;
      s = reducer(s, { type: 'validateLever', id, by: 'Léa Martin', at: '2026-11-16' });
      expect(s.levers[0]).toMatchObject({ status: 'validated', decision: { by: 'Léa Martin', at: '2026-11-16' } });
      s = reducer(s, { type: 'rejectLever', id, by: 'Tom', at: '2026-11-17' });
      expect(s.levers[0]).toMatchObject({ status: 'rejected', decision: { by: 'Tom', at: '2026-11-17' } });
    });

    it('refuses an anonymous decision: the gate needs a named analyst (invariant 4)', () => {
      const s = ingest(airline());
      const after = reducer(s, { type: 'validateLever', id: s.levers[0].id, by: '  ', at: '2026-11-16' });
      expect(after.levers[0].status).toBe('hypothesis');
      expect(after.error).toMatch(/nom d'analyste/);
    });

    it('a lever written by an analyst carries its author', () => {
      const s = reducer(airline(), { type: 'addLever', by: 'Léa Martin', draft: {
        label: 'l', mechanism: 'm', category: 'WC_DSO', impactMetricCode: 'DSO', expectedDelta: -5, deltaKind: 'absolute',
        timeToImpactDays: 90, effort: 'low', confidence: 0.7, confidenceBasis: 'b',
      } });
      expect(s.levers[0].createdBy).toBe('Léa Martin');
    });
  });

  describe('provenance of every input', () => {
    it('a new case holds illustrative values only: no input has a source yet', () => {
      expect(airline().provenance).toEqual({});
      expect(reliability(airline())).toMatchObject({ total: Object.keys(airline().inputs).length, sourced: 0 });
    });

    it('typing a value records who entered it, when, and an optional reference', () => {
      const s = reducer(airline(), { type: 'setInput', code: 'LOAD_FACTOR', value: 0.8, by: 'Léa', at: '2026-11-16' });
      expect(s.provenance.LOAD_FACTOR).toEqual({ source: 'manual', ref: '', by: 'Léa', at: '2026-11-16' });
      const noted = reducer(s, { type: 'setProvenanceRef', code: 'LOAD_FACTOR', ref: 'Rapport annuel 2025, p. 12' });
      expect(noted.provenance.LOAD_FACTOR.ref).toBe('Rapport annuel 2025, p. 12');
      expect(reliability(noted).sourced).toBe(1);
    });

    it('confirming a demo value as real marks it without changing it', () => {
      const s = reducer(airline(), { type: 'confirmInput', code: 'HOLD_YEARS', by: 'Léa', at: '2026-11-16' });
      expect(s.inputs.HOLD_YEARS).toBe(airline().inputs.HOLD_YEARS);
      expect(s.provenance.HOLD_YEARS.source).toBe('manual');
    });

    it('several inputs set from one source (file, public filing) carry that source', () => {
      const s = reducer(airline(), { type: 'setInputs', values: { EBITDA_ENTRY: 140, CAPEX: 70 }, source: 'import', ref: 'comptes-2025.csv', by: 'Léa', at: '2026-11-16' });
      expect(s.inputs).toMatchObject({ EBITDA_ENTRY: 140, CAPEX: 70 });
      expect(s.provenance.CAPEX).toEqual({ source: 'import', ref: 'comptes-2025.csv', by: 'Léa', at: '2026-11-16' });
      const bad = reducer(airline(), { type: 'setInputs', values: { MOIC: 3 }, source: 'import', ref: 'x', by: 'Léa', at: 'd' });
      expect(bad.error).toMatch(/MOIC/);
      expect(bad.inputs).toEqual(airline().inputs);
    });

    it('switching company type starts again from illustrative values', () => {
      const s = reducer(airline(), { type: 'setInput', code: 'LOAD_FACTOR', value: 0.8, by: 'Léa', at: 'd' });
      expect(reducer(s, { type: 'selectArchetype', archetype: 'cpg' }).provenance).toEqual({});
    });
  });

  describe('named scenarios and sensitivity', () => {
    const withLever = () => {
      let s = ingest(airline());
      const id = s.levers[0].id;
      s = reducer(s, { type: 'validateLever', id, by: 'Léa', at: '2026-11-16' });
      return reducer(s, { type: 'toggleScenarioLever', id });
    };
    const moicOf = (rows: { name: string; MOIC: number }[], name: string) => rows.find((r) => r.name === name)!.MOIC;

    it('saves the current scenario under a name, and compares the saved ones with the base case (engine)', () => {
      let s = reducer(withLever(), { type: 'saveScenario', name: 'Plan' });
      s = reducer(s, { type: 'setAssumption', code: 'EXIT_MULTIPLE', value: 5 });
      s = reducer(s, { type: 'saveScenario', name: 'Prudent' });
      expect(Object.keys(s.savedScenarios)).toEqual(['Plan', 'Prudent']);
      const rows = compareScenarios(s);
      expect(rows.map((r) => r.name)).toEqual(['Base (sans levier)', 'Plan', 'Prudent']);
      expect(moicOf(rows, 'Plan')).toBeGreaterThan(moicOf(rows, 'Base (sans levier)'));
      expect(moicOf(rows, 'Prudent')).toBeLessThan(moicOf(rows, 'Plan'));
      expect(rows[1].IRR).toBeCloseTo(rows[1].MOIC ** (1 / 5) - 1, 12);
    });

    it('loads a saved scenario back, replaces one saved under the same name, deletes one', () => {
      let s = reducer(withLever(), { type: 'saveScenario', name: 'Plan' });
      s = reducer(s, { type: 'toggleScenarioLever', id: s.levers[0].id });
      expect(s.scenario.leverIds).toEqual([]);
      s = reducer(s, { type: 'loadScenario', name: 'Plan' });
      expect(s.scenario.leverIds).toEqual([s.levers[0].id]);
      s = reducer(reducer(s, { type: 'setAssumption', code: 'EXIT_MULTIPLE', value: 7 }), { type: 'saveScenario', name: 'Plan' });
      expect(s.savedScenarios.Plan.assumptions.EXIT_MULTIPLE).toBe(7);
      expect(reducer(s, { type: 'deleteScenario', name: 'Plan' }).savedScenarios).toEqual({});
      expect(reducer(s, { type: 'saveScenario', name: '  ' }).error).toMatch(/nom/i);
    });

    it('a saved scenario drops a lever that was rejected or became qualitative since (analyst gate holds)', () => {
      let s = reducer(withLever(), { type: 'saveScenario', name: 'Plan' });
      s = reducer(s, { type: 'rejectLever', id: s.levers[0].id, by: 'Léa', at: 'd' });
      expect(s.savedScenarios.Plan.leverIds).toEqual([]);
      expect(() => compareScenarios(s)).not.toThrow();
    });

    it('sensitivity: MOIC of the current scenario across exit multiples and holding periods', () => {
      const g = sensitivityGrid(withLever());
      expect(g.multiples).toEqual([4, 5, 6, 7, 8]);
      expect(g.years).toEqual([4, 5, 6]);
      expect(g.moic[2][1]!).toBeCloseTo(selectScenario(withLever()).find((r) => r.metricCode === 'MOIC')!.value, 12);
      expect(g.moic[4][1]!).toBeGreaterThan(g.moic[0][1]!);
      expect(g.moic.flat().every((v) => v === null || Number.isFinite(v))).toBe(true);
    });
  });

  describe('workshop observations', () => {
    const lf = getCatalog('airline').find((a) => a.formulas.some((f) => f.output === 'Load Factor'))!;
    const vars = findFormula(getCatalog('airline'), lf.id, 'Load Factor')!.variables;
    const add = (s: CockpitState, values: Record<string, number>, metricCode: string | null = 'LOAD_FACTOR') =>
      reducer(s, { type: 'addObservation', analysisId: lf.id, formula: 'Load Factor', values, metricCode, note: 'données S1', today: '2026-10-27' });
    const good = { [vars[0]]: 78, [vars[1]]: 100 };

    it('records the analyst data (never the result) with an id', () => {
      const s = add(airline(), good);
      expect(s.observations).toEqual([{ id: 'o1', analysisId: lf.id, formula: 'Load Factor', values: good, metricCode: 'LOAD_FACTOR', date: '2026-10-27', note: 'données S1', applied: false }]);
      expect(s.nextId).toBe(2);
    });

    it('refuses missing data, a result the engine cannot compute, or a metric outside the vocabulary', () => {
      expect(add(airline(), { [vars[0]]: 78 }).error).toMatch(/manquante/);
      expect(add(airline(), { [vars[0]]: 78, [vars[1]]: 0 }).error).toMatch(/finite/);
      expect(add(airline(), good, 'BOOK_TO_BILL').error).toMatch(/BOOK_TO_BILL/);
    });

    it('applying an observation sets the company input in the metric unit (78 % → 0.78)', () => {
      let s = add(airline(), good);
      s = reducer(s, { type: 'applyObservation', id: 'o1' });
      expect(s.inputs.LOAD_FACTOR).toBeCloseTo(0.78, 12);
      expect(s.observations[0].applied).toBe(true);
      expect(s.provenance.LOAD_FACTOR).toMatchObject({ source: 'observation', ref: `${lf.id} — Load Factor` });
    });

    it('an observation of a metric that is not a model input cannot be applied', () => {
      const s = reducer(add(airline(), good, 'MARKET_SHARE'), { type: 'applyObservation', id: 'o1' });
      expect(s.error).toMatch(/input/);
      expect(s.observations[0].applied).toBe(false);
    });

    it('removes an observation', () => {
      expect(reducer(add(airline(), good), { type: 'removeObservation', id: 'o1' }).observations).toEqual([]);
    });
  });
});

