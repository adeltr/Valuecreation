import { describe, it, expect, afterEach } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { filingsRoutes, type FilingsClient } from './filingsRoutes';

const fy = (y: number, val: number) => ({ start: `${y}-01-01`, end: `${y}-12-31`, val, fy: y, fp: 'FY', form: '10-K', filed: `${y + 1}-02-01` });
const client: FilingsClient = {
  cikOf: async (ticker) => (ticker === 'AIRX' ? 42 : null),
  submissions: async () => ({ cik: '42', name: 'Air X Inc.', sic: '4512', addresses: { business: { isForeignLocation: 0 } } }),
  companyFacts: async () => ({ cik: 42, facts: { 'us-gaap': {
    Revenues: { units: { USD: [fy(2024, 900e6), fy(2025, 1000e6)] } },
    OperatingIncomeLoss: { units: { USD: [fy(2025, 100e6)] } },
    DepreciationDepletionAndAmortization: { units: { USD: [fy(2025, 50e6)] } },
  } } }),
};

let server: Server | null = null;
async function start(c: FilingsClient | null) {
  const app = express();
  app.use('/api/filings', filingsRoutes(() => c));
  server = await new Promise<Server>((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/filings`;
}
afterEach(async () => { if (server) await new Promise((r) => server!.close(r)); server = null; });

describe('public filings lookup', () => {
  it('returns the latest annual facts of a listed company, with their source', async () => {
    const r = await (await fetch(`${await start(client)}?ticker=airx`)).json();
    expect(r).toMatchObject({
      ticker: 'AIRX', cik: 42, name: 'Air X Inc.', fiscalYear: 2025, currency: 'USD', archetype: 'airline',
      values: { REVENUE: 1000e6, EBITDA_ENTRY: 150e6 },
      source: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000000042.json',
    });
    expect(r.missing).toContain('CAPEX');
  });

  it('404 on an unknown ticker, 400 on a malformed one', async () => {
    const base = await start(client);
    expect((await fetch(`${base}?ticker=NOPE`)).status).toBe(404);
    expect((await fetch(`${base}?ticker=../x`)).status).toBe(400);
  });

  it('503 with what to configure when the server has no SEC contact', async () => {
    const r = await fetch(`${await start(null)}?ticker=AIRX`);
    expect(r.status).toBe(503);
    expect((await r.json()).error).toMatch(/SEC_USER_AGENT/);
  });
});
