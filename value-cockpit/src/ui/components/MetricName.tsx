import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { describeMetric } from '../../ontology/labels';
import { extractDependencies } from '../../engine/formula';
import type { Metric } from '../../domain/types';
import type { Unit } from '../../ontology/base';
import { Icon } from './Icon';

/** The company model on screen: lets every metric name explain itself (formula, what it feeds). */
export const ModelContext = createContext<Metric[]>([]);

const UNIT_TEXT: Record<Unit, string> = {
  currency: 'montant, dans la devise et l\'échelle du dossier (sauf prix unitaires)',
  percent: 'fraction : 0,05 = 5 %', days: 'jours', years: 'années', ratio: 'ratio ou multiple', count: 'nombre',
};
const BUBBLE_WIDTH = 340;

function Bubble({ code, archetype, anchor, onClose, id }: {
  code: string; archetype: string; anchor: HTMLElement; onClose: () => void; id: string;
}) {
  const metrics = useContext(ModelContext);
  const d = describeMetric(code, archetype);
  const metric = metrics.find((m) => m.code === code);
  const feeds = metrics.filter((m) => m.formula && extractDependencies(m.formula).includes(code));
  const r = anchor.getBoundingClientRect();
  const left = Math.max(8, Math.min(r.left - 12, window.innerWidth - BUBBLE_WIDTH - 8));
  const below = r.bottom + 8;
  const style: CSSProperties = below + 260 > window.innerHeight && r.top > 280
    ? { left, bottom: window.innerHeight - r.top + 8 }
    : { left, top: below };
  return createPortal(
    <div role="dialog" aria-labelledby={`${id}-title`} id={id} className="bubble" style={style}
      onMouseDown={(e) => e.stopPropagation()}>
      <p className="bubble-title" id={`${id}-title`}>{d.label}</p>
      <code className="metric-code">{code}</code>
      {d.definition ? <p>{d.definition}</p> : <p className="muted">Pas encore de définition pour ce code.</p>}
      {d.source === 'umbrex' && <p className="bubble-note">Définition du glossaire sectoriel Umbrex.</p>}
      <dl>
        {metric && <><dt>Unité</dt><dd>{UNIT_TEXT[metric.unit]}</dd></>}
        {metric?.isCalculated
          ? <><dt>Calculé par le moteur</dt><dd><code>{metric.formula}</code></dd></>
          : metric && <><dt>Saisi par l'analyste</dt><dd>Donnée d'entrée du modèle : saisie, importée ou lue dans les comptes publics.</dd></>}
        {feeds.length > 0 && <><dt>Entre dans</dt><dd>{feeds.map((m) => describeMetric(m.code, archetype).label).join(' · ')}</dd></>}
      </dl>
      <button type="button" className="icon-button bubble-close" aria-label="Fermer l'explication" onClick={onClose}><Icon name="close" /></button>
    </div>,
    document.body,
  );
}

/** The « i » next to a metric: opens a bubble on hover, focus or click; Escape or a click elsewhere closes it. */
export function MetricInfo({ code, archetype }: { code: string; archetype: string }) {
  const [open, setOpen] = useState<'hover' | 'pinned' | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const label = describeMetric(code, archetype).label;
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);
  return (
    <>
      <button ref={button} type="button" className="info-button" aria-label={`Explication : ${label}`}
        aria-expanded={open !== null} aria-controls={open ? id : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen(open === 'pinned' ? null : 'pinned')}
        onMouseEnter={() => setOpen((o) => o ?? 'hover')}
        onMouseLeave={() => setOpen((o) => (o === 'hover' ? null : o))}>
        <Icon name="info" size={15} />
      </button>
      {open && button.current && (
        <Bubble code={code} archetype={archetype} anchor={button.current} id={id} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

/**
 * A metric as people read it: name, then its ontology code, then the explanation bubble.
 * `htmlFor`: the name and code label that input; the bubble button stays outside the label.
 */
export function MetricName({ code, archetype, htmlFor }: { code: string; archetype: string; htmlFor?: string }) {
  const d = describeMetric(code, archetype);
  const text = (
    <>
      <span className="metric-name">{d.label}</span>{' '}
      <code className="metric-code">{code}</code>
    </>
  );
  return (
    <span className="metric">
      {htmlFor ? <label htmlFor={htmlFor}>{text}</label> : <span>{text}</span>}
      <MetricInfo code={code} archetype={archetype} />
    </span>
  );
}
