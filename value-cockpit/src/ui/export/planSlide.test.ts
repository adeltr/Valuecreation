import { describe, it, expect } from 'vitest';
import { buildSlideModel, renderPlanSlide } from './planSlide';
import { buildPlan } from '../model/plan';
import { TEMPLATES } from '../../templates';
import { getCatalog } from '../../catalog';
import type { Lever } from '../../domain/types';

const lever = (id: string, over: Partial<Lever>): Lever => ({
  id, nodeId: 'n', causeId: null, label: id, mechanism: 'm', category: 'FUEL_EFFICIENCY', impactMetricCode: 'FUEL_CASK',
  expectedDelta: -0.002, deltaKind: 'absolute', timeToImpactDays: 60, effort: 'high', confidence: 0.5,
  confidenceBasis: 'cf. airline-10', source: 'claude', status: 'validated', ...over,
});
const plan = (levers: Lever[]) => buildPlan({
  levers, rootCauses: [{ id: 'c', nodeId: 'n', description: 'Flotte vieillissante', category: 'OPERATIONAL', severity: 'high', source: 'claude', evidence: null, createdAt: 'd' }],
  metrics: TEMPLATES.airline!.instantiate('c', TEMPLATES.airline!.demoInputs), catalog: getCatalog('airline'),
  rules: [], family: 'ebitda', overrides: { fleet: { owner: 'COO' } },
});
const meta = { company: 'Air X', archetypeLabel: 'Airline', date: '27/10/2026' };

describe('100-day plan slide (consultant format)', () => {
  const levers = [
    lever('fleet', { label: 'Renouvellement de flotte' }),
    lever('net', { label: 'Réseau', category: 'NETWORK_OPTIMIZATION', impactMetricCode: 'LOAD_FACTOR', expectedDelta: 0.02, timeToImpactDays: 180, effort: 'low' }),
  ];
  const m = buildSlideModel(plan(levers), meta);

  it('an action title carrying the engine figures', () => {
    expect(m.title).toMatch(/^Plan 100 jours : 2 chantiers pour porter le MOIC de 1,79x à \d,\d\dx, dont \d,\d\dx d'ici J100$/);
    expect(m.subtitle).toBe('Air X · Airline · 27/10/2026');
  });

  it('timeline rows: value workstreams, then the foundations', () => {
    expect(m.rows.filter((r) => r.kind === 'lever').map((r) => r.label)).toEqual(['Renouvellement de flotte', 'Réseau']);
    expect(m.rows.filter((r) => r.kind === 'foundation')).toHaveLength(5);
    expect(m.rows[1].beyond).toBe('→ J+180');
  });

  it('value table: owner, KPI target, ΔMOIC, and the total of all validated levers', () => {
    expect(m.table[0]).toEqual(['Chantier', 'Responsable', 'KPI cible', 'Δ MOIC']);
    expect(m.table[1].slice(0, 2)).toEqual(['Renouvellement de flotte', 'COO']);
    expect(m.table[1][2]).toMatch(/^FUEL_CASK → 0,02$/);
    expect(m.table[1][3]).toMatch(/^\+0,\d\dx$/);
    expect(m.table.slice(-1)[0][0]).toBe('Total (moteur, avec interactions)');
  });

  it('governance and risks boxes, and a source footnote that states the method', () => {
    expect(m.governance.join(' ')).toMatch(/J30.*J60.*J100/);
    expect(m.risks).toEqual(['Flotte vieillissante (OPERATIONAL)']);
    expect(m.footnote).toMatch(/calculés par le moteur/);
    expect(m.footnote).toMatch(/validés par l'analyste/);
  });

  it('caps the timeline at 7 value workstreams and says how many are left out', () => {
    const many = Array.from({ length: 9 }, (_, i) => lever(`L${i}`, { timeToImpactDays: 30 + i }));
    const big = buildSlideModel(plan(many), meta);
    expect(big.rows.filter((r) => r.kind === 'lever')).toHaveLength(7);
    expect(big.more).toBe('+ 2 autres chantiers dans le plan détaillé');
  });

  it('renders a valid .pptx file', async () => {
    const buf = await renderPlanSlide(m, 'nodebuffer') as Uint8Array;
    expect(buf.byteLength).toBeGreaterThan(10_000);
    expect(String.fromCharCode(buf[0], buf[1])).toBe('PK');
  });
});
