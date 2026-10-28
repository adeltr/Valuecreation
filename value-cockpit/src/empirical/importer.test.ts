import { describe, it, expect, vi } from 'vitest';
import { importCompanies, secUserAgent, type SecClient } from './importer';

const fy = (y: number, val: number) => ({ start: `${y}-01-01`, end: `${y}-12-31`, val, fy: y, fp: 'FY', form: '10-K', filed: `${y + 1}-02-01` });
const facts = (cik: number) => ({ cik, facts: { 'us-gaap': {
  Revenues: { units: { USD: [2016, 2017, 2018, 2019, 2020, 2021].map((y, i) => fy(y, 1000 + 100 * i)) } },
  OperatingIncomeLoss: { units: { USD: [2016, 2017, 2018, 2019, 2020, 2021].map((y) => fy(y, 100)) } },
  DepreciationDepletionAndAmortization: { units: { USD: [2016, 2017, 2018, 2019, 2020, 2021].map((y) => fy(y, 10)) } },
} } });
const subs = (cik: number, sic: string) => ({ cik: String(cik), name: `Co ${cik}`, sic, addresses: { business: { isForeignLocation: 0 } }, filings: { recent: { form: [], items: [], filingDate: [] } } });

function client(): SecClient & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    tickers: async () => { calls.push('tickers'); return [1, 2, 3]; },
    submissions: async (cik) => { calls.push(`subs ${cik}`); return subs(cik, cik === 3 ? '2834' : '4512'); },
    companyFacts: async (cik) => { calls.push(`facts ${cik}`); if (cik === 2) throw Object.assign(new Error('404'), { status: 404 }); return facts(cik); },
  };
}

describe('EDGAR import', () => {
  it('keeps the requested archetypes, skips companies without facts, builds 3- and 5-year windows', async () => {
    const c = client();
    const log = vi.fn();
    const out = await importCompanies(c, { archetypes: ['airline'], years: [3, 5] }, log);
    expect(c.calls).toEqual(['tickers', 'subs 1', 'facts 1', 'subs 2', 'facts 2', 'subs 3']); // pharma: no facts fetched
    expect(out.companies).toBe(1);
    expect(out.records.filter((r) => r.endYear - r.startYear === 3)).toHaveLength(3);
    expect(out.records.filter((r) => r.endYear - r.startYear === 5)).toHaveLength(1);
    expect(out.skipped).toEqual([{ cik: 2, reason: '404' }]);
  });

  it('the SEC requires a contact in the User-Agent: refuse to run without one', () => {
    expect(() => secUserAgent({})).toThrow(/SEC_USER_AGENT/);
    expect(() => secUserAgent({ SEC_USER_AGENT: 'no email here' })).toThrow(/e-mail/);
    expect(secUserAgent({ SEC_USER_AGENT: 'Jane Doe jane@example.com' })).toBe('Jane Doe jane@example.com');
  });
});
