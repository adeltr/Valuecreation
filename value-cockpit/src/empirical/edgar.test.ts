import { describe, it, expect } from 'vitest';
import { annualSeries, companyProfile, sicToArchetype, yearMetrics, acquisitionYears, windowRecords, sizeBucket, normalizeCountry, entryFacts } from './edgar';

// Excerpts in the documented shape of data.sec.gov (companyfacts / submissions) — test fixtures only.
const fy = (y: number, val: number, extra: object = {}) => ({ start: `${y}-01-01`, end: `${y}-12-31`, val, fy: y, fp: 'FY', form: '10-K', filed: `${y + 1}-02-15`, ...extra });
const inst = (y: number, val: number) => ({ end: `${y}-12-31`, val, fy: y, fp: 'FY', form: '10-K', filed: `${y + 1}-02-15` });
const facts = {
  cik: 1, entityName: 'Air Test Inc.',
  facts: { 'us-gaap': {
    Revenues: { units: { USD: [fy(2018, 1000e6), fy(2019, 1100e6), fy(2020, 1210e6), fy(2021, 1331e6),
      { start: '2021-10-01', end: '2021-12-31', val: 400e6, fy: 2021, fp: 'Q4', form: '10-K', filed: '2022-02-15' },  // quarter: ignored
      fy(2020, 1200e6, { form: '10-K/A', filed: '2021-06-01' })] } },                                                     // amendment: latest filing wins
    OperatingIncomeLoss: { units: { USD: [fy(2018, 80e6), fy(2019, 99e6), fy(2020, 120e6), fy(2021, 160e6)] } },
    DepreciationDepletionAndAmortization: { units: { USD: [fy(2018, 20e6), fy(2019, 22e6), fy(2020, 24e6), fy(2021, 26e6)] } },
    AccountsReceivableNetCurrent: { units: { USD: [inst(2018, 100e6), inst(2021, 73e6)] } },
    CostOfRevenue: { units: { USD: [fy(2018, 600e6), fy(2021, 800e6)] } },
    InventoryNet: { units: { USD: [inst(2018, 60e6), inst(2021, 40e6)] } },
    AccountsPayableCurrent: { units: { USD: [inst(2018, 50e6), inst(2021, 88e6)] } },
  } },
};
const submissions = {
  cik: '1', name: 'Air Test Inc.', sic: '4512', sicDescription: 'Air Transportation, Scheduled',
  addresses: { business: { stateOrCountry: 'TX', stateOrCountryDescription: 'TX', isForeignLocation: 0 } },
  filings: { recent: { form: ['8-K', '10-K', '8-K'], items: ['2.01,9.01', '', '5.02'], filingDate: ['2019-05-01', '2020-02-15', '2020-07-01'] } },
};

describe('EDGAR parsing', () => {
  it('annual series: fiscal-year durations only, the latest filing of a year wins', () => {
    expect(annualSeries(facts, ['Revenues'])).toEqual({ 2018: 1000e6, 2019: 1100e6, 2020: 1200e6, 2021: 1331e6 });
  });

  it('falls back through concept aliases', () => {
    const alt = { ...facts, facts: { 'us-gaap': { RevenueFromContractWithCustomerExcludingAssessedTax: facts.facts['us-gaap'].Revenues } } };
    expect(annualSeries(alt, ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax'])[2019]).toBe(1100e6);
  });

  it('per-year metrics in ontology terms: EBITDA margin, DSO, DIO, DPO', () => {
    const m = yearMetrics(facts);
    expect(m[2018]).toEqual({ REVENUE: 1000e6, EBITDA_MARGIN: 0.1, DSO: 36.5, DIO: 36.5, DPO: (50 / 600) * 365 });
    expect(m[2019]).toEqual({ REVENUE: 1100e6, EBITDA_MARGIN: 121 / 1100 });
  });

  it('profile: SIC → archetype, country, size bucket', () => {
    expect(companyProfile(submissions)).toEqual({ cik: 1, name: 'Air Test Inc.', sic: 4512, archetype: 'airline', country: 'United States' });
    const foreign = { ...submissions, addresses: { business: { stateOrCountry: 'X0', stateOrCountryDescription: 'United Kingdom', isForeignLocation: 1 } } };
    expect(companyProfile(foreign).country).toBe('United Kingdom');
    expect(sicToArchetype(2834)).toBe('pharma');
    expect(sicToArchetype(2836)).toBe('biotech');
    expect(sicToArchetype(9999)).toBeNull();
    expect(sizeBucket(30e6)).toBe('<50M');
    expect(sizeBucket(2e9)).toBe('1–5B');
  });

  it('country of a foreign filer: country name first, then description, then mailing address, then ISO code — never an EDGAR state code', () => {
    const at = (business: object, mailing: object = {}) => companyProfile({ ...submissions, addresses: { business, mailing } } as never).country;
    expect(at({ isForeignLocation: 1, country: 'UNITED KINGDOM', countryCode: 'GB', stateOrCountry: 'X0', stateOrCountryDescription: null })).toBe('United Kingdom');
    expect(at({ isForeignLocation: 1, stateOrCountry: 'X0', stateOrCountryDescription: 'United Kingdom' })).toBe('United Kingdom');
    expect(at({ isForeignLocation: 1, stateOrCountry: 'X0' }, { isForeignLocation: 1, country: 'IRELAND' })).toBe('Ireland');
    expect(at({ isForeignLocation: 1, countryCode: 'DE' })).toBe('DE');
    expect(at({ isForeignLocation: 1, stateOrCountry: 'A1', stateOrCountryDescription: 'British Columbia, Canada' })).toBe('Canada');
    expect(at({}, { isForeignLocation: 0, stateOrCountry: 'NY' })).toBe('United States');
  });

  it('plausibility: micro-revenue windows are excluded, impossible levels are dropped', () => {
    const tiny = { ...facts, facts: { 'us-gaap': { ...facts.facts['us-gaap'], Revenues: { units: { USD: [fy(2018, 2e6), fy(2021, 3e6)] } } } } };
    expect(windowRecords(companyProfile(submissions), yearMetrics(tiny), [], 3)).toEqual([]);
    const wild = { ...facts, facts: { 'us-gaap': { ...facts.facts['us-gaap'],
      Revenues: { units: { USD: [fy(2018, 20e6)] } },
      OperatingIncomeLoss: { units: { USD: [fy(2018, -60e6)] } },          // margin −300 %: dropped
      AccountsReceivableNetCurrent: { units: { USD: [inst(2018, 60e6)] } }, // DSO 1 095 days: dropped
    } } };
    expect(yearMetrics(wild)[2018]).toEqual({ REVENUE: 20e6, DIO: (60 / 600) * 365, DPO: (50 / 600) * 365 });
  });

  it('a province or state suffix collapses to the country (datasets imported before the fix included)', () => {
    expect(normalizeCountry('Ontario, Canada')).toBe('Canada');
    expect(normalizeCountry('Korea, Republic Of')).toBe('Korea, Republic Of');
    expect(normalizeCountry('United Kingdom')).toBe('United Kingdom');
  });

  it('deal history: years with a completed acquisition (8-K item 2.01)', () => {
    expect(acquisitionYears(submissions)).toEqual([2019]);
  });

  it('window records: change of each metric over n years, size at start, deal flag', () => {
    const [r] = windowRecords(companyProfile(submissions), yearMetrics(facts), acquisitionYears(submissions), 3);
    expect(r).toMatchObject({ cik: 1, archetype: 'airline', country: 'United States', startYear: 2018, endYear: 2021, sizeBucket: '1–5B', acquisition: true });
    expect(r.deltas.EBITDA_MARGIN).toBeCloseTo(186 / 1331 - 0.1, 12);
    expect(r.deltas.REVENUE_GROWTH).toBeCloseTo((1331 / 1000) ** (1 / 3) - 1, 12);
    expect(r.deltas.DSO).toBeCloseTo(73 / 1331 * 365 - 36.5, 12);
    expect(r.source).toBe('https://data.sec.gov/api/xbrl/companyfacts/CIK0000000001.json');
  });

  it('entry facts of the latest fiscal year, in the cockpit\'s input codes, with what could not be read', () => {
    const withCapex = { ...facts, facts: { 'us-gaap': { ...facts.facts['us-gaap'],
      PaymentsToAcquirePropertyPlantAndEquipment: { units: { USD: [fy(2021, 90e6)] } } } } };
    const e = entryFacts(withCapex)!;
    expect(e.fiscalYear).toBe(2021);
    expect(e.values).toEqual({
      REVENUE: 1331e6, EBITDA_ENTRY: 186e6, CAPEX: 90e6, COGS_RATIO: 800 / 1331,
      DSO: (73 / 1331) * 365, DIO: (40 / 800) * 365, DPO: (88 / 800) * 365, WORKING_CAPITAL: (73 + 40 - 88) * 1e6,
    });
    expect(e.missing).toEqual([]);
    const bare = entryFacts({ cik: 1, facts: { 'us-gaap': { Revenues: facts.facts['us-gaap'].Revenues } } })!;
    expect(bare.values).toEqual({ REVENUE: 1331e6 });
    expect(bare.missing).toEqual(['EBITDA_ENTRY', 'CAPEX', 'COGS_RATIO', 'DSO', 'DIO', 'DPO', 'WORKING_CAPITAL']);
    expect(entryFacts({ cik: 1, facts: {} })).toBeNull();
  });
});

