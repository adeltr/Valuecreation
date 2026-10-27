import { z } from 'zod';
import { getActiveVocabulary, SECTOR_ARCHETYPES, type SectorArchetype } from '../../ontology/registry';
import { SCENARIO_ASSUMPTION_CODES } from '../../ontology/base';
import { makeLeverSchema, makeRootCauseSchema } from '../../domain/schemas';
import type { Lever, RootCause } from '../../domain/types';
import { TEMPLATES } from '../../templates';
import type { CockpitState } from './store';

export const DOSSIER_FORMAT = 'value-cockpit-dossier';
export const DOSSIER_VERSION = 1;

/**
 * A saved company case. It holds what the analyst entered or decided — inputs, levers and
 * their status, causes, scenario choices — and never an engine output: every figure is
 * recomputed by the engine on load (invariant 1).
 */
export interface DossierFile {
  format: typeof DOSSIER_FORMAT;
  version: typeof DOSSIER_VERSION;
  name: string;
  savedAt: string;
  archetype: SectorArchetype;
  inputs: Record<string, number>;
  levers: Lever[];
  rootCauses: RootCause[];
  scenario: CockpitState['scenario'];
  nextId: number;
}

export function toDossier(state: CockpitState, savedAt: string): DossierFile {
  const name = state.name.trim();
  if (!name) throw new Error('Donne un nom au dossier avant de l\'enregistrer ou de l\'exporter');
  return {
    format: DOSSIER_FORMAT, version: DOSSIER_VERSION, name, savedAt,
    archetype: state.archetype,
    inputs: state.inputs, levers: state.levers, rootCauses: state.rootCauses,
    scenario: state.scenario, nextId: state.nextId,
  };
}

const envelope = z.object({
  format: z.literal(DOSSIER_FORMAT),
  version: z.literal(DOSSIER_VERSION),
  name: z.string().min(1),
  savedAt: z.string(),
  archetype: z.string(),
  inputs: z.record(z.number().finite()),
  levers: z.array(z.unknown()),
  rootCauses: z.array(z.unknown()),
  scenario: z.object({
    leverIds: z.array(z.string()),
    applied: z.record(z.number().finite()),
    assumptions: z.record(z.number().finite()),
  }),
  nextId: z.number().int().min(1),
});

const issues = (e: z.ZodError) => e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');

function parseWith<T>(schema: z.ZodType<T>, value: unknown, what: string): T {
  const r = schema.safeParse(value);
  if (!r.success) throw new Error(`${what} invalide — ${issues(r.error)}`);
  return r.data;
}

/** Validates an untrusted dossier file against the current templates and vocabulary. Throws, never guesses. */
export function parseDossier(raw: unknown): CockpitState {
  const head = envelope.safeParse(raw);
  if (!head.success) throw new Error(`Fichier de dossier invalide — ${issues(head.error)}`);
  const file = head.data;

  if (!(SECTOR_ARCHETYPES as readonly string[]).includes(file.archetype) || !TEMPLATES[file.archetype as SectorArchetype]) {
    throw new Error(`Type d'entreprise inconnu : ${file.archetype}`);
  }
  const archetype = file.archetype as SectorArchetype;

  const expected = Object.keys(TEMPLATES[archetype]!.demoInputs);
  const missing = expected.filter((c) => !(c in file.inputs));
  const unknown = Object.keys(file.inputs).filter((c) => !expected.includes(c));
  if (missing.length || unknown.length) {
    throw new Error(`Inputs incompatibles avec le modèle ${archetype}`
      + (missing.length ? ` — manquants : ${missing.join(', ')}` : '')
      + (unknown.length ? ` — inconnus : ${unknown.join(', ')}` : ''));
  }

  const vocab = getActiveVocabulary(archetype);
  const levers = parseWith(z.array(makeLeverSchema(vocab)), file.levers, 'Levier') as Lever[];
  const rootCauses = parseWith(z.array(makeRootCauseSchema(vocab)), file.rootCauses, 'Cause') as RootCause[];

  const { leverIds, applied, assumptions } = file.scenario;
  for (const id of leverIds) {
    if (levers.find((l) => l.id === id)?.status !== 'validated') {
      throw new Error(`Scénario invalide : le levier ${id} n'est pas validé par l'analyste`);
    }
  }
  const appliedKeys = Object.keys(applied);
  if (appliedKeys.length !== leverIds.length || appliedKeys.some((k) => !leverIds.includes(k))) {
    throw new Error('Scénario invalide : les deltas appliqués ne correspondent pas aux leviers du scénario');
  }
  for (const code of Object.keys(assumptions)) {
    if (!(SCENARIO_ASSUMPTION_CODES as readonly string[]).includes(code)) {
      throw new Error(`Hypothèse non autorisée : ${code} (assumption limitée à ${SCENARIO_ASSUMPTION_CODES.join(', ')})`);
    }
  }

  // Ids are h<n>: the next one must be past every id already in the file, whatever nextId says.
  const used = [...levers, ...rootCauses].map((x) => Number(/^h(\d+)$/.exec(x.id)?.[1] ?? 0));
  const nextId = Math.max(file.nextId, ...used.map((n) => n + 1));

  return {
    name: file.name, archetype, inputs: file.inputs, levers, rootCauses,
    scenario: { leverIds, applied, assumptions }, nextId, error: null,
  };
}
