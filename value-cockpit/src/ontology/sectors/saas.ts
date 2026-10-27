import type { MetricMeta } from '../base';

export const SAAS_METRIC_CODES = [
  'ARR', 'GROSS_CHURN', 'EXPANSION_RATE', 'NRR', 'CAC', 'LTV', 'ARR_EXIT',
] as const;

export const SAAS_METRIC_META: Record<(typeof SAAS_METRIC_CODES)[number], MetricMeta> = {
  ARR: { unit: 'currency' },
  GROSS_CHURN: { unit: 'percent' },
  EXPANSION_RATE: { unit: 'percent' },
  NRR: { unit: 'ratio' },
  CAC: { unit: 'currency' },
  LTV: { unit: 'currency' },
  ARR_EXIT: { unit: 'currency' },
};

export const SAAS_LEVER_CATEGORIES = ['RETENTION', 'EXPANSION', 'SALES_EFFICIENCY'] as const;
