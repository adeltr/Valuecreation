import type { AnalysisRef } from '../catalog/types';
import type { Unit } from '../ontology/base';
import { evaluateParsed, type ParsedFormula } from './formulas';

/**
 * A measurement made in the workshop: the analyst's data for one formula of one analysis,
 * optionally linked to an ontology metric. The value is never stored: the engine recomputes it.
 */
export interface Observation {
  id: string;
  analysisId: string;
  formula: string;                  // output name of the formula in that analysis
  values: Record<string, number>;   // analyst data, one per formula variable
  metricCode: string | null;        // ontology metric it measures
  date: string;
  note: string;
  applied: boolean;                 // pushed into the company inputs by the analyst
}

export function findFormula(catalog: AnalysisRef[], analysisId: string, output: string): ParsedFormula | null {
  return catalog.find((a) => a.id === analysisId)?.formulas.find((f) => f.output === output) ?? null;
}

function formulaOf(o: Observation, catalog: AnalysisRef[]): ParsedFormula {
  if (!catalog.some((a) => a.id === o.analysisId)) throw new Error(`Analyse inconnue : ${o.analysisId}`);
  const f = findFormula(catalog, o.analysisId, o.formula);
  if (!f) throw new Error(`Formule inconnue dans ${o.analysisId} : ${o.formula}`);
  return f;
}

/** Engine-computed value of the observation, in the protocol's own unit. */
export function observationValue(o: Observation, catalog: AnalysisRef[]): number {
  return evaluateParsed(formulaOf(o, catalog), o.values);
}

/** The value in the unit of the metric it feeds: a protocol percentage (× 100) becomes a fraction. */
export function toMetricValue(o: Observation, catalog: AnalysisRef[], unit: Unit): number {
  const v = observationValue(o, catalog);
  return unit === 'percent' && formulaOf(o, catalog).percentOutput ? v / 100 : v;
}

const words = (s: string) => s.toUpperCase().replace(/\(.*?\)/g, '').replace(/[^A-Z0-9]+/g, ' ').trim().split(' ').filter(Boolean);

/**
 * Metrics an observation may measure among `candidates`: only names that match the formula
 * output; the analysis' curated metrics break ties. No match ⇒ nothing (a diagnostic).
 */
export function suggestMetrics(analysis: AnalysisRef, f: ParsedFormula, candidates: string[]): string[] {
  const out = words(f.output);
  const overlap = (code: string) => code.split('_').filter((p) => out.includes(p)).length / code.split('_').length;
  const score = (code: string) => overlap(code) + (analysis.relatedMetricCodes.includes(code) ? 0.5 : 0);
  return candidates.filter((c) => overlap(c) > 0).sort((a, b) => score(b) - score(a));
}
