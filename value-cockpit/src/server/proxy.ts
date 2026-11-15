import express from 'express';
import { sanitizeProposal, type CopilotProposal } from '../copilot/proposal';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';
import { getCatalog } from '../catalog';
import { modelTargets } from '../templates/targets';
import type { DossierRepository } from '../dossier/repository';
import { dossierRoutes } from './dossierRoutes';
import { empiricalRoutes } from './empiricalRoutes';
import type { EmpiricalDataset } from '../empirical/importer';

export function buildSystemPrompt(archetype: SectorArchetype): string {
  const v = getActiveVocabulary(archetype);
  const targets = modelTargets(archetype);
  return [
    'You propose root causes and levers for a PE value driver tree.',
    'Return ONLY a JSON object: { "rootCauses": [...], "levers": [...] }. No prose, no markdown.',
    `Lever.category MUST be one of: ${v.leverCategories.join(', ')}.`,
    `RootCause.category MUST be one of: ${v.causeCategories.join(', ')}.`,
    ...(targets.quantified.length ? [`impactMetricCode MUST preferably be one of the model inputs, whose impact the engine computes: ${targets.quantified.join(', ')}.`] : []),
    `impactMetricCode MAY otherwise be one of these diagnostic metrics — the lever is then qualitative and is not simulated: ${targets.diagnostic.join(', ')}.`,
    'NEVER target a metric the model computes (exit aggregates, equity, MOIC): a lever acts on an input.',
    "Every lever MUST include deltaKind ('absolute' or 'percent') and a non-empty confidenceBasis.",
    'NEVER output computed figures, scenario results, exit multiples, or assumptions — the engine and the analyst own those.',
    ...catalogSection(archetype),
  ].join('\n');
}

function catalogSection(archetype: SectorArchetype): string[] {
  const catalog = getCatalog(archetype);
  if (catalog.length === 0) return [];
  return [
    `Analysis protocols available for this company type — cite the id in a root cause "evidence" (e.g. "cf. ${catalog[0].id}"):`,
    ...catalog.map((a) => `${a.id}: ${a.title}`),
  ];
}

export async function handleProposal(
  archetype: SectorArchetype,
  userMessage: string,
  callModel: (system: string, user: string) => Promise<string>,
): Promise<CopilotProposal> {
  const text = await callModel(buildSystemPrompt(archetype), userMessage);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return sanitizeProposal(JSON.parse(cleaned), getActiveVocabulary(archetype), modelTargets(archetype).calculated);
}

export function createServer(
  callModel: (s: string, u: string) => Promise<string>,
  options: { dossiers?: DossierRepository; empirical?: () => EmpiricalDataset | null } = {},
) {
  const app = express();
  if (options.dossiers) app.use('/api/dossiers', dossierRoutes(options.dossiers));
  if (options.empirical) app.use('/api/empirical', empiricalRoutes(options.empirical));
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
