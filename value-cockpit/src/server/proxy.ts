import express from 'express';
import { sanitizeProposal, type CopilotProposal } from '../copilot/proposal';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';

export function buildSystemPrompt(archetype: SectorArchetype): string {
  const v = getActiveVocabulary(archetype);
  return [
    'You propose root causes and levers for a PE value driver tree.',
    'Return ONLY a JSON object: { "rootCauses": [...], "levers": [...] }. No prose, no markdown.',
    `Lever.category MUST be one of: ${v.leverCategories.join(', ')}.`,
    `RootCause.category MUST be one of: ${v.causeCategories.join(', ')}.`,
    `impactMetricCode MUST be one of: ${v.metricCodes.filter(v.isLeverTarget).join(', ')}.`,
    "Every lever MUST include deltaKind ('absolute' or 'percent') and a non-empty confidenceBasis.",
    'NEVER output computed figures, scenario results, exit multiples, or assumptions — the engine and the analyst own those.',
  ].join('\n');
}

export async function handleProposal(
  archetype: SectorArchetype,
  userMessage: string,
  callModel: (system: string, user: string) => Promise<string>,
): Promise<CopilotProposal> {
  const text = await callModel(buildSystemPrompt(archetype), userMessage);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return sanitizeProposal(JSON.parse(cleaned), getActiveVocabulary(archetype));
}

export function createServer(callModel: (s: string, u: string) => Promise<string>) {
  const app = express();
  app.use(express.json());
  app.post('/api/propose', async (req, res) => {
    try {
      const archetype = (req.body?.archetype ?? 'generic') as SectorArchetype;
      res.json(await handleProposal(archetype, String(req.body?.message ?? ''), callModel));
    } catch (e) {
      res.status(422).json({ error: (e as Error).message });
    }
  });
  return app;
}
