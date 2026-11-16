import { describe, it, expect } from 'vitest';
import { formatValue } from './format';
import { buildDriverGraph } from './graph';
import { analysesForMetric } from './hundredDay';
import { TEMPLATES } from '../../templates';
import { getCatalog } from '../../catalog';

const sp = (s: string) => s.replace(/[  ]/g, ' ');

describe('formatValue (display boundary only)', () => {
  it('formats by unit', () => {
    expect(sp(formatValue(0.82, 'percent'))).toBe('82,0 %');
    expect(sp(formatValue(2.3456, 'ratio'))).toBe('2,35x');
    expect(sp(formatValue(1234.567, 'currency'))).toBe('1 234,6');
    expect(sp(formatValue(0.0225, 'currency'))).toBe('0,0225');
    expect(sp(formatValue(45, 'days'))).toBe('45 j');
    expect(sp(formatValue(5, 'years'))).toBe('5 ans');
    expect(sp(formatValue(10000, 'count'))).toBe('10 000');
    expect(sp(formatValue(6.6518, 'count'))).toBe('6,65');
    expect(formatValue(undefined, 'currency')).toBe('—');
  });
});

describe('buildDriverGraph', () => {
  const metrics = TEMPLATES.airline!.instantiate('c', TEMPLATES.airline!.demoInputs);
  const g = buildDriverGraph(metrics);

  it('one node per metric, one edge per formula dependency (cause → effect)', () => {
    expect(g.nodes).toHaveLength(metrics.length);
    expect(g.edges).toContainEqual({ id: 'LOAD_FACTOR->RPK_EXIT', source: 'LOAD_FACTOR', target: 'RPK_EXIT' });
    expect(g.edges).toContainEqual({ id: 'EQUITY_EXIT->MOIC', source: 'EQUITY_EXIT', target: 'MOIC' });
  });

  it('layers: L1 bridge, L2 financial, L3 operational inputs', () => {
    const layer = (c: string) => g.nodes.find((n) => n.id === c)!.layer;
    expect(layer('MOIC')).toBe('L1');
    expect(layer('EXIT_MULTIPLE')).toBe('L1');
    expect(layer('REVENUE_EXIT')).toBe('L2');
    expect(layer('LOAD_FACTOR')).toBe('L3');
  });

  it('places operational drivers left of the bridge (causality L3 → L1)', () => {
    const x = (c: string) => g.nodes.find((n) => n.id === c)!.position.x;
    expect(x('LOAD_FACTOR')).toBeLessThan(x('REVENUE_EXIT'));
    expect(x('REVENUE_EXIT')).toBeLessThan(x('MOIC'));
  });
});

describe('analysesForMetric', () => {
  const catalog = getCatalog('airline');

  it('lists the analyses to run for a metric (exploration mode)', () => {
    expect(analysesForMetric(catalog, 'FUEL_CASK').map((a) => a.id)).toEqual(['airline-10', 'airline-30', 'airline-33', 'airline-36']);
  });
});
