import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SecClient } from '../empirical/importer';
import type { FilingsClient } from './filingsRoutes';

const MIN_INTERVAL_MS = 125; // SEC fair-access policy: at most 10 requests per second

/**
 * SEC EDGAR over HTTPS, cached on disk. `userAgent` must carry a contact e-mail (SEC rule).
 * `maxAgeMs`: a cached answer older than this is fetched again (filings change every year).
 */
export function makeSecClient(opts: { userAgent: string; cacheDir: string; maxAgeMs?: number }): SecClient & FilingsClient {
  mkdirSync(opts.cacheDir, { recursive: true });
  let last = 0;
  async function getJson(url: string, cacheName: string): Promise<unknown> {
    const cached = join(opts.cacheDir, cacheName);
    if (existsSync(cached) && Date.now() - statSync(cached).mtimeMs < (opts.maxAgeMs ?? Infinity)) {
      return JSON.parse(readFileSync(cached, 'utf8'));
    }
    for (let attempt = 0; attempt < 4; attempt++) {
      const wait = last + MIN_INTERVAL_MS - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      last = Date.now();
      const res = await fetch(url, { headers: { 'User-Agent': opts.userAgent, Accept: 'application/json' } });
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); continue; }
      if (!res.ok) throw Object.assign(new Error(String(res.status)), { status: res.status });
      const body = await res.json();
      writeFileSync(cached, JSON.stringify(body));
      return body;
    }
    throw new Error(`échec après 4 tentatives : ${url}`);
  }
  const pad = (cik: number) => String(cik).padStart(10, '0');
  const tickerFile = () => getJson('https://www.sec.gov/files/company_tickers.json', 'company_tickers.json') as Promise<Record<string, { cik_str: number; ticker: string }>>;
  return {
    tickers: async () => [...new Set(Object.values(await tickerFile()).map((x) => x.cik_str))],
    cikOf: async (ticker) => Object.values(await tickerFile()).find((x) => x.ticker.toUpperCase() === ticker.toUpperCase())?.cik_str ?? null,
    submissions: async (cik) => getJson(`https://data.sec.gov/submissions/CIK${pad(cik)}.json`, `sub-${pad(cik)}.json`) as never,
    companyFacts: async (cik) => getJson(`https://data.sec.gov/api/xbrl/companyfacts/CIK${pad(cik)}.json`, `facts-${pad(cik)}.json`) as never,
  };
}
