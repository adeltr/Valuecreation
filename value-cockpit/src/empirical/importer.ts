import type { SectorArchetype } from '../ontology/registry';
import {
  acquisitionYears, companyProfile, windowRecords, yearMetrics,
  type CompanyFacts, type Submissions, type WindowRecord,
} from './edgar';

/** The three EDGAR endpoints the import needs; the network adapter lives in scripts/empirical-import.ts. */
export interface SecClient {
  tickers(): Promise<number[]>;                       // www.sec.gov/files/company_tickers.json → CIKs
  submissions(cik: number): Promise<Submissions>;    // data.sec.gov/submissions/CIK##########.json
  companyFacts(cik: number): Promise<CompanyFacts>;  // data.sec.gov/api/xbrl/companyfacts/CIK##########.json
}

export interface EmpiricalDataset {
  source: string; generatedAt: string; years: number[];
  companies: number; records: WindowRecord[]; skipped: { cik: number; reason: string }[];
}

/** The SEC asks every automated client to identify itself with a contact e-mail. */
export function secUserAgent(env: Record<string, string | undefined>): string {
  const ua = env.SEC_USER_AGENT?.trim();
  if (!ua) throw new Error('SEC_USER_AGENT manquant : export SEC_USER_AGENT="Prénom Nom adresse@e-mail"');
  if (!/\S+@\S+\.\S+/.test(ua)) throw new Error('SEC_USER_AGENT doit contenir une adresse e-mail de contact');
  return ua;
}

export async function importCompanies(
  sec: SecClient, opts: { archetypes: SectorArchetype[]; years: number[]; limit?: number },
  log: (msg: string) => void = () => {},
): Promise<EmpiricalDataset> {
  const ciks = (await sec.tickers()).slice(0, opts.limit ?? Infinity);
  const records: WindowRecord[] = [];
  const skipped: EmpiricalDataset['skipped'] = [];
  let companies = 0;
  for (const [i, cik] of ciks.entries()) {
    try {
      const subs = await sec.submissions(cik);
      const profile = companyProfile(subs);
      if (!profile.archetype || !opts.archetypes.includes(profile.archetype)) continue;
      const metrics = yearMetrics(await sec.companyFacts(cik));
      const rows = opts.years.flatMap((y) => windowRecords(profile, metrics, acquisitionYears(subs), y));
      if (rows.length) { companies++; records.push(...rows); }
      if (i % 100 === 0) log(`${i}/${ciks.length} sociétés lues, ${companies} retenues`);
    } catch (e) {
      skipped.push({ cik, reason: (e as Error).message });
    }
  }
  return { source: 'SEC EDGAR (data.sec.gov companyfacts + submissions)', generatedAt: new Date().toISOString(), years: opts.years, companies, records, skipped };
}
