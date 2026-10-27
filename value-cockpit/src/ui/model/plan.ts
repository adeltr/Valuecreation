import type { InteractionRule, Lever, Metric, RootCause } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import type { Unit } from '../../ontology/base';
import type { BridgeFamily } from '../../ontology/families';
import { FAMILY_BRIDGE } from '../../templates/build';
import { resolveMetrics } from '../../engine/resolver';
import { runScenario } from '../../engine/scenario';

export const PLAN_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];
export interface PlanOverride { owner?: string; status?: PlanStatus; note?: string }

export type Phase = 'diagnose' | 'design' | 'execute';
export interface Bar { phase: Phase; from: number; to: number }
export interface Milestone { day: number; label: string }
export type Quadrant = 'quick_win' | 'strategic' | 'fill_in' | 'reconsider';

export interface Workstream {
  id: string; title: string; category: string;
  owner: string; status: PlanStatus; note: string;
  bars: Bar[]; milestones: Milestone[]; beyond100: boolean; impactDay: number;
  kpi: { code: string; unit: Unit; baseline: number; target: number } | null;
  /** Engine-computed, this lever alone: MOIC change and change of the family anchor. */
  value: { moic: number; anchorDelta: number } | null;
  quadrant: Quadrant; effort: Lever['effort'];
  analyses: AnalysisRef[];
}

export interface Foundation { id: string; title: string; owner: string; status: PlanStatus; note: string; milestones: Milestone[] }

export interface HundredDayPlan {
  workstreams: Workstream[];
  foundations: Foundation[];
  totals: { anchorCode: string; moicBase: number; moicAll: number; moicBy100: number };
  risks: string[];
}

export interface PlanInput {
  levers: Lever[]; rootCauses: RootCause[]; metrics: Metric[]; catalog: AnalysisRef[];
  rules: InteractionRule[]; family: BridgeFamily; overrides: Record<string, PlanOverride>;
}

const HORIZON = 100;
const HIGH_VALUE_MOIC = 0.05; // ΔMOIC above which a lever counts as high value (analyst convention)
const UNASSIGNED = 'À désigner';

/** Diagnose J0–30, design J30–60, execute J60–100; compressed into thirds when impact lands by J60. */
function phases(t: number): Bar[] {
  if (t <= 60) {
    const a = Math.round(t / 3), b = Math.round((2 * t) / 3);
    return [{ phase: 'diagnose', from: 0, to: a }, { phase: 'design', from: a, to: b }, { phase: 'execute', from: b, to: t }];
  }
  return [{ phase: 'diagnose', from: 0, to: 30 }, { phase: 'design', from: 30, to: 60 }, { phase: 'execute', from: 60, to: Math.min(t, HORIZON) }];
}

const quadrant = (moic: number, effort: Lever['effort']): Quadrant => {
  const high = moic >= HIGH_VALUE_MOIC, easy = effort !== 'high';
  return high ? (easy ? 'quick_win' : 'strategic') : (easy ? 'fill_in' : 'reconsider');
};

// Cross-cutting workstreams every 100-day plan carries; the cash one follows the bridge family.
const CASH_TITLE: Record<BridgeFamily, [string, string]> = {
  ebitda: ['Cash et BFR', 'Prévision de trésorerie à 13 semaines et plan BFR'],
  book_value: ['Capital et liquidité', 'Trajectoire de capital réglementaire et politique de distribution'],
  rnpv: ['Trésorerie et runway', 'Plan de financement et jalons du runway'],
};
function foundations(family: BridgeFamily, overrides: Record<string, PlanOverride>): Foundation[] {
  const base: [string, string, Milestone[]][] = [
    ['f-governance', 'Gouvernance et PMO', [
      { day: 7, label: 'Comité de pilotage lancé, rituels hebdomadaires' }, { day: 30, label: 'Revue J30 : diagnostic validé' },
      { day: 60, label: 'Revue J60 : plans détaillés validés' }, { day: 100, label: 'Revue J100 : plan de création de valeur actualisé' },
    ]],
    ['f-kpi', 'Reporting et baseline KPI', [
      { day: 30, label: 'Baseline des KPI du modèle validée' }, { day: 60, label: 'Tableau de bord mensuel en place' },
    ]],
    ['f-cash', CASH_TITLE[family][0], [{ day: 30, label: CASH_TITLE[family][1] }]],
    ['f-people', 'Management et organisation', [
      { day: 30, label: 'Évaluation de l\'équipe dirigeante' }, { day: 60, label: 'Plan d\'intéressement aligné sur les KPI du plan' },
    ]],
    ['f-comms', 'Communication', [{ day: 7, label: 'Communication interne et aux clients clés' }]],
  ];
  return base.map(([id, title, milestones]) => ({
    id, title, milestones,
    owner: overrides[id]?.owner || UNASSIGNED, status: overrides[id]?.status ?? 'todo', note: overrides[id]?.note ?? '',
  }));
}

/** The 100-day plan of the validated levers. Every value is computed by the engine (invariant 1). */
export function buildPlan({ levers, rootCauses, metrics, catalog, rules, family, overrides }: PlanInput): HundredDayPlan {
  const anchorCode = FAMILY_BRIDGE[family].anchor;
  const base = resolveMetrics(metrics);
  const run = (ls: Lever[]) => {
    const r = runScenario('plan', metrics, ls, ls.map((l) => ({ scenarioId: 'plan', leverId: l.id, appliedDelta: l.expectedDelta, deltaKind: l.deltaKind })), [], rules);
    return new Map(r.map((x) => [x.metricCode, x.value]));
  };
  const byCode = new Map(metrics.map((m) => [m.code, m]));
  const validated = levers.filter((l) => l.status === 'validated').sort((a, b) => a.timeToImpactDays - b.timeToImpactDays);

  const workstreams = validated.map((l): Workstream => {
    const t = l.timeToImpactDays;
    const bars = phases(t);
    const analyses = catalog.filter((a) => a.relatedLeverCategories.includes(l.category)).slice(0, 3);
    const target = byCode.get(l.impactMetricCode);
    const moves = target && !target.isCalculated;
    const after = moves ? run([l]) : null;
    const value = after ? { moic: after.get('MOIC')! - base.get('MOIC')!, anchorDelta: after.get(anchorCode)! - base.get(anchorCode)! } : null;
    const baseline = target?.currentValue ?? null;
    return {
      id: l.id, title: l.label, category: l.category,
      owner: overrides[l.id]?.owner || UNASSIGNED, status: overrides[l.id]?.status ?? 'todo', note: overrides[l.id]?.note ?? '',
      bars, beyond100: t > HORIZON, impactDay: t,
      milestones: [
        { day: bars[0].to, label: `Diagnostic validé${analyses.length ? ` (${analyses.map((a) => a.id).join(', ')})` : ''}` },
        { day: bars[1].to, label: 'Business case et plan détaillé validés' },
        t <= HORIZON
          ? { day: t, label: `Premier impact mesuré sur ${l.impactMetricCode}` }
          : { day: HORIZON, label: `Exécution lancée, impact attendu à J+${t}` },
      ],
      kpi: moves && baseline !== null
        ? { code: l.impactMetricCode, unit: target.unit, baseline,
          target: l.deltaKind === 'percent' ? baseline * (1 + l.expectedDelta) : baseline + l.expectedDelta }
        : null,
      value, quadrant: quadrant(value?.moic ?? 0, l.effort), effort: l.effort, analyses,
    };
  });

  const movable = validated.filter((l) => byCode.get(l.impactMetricCode) && !byCode.get(l.impactMetricCode)!.isCalculated);
  const moicOf = (ls: Lever[]) => (ls.length ? run(ls).get('MOIC')! : base.get('MOIC')!);
  return {
    workstreams,
    foundations: foundations(family, overrides),
    totals: {
      anchorCode, moicBase: base.get('MOIC')!,
      moicAll: moicOf(movable), moicBy100: moicOf(movable.filter((l) => l.timeToImpactDays <= HORIZON)),
    },
    risks: rootCauses.filter((c) => c.severity === 'high').map((c) => `${c.description} (${c.category})`),
  };
}
