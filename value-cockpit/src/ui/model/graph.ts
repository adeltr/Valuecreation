import type { Metric } from '../../domain/types';
import { BASE_METRIC_CODES, BRIDGE_METRIC_CODES } from '../../ontology/base';
import { FAMILY_BRIDGE } from '../../templates/build';
import { BRIDGE_FAMILIES, FAMILY_VOCAB } from '../../ontology/families';
import { extractDependencies } from '../../engine/formula';

export type Layer = 'L1' | 'L2' | 'L3';

export interface GraphNode { id: string; layer: Layer; isCalculated: boolean; position: { x: number; y: number } }
export interface GraphEdge { id: string; source: string; target: string }

const has = (list: readonly string[], code: string) => list.includes(code);

// L1 = the bridge of every family (family codes are disjoint, so no archetype is needed).
const L1_CODES = [...BRIDGE_METRIC_CODES, ...BRIDGE_FAMILIES.flatMap((f) => {
  const b = FAMILY_BRIDGE[f];
  return [b.anchor, ...b.inputs, ...Object.keys(b.formulas)];
})];
const L2_CODES = [...BASE_METRIC_CODES, ...BRIDGE_FAMILIES.flatMap((f) => FAMILY_VOCAB[f].codes)];

/**
 * docs/01 layers: L1 = two-point bridge of the family (docs/16), L2 = financial drivers (base P&L/cash
 * codes and the extension's calculated exit aggregates), L3 = sector operational inputs.
 */
export function layerOf(m: Metric): Layer {
  if (has(L1_CODES, m.code)) return 'L1';
  if (has(L2_CODES, m.code) || m.isCalculated) return 'L2';
  return 'L3';
}

/** Columns, left to right: operational drivers, financial aggregates, deal and cash inputs, computed bridge. */
type Column = 'L3' | 'L2' | 'L1in' | 'L1';
const COLUMN_X: Record<Column, number> = { L3: 0, L2: 300, L1in: 600, L1: 900 };
const ROW_H = 64;
const columnOf = (m: Metric): Column => {
  const layer = layerOf(m);
  return layer === 'L1' && !m.isCalculated ? 'L1in' : layer;
};

/** Driver tree from template formulas: an edge per dependency, oriented cause → effect. */
export function buildDriverGraph(metrics: Metric[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const rows: Record<Column, number> = { L3: 0, L2: 0, L1in: 0, L1: 0 };
  const counts: Record<Column, number> = { L3: 0, L2: 0, L1in: 0, L1: 0 };
  for (const m of metrics) counts[columnOf(m)]++;
  // Shorter columns are centred on the tallest one, so the tree reads left to right.
  const tallest = Math.max(...Object.values(counts));
  const top = (c: Column) => ((tallest - counts[c]) * ROW_H) / 2;
  const nodes = metrics.map((m) => {
    const column = columnOf(m);
    return { id: m.code, layer: layerOf(m), isCalculated: m.isCalculated, position: { x: COLUMN_X[column], y: top(column) + rows[column]++ * ROW_H } };
  });
  const edges = metrics.flatMap((m) =>
    m.isCalculated && m.formula
      ? extractDependencies(m.formula).map((dep) => ({ id: `${dep}->${m.code}`, source: dep, target: m.code }))
      : [],
  );
  return { nodes, edges };
}
