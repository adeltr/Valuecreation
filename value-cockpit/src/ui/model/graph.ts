import type { Metric } from '../../domain/types';
import { BASE_METRIC_CODES, BRIDGE_METRIC_CODES } from '../../ontology/base';
import { extractDependencies } from '../../engine/formula';

export type Layer = 'L1' | 'L2' | 'L3';

export interface GraphNode { id: string; layer: Layer; isCalculated: boolean; position: { x: number; y: number } }
export interface GraphEdge { id: string; source: string; target: string }

const has = (list: readonly string[], code: string) => list.includes(code);

/**
 * docs/01 layers: L1 = two-point bridge, L2 = financial drivers (base P&L/cash
 * codes and the extension's calculated exit aggregates), L3 = sector operational inputs.
 */
export function layerOf(m: Metric): Layer {
  if (has(BRIDGE_METRIC_CODES, m.code)) return 'L1';
  if (has(BASE_METRIC_CODES, m.code) || m.isCalculated) return 'L2';
  return 'L3';
}

const COLUMN_X: Record<Layer, number> = { L3: 0, L2: 320, L1: 640 };
const ROW_H = 64;

/** Driver tree from template formulas: an edge per dependency, oriented cause → effect. */
export function buildDriverGraph(metrics: Metric[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const rows: Record<Layer, number> = { L1: 0, L2: 0, L3: 0 };
  const nodes = metrics.map((m) => {
    const layer = layerOf(m);
    return { id: m.code, layer, isCalculated: m.isCalculated, position: { x: COLUMN_X[layer], y: rows[layer]++ * ROW_H } };
  });
  const edges = metrics.flatMap((m) =>
    m.isCalculated && m.formula
      ? extractDependencies(m.formula).map((dep) => ({ id: `${dep}->${m.code}`, source: dep, target: m.code }))
      : [],
  );
  return { nodes, edges };
}
