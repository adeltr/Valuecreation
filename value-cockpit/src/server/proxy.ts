import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { sanitizeProposal, type CopilotProposal } from '../copilot/proposal';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';
import { getCatalog } from '../catalog';
import { modelTargets } from '../templates/targets';
import { parseDossier } from '../dossier/format';
import { buildCompanyBrief } from '../copilot/brief';
import type { DossierRepository } from '../dossier/repository';
import { dossierRoutes } from './dossierRoutes';
import { requirePassword, type AuthOptions } from './auth';
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
    'The user message may end with a COMPANY DATA block: ground your causes and levers in it (cite the input or observation in "evidence" or "confidenceBasis"), size expectedDelta against the current value of the target, and do not repeat levers already on file.',
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
  company?: unknown,
): Promise<CopilotProposal> {
  let user = userMessage;
  if (company !== undefined && company !== null) {
    // Untrusted client data: validated as a dossier, figures recomputed by the engine in the brief.
    const dossier = parseDossier(company);
    if (dossier.archetype !== archetype) throw new Error(`Les données de l'entreprise sont de type ${dossier.archetype}, pas ${archetype}`);
    user = `${userMessage}\n\n${buildCompanyBrief(dossier)}`;
  }
  const text = await callModel(buildSystemPrompt(archetype), user);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return sanitizeProposal(JSON.parse(cleaned), getActiveVocabulary(archetype), modelTargets(archetype).calculated);
}

export function createServer(
  callModel: (s: string, u: string) => Promise<string>,
  options: { dossiers?: DossierRepository; empirical?: () => EmpiricalDataset | null; auth?: AuthOptions } = {},
) {
  const app = express();
  app.get('/api/session', (_req, res) => { res.json({ passwordRequired: Boolean(options.auth?.password) }); });
  app.use('/api', requirePassword(options.auth?.password));
  if (options.dossiers) app.use('/api/dossiers', dossierRoutes(options.dossiers, options.auth?.auditFile));
  if (options.empirical) app.use('/api/empirical', empiricalRoutes(options.empirical));
  app.use(express.json({ limit: '2mb' }));
  app.post('/api/propose', async (req, res) => {
    try {
      const archetype = (req.body?.archetype ?? 'generic') as SectorArchetype;
      res.json(await handleProposal(archetype, String(req.body?.message ?? ''), callModel, req.body?.company));
    } catch (e) {
      // Most specific first: credentials, rate limit, model overload, then anything else from the API.
      if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
        res.status(502).json({ error: 'Clé API Anthropic refusée : vérifiez ANTHROPIC_API_KEY sur le serveur' });
      } else if (e instanceof Anthropic.RateLimitError) {
        res.status(429).json({ error: 'Limite de débit de l\'API atteinte : réessayez dans un instant' });
      } else if (e instanceof Anthropic.APIConnectionError) {
        res.status(502).json({ error: 'API Anthropic injoignable depuis le serveur' });
      } else if (e instanceof Anthropic.APIError) {
        res.status(502).json({ error: `Erreur de l'API Anthropic (${e.status ?? '?'}) : ${e.message}` });
      } else {
        res.status(422).json({ error: (e as Error).message });
      }
    }
  });
  return app;
}
