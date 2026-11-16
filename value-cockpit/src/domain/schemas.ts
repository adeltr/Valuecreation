import { z } from 'zod';
import type { ActiveVocabulary } from '../ontology/registry';
import { DELTA_KINDS } from '../ontology/base';

const inVocab = (check: (v: unknown) => boolean, what: string) =>
  z.string().refine(check, { message: `not in active vocabulary: ${what}` });

/** A lever target: in the active vocabulary, and never a metric the model computes. */
export function leverTarget(vocab: ActiveVocabulary, calculated: readonly string[]) {
  return inVocab(vocab.isLeverTarget, 'lever target metric code')
    .refine((c) => !calculated.includes(c), (c) => ({ message: `${c} est calculé par le modèle : un levier agit sur un input` }));
}

export function makeLeverSchema(vocab: ActiveVocabulary, calculated: readonly string[] = []) {
  return z.object({
    id: z.string(),
    nodeId: z.string(),
    causeId: z.string().nullable(),
    label: z.string().min(1),
    mechanism: z.string().min(1),
    category: inVocab(vocab.isLeverCategory, 'lever category'),
    impactMetricCode: leverTarget(vocab, calculated),
    expectedDelta: z.number(),
    deltaKind: z.enum(DELTA_KINDS),
    timeToImpactDays: z.number().int().nonnegative(),
    effort: z.enum(['low', 'medium', 'high']),
    confidence: z.number().min(0).max(1),
    confidenceBasis: z.string().min(1, 'confidenceBasis is required'),
    source: z.enum(['claude', 'analyst']),
    status: z.enum(['hypothesis', 'validated', 'rejected']),
    implementationCost: z.number().finite().nonnegative().optional(),
    decision: z.object({ by: z.string().min(1), at: z.string().min(1) }).strict().optional(),
    createdBy: z.string().min(1).optional(),
  });
}

export function makeRootCauseSchema(vocab: ActiveVocabulary) {
  return z.object({
    id: z.string(),
    nodeId: z.string(),
    description: z.string().min(1),
    category: inVocab(vocab.isCauseCategory, 'cause category'),
    severity: z.enum(['low', 'medium', 'high']),
    source: z.enum(['claude', 'analyst']),
    evidence: z.string().nullable(),
    createdAt: z.string(),
  });
}
