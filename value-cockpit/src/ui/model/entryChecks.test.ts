import { describe, it, expect } from 'vitest';
import { entryChecks } from './entryChecks';
import { TEMPLATES } from '../../templates';
import { SECTOR_ARCHETYPES, getBridgeFamily } from '../../ontology/registry';

const at = (a: 'cpg' | 'commercial-bank' | 'biotech', over: Record<string, number> = {}) => {
  const t = TEMPLATES[a]!;
  return entryChecks(t.instantiate('c', { ...t.demoInputs, ...over }), getBridgeFamily(a));
};

describe('entry consistency checks', () => {
  it('compares each entry fact with what the drivers give at year 0', () => {
    const [ebitda, wc] = at('cpg');
    // 1000 × (0.45 − 0.12 − 0.08 − 0.10) = 150, as entered
    expect(ebitda).toMatchObject({ entryCode: 'EBITDA_ENTRY', entered: 150, ok: true });
    expect(ebitda.model).toBeCloseTo(150, 10);
    expect(wc.entryCode).toBe('WORKING_CAPITAL');
  });

  it('flags a gap above 5 %', () => {
    const [ebitda] = at('cpg', { EBITDA_ENTRY: 120 });
    expect(ebitda.ok).toBe(false);
    expect(ebitda.gap).toBeCloseTo(120 / 150 - 1, 10);
  });

  it('follows the bridge family: net income for a bank, rNPV for a biotech', () => {
    expect(at('commercial-bank').map((c) => c.entryCode)).toEqual(['NET_INCOME_ENTRY']);
    expect(at('biotech').map((c) => c.entryCode)).toEqual(['RNPV_ENTRY']);
  });

  it('never throws: a model that cannot be read at year 0 gives no check', () => {
    expect(at('cpg', { REVENUE: Number.NaN })).toEqual([]);
  });

  it('the demo cases are consistent at entry (illustrative inputs must not teach a wrong pattern)', () => {
    const off = SECTOR_ARCHETYPES.filter((a) => TEMPLATES[a]).flatMap((a) => {
      const t = TEMPLATES[a]!;
      return entryChecks(t.instantiate('c', t.demoInputs), getBridgeFamily(a)).filter((c) => !c.ok).map((c) => `${a}:${c.entryCode} ${c.entered} vs ${c.model.toFixed(1)}`);
    });
    expect(off).toEqual([]);
  });
});
