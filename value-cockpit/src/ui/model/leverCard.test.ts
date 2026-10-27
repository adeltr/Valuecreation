import { describe, it, expect } from 'vitest';
import { buildLeverCard, causalPath } from './leverCard';
import { TEMPLATES } from '../../templates';
import { getCatalog } from '../../catalog';
import type { Lever } from '../../domain/types';

const lever = (over: Partial<Lever> = {}): Lever => ({
  id: 'h1', nodeId: 'FUEL_CASK', causeId: null, label: 'Renouvellement de flotte', mechanism: 'avions moins gourmands',
  category: 'FUEL_EFFICIENCY', impactMetricCode: 'FUEL_CASK', expectedDelta: -0.002, deltaKind: 'absolute',
  timeToImpactDays: 60, effort: 'high', confidence: 0.5, confidenceBasis: 'cf. airline-10', source: 'claude',
  status: 'hypothesis', ...over,
});

const airline = TEMPLATES.airline!;
const metrics = airline.instantiate('c', airline.demoInputs);
const card = (l: Lever, archetype: 'airline' | 'cpg' = 'airline') => {
  const t = TEMPLATES[archetype]!;
  return buildLeverCard(l, t.instantiate('c', t.demoInputs), getCatalog(archetype), t.interactions);
};

describe('causalPath', () => {
  it('follows the formulas from the lever target to the MOIC', () => {
    expect(causalPath(metrics, 'FUEL_CASK').map((s) => s.code))
      .toEqual(['FUEL_CASK', 'OPERATING_COSTS_EXIT', 'EBITDA_EXIT', 'EQUITY_EXIT', 'MOIC']);
    expect(causalPath(metrics, 'FUEL_CASK')[1].formula).toMatch(/FUEL_CASK/);
  });
  it('is empty when the code does not reach the MOIC (a diagnostic)', () => {
    expect(causalPath(metrics, 'NOPE')).toEqual([]);
  });
});

describe('buildLeverCard', () => {
  it('says what the lever is and what it moves', () => {
    const c = card(lever());
    expect(c.summary).toMatch(/FUEL_EFFICIENCY/);
    expect(c.summary).toMatch(/FUEL_CASK/);
    expect(c.target).toEqual({ code: 'FUEL_CASK', unit: 'currency', current: 0.022 });
  });

  it('model sensitivity is an engine probe on the target, sign included (fuel cost up ⇒ MOIC down)', () => {
    const c = card(lever());
    expect(c.sensitivity!.step).toEqual({ kind: 'percent', value: 0.01 });
    expect(c.sensitivity!.moicDelta).toBeLessThan(0);
    const lf = card(lever({ impactMetricCode: 'LOAD_FACTOR', category: 'NETWORK_OPTIMIZATION' }));
    expect(lf.sensitivity!.step).toEqual({ kind: 'absolute', value: 0.01 }); // +1 pt on a percent metric
    expect(lf.sensitivity!.moicDelta).toBeGreaterThan(0);
  });

  it('the lever impact is computed only once the analyst has validated it (invariant 4)', () => {
    expect(card(lever()).impact).toBeNull();
    const v = card(lever({ status: 'validated' })).impact!;
    expect(v.moicAfter).toBeGreaterThan(v.moicBefore);
  });

  it('lists the analyses that diagnose it — lever matches first — with what to collect and how to improve', () => {
    const c = card(lever());
    expect(c.analyses[0].relatedLeverCategories).toContain('FUEL_EFFICIENCY');
    expect(c.analyses.map((a) => a.id)).toContain('airline-10');
    expect(c.dataToCollect.length).toBeGreaterThan(0);
    expect(c.improve.length).toBeGreaterThan(0);
    expect(new Set(c.dataToCollect).size).toBe(c.dataToCollect.length);
  });

  it('names the interaction rules the lever triggers (cpg: price-mix → volume)', () => {
    const c = card(lever({ impactMetricCode: 'PRICE_MIX_GROWTH', category: 'PRICING', nodeId: 'PRICE_MIX_GROWTH', expectedDelta: 0.01 }), 'cpg');
    expect(c.interactions).toEqual([{ sourceCode: 'PRICE_MIX_GROWTH', targetCode: 'VOLUME_GROWTH', coefficientCode: 'PRICE_ELASTICITY' }]);
  });
});
