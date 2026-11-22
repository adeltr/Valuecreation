import type { SectorArchetype } from '../ontology/registry';

/**
 * SEC EDGAR (data.sec.gov) parsing — pure functions over the documented JSON of the
 * companyfacts and submissions APIs. Empirical figures are public filings data, never model output.
 */

interface Address {
  stateOrCountry?: string | null; stateOrCountryDescription?: string | null; isForeignLocation?: number | null;
  country?: string | null; countryCode?: string | null;
}
interface Fact { start?: string; end: string; val: number; fy?: number; fp?: string; form?: string; filed?: string }
export interface CompanyFacts { cik: number; entityName?: string; facts: Record<string, Record<string, { units: Record<string, Fact[]> }>> }
export interface Submissions {
  cik: string | number; name: string; sic: string | number;
  addresses?: Partial<Record<'business' | 'mailing', Address>>;
  filings?: { recent?: { form: string[]; items?: string[]; filingDate: string[] } };
}

const ANNUAL_FORMS = /^(10-K|20-F|40-F)(\/A)?$/;
const days = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000;

/** One value per fiscal year (year of the period end): annual durations or year-end instants, latest filing wins. */
export function annualSeries(cf: CompanyFacts, concepts: string[]): Record<number, number> {
  for (const concept of concepts) {
    const facts = cf.facts['us-gaap']?.[concept]?.units?.USD ?? cf.facts['ifrs-full']?.[concept]?.units?.USD;
    if (!facts?.length) continue;
    const byYear = new Map<number, Fact>();
    for (const f of facts) {
      if (!f.form || !ANNUAL_FORMS.test(f.form) || !Number.isFinite(f.val)) continue;
      if (f.start && (days(f.start, f.end) < 340 || days(f.start, f.end) > 380)) continue; // not a full year
      const year = Number(f.end.slice(0, 4));
      const prev = byYear.get(year);
      if (!prev || (f.filed ?? '') >= (prev.filed ?? '')) byYear.set(year, f);
    }
    if (byYear.size) return Object.fromEntries([...byYear].map(([y, f]) => [y, f.val]));
  }
  return {};
}

const CONCEPTS = {
  revenue: ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax', 'SalesRevenueNet', 'Revenue'],
  operatingIncome: ['OperatingIncomeLoss', 'ProfitLossFromOperatingActivities'],
  da: ['DepreciationDepletionAndAmortization', 'DepreciationAndAmortization', 'DepreciationAmortizationAndAccretionNet', 'DepreciationAndAmortisationExpense'],
  receivables: ['AccountsReceivableNetCurrent', 'TradeAndOtherCurrentReceivables'],
  cogs: ['CostOfRevenue', 'CostOfGoodsAndServicesSold', 'CostOfGoodsSold', 'CostOfSales'],
  inventory: ['InventoryNet', 'Inventories'],
  payables: ['AccountsPayableCurrent', 'TradeAndOtherCurrentPayables'],
};

export type EmpiricalMetric = 'REVENUE' | 'EBITDA_MARGIN' | 'DSO' | 'DIO' | 'DPO';

// Levels outside these bounds come from near-zero revenue or tagging errors, not from operations.
const PLAUSIBLE: Record<EmpiricalMetric, (v: number) => boolean> = {
  REVENUE: (v) => v > 0,
  EBITDA_MARGIN: (v) => v >= -1 && v <= 1,
  DSO: (v) => v >= 0 && v <= 365, DIO: (v) => v >= 0 && v <= 730, DPO: (v) => v >= 0 && v <= 365,
};
/** Windows starting below this revenue (micro-caps, pre-revenue) are left out of the benchmarks. */
export const MIN_REVENUE_USD = 10e6;

/** Per fiscal year, the ontology metrics computable from the filing (EBITDA = operating income + D&A). */
export function yearMetrics(cf: CompanyFacts): Record<number, Partial<Record<EmpiricalMetric, number>>> {
  const s = Object.fromEntries(Object.entries(CONCEPTS).map(([k, c]) => [k, annualSeries(cf, c)])) as Record<keyof typeof CONCEPTS, Record<number, number>>;
  const out: Record<number, Partial<Record<EmpiricalMetric, number>>> = {};
  for (const y of Object.keys(s.revenue).map(Number)) {
    const rev = s.revenue[y];
    if (!(rev > 0)) continue;
    const m: Partial<Record<EmpiricalMetric, number>> = { REVENUE: rev };
    const keep = (k: EmpiricalMetric, v: number) => { if (PLAUSIBLE[k](v)) m[k] = v; };
    if (s.operatingIncome[y] !== undefined && s.da[y] !== undefined) keep('EBITDA_MARGIN', (s.operatingIncome[y] + s.da[y]) / rev);
    if (s.receivables[y] !== undefined) keep('DSO', (s.receivables[y] / rev) * 365);
    if (s.cogs[y] > 0 && s.inventory[y] !== undefined) keep('DIO', (s.inventory[y] / s.cogs[y]) * 365);
    if (s.cogs[y] > 0 && s.payables[y] !== undefined) keep('DPO', (s.payables[y] / s.cogs[y]) * 365);
    out[y] = m;
  }
  return out;
}

// SIC → archetype (most specific range first). Auto insurance has no SIC of its own (6331 = P&C).
const SIC_RANGES: [number, number, SectorArchetype][] = [
  [2834, 2834, 'pharma'], [2836, 2836, 'biotech'], [2844, 2844, 'cosmetics'],
  [2082, 2085, 'wine-spirits'], [2000, 2099, 'cpg'], [2800, 2899, 'chemical'],
  [3841, 3845, 'medical-device'], [3720, 3728, 'aero'], [3760, 3769, 'aero'], [3812, 3812, 'aero'],
  [3310, 3399, 'metals-mining'], [1000, 1499, 'metals-mining'], [3400, 3699, 'manufacturing'], [3500, 3599, 'manufacturing'],
  [100, 799, 'agriculture'], [4512, 4522, 'airline'], [4731, 4731, 'third-party-logistics'], [4210, 4215, 'third-party-logistics'],
  [4911, 4911, 'electricity-generation'], [4931, 4931, 'electricity-generation'], [4991, 4991, 'electricity-generation'],
  [4953, 4955, 'waste-management'], [7011, 7011, 'hospitality'], [4833, 4841, 'media'], [7812, 7829, 'media'], [2711, 2731, 'media'],
  [5200, 5999, 'retail'], [7372, 7372, 'saas'], [8000, 8099, 'healthcare-provider'], [6324, 6324, 'health-payor'],
  [6311, 6311, 'life-insurance'], [6331, 6331, 'pc-insurance'], [6021, 6022, 'commercial-bank'], [6035, 6036, 'retail-bank'],
];
export function sicToArchetype(sic: number): SectorArchetype | null {
  return SIC_RANGES.find(([a, b]) => sic >= a && sic <= b)?.[2] ?? null;
}

export interface CompanyProfile { cik: number; name: string; sic: number; archetype: SectorArchetype | null; country: string }

// EDGAR describes Canadian and Australian filers by province or state: "Ontario, Canada".
const SUBDIVIDED = ['Canada', 'Australia', 'China', 'Mexico', 'United Kingdom'];
export function normalizeCountry(name: string): string {
  const tail = name.split(',').pop()!.trim();
  return name.includes(',') && SUBDIVIDED.includes(tail) ? tail : name;
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());

/** Country of the business address (mailing as fallback): full name when the filing gives one. */
function countryOf(addresses: Submissions['addresses']): string {
  const all = [addresses?.business, addresses?.mailing].filter((a): a is Address => !!a);
  const foreign = all.filter((a) => a.isForeignLocation === 1);
  if (all.length && foreign.length === 0) return 'United States';
  for (const a of foreign) if (a.country) return normalizeCountry(titleCase(a.country));
  // A description equal to the 2-character EDGAR code (e.g. "X0") is not a country name.
  for (const a of foreign) if (a.stateOrCountryDescription && a.stateOrCountryDescription !== a.stateOrCountry) return normalizeCountry(a.stateOrCountryDescription);
  for (const a of foreign) if (a.countryCode) return a.countryCode;
  return 'Inconnu';
}

export function companyProfile(s: Submissions): CompanyProfile {
  const sic = Number(s.sic);
  return { cik: Number(s.cik), name: s.name, sic, archetype: sicToArchetype(sic), country: countryOf(s.addresses) };
}

/** Deal history from filings: years with a completed acquisition or disposition (8-K item 2.01). */
export function acquisitionYears(s: Submissions): number[] {
  const r = s.filings?.recent;
  if (!r) return [];
  const years = r.form.flatMap((form, i) => (form.startsWith('8-K') && (r.items?.[i] ?? '').split(',').includes('2.01') ? [Number(r.filingDate[i].slice(0, 4))] : []));
  return [...new Set(years)].sort();
}

export const SIZE_BUCKETS = ['<50M', '50–250M', '250M–1B', '1–5B', '>5B'] as const;
export type SizeBucket = (typeof SIZE_BUCKETS)[number];
export function sizeBucket(revenueUsd: number): SizeBucket {
  if (revenueUsd < 50e6) return '<50M';
  if (revenueUsd < 250e6) return '50–250M';
  if (revenueUsd < 1e9) return '250M–1B';
  if (revenueUsd < 5e9) return '1–5B';
  return '>5B';
}

/** What a company achieved over `years`: margin and working-capital changes, revenue CAGR. */
export interface WindowRecord {
  cik: number; name: string; archetype: SectorArchetype | null; country: string;
  startYear: number; endYear: number; sizeBucket: SizeBucket; acquisition: boolean;
  deltas: Partial<Record<'EBITDA_MARGIN' | 'REVENUE_GROWTH' | 'DSO' | 'DIO' | 'DPO', number>>;
  source: string;
}

export function windowRecords(
  p: CompanyProfile, metrics: Record<number, Partial<Record<EmpiricalMetric, number>>>, deals: number[], years: number,
): WindowRecord[] {
  const out: WindowRecord[] = [];
  for (const start of Object.keys(metrics).map(Number).sort()) {
    const a = metrics[start], b = metrics[start + years];
    if (!a?.REVENUE || !b?.REVENUE || a.REVENUE < MIN_REVENUE_USD) continue;
    const deltas: WindowRecord['deltas'] = { REVENUE_GROWTH: (b.REVENUE / a.REVENUE) ** (1 / years) - 1 };
    for (const k of ['EBITDA_MARGIN', 'DSO', 'DIO', 'DPO'] as const) {
      if (a[k] !== undefined && b[k] !== undefined) deltas[k] = b[k]! - a[k]!;
    }
    out.push({
      cik: p.cik, name: p.name, archetype: p.archetype, country: p.country,
      startYear: start, endYear: start + years, sizeBucket: sizeBucket(a.REVENUE),
      acquisition: deals.some((y) => y >= start && y <= start + years),
      deltas, source: `https://data.sec.gov/api/xbrl/companyfacts/CIK${String(p.cik).padStart(10, '0')}.json`,
    });
  }
  return out;
}

const ENTRY_CODES = ['EBITDA_ENTRY', 'CAPEX', 'COGS_RATIO', 'DSO', 'DIO', 'DPO', 'WORKING_CAPITAL'] as const;

/**
 * The latest annual filing as entry facts of a dossier (docs/23), in filing currency units.
 * Only what the filing states: a fact that cannot be computed is listed in `missing`, never
 * estimated. Net debt is left to the analyst (too many debt concepts to read reliably).
 */
export function entryFacts(cf: CompanyFacts): { fiscalYear: number; values: Record<string, number>; missing: string[] } | null {
  const s = Object.fromEntries(Object.entries(CONCEPTS).map(([k, c]) => [k, annualSeries(cf, c)])) as Record<keyof typeof CONCEPTS, Record<number, number>>;
  const capex = annualSeries(cf, ['PaymentsToAcquirePropertyPlantAndEquipment', 'PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities']);
  const years = Object.keys(s.revenue).map(Number).filter((y) => s.revenue[y] > 0);
  if (!years.length) return null;
  const y = Math.max(...years);
  const rev = s.revenue[y], cogs = s.cogs[y];
  const values: Record<string, number> = { REVENUE: rev };
  if (s.operatingIncome[y] !== undefined && s.da[y] !== undefined) values.EBITDA_ENTRY = s.operatingIncome[y] + s.da[y];
  if (capex[y] !== undefined) values.CAPEX = capex[y];
  if (cogs > 0) values.COGS_RATIO = cogs / rev;
  if (s.receivables[y] !== undefined) values.DSO = (s.receivables[y] / rev) * 365;
  if (cogs > 0 && s.inventory[y] !== undefined) values.DIO = (s.inventory[y] / cogs) * 365;
  if (cogs > 0 && s.payables[y] !== undefined) values.DPO = (s.payables[y] / cogs) * 365;
  if (s.receivables[y] !== undefined && s.inventory[y] !== undefined && s.payables[y] !== undefined) {
    values.WORKING_CAPITAL = s.receivables[y] + s.inventory[y] - s.payables[y];
  }
  return { fiscalYear: y, values, missing: ENTRY_CODES.filter((c) => !(c in values)) };
}
