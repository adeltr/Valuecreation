import { describe, it, expect } from 'vitest';
import { TEMPLATES } from './index';
import { resolveMetrics } from '../engine/resolver';
import { NON_LEVER_CODES, SCENARIO_ASSUMPTION_CODES } from '../ontology/base';

describe('templates registry', () => {
  it('covers every archetype that has a template', () => {
    expect(Object.keys(TEMPLATES).sort()).toEqual(['aero', 'airline', 'saas']);
  });
  it.each(Object.entries(TEMPLATES))('%s demo inputs resolve to a finite MOIC', (_, t) => {
    const v = resolveMetrics(t.instantiate('demo', t.demoInputs));
    expect(Number.isFinite(v.get('MOIC'))).toBe(true);
  });
  it('scenario assumptions are deal-structure codes, never lever targets', () => {
    expect([...SCENARIO_ASSUMPTION_CODES]).toEqual(['EXIT_MULTIPLE', 'HOLD_YEARS']);
    for (const c of SCENARIO_ASSUMPTION_CODES) expect(NON_LEVER_CODES).toContain(c);
  });
});
