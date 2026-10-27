import type { Unit } from '../ontology/base';

export interface SpecTerm { code: string; unit: Unit; sources: string }

/**
 * Single source of truth for a level-2 sector (docs/14): vocabulary with sources, linkage
 * formulas, levers with their expected direction, catalog links and a hand-computed
 * reference. Extension, template, catalog enrichment and _level2.md derive from it.
 */
export interface SectorSpec {
  archetype: string;
  label: string;
  umbrexType: string;
  kpiFile: string;
  baseInputs: string[];                        // base codes the formulas read (e.g. REVENUE)
  inputs: SpecTerm[];                          // formula inputs (pile 1)
  diagnostics: SpecTerm[];                     // benchmarked, no formula (pile 2)
  calculated: { code: string; unit: Unit }[];  // extension-specific calculated codes
  formulas: Record<string, string>;            // must define EBITDA_EXIT; the bridge is appended
  levers: { category: string; target: string | null; delta: number; sources: string; analyses: number[] }[];
  baseLevers: { category: string; analyses: number[] }[];
  causes: { category: string; sources: string; analyses: number[]; exogenous?: boolean }[];
  catalogMetrics: Record<string, number[]>;    // metric code (extension or base) → analyses
  demoInputs: Record<string, number>;
  reference: { EBITDA_EXIT: number };          // computed by hand from demoInputs, not by the engine
  approximations: string[];
}
