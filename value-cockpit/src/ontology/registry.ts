import {
  BASE_METRIC_CODES, BASE_METRIC_META, BASE_LEVER_CATEGORIES,
  BASE_CAUSE_CATEGORIES, NODE_TYPES, NON_LEVER_CODES, type MetricMeta,
} from './base';
import { SAAS_METRIC_CODES, SAAS_METRIC_META, SAAS_LEVER_CATEGORIES } from './sectors/saas';
import {
  AERO_METRIC_CODES, AERO_METRIC_META,
  AERO_LEVER_CATEGORIES, AERO_CAUSE_CATEGORIES,
} from './sectors/aero';
import { SPECS } from '../sectors';
import {
  CPG_METRIC_CODES, CPG_METRIC_META, CPG_LEVER_CATEGORIES, CPG_CAUSE_CATEGORIES,
} from './sectors/cpg';
import {
  AIRLINE_METRIC_CODES, AIRLINE_METRIC_META,
  AIRLINE_LEVER_CATEGORIES, AIRLINE_CAUSE_CATEGORIES,
} from './sectors/airline';

// Level 2 — sector extension + dedicated template.
// Level 2 defined by a sector spec (src/sectors, docs/14).
export const SPEC_ARCHETYPES = ['manufacturing', 'retail', 'chemical', 'agriculture', 'cosmetics', 'electricity-generation', 'healthcare-provider'] as const;
export const EXTENDED_ARCHETYPES = ['saas', 'aero', 'airline', 'cpg', ...SPEC_ARCHETYPES] as const;
// Level 1 — EBITDA-family company types on the base vocabulary + generic template (docs/11).
// 15 types; cpg moved to level 2.
export const BASE_ARCHETYPES = [
  'hospitality', 'media', 'medical-device', 'metals-mining', 'pharma',
  'third-party-logistics', 'waste-management', 'wine-spirits',
] as const;
export const SECTOR_ARCHETYPES = ['generic', ...EXTENDED_ARCHETYPES, ...BASE_ARCHETYPES] as const;
export type SectorArchetype = (typeof SECTOR_ARCHETYPES)[number];

export interface ActiveVocabulary {
  metricCodes: string[];
  metricMeta: Record<string, MetricMeta>;
  leverCategories: string[];
  causeCategories: string[];
  nodeTypes: string[];
  isMetricCode(v: unknown): boolean;
  isLeverTarget(v: unknown): boolean;
  isLeverCategory(v: unknown): boolean;
  isCauseCategory(v: unknown): boolean;
}

// One archetype per Umbrex company type (docs/11). Add one via docs/09.
const EXTENSIONS: Partial<Record<SectorArchetype, {
  codes: readonly string[];
  meta: Record<string, MetricMeta>;
  levers: readonly string[];
  causes?: readonly string[];
}>> = {
  saas: { codes: SAAS_METRIC_CODES, meta: SAAS_METRIC_META, levers: SAAS_LEVER_CATEGORIES },
  aero: { codes: AERO_METRIC_CODES, meta: AERO_METRIC_META, levers: AERO_LEVER_CATEGORIES, causes: AERO_CAUSE_CATEGORIES },
  ...Object.fromEntries(Object.values(SPECS).map((spec) => [spec.archetype, {
    codes: [...spec.inputs, ...spec.diagnostics, ...spec.calculated].map((t) => t.code),
    meta: Object.fromEntries([...spec.inputs, ...spec.diagnostics, ...spec.calculated].map((t) => [t.code, { unit: t.unit }])),
    levers: spec.levers.map((l) => l.category),
    causes: spec.causes.map((c) => c.category),
  }])),
  cpg: { codes: CPG_METRIC_CODES, meta: CPG_METRIC_META, levers: CPG_LEVER_CATEGORIES, causes: CPG_CAUSE_CATEGORIES },
  airline: { codes: AIRLINE_METRIC_CODES, meta: AIRLINE_METRIC_META, levers: AIRLINE_LEVER_CATEGORIES, causes: AIRLINE_CAUSE_CATEGORIES },
};

export function getActiveVocabulary(archetype: SectorArchetype): ActiveVocabulary {
  if (!(SECTOR_ARCHETYPES as readonly string[]).includes(archetype)) {
    throw new Error(`Unknown archetype: ${archetype}`);
  }
  const ext = EXTENSIONS[archetype];
  const metricCodes = [...BASE_METRIC_CODES, ...(ext?.codes ?? [])];
  const metricMeta = { ...BASE_METRIC_META, ...(ext?.meta ?? {}) };
  const leverCategories = [...BASE_LEVER_CATEGORIES, ...(ext?.levers ?? [])];
  const causeCategories: string[] = [...BASE_CAUSE_CATEGORIES, ...(ext?.causes ?? [])];
  return {
    metricCodes, metricMeta, leverCategories, causeCategories, nodeTypes: [...NODE_TYPES],
    isMetricCode: (v) => metricCodes.includes(v as string),
    isLeverTarget: (v) => metricCodes.includes(v as string)
      && !(NON_LEVER_CODES as readonly string[]).includes(v as string),
    isLeverCategory: (v) => leverCategories.includes(v as string),
    isCauseCategory: (v) => causeCategories.includes(v as string),
  };
}
