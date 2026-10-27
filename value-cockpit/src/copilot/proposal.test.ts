import { describe, it, expect } from 'vitest';
import { sanitizeProposal } from './proposal';
import { getActiveVocabulary } from '../ontology/registry';

const vocab = getActiveVocabulary('saas');
const lever = {
  nodeId: 'n1', causeId: null, label: 'Cut churn', mechanism: 'CS playbook',
  category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
  expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
  effort: 'medium', confidence: 0.6, confidenceBasis: '2 portfolio cases',
};

describe('sanitizeProposal', () => {
  it('strips smuggled scenarioResults', () => {
    const clean = sanitizeProposal({ levers: [lever], scenarioResults: [{ metricCode: 'MOIC', value: 9 }] }, vocab);
    expect((clean as any).scenarioResults).toBeUndefined();
  });
  it('rejects a lever missing confidenceBasis', () => {
    const { confidenceBasis, ...bad } = lever;
    expect(() => sanitizeProposal({ levers: [bad] }, vocab)).toThrow(/confidenceBasis/i);
  });
  it('rejects out-of-active-vocabulary categories', () => {
    expect(() => sanitizeProposal({ levers: [{ ...lever, category: 'MULTIPLE_EXPANSION' }] }, vocab)).toThrow();
    expect(() => sanitizeProposal({ levers: [lever] }, getActiveVocabulary('generic'))).toThrow();
  });
});
