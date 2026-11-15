import { describeMetric } from '../../ontology/labels';

/** A metric as people read it: name (definition on hover) followed by its ontology code. */
export function MetricName({ code, archetype }: { code: string; archetype: string }) {
  const d = describeMetric(code, archetype);
  const title = d.definition ? `${d.definition}${d.source === 'umbrex' ? ' (glossaire Umbrex)' : ''}` : undefined;
  return (
    <>
      <span className={`metric-name ${d.definition ? 'has-def' : ''}`} title={title}>{d.label}</span>{' '}
      <code className="metric-code">{code}</code>
    </>
  );
}
