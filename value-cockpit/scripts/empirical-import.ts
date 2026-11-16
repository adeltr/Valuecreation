#!/usr/bin/env tsx
/**
 * Builds data/empirical/sec-windows.json from SEC EDGAR (docs/19): for every listed company of
 * the requested types, the 3- and 5-year changes of EBITDA margin, revenue CAGR and DSO/DIO/DPO,
 * with size, country and completed acquisitions. Raw responses are cached in data/empirical/cache.
 *
 * Usage: SEC_USER_AGENT="Prénom Nom adresse@e-mail" npx tsx scripts/empirical-import.ts [--archetype airline …] [--limit 500]
 */
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importCompanies, secUserAgent } from '../src/empirical/importer.js';
import { makeSecClient } from '../src/server/secClient.js';
import { SECTOR_ARCHETYPES, type SectorArchetype } from '../src/ontology/registry.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'data/empirical');
const CACHE = join(OUT, 'cache');
const UA = secUserAgent(process.env);

const args = process.argv.slice(2);
const values = (flag: string) => args.flatMap((a, i) => (a === flag && args[i + 1] ? [args[i + 1]] : []));
const archetypes = (values('--archetype').length ? values('--archetype') : SECTOR_ARCHETYPES.filter((a) => a !== 'generic')) as SectorArchetype[];
const limit = values('--limit')[0] ? Number(values('--limit')[0]) : undefined;

const sec = makeSecClient({ userAgent: UA, cacheDir: CACHE });

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
