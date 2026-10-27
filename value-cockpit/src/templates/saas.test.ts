import { describe, it, expect } from 'vitest';
import { instantiateSaasTemplate } from './saas';
import { resolveMetrics } from '../engine/resolver';

describe('saas template', () => {
  const metrics = instantiateSaasTemplate('c1', {
    ARR: 100, GROSS_CHURN: 0.10, EXPANSION_RATE: 0.12, EBITDA_MARGIN: 0.20,
    ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 4,
    NET_DEBT_ENTRY: 60, FCF_ANNUAL: 8,
  });
  it('resolves the full chain churn -> NRR -> ARR_EXIT -> EBITDA_EXIT -> MOIC', () => {
    const v = resolveMetrics(metrics);
    expect(v.get('NRR')).toBeCloseTo(1.02, 10);
    expect(v.get('ARR_EXIT')).toBeCloseTo(100 * 1.02 ** 4, 4);
    expect(v.get('EBITDA_EXIT')).toBeCloseTo(v.get('ARR_EXIT')! * 0.2, 6);
    const equityEntry = 100 * 0.2 * 8 - 60;
    expect(v.get('EQUITY_ENTRY')).toBeCloseTo(equityEntry, 6);
    const netDebtExit = 60 - 8 * 4;
    expect(v.get('MOIC')).toBeCloseTo((v.get('EBITDA_EXIT')! * 8 - netDebtExit) / equityEntry, 6);
  });
  it('every instantiated code belongs to the saas active vocabulary', async () => {
    const { getActiveVocabulary } = await import('../ontology/registry');
    const vocab = getActiveVocabulary('saas');
    for (const x of metrics) expect(vocab.isMetricCode(x.code), x.code).toBe(true);
  });
});
