import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, handleProposal } from './proxy';

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
