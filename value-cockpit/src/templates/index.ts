import type { Metric } from '../domain/types';
import type { SectorArchetype } from '../ontology/registry';
import { instantiateSaasTemplate, type SaasInputs } from './saas';
import { instantiateAeroTemplate, type AeroInputs } from './aero';
import { instantiateAirlineTemplate, type AirlineInputs } from './airline';

export interface TemplateEntry {
  label: string;
  instantiate(companyId: string, inputs: Record<string, number>): Metric[];
  /** Illustrative inputs (the reference cases of each template's tests), editable in the UI. */
  demoInputs: Record<string, number>;
}

export const TEMPLATES: Partial<Record<SectorArchetype, TemplateEntry>> = {
  saas: {
    label: 'SaaS',
    instantiate: (id, i) => instantiateSaasTemplate(id, i as SaasInputs),
    demoInputs: {
      ARR: 100, GROSS_CHURN: 0.10, EXPANSION_RATE: 0.12, EBITDA_MARGIN: 0.20,
      ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 4, NET_DEBT_ENTRY: 60, FCF_ANNUAL: 8,
    },
  },
  aero: {
    label: 'Aerospace & Defense',
    instantiate: (id, i) => instantiateAeroTemplate(id, i as AeroInputs),
    demoInputs: {
      REVENUE: 500, EBITDA_MARGIN: 0.12, BOOK_TO_BILL: 1.06, FIXED_PRICE_SHARE: 0.60,
      COST_OVERRUN_RATE: 0.03, ENTRY_MULTIPLE: 9, EXIT_MULTIPLE: 9, HOLD_YEARS: 5,
      NET_DEBT_ENTRY: 300, FCF_ANNUAL: 25,
    },
  },
  airline: {
    label: 'Airline',
    instantiate: (id, i) => instantiateAirlineTemplate(id, i as AirlineInputs),
    demoInputs: {
      ASK: 10_000, LOAD_FACTOR: 0.82, YIELD: 0.09, ANCILLARY_PER_PAX: 15, AVG_TRIP_KM: 1_500,
      CASK_EX_FUEL: 0.045, FUEL_CASK: 0.022, CAPACITY_GROWTH: 0.04, EBITDA_ENTRY: 150,
      ENTRY_MULTIPLE: 6, EXIT_MULTIPLE: 6, HOLD_YEARS: 5, NET_DEBT_ENTRY: 400, FCF_ANNUAL: 40,
    },
  },
};
