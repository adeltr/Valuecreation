import { describe, it, expect } from 'vitest';
import { topoSort } from './graph';

describe('graph', () => {
  it('orders dependencies before dependents', () => {
    const order = topoSort(new Map([
      ['MOIC', ['EQUITY_EXIT', 'EQUITY_ENTRY']],
      ['EQUITY_EXIT', []],
      ['EQUITY_ENTRY', []],
    ]));
    expect(order.indexOf('EQUITY_EXIT')).toBeLessThan(order.indexOf('MOIC'));
  });
  it('throws on a cycle with the cycle path in the message', () => {
    expect(() => topoSort(new Map([['A', ['B']], ['B', ['A']]]))).toThrow(/cycle.*A.*B/is);
  });
});
