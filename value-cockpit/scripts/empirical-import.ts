#!/usr/bin/env tsx
/**
 * Builds data/empirical/sec-windows.json from SEC EDGAR (docs/19): for every listed company of
 * the requested types, the 3- and 5-year changes of EBITDA margin, revenue CAGR and DSO/DIO/DPO,
 * with size, country and completed acquisitions. Raw responses are cached in data/empirical/cache.
 *
 * Usage: SEC_USER_AGENT="Prénom Nom adresse@e-mail" npx tsx scripts/empirical-import.ts [--archetype airline …] [--limit 500]
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importCompanies, secUserAgent, type SecClient } from '../src/empirical/importer.js';
import { SECTOR_ARCHETYPES, type SectorArchetype } from '../src/ontology/registry.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'data/empirical');
const CACHE = join(OUT, 'cache');
const UA = secUserAgent(process.env);
const MIN_INTERVAL_MS = 125; // SEC fair-access policy: at most 10 requests per second

const args = process.argv.slice(2);
const values = (flag: string) => args.flatMap((a, i) => (a === flag && args[i + 1] ? [args[i + 1]] : []));
const archetypes = (values('--archetype').length ? values('--archetype') : SECTOR_ARCHETYPES.filter((a) => a !== 'generic')) as SectorArchetype[];
const limit = values('--limit')[0] ? Number(values('--limit')[0]) : undefined;

let last = 0;
async function getJson(url: string, cacheName: string): Promise<unknown> {
  const cached = join(CACHE, cacheName);
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'));
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = last + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    last = Date.now();
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); continue; }
    if (!res.ok) throw Object.assign(new Error(String(res.status)), { status: res.status });
    const body = await res.json();
    writeFileSync(cached, JSON.stringify(body));
    return body;
  }
  throw new Error(`échec après 4 tentatives : ${url}`);
}

const pad = (cik: number) => String(cik).padStart(10, '0');
const sec: SecClient = {
  tickers: async () => {
    const t = await getJson('https://www.sec.gov/files/company_tickers.json', 'company_tickers.json') as Record<string, { cik_str: number }>;
    return [...new Set(Object.values(t).map((x) => x.cik_str))];
  },
  submissions: async (cik) => getJson(`https://data.sec.gov/submissions/CIK${pad(cik)}.json`, `sub-${pad(cik)}.json`) as never,
  companyFacts: async (cik) => getJson(`https://data.sec.gov/api/xbrl/companyfacts/CIK${pad(cik)}.json`, `facts-${pad(cik)}.json`) as never,
};

mkdirSync(CACHE, { recursive: true });
try {
  const data = await importCompanies(sec, { archetypes, years: [3, 5], limit }, (m) => console.log(m));
  writeFileSync(join(OUT, 'sec-windows.json'), JSON.stringify(data));
  console.log(`✓ ${data.companies} sociétés, ${data.records.length} fenêtres → data/empirical/sec-windows.json (${data.skipped.length} ignorées)`);
} catch (e) {
  const cause = (e as { cause?: { code?: string; hostname?: string } }).cause;
  console.error(cause?.code === 'ENOTFOUND' || cause?.code === 'ECONNREFUSED'
    ? `✗ Impossible de joindre ${cause.hostname ?? 'sec.gov'} : vérifiez la connexion internet.`
    : `✗ ${(e as Error).message}`);
  process.exit(1);
}
