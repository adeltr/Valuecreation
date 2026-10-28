import { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Metric } from '../../domain/types';
import type { AnalysisRef } from '../../catalog/types';
import { buildDriverGraph, type Layer } from '../model/graph';
import { analysesForMetric } from '../model/hundredDay';
import { formatValue } from '../model/format';
import { Panel } from './Panel';

const LAYER_LABEL: Record<Layer, string> = { L3: 'L3 · opérationnel', L2: 'L2 · financier', L1: 'L1 · bridge' };

interface Props { metrics: Metric[]; baseline: Map<string, number>; catalog: AnalysisRef[] }

export function DriverGraph({ metrics, baseline, catalog }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const graph = useMemo(() => buildDriverGraph(metrics), [metrics]);
  const byCode = useMemo(() => new Map(metrics.map((m) => [m.code, m])), [metrics]);

  const nodes: Node[] = graph.nodes.map((n) => ({
    id: n.id, position: n.position,
    className: `node node-${n.layer} ${n.id === selected ? 'node-selected' : ''}`,
    data: { label: `${n.id}\n${formatValue(baseline.get(n.id), byCode.get(n.id)!.unit)}` },
  }));
  const edges: Edge[] = graph.edges.map((e) => ({ ...e, animated: e.source === selected || e.target === selected }));
  const sel = selected ? byCode.get(selected) : undefined;
  const analyses = selected ? analysesForMetric(catalog, selected) : [];

  return (
    <Panel title="Arbre de valeur" className="graph">
      <div className="graph-body">
        <div className="flow">
          <ReactFlow nodes={nodes} edges={edges} fitView onNodeClick={(_, n) => setSelected(n.id)} nodesConnectable={false}>
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
        <aside className="explore">
          {(['L3', 'L2', 'L1'] as Layer[]).map((layer) => (
            <div key={layer}>
              <h3>{LAYER_LABEL[layer]}</h3>
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
              <h3>{sel.code}</h3>
              <p className="num">{formatValue(baseline.get(sel.code), sel.unit)}</p>
              {sel.formula && <code>{sel.formula}</code>}
              <h4>Analyses à mener</h4>
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
