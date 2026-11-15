import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, handleProposal } from './proxy';
import { toDossier } from '../dossier/format';
import { initialState, reducer } from '../ui/state/store';

describe('proxy', () => {
  it('system prompt injects the ACTIVE vocabulary for the archetype', () => {
    const saas = buildSystemPrompt('saas');
    expect(saas).toMatch(/RETENTION/);
    expect(saas).toMatch(/GROSS_CHURN/);
    expect(saas).toMatch(/confidenceBasis/);
    expect(buildSystemPrompt('generic')).not.toMatch(/RETENTION/);
  });
  it('handleProposal sanitizes a model reply against the archetype vocabulary', async () => {
    const fakeCall = async () => JSON.stringify({
      levers: [], rootCauses: [], scenarioResults: [{ metricCode: 'MOIC', value: 9 }],
    });
    const out = await handleProposal('saas', 'analyse', fakeCall);
    expect((out as any).scenarioResults).toBeUndefined();
  });
});

describe('proxy – lever targets in prompt', () => {
  it('does not offer deal-structure codes as impactMetricCode', () => {
    const line = buildSystemPrompt('aero').split('\n').find((l) => l.startsWith('impactMetricCode'))!;
    expect(line).toMatch(/COST_OVERRUN_RATE/);
    expect(line).not.toMatch(/EXIT_MULTIPLE|ENTRY_MULTIPLE|HOLD_YEARS|NET_DEBT_ENTRY/);
  });
});

describe('proxy – archetype guard', () => {
  it('handleProposal rejects an unknown archetype instead of falling back to generic', async () => {
    const fakeCall = async () => '{}';
    await expect(handleProposal('aviation' as never, 'x', fakeCall)).rejects.toThrow(/unknown archetype/i);
  });
});

describe('proxy – analysis catalog in prompt (docs/07)', () => {
  it('injects the archetype catalog (ids + titles) and asks to cite ids in evidence', () => {
    const p = buildSystemPrompt('airline');
    expect(p).toMatch(/airline-13: Load Factor and Capacity Management Analysis/);
    expect(p).toMatch(/evidence/i);
  });
  it('injects no catalog for an archetype without one', () => {
    expect(buildSystemPrompt('saas')).not.toMatch(/airline-13|aero-/);
  });
});

describe('proxy – model inputs vs diagnostics', () => {
  it('the prompt separates the inputs the engine quantifies from diagnostic metrics', () => {
    const lines = buildSystemPrompt('airline').split('\n');
    const quantified = lines.find((l) => l.startsWith('impactMetricCode MUST'))!;
    const diagnostic = lines.find((l) => l.startsWith('impactMetricCode MAY'))!;
    expect(quantified).toMatch(/FUEL_CASK/);
    expect(quantified).not.toMatch(/ON_TIME_PERFORMANCE|EBITDA_EXIT/);
    expect(diagnostic).toMatch(/ON_TIME_PERFORMANCE/);
    expect(diagnostic).toMatch(/qualitative/);
    expect(buildSystemPrompt('airline')).not.toMatch(/\bEBITDA_EXIT\b.*MUST/);
  });

  it('handleProposal rejects a lever on a computed metric', async () => {
    const reply = JSON.stringify({ levers: [{
      nodeId: 'n', causeId: null, label: 'l', mechanism: 'm', category: 'FUEL_EFFICIENCY', impactMetricCode: 'EBITDA_EXIT',
      expectedDelta: 10, deltaKind: 'absolute', timeToImpactDays: 30, effort: 'low', confidence: 0.5, confidenceBasis: 'b',
    }] });
    await expect(handleProposal('airline', 'x', async () => reply)).rejects.toThrow(/EBITDA_EXIT/);
  });
});

describe('proxy – company data', () => {
  const company = () => toDossier(reducer(initialState('airline'), { type: 'setName', name: 'Air X' }), 't');

  it('adds the validated company brief to the question sent to the model', async () => {
    let seen = '';
    await handleProposal('airline', 'Pourquoi la marge baisse ?', async (_s, user) => { seen = user; return '{}'; }, company());
    expect(seen).toMatch(/Pourquoi la marge baisse \?/);
    expect(seen).toMatch(/COMPANY DATA/);
    expect(seen).toMatch(/LOAD_FACTOR \(Load Factor\): 0\.82/);
  });

  it('refuses company data that is not a valid dossier, or is for another company type', async () => {
    const call = async () => '{}';
    await expect(handleProposal('airline', 'x', call, { ...company(), inputs: { MOIC: 9 } })).rejects.toThrow(/Inputs incompatibles/);
    await expect(handleProposal('cpg', 'x', call, company())).rejects.toThrow(/airline/);
  });

  it('works without company data (question only)', async () => {
    let seen = '';
    await handleProposal('airline', 'x', async (_s, user) => { seen = user; return '{}'; });
    expect(seen).toBe('x');
  });
});

