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
