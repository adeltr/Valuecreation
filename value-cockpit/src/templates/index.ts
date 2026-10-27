import type { Metric } from '../domain/types';
import { BASE_ARCHETYPES, type SectorArchetype } from '../ontology/registry';
import { SPECS } from '../sectors';
import { makeTemplate, FAMILY_BRIDGE } from './build';
import type { InteractionRule } from '../domain/types';
import { instantiateSaasTemplate, type SaasInputs } from './saas';
import { instantiateAeroTemplate, type AeroInputs } from './aero';
import { instantiateAirlineTemplate, type AirlineInputs } from './airline';
import { instantiateEbitdaTemplate, type EbitdaInputs } from './ebitda';
import { instantiateCpgTemplate, type CpgInputs } from './cpg';

export interface TemplateEntry {
  label: string;
  /** 2 = sector extension + dedicated template; 1 = base vocabulary + generic EBITDA template. */
  level: 1 | 2;
  instantiate(companyId: string, inputs: Record<string, number>): Metric[];
  /** Illustrative inputs (the reference cases of each template's tests), editable in the UI. */
  demoInputs: Record<string, number>;
  /** Analyst-set interaction rules applied by the scenario engine (docs/06). */
  interactions: InteractionRule[];
}

const LEVEL1_LABELS: Record<(typeof BASE_ARCHETYPES)[number], string> = {
};

// Illustrative inputs shared by every level-1 archetype until the analyst enters the company's own.
const EBITDA_DEMO: EbitdaInputs = {
  REVENUE: 400, REVENUE_GROWTH: 0.05, EBITDA_MARGIN: 0.15, EBITDA_ENTRY: 60,
  ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 5, NET_DEBT_ENTRY: 200, FCF_ANNUAL: 20,
};

const LEVEL1: Partial<Record<SectorArchetype, TemplateEntry>> = Object.fromEntries(
  BASE_ARCHETYPES.map((a) => [a, {
    label: LEVEL1_LABELS[a], level: 1,
    instantiate: (id: string, i: Record<string, number>) => instantiateEbitdaTemplate(id, i as EbitdaInputs, a),
    demoInputs: { ...EBITDA_DEMO },
    interactions: [],
  } satisfies TemplateEntry]),
);

const LEVEL2_SPECS: Partial<Record<SectorArchetype, TemplateEntry>> = Object.fromEntries(
  Object.values(SPECS).map((spec) => [spec.archetype, {
    label: spec.label, level: 2,
    instantiate: makeTemplate(spec.archetype as SectorArchetype, { ...spec.formulas, ...FAMILY_BRIDGE[spec.family ?? 'ebitda'].formulas }),
    demoInputs: { ...spec.demoInputs },
    interactions: (spec.interactions ?? []).map((r) => ({ sourceCode: r.source, targetCode: r.target, coefficientCode: r.coefficient })),
  } satisfies TemplateEntry]),
);

export const TEMPLATES: Partial<Record<SectorArchetype, TemplateEntry>> = {
  ...LEVEL1,
  ...LEVEL2_SPECS,
  saas: {
    label: 'SaaS',
    level: 2,
    instantiate: (id, i) => instantiateSaasTemplate(id, i as SaasInputs),
    demoInputs: {
      ARR: 100, GROSS_CHURN: 0.10, EXPANSION_RATE: 0.12, EBITDA_MARGIN: 0.20,
      ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 4, NET_DEBT_ENTRY: 60, FCF_ANNUAL: 8,
    },
    interactions: [],
  },
  aero: {
    label: 'Aerospace & Defense',
    level: 2,
    instantiate: (id, i) => instantiateAeroTemplate(id, i as AeroInputs),
    demoInputs: {
      REVENUE: 500, EBITDA_MARGIN: 0.12, BOOK_TO_BILL: 1.06, FIXED_PRICE_SHARE: 0.60,
      COST_OVERRUN_RATE: 0.03, ENTRY_MULTIPLE: 9, EXIT_MULTIPLE: 9, HOLD_YEARS: 5,
      NET_DEBT_ENTRY: 300, FCF_ANNUAL: 25,
    },
    interactions: [],
  },
  cpg: {
    label: 'Consumer Packaged Goods',
    level: 2,
    instantiate: (id, i) => instantiateCpgTemplate(id, i as CpgInputs),
    demoInputs: {
      REVENUE: 1000, VOLUME_GROWTH: 0.03, PRICE_MIX_GROWTH: 0.02, GROSS_MARGIN: 0.45,
      TRADE_SPEND_RATE: 0.12, AP_RATE: 0.08, OVERHEAD_RATE: 0.10, EBITDA_ENTRY: 150,
      ENTRY_MULTIPLE: 10, EXIT_MULTIPLE: 10, HOLD_YEARS: 5, NET_DEBT_ENTRY: 600, FCF_ANNUAL: 60,
      PRICE_ELASTICITY: -0.8, // analyst choice; #21 price-pack (Price Elasticity) to calibrate
    },
    interactions: [{ sourceCode: 'PRICE_MIX_GROWTH', targetCode: 'VOLUME_GROWTH', coefficientCode: 'PRICE_ELASTICITY' }],
  },
  airline: {
    label: 'Airline',
    level: 2,
    instantiate: (id, i) => instantiateAirlineTemplate(id, i as AirlineInputs),
    demoInputs: {
      ASK: 10_000, LOAD_FACTOR: 0.82, YIELD: 0.09, ANCILLARY_PER_PAX: 15, AVG_TRIP_KM: 1_500,
      CASK_EX_FUEL: 0.045, FUEL_CASK: 0.022, CAPACITY_GROWTH: 0.04, EBITDA_ENTRY: 150,
      ENTRY_MULTIPLE: 6, EXIT_MULTIPLE: 6, HOLD_YEARS: 5, NET_DEBT_ENTRY: 400, FCF_ANNUAL: 40,
    },
    interactions: [],
  },
};
