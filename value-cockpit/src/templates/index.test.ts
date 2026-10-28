import { describe, it, expect } from 'vitest';
import { TEMPLATES } from './index';
import { resolveMetrics } from '../engine/resolver';
import { NON_LEVER_CODES, SCENARIO_ASSUMPTION_CODES } from '../ontology/base';
import { SECTOR_ARCHETYPES, BASE_ARCHETYPES, EXTENDED_ARCHETYPES } from '../ontology/registry';

describe('templates registry', () => {
  it('covers every archetype except generic with a dedicated level-2 template', () => {
    expect(Object.keys(TEMPLATES).sort()).toEqual(SECTOR_ARCHETYPES.filter((a) => a !== 'generic').sort());
    expect(BASE_ARCHETYPES).toHaveLength(0);
    for (const a of EXTENDED_ARCHETYPES) expect(TEMPLATES[a]!.level, a).toBe(2);
  });
  it.each(Object.entries(TEMPLATES))('%s demo inputs resolve to a finite MOIC', (_, t) => {
    const v = resolveMetrics(t.instantiate('demo', t.demoInputs));
    expect(Number.isFinite(v.get('MOIC'))).toBe(true);
  });
  it('price → volume elasticity on every template that grows volume and price separately', () => {
    const withRule = Object.entries(TEMPLATES).filter(([, t]) => t.interactions.length > 0).map(([a]) => a).sort();
    expect(withRule).toEqual(['chemical', 'cosmetics', 'cpg', 'manufacturing', 'third-party-logistics', 'waste-management', 'wine-spirits']);
    for (const a of withRule) {
      const t = TEMPLATES[a as keyof typeof TEMPLATES]!;
      expect(t.interactions[0].targetCode, a).toBe('VOLUME_GROWTH');
      expect(t.interactions[0].coefficientCode, a).toBe('PRICE_ELASTICITY');
      expect(t.demoInputs.PRICE_ELASTICITY, a).toBeLessThan(0);
    }
  });
  it('scenario assumptions are deal-structure codes, never lever targets', () => {
    expect([...SCENARIO_ASSUMPTION_CODES]).toEqual(['EXIT_MULTIPLE', 'HOLD_YEARS']);
    for (const c of SCENARIO_ASSUMPTION_CODES) expect(NON_LEVER_CODES).toContain(c);
  });
});
