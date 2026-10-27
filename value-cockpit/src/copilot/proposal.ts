import { z } from 'zod';
import type { ActiveVocabulary } from '../ontology/registry';
import { DELTA_KINDS } from '../ontology/base';

export function makeProposalSchema(vocab: ActiveVocabulary) {
  const inVocab = (check: (v: unknown) => boolean, what: string) =>
    z.string().refine(check, { message: `not in active vocabulary: ${what}` });

  const ProposedLever = z.object({
    nodeId: z.string(),
    causeId: z.string().nullable(),
    label: z.string().min(1),
    mechanism: z.string().min(1),
    category: inVocab(vocab.isLeverCategory, 'lever category'),
    impactMetricCode: inVocab(vocab.isMetricCode, 'metric code'),
    expectedDelta: z.number(),
    deltaKind: z.enum(DELTA_KINDS),
    timeToImpactDays: z.number().int().nonnegative(),
    effort: z.enum(['low', 'medium', 'high']),
    confidence: z.number().min(0).max(1),
    confidenceBasis: z.string().min(1, 'confidenceBasis is required'),
  });

  const ProposedCause = z.object({
    nodeId: z.string(),
    description: z.string().min(1),
    category: inVocab(vocab.isCauseCategory, 'cause category'),
    severity: z.enum(['low', 'medium', 'high']),
    evidence: z.string().nullable(),
  });

  return z.object({
    rootCauses: z.array(ProposedCause).optional(),
    levers: z.array(ProposedLever).optional(),
  }).strict();
}

export type CopilotProposal = z.infer<ReturnType<typeof makeProposalSchema>>;

export function sanitizeProposal(raw: unknown, vocab: ActiveVocabulary): CopilotProposal {
  const { scenarioResults: _sr, assumptions: _a, ...rest } = (raw ?? {}) as Record<string, unknown>;
  return makeProposalSchema(vocab).parse(rest);
}
