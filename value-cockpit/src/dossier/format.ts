import { z } from 'zod';
import { getActiveVocabulary, SECTOR_ARCHETYPES, type SectorArchetype } from '../ontology/registry';
import { SCENARIO_ASSUMPTION_CODES } from '../ontology/base';
import { makeLeverSchema, makeRootCauseSchema } from '../domain/schemas';
import type { Lever, RootCause } from '../domain/types';
import { TEMPLATES } from '../templates';

export type AssumptionCode = (typeof SCENARIO_ASSUMPTION_CODES)[number];

/** 100-day plan decisions of the analyst, per workstream (a lever id or a cross-cutting foundation). */
export const PLAN_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];
export interface PlanOverride { owner?: string; status?: PlanStatus; note?: string }
export const FOUNDATION_IDS = ['f-governance', 'f-kpi', 'f-cash', 'f-people', 'f-comms'] as const;

/** A company case as the analyst works it: what a dossier stores, plus the next id to hand out. */
export interface DossierCase {
  name: string;
  archetype: SectorArchetype;
  inputs: Record<string, number>;
  levers: Lever[];
  rootCauses: RootCause[];
  scenario: {
    leverIds: string[];
    applied: Record<string, number>;
    assumptions: Partial<Record<AssumptionCode, number>>;
  };
  plan: Record<string, PlanOverride>;
  nextId: number;
}

export const DOSSIER_FORMAT = 'value-cockpit-dossier';
export const DOSSIER_VERSION = 2; // 2: + plan (version 1 files open with an empty plan)

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
  scenario: DossierCase['scenario'];
  plan: DossierCase['plan'];
  nextId: number;
}

export function toDossier(state: DossierCase, savedAt: string): DossierFile {
  const name = state.name.trim();
  if (!name) throw new Error('Donne un nom au dossier avant de l\'enregistrer ou de l\'exporter');
  return {
    format: DOSSIER_FORMAT, version: DOSSIER_VERSION, name, savedAt,
    archetype: state.archetype,
    inputs: state.inputs, levers: state.levers, rootCauses: state.rootCauses,
    scenario: state.scenario, plan: state.plan, nextId: state.nextId,
  };
}

const envelope = z.object({
  format: z.literal(DOSSIER_FORMAT),
  version: z.union([z.literal(1), z.literal(DOSSIER_VERSION)]),
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
  plan: z.record(z.object({
    owner: z.string().optional(), status: z.enum(PLAN_STATUSES).optional(), note: z.string().optional(),
  }).strict()).default({}),
  nextId: z.number().int().min(1),
});

const issues = (e: z.ZodError) => e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');

function parseWith<T>(schema: z.ZodType<T>, value: unknown, what: string): T {
  const r = schema.safeParse(value);
  if (!r.success) throw new Error(`${what} invalide — ${issues(r.error)}`);
  return r.data;
}

/** Validates an untrusted dossier file against the current templates and vocabulary. Throws, never guesses. */
export function parseDossier(raw: unknown): DossierCase {
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

  for (const id of Object.keys(file.plan)) {
    if (!levers.some((l) => l.id === id) && !(FOUNDATION_IDS as readonly string[]).includes(id)) {
      throw new Error(`Plan invalide : chantier inconnu ${id}`);
    }
  }

  // Ids are h<n>: the next one must be past every id already in the file, whatever nextId says.
  const used = [...levers, ...rootCauses].map((x) => Number(/^h(\d+)$/.exec(x.id)?.[1] ?? 0));
  const nextId = Math.max(file.nextId, ...used.map((n) => n + 1));

  return {
    name: file.name, archetype, inputs: file.inputs, levers, rootCauses,
    scenario: { leverIds, applied, assumptions }, plan: file.plan, nextId,
  };
}
