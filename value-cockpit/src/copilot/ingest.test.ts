import { describe, it, expect } from 'vitest';
import { ingestProposal } from './ingest';

let n = 0;
const id = () => `id-${++n}`;

describe('ingestProposal', () => {
  it('tags levers as claude-sourced hypotheses (never validated)', () => {
    const { levers } = ingestProposal({
      levers: [{
        nodeId: 'n1', causeId: null, label: 'Cut churn', mechanism: 'm',
        category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
        expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
        effort: 'medium', confidence: 0.6, confidenceBasis: 'b',
      }],
    }, id);
    expect(levers[0].source).toBe('claude');
    expect(levers[0].status).toBe('hypothesis');
  });
});
