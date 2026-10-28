import { describe, it, expect, afterEach } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { empiricalRoutes } from './empiricalRoutes';
import type { EmpiricalDataset } from '../empirical/importer';
import type { WindowRecord } from '../empirical/edgar';

const rec = (i: number, over: Partial<WindowRecord> = {}): WindowRecord => ({
  cik: i, name: `C${i}`, archetype: 'airline', country: 'United States', startYear: 2015, endYear: 2018,
  sizeBucket: '1–5B', acquisition: i % 2 === 0, deltas: { EBITDA_MARGIN: i / 100, REVENUE_GROWTH: 0.05 }, source: 's', ...over,
});
const dataset: EmpiricalDataset = {
  source: 'SEC EDGAR', generatedAt: '2026-10-28T00:00:00Z', years: [3, 5], companies: 12, skipped: [],
  records: [...Array.from({ length: 10 }, (_, i) => rec(i + 1)), rec(50, { country: 'United Kingdom' }), rec(60, { archetype: 'cpg' })],
};

let server: Server | null = null;
async function start(load: () => EmpiricalDataset | null) {
  const app = express();
  app.use('/api/empirical', empiricalRoutes(load));
  server = await new Promise<Server>((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/empirical`;
}
afterEach(async () => { if (server) await new Promise((r) => server!.close(r)); server = null; });

describe('empirical routes', () => {
  it('meta: source, date, and the filters available for an archetype with their sample sizes', async () => {
    const base = await start(() => dataset);
    const m = await (await fetch(`${base}/meta?archetype=airline`)).json();
    expect(m).toMatchObject({ source: 'SEC EDGAR', generatedAt: '2026-10-28T00:00:00Z', companies: 11 });
    expect(m.countries).toEqual([{ value: 'United States', n: 10 }, { value: 'United Kingdom', n: 1 }]);
    expect(m.sizes).toEqual([{ value: '1–5B', n: 11 }]);
  });

  it('benchmark: quantiles per metric and the values for a percentile rank, filters applied', async () => {
    const base = await start(() => dataset);
    const b = await (await fetch(`${base}/benchmark?archetype=airline&years=3&countries=United%20States`)).json();
    expect(b.metrics.EBITDA_MARGIN.n).toBe(10);
    expect(b.values.EBITDA_MARGIN).toHaveLength(10);
    expect(b.metrics.DSO).toBeNull();
    const deals = await (await fetch(`${base}/benchmark?archetype=airline&years=3&deals=with`)).json();
    expect(deals.metrics.EBITDA_MARGIN).toBeNull(); // 5 windows < minimum sample
  });

  it('404 with the command to run when no dataset was imported', async () => {
    const base = await start(() => null);
    const r = await fetch(`${base}/meta?archetype=airline`);
    expect(r.status).toBe(404);
    expect((await r.json()).error).toMatch(/empirical:import/);
  });

  it('400 on an unknown archetype or a window other than 3 or 5 years', async () => {
    const base = await start(() => dataset);
    expect((await fetch(`${base}/benchmark?archetype=airline&years=x`)).status).toBe(400);
    expect((await fetch(`${base}/benchmark?archetype=nope&years=3`)).status).toBe(400);
  });
});
