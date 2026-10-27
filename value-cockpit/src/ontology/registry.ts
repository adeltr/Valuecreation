import {
  BASE_METRIC_CODES, BASE_METRIC_META, BASE_LEVER_CATEGORIES,
  BASE_CAUSE_CATEGORIES, NODE_TYPES, NON_LEVER_CODES, type MetricMeta,
} from './base';
import { SAAS_METRIC_CODES, SAAS_METRIC_META, SAAS_LEVER_CATEGORIES } from './sectors/saas';
import {
  AERO_METRIC_CODES, AERO_METRIC_META,
  AERO_LEVER_CATEGORIES, AERO_CAUSE_CATEGORIES,
} from './sectors/aero';
import {
  AIRLINE_METRIC_CODES, AIRLINE_METRIC_META,
  AIRLINE_LEVER_CATEGORIES, AIRLINE_CAUSE_CATEGORIES,
} from './sectors/airline';

export const SECTOR_ARCHETYPES = ['generic', 'saas', 'aero', 'airline'] as const;
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
