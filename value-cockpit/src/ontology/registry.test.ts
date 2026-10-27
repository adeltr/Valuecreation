import { describe, it, expect } from 'vitest';
import { getActiveVocabulary, type SectorArchetype } from './registry';

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
