import { describe, it, expect } from 'vitest';
import { getActiveVocabulary, SECTOR_ARCHETYPES, EXTENDED_ARCHETYPES, BASE_ARCHETYPES, type SectorArchetype } from './registry';

describe('ontology registry', () => {
  const saas = getActiveVocabulary('saas');
  it('saas vocabulary = base ∪ saas extension', () => {
    expect(saas.metricCodes).toContain('EBITDA_EXIT');   // base
    expect(saas.metricCodes).toContain('GROSS_CHURN');   // extension
    expect(saas.leverCategories).toContain('PRICING');   // base
    expect(saas.leverCategories).toContain('RETENTION'); // extension
  });
  it('generic archetype has no saas terms', () => {
    const generic = getActiveVocabulary('generic');
    expect(generic.metricCodes).not.toContain('GROSS_CHURN');
  });
  it('guards validate against the ACTIVE vocabulary', () => {
    expect(saas.isLeverCategory('RETENTION')).toBe(true);
    expect(getActiveVocabulary('generic').isLeverCategory('RETENTION')).toBe(false);
    expect(saas.isLeverCategory('SYNERGY_MAGIC')).toBe(false);
  });
  it('every saas metric code has meta with a unit', () => {
    for (const code of saas.metricCodes) expect(saas.metricMeta[code]?.unit).toBeTypeOf('string');
  });
});

describe('ontology registry – aero extension', () => {
  const aero = getActiveVocabulary('aero' as SectorArchetype);

  it('aero vocabulary = base ∪ aero extension (metrics + levers)', () => {
    expect(aero.metricCodes).toContain('EBITDA_EXIT');            // base
    expect(aero.metricCodes).toContain('BOOK_TO_BILL');           // extension
    expect(aero.metricCodes).toContain('REVENUE_EXIT');           // extension (calculated)
    expect(aero.metricCodes).toContain('EBITDA_MARGIN_EXIT');     // extension (calculated)
    expect(aero.leverCategories).toContain('PRICING');            // base
    expect(aero.leverCategories).toContain('PROGRAM_EXECUTION');  // extension
    expect(aero.leverCategories).toContain('CONTRACT_MIX');       // extension
  });

  it('aero causeCategories extends base with GEOPOLITICAL, REGULATORY, PROGRAM', () => {
    expect(aero.causeCategories).toContain('COMMERCIAL');   // base
    expect(aero.causeCategories).toContain('GEOPOLITICAL'); // extension
    expect(aero.causeCategories).toContain('REGULATORY');   // extension
    expect(aero.causeCategories).toContain('PROGRAM');      // extension
    expect(aero.isCauseCategory('GEOPOLITICAL')).toBe(true);
    expect(aero.isCauseCategory('REGULATORY')).toBe(true);
    expect(aero.isCauseCategory('PROGRAM')).toBe(true);
  });

  it('generic archetype has no aero terms', () => {
    const generic = getActiveVocabulary('generic');
    expect(generic.metricCodes).not.toContain('BOOK_TO_BILL');
    expect(generic.causeCategories).not.toContain('GEOPOLITICAL');
    expect(generic.isCauseCategory('GEOPOLITICAL')).toBe(false);
  });

  it('every aero metric code has meta with a unit', () => {
    for (const code of aero.metricCodes) {
      expect(aero.metricMeta[code]?.unit, code).toBeTypeOf('string');
    }
  });
});

describe('ontology registry – lever targets', () => {
  const v = getActiveVocabulary('aero');
  it('excludes deal-structure codes from lever targets', () => {
    for (const code of ['EXIT_MULTIPLE', 'ENTRY_MULTIPLE', 'HOLD_YEARS', 'NET_DEBT_ENTRY']) {
      expect(v.isMetricCode(code)).toBe(true);
      expect(v.isLeverTarget(code), code).toBe(false);
    }
  });
  it('accepts operational inputs as lever targets', () => {
    expect(v.isLeverTarget('COST_OVERRUN_RATE')).toBe(true);
    expect(v.isLeverTarget('NOT_A_CODE')).toBe(false);
  });
});

describe('ontology registry – archetypes', () => {
  it('lists generic, the extended archetypes, then the 16 level-1 company types', () => {
    expect(SECTOR_ARCHETYPES.slice(0, 4)).toEqual(['generic', 'saas', 'aero', 'airline']);
    expect(SECTOR_ARCHETYPES).toHaveLength(20);
    expect(SECTOR_ARCHETYPES).toContain('cpg');
  });
  it('a level-1 archetype has exactly the base vocabulary', () => {
    expect(getActiveVocabulary('wine-spirits').metricCodes).toEqual(getActiveVocabulary('generic').metricCodes);
  });
});

describe('ontology registry – airline extension', () => {
  const airline = getActiveVocabulary('airline');

  it('airline vocabulary = base ∪ airline extension', () => {
    expect(airline.metricCodes).toContain('EBITDA_EXIT');
    for (const code of ['ASK', 'LOAD_FACTOR', 'YIELD', 'ANCILLARY_PER_PAX', 'CASK_EX_FUEL',
                        'FUEL_CASK', 'CAPACITY_GROWTH', 'AVG_TRIP_KM']) {
      expect(airline.metricCodes, code).toContain(code);
    }
    expect(airline.leverCategories).toContain('PRICING');
    for (const cat of ['NETWORK_OPTIMIZATION', 'REVENUE_MANAGEMENT', 'ANCILLARY', 'FLEET_PRODUCTIVITY',
                       'FUEL_EFFICIENCY', 'CREW_PRODUCTIVITY', 'AIRPORT_GROUND_COST', 'FLEET_FINANCING', 'ALLIANCES']) {
      expect(airline.leverCategories, cat).toContain(cat);
    }
  });

  it('airline causes extend base with REGULATORY, FUEL_PRICE, LABOR', () => {
    expect(airline.causeCategories).toContain('MARKET');
    for (const c of ['REGULATORY', 'FUEL_PRICE', 'LABOR']) expect(airline.isCauseCategory(c), c).toBe(true);
  });

  it('cargo is out of scope v1 and aero terms do not leak', () => {
    expect(airline.isMetricCode('CARGO_LOAD_FACTOR')).toBe(false);
    expect(airline.isMetricCode('BOOK_TO_BILL')).toBe(false);
    expect(getActiveVocabulary('aero').isMetricCode('LOAD_FACTOR')).toBe(false);
  });

  it('every airline metric code has meta with a unit', () => {
    for (const code of airline.metricCodes) expect(airline.metricMeta[code]?.unit, code).toBeTypeOf('string');
  });
});

describe('ontology registry – no duplicate codes', () => {
  it.each(SECTOR_ARCHETYPES)('%s vocabulary lists every code once', (a) => {
    const codes = getActiveVocabulary(a).metricCodes;
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('ontology registry – REGULATORY is a base cause', () => {
  it.each(SECTOR_ARCHETYPES)('%s has REGULATORY once', (a) => {
    const causes = getActiveVocabulary(a).causeCategories;
    expect(causes.filter((c) => c === 'REGULATORY')).toHaveLength(1);
    expect(new Set(causes).size).toBe(causes.length);
  });
});

describe('ontology registry – aero candidates validated (aero/_curation.md §C)', () => {
  const aero = getActiveVocabulary('aero');
  it('adds the 7 benchmarked diagnostics, RD_PORTFOLIO and CYBER', () => {
    for (const c of ['DEFENSE_REVENUE_SHARE', 'CLASSIFIED_REVENUE_SHARE', 'RD_INTENSITY', 'OPERATIONAL_AVAILABILITY',
                     'SPARE_PARTS_AVAILABILITY', 'SUSTAINMENT_COST', 'WORKFORCE_TURNOVER']) {
      expect(aero.isMetricCode(c), c).toBe(true);
    }
    expect(aero.isLeverCategory('RD_PORTFOLIO')).toBe(true);
    expect(aero.isCauseCategory('CYBER')).toBe(true);
  });
});

describe('ontology registry – cpg extension (level 2)', () => {
  const cpg = getActiveVocabulary('cpg');
  it('cpg is an extended archetype, no longer level 1', () => {
    expect(EXTENDED_ARCHETYPES).toContain('cpg');
    expect(BASE_ARCHETYPES).not.toContain('cpg');
  });
  it('adds the validated drivers, diagnostics, levers and causes (cpg/_level2.md)', () => {
    for (const c of ['VOLUME_GROWTH', 'PRICE_MIX_GROWTH', 'GROSS_MARGIN', 'TRADE_SPEND_RATE', 'AP_RATE', 'OVERHEAD_RATE',
                     'MARKET_SHARE', 'OUT_OF_STOCK_RATE', 'PRIVATE_LABEL_SHARE', 'RETAILER_CONCENTRATION',
                     'NEW_PRODUCT_SUCCESS_RATE', 'PROMO_ROI', 'EBITDA_MARGIN_EXIT']) {
      expect(cpg.isMetricCode(c), c).toBe(true);
    }
    for (const c of ['TRADE_SPEND_OPTIMIZATION', 'MARKETING_EFFECTIVENESS', 'ROUTE_TO_MARKET', 'IN_STORE_EXECUTION', 'INNOVATION_NPD']) {
      expect(cpg.isLeverCategory(c), c).toBe(true);
    }
    expect(cpg.isCauseCategory('RETAILER_POWER')).toBe(true);
    expect(cpg.isCauseCategory('COMMODITY_PRICES')).toBe(true);
  });
  it('EBITDA_MARGIN_EXIT is a base code shared by aero and cpg', () => {
    expect(getActiveVocabulary('retail').isMetricCode('EBITDA_MARGIN_EXIT')).toBe(true);
  });
});

describe('ontology registry – one term, one concept', () => {
  it('no code is both a metric and a lever/cause category, in any archetype', () => {
    const metrics = new Set(SECTOR_ARCHETYPES.flatMap((a) => getActiveVocabulary(a).metricCodes));
    const categories = SECTOR_ARCHETYPES.flatMap((a) => [...getActiveVocabulary(a).leverCategories, ...getActiveVocabulary(a).causeCategories]);
    expect(categories.filter((c) => metrics.has(c))).toEqual([]);
  });
});
