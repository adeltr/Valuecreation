import { describe, it, expect } from 'vitest';
import { makeLeverSchema } from './schemas';
import { getActiveVocabulary } from '../ontology/registry';

const saasSchema = makeLeverSchema(getActiveVocabulary('saas'));
const genericSchema = makeLeverSchema(getActiveVocabulary('generic'));

const base = {
  id: 'l1', nodeId: 'n1', causeId: null, label: 'Reduce churn', mechanism: 'CS playbook',
  category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
  expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
  effort: 'medium', confidence: 0.6, source: 'claude', status: 'hypothesis',
};

describe('makeLeverSchema', () => {
  it('rejects empty/missing confidenceBasis', () => {
    expect(saasSchema.safeParse({ ...base, confidenceBasis: '' }).success).toBe(false);
    expect(saasSchema.safeParse(base).success).toBe(false);
  });
  it('accepts a grounded saas lever', () => {
    expect(saasSchema.safeParse({ ...base, confidenceBasis: '2 portfolio cases, churn -1.5pts realized' }).success).toBe(true);
  });
  it('rejects the same lever under the generic vocabulary (RETENTION unknown)', () => {
    expect(genericSchema.safeParse({ ...base, confidenceBasis: 'x' }).success).toBe(false);
  });
  it('rejects an invalid deltaKind', () => {
    expect(saasSchema.safeParse({ ...base, confidenceBasis: 'x', deltaKind: 'vibes' }).success).toBe(false);
  });
});

describe('makeLeverSchema – deal-structure codes', () => {
  it('rejects a lever whose impactMetricCode is EXIT_MULTIPLE', () => {
    const r = saasSchema.safeParse({ ...base, confidenceBasis: 'x', category: 'PRICING', impactMetricCode: 'EXIT_MULTIPLE' });
    expect(r.success).toBe(false);
  });
});
