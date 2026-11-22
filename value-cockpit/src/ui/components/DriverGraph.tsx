import { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, Position, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Metric } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import { buildDriverGraph, type Layer } from '../model/graph';
import { analysesForMetric } from '../model/hundredDay';
import { formatValue } from '../model/format';
import { MetricName } from './MetricName';
import { describeMetric } from '../../ontology/labels';
import { Panel } from './Panel';

const LAYER_LABEL: Record<Layer, string> = { L3: 'Drivers opérationnels', L2: 'Agrégats financiers', L1: 'Bridge de valeur' };

interface Props {
  metrics: Metric[]; baseline: Map<string, number>; catalog: AnalysisRef[]; archetype: string;
  /** React Flow fits the view to its box: it is mounted only while the step is on screen. */
  visible?: boolean;
}

export function DriverGraph({ metrics, baseline, catalog, archetype, visible = true }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const graph = useMemo(() => buildDriverGraph(metrics), [metrics]);
  const byCode = useMemo(() => new Map(metrics.map((m) => [m.code, m])), [metrics]);

  const nodes: Node[] = graph.nodes.map((n) => ({
    id: n.id, position: n.position, sourcePosition: Position.Right, targetPosition: Position.Left,
    className: `node node-${n.layer} ${n.id === selected ? 'node-selected' : ''}`,
    data: { label: `${describeMetric(n.id, archetype).label}\n${formatValue(baseline.get(n.id), byCode.get(n.id)!.unit)}` },
  }));
  const edges: Edge[] = graph.edges.map((e) => ({ ...e, animated: e.source === selected || e.target === selected }));
  const sel = selected ? byCode.get(selected) : undefined;
  const analyses = selected ? analysesForMetric(catalog, selected) : [];

  return (
    <Panel title="Arbre de valeur" className="graph">
      <p className="muted graph-hint">De gauche à droite : drivers opérationnels, agrégats financiers, puis bridge jusqu'au MOIC. Cliquez un nœud pour voir sa formule et les analyses qui le mesurent.</p>
      <div className="graph-body">
        <div className="flow">
          {visible && <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.08 }} minZoom={0.2} onNodeClick={(_, n) => setSelected(n.id)} nodesConnectable={false}>
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>}
        </div>
        <aside className="explore">
          {(['L3', 'L2', 'L1'] as Layer[]).map((layer) => (
            <div key={layer}>
              <h4><span className={`layer-dot layer-${layer}`} aria-hidden="true" />{LAYER_LABEL[layer]}</h4>
              <div className="chips">
                {graph.nodes.filter((n) => n.layer === layer).map((n) => (
                  <button
                    key={n.id} type="button" aria-label={`Explorer ${n.id}`}
                    className={`chip ${n.id === selected ? 'chip-on' : ''}`} onClick={() => setSelected(n.id)}
                  >{n.id}</button>
                ))}
              </div>
            </div>
          ))}
          {sel && (
            <div className="explore-detail">
              <h4><MetricName code={sel.code} archetype={archetype} /></h4>
              {describeMetric(sel.code, archetype).definition && <p className="muted">{describeMetric(sel.code, archetype).definition}</p>}
              <p className="num">{formatValue(baseline.get(sel.code), sel.unit)}</p>
              {sel.formula && <code>{sel.formula}</code>}
              <h5>Analyses à mener</h5>
              {analyses.length === 0
                ? <p className="muted">Aucune analyse du catalogue ne cite ce driver.</p>
                : <ul>{analyses.map((a) => <li key={a.id}><strong>{a.id}</strong> — {a.title}</li>)}</ul>}
            </div>
          )}
        </aside>
      </div>
    </Panel>
  );
}
