import { describe, it, expect } from 'vitest';
import { annualSeries, companyProfile, sicToArchetype, yearMetrics, acquisitionYears, windowRecords, sizeBucket } from './edgar';

// Excerpts in the documented shape of data.sec.gov (companyfacts / submissions) — test fixtures only.
const fy = (y: number, val: number, extra: object = {}) => ({ start: `${y}-01-01`, end: `${y}-12-31`, val, fy: y, fp: 'FY', form: '10-K', filed: `${y + 1}-02-15`, ...extra });
const inst = (y: number, val: number) => ({ end: `${y}-12-31`, val, fy: y, fp: 'FY', form: '10-K', filed: `${y + 1}-02-15` });
const facts = {
  cik: 1, entityName: 'Air Test Inc.',
  facts: { 'us-gaap': {
    Revenues: { units: { USD: [fy(2018, 1000), fy(2019, 1100), fy(2020, 1210), fy(2021, 1331),
      { start: '2021-10-01', end: '2021-12-31', val: 400, fy: 2021, fp: 'Q4', form: '10-K', filed: '2022-02-15' },  // quarter: ignored
      fy(2020, 1200, { form: '10-K/A', filed: '2021-06-01' })] } },                                                     // amendment: latest filing wins
    OperatingIncomeLoss: { units: { USD: [fy(2018, 80), fy(2019, 99), fy(2020, 120), fy(2021, 160)] } },
    DepreciationDepletionAndAmortization: { units: { USD: [fy(2018, 20), fy(2019, 22), fy(2020, 24), fy(2021, 26)] } },
    AccountsReceivableNetCurrent: { units: { USD: [inst(2018, 100), inst(2021, 73)] } },
    CostOfRevenue: { units: { USD: [fy(2018, 600), fy(2021, 800)] } },
    InventoryNet: { units: { USD: [inst(2018, 60), inst(2021, 40)] } },
    AccountsPayableCurrent: { units: { USD: [inst(2018, 50), inst(2021, 88)] } },
  } },
};
const submissions = {
  cik: '1', name: 'Air Test Inc.', sic: '4512', sicDescription: 'Air Transportation, Scheduled',
  addresses: { business: { stateOrCountry: 'TX', stateOrCountryDescription: 'TX', isForeignLocation: 0 } },
  filings: { recent: { form: ['8-K', '10-K', '8-K'], items: ['2.01,9.01', '', '5.02'], filingDate: ['2019-05-01', '2020-02-15', '2020-07-01'] } },
};

describe('EDGAR parsing', () => {
  it('annual series: fiscal-year durations only, the latest filing of a year wins', () => {
    expect(annualSeries(facts, ['Revenues'])).toEqual({ 2018: 1000, 2019: 1100, 2020: 1200, 2021: 1331 });
  });

  it('falls back through concept aliases', () => {
    const alt = { ...facts, facts: { 'us-gaap': { RevenueFromContractWithCustomerExcludingAssessedTax: facts.facts['us-gaap'].Revenues } } };
    expect(annualSeries(alt, ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax'])[2019]).toBe(1100);
  });

  it('per-year metrics in ontology terms: EBITDA margin, DSO, DIO, DPO', () => {
    const m = yearMetrics(facts);
    expect(m[2018]).toEqual({ REVENUE: 1000, EBITDA_MARGIN: 0.1, DSO: 36.5, DIO: 36.5, DPO: (50 / 600) * 365 });
    expect(m[2019]).toEqual({ REVENUE: 1100, EBITDA_MARGIN: 121 / 1100 });
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

  it('deal history: years with a completed acquisition (8-K item 2.01)', () => {
    expect(acquisitionYears(submissions)).toEqual([2019]);
  });

  it('window records: change of each metric over n years, size at start, deal flag', () => {
    const [r] = windowRecords(companyProfile(submissions), yearMetrics(facts), acquisitionYears(submissions), 3);
    expect(r).toMatchObject({ cik: 1, archetype: 'airline', country: 'United States', startYear: 2018, endYear: 2021, sizeBucket: '<50M', acquisition: true });
    expect(r.deltas.EBITDA_MARGIN).toBeCloseTo(186 / 1331 - 0.1, 12);
    expect(r.deltas.REVENUE_GROWTH).toBeCloseTo((1331 / 1000) ** (1 / 3) - 1, 12);
    expect(r.deltas.DSO).toBeCloseTo(73 / 1331 * 365 - 36.5, 12);
    expect(r.source).toBe('https://data.sec.gov/api/xbrl/companyfacts/CIK0000000001.json');
  });
});
