import type { HundredDayPlan, Phase } from '../model/plan';
import { formatValue } from '../model/format';

export interface SlideRow {
  kind: 'lever' | 'foundation'; label: string;
  bars: { phase: Phase; from: number; to: number }[];
  milestones: number[]; beyond: string | null;
}

export interface SlideModel {
  title: string; subtitle: string;
  rows: SlideRow[]; more: string | null;
  table: string[][];
  governance: string[]; risks: string[];
  footnote: string;
}

const MAX_LEVER_ROWS = 7;
const signedRatio = (v: number) => `${v > 0 ? '+' : ''}${formatValue(v, 'ratio')}`;

/** One consultant slide: action title, timeline, value at stake, governance and risks, source. */
export function buildSlideModel(plan: HundredDayPlan, meta: { company: string; archetypeLabel: string; date: string }): SlideModel {
  const { totals } = plan;
  const n = plan.workstreams.length;
  const shown = plan.workstreams.slice(0, MAX_LEVER_ROWS);
  return {
    title: `Plan 100 jours : ${n} chantier${n > 1 ? 's' : ''} pour porter le MOIC de ${formatValue(totals.moicBase, 'ratio')} à `
      + `${formatValue(totals.moicAll, 'ratio')}, dont ${formatValue(totals.moicBy100, 'ratio')} d'ici J100`,
    subtitle: [meta.company || 'Dossier sans nom', meta.archetypeLabel, meta.date].join(' · '),
    rows: [
      ...shown.map((w): SlideRow => ({
        kind: 'lever', label: w.title, bars: w.bars, milestones: w.milestones.map((m) => m.day),
        beyond: w.beyond100 ? `→ J+${w.impactDay}` : null,
      })),
      ...plan.foundations.map((f): SlideRow => ({ kind: 'foundation', label: f.title, bars: [], milestones: f.milestones.map((m) => m.day), beyond: null })),
    ],
    more: n > MAX_LEVER_ROWS ? `+ ${n - MAX_LEVER_ROWS} autres chantiers dans le plan détaillé` : null,
    table: [
      ['Chantier', 'Responsable', 'KPI cible', 'Δ MOIC'],
      ...plan.workstreams.map((w) => [
        w.title, w.owner,
        w.kpi ? `${w.kpi.code} → ${formatValue(w.kpi.target, w.kpi.unit)}` : '—',
        w.value ? signedRatio(w.value.moic) : '—',
      ]),
      ['Total (moteur, avec interactions)', '', '', signedRatio(totals.moicAll - totals.moicBase)],
    ],
    governance: [
      'Comité de pilotage hebdomadaire, PMO dédié',
      'Revues J30 (diagnostic), J60 (plans détaillés), J100 (plan de création de valeur actualisé)',
      'Tableau de bord mensuel des KPI du plan',
    ],
    risks: plan.risks.slice(0, 4),
    footnote: 'Source : Value Creation Cockpit. Chiffres calculés par le moteur à partir des inputs de l\'entreprise et des leviers '
      + 'validés par l\'analyste ; Δ par chantier calculés levier par levier, total avec les interactions du modèle.',
  };
}

const C = { ink: '1D2433', muted: '667085', line: 'E4E7EC', accent: '2F5BEA', diagnose: 'B8C7F8', design: '7A95F0', execute: '2F5BEA', milestone: 'B54708', soft: 'F4F5F7' };
const PHASES: [string, number, number][] = [['Diagnostic & mobilisation', 0, 30], ['Conception', 30, 60], ['Exécution & suivi', 60, 100]];

/** Renders the slide with pptxgenjs (loaded on demand). 'nodebuffer' for tests, 'download' in the browser. */
export async function renderPlanSlide(m: SlideModel, output: 'nodebuffer' | 'download', fileName = 'plan-100-jours.pptx') {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 × 7.5 in
  const s = pptx.addSlide();
  const font = 'Calibri';

  s.addText(m.title, { x: 0.4, y: 0.25, w: 12.5, h: 0.75, fontSize: 20, bold: true, color: C.ink, fontFace: font, valign: 'top' });
  s.addText(m.subtitle, { x: 0.4, y: 0.95, w: 12.5, h: 0.3, fontSize: 11, color: C.muted, fontFace: font });

  // Timeline
  const labelX = 0.4, labelW = 2.4, trackX = 2.9, trackW = 4.6, top = 1.45, rowH = 0.3; // leaves room for « → J+n » before the table
  const x = (day: number) => trackX + (Math.min(day, 100) / 100) * trackW;
  for (const [name, from, to] of PHASES) {
    s.addShape(pptx.ShapeType.rect, { x: x(from), y: top, w: x(to) - x(from) - 0.03, h: 0.3, fill: { color: C.soft }, line: { color: C.soft } });
    s.addText(`${name}\nJ${from}–J${to}`, { x: x(from), y: top, w: x(to) - x(from), h: 0.3, fontSize: 8, color: C.ink, align: 'center', fontFace: font });
  }
  let y = top + 0.45;
  let section: SlideRow['kind'] | null = null;
  for (const r of m.rows) {
    if (r.kind !== section) {
      s.addText(r.kind === 'lever' ? 'CHANTIERS DE VALEUR' : 'FONDATIONS', { x: labelX, y, w: labelW, h: 0.22, fontSize: 7, bold: true, color: C.muted, fontFace: font });
      y += 0.22; section = r.kind;
      if (r.kind === 'foundation' && m.more) {
        s.addText(m.more, { x: trackX, y: y - 0.22, w: trackW, h: 0.22, fontSize: 7, italic: true, color: C.muted, fontFace: font });
      }
    }
    s.addText(r.label, { x: labelX, y, w: labelW, h: rowH, fontSize: 9, color: C.ink, fontFace: font, valign: 'middle' });
    for (const b of r.bars) {
      s.addShape(pptx.ShapeType.rect, { x: x(b.from), y: y + 0.09, w: Math.max(x(b.to) - x(b.from), 0.03), h: 0.12, fill: { color: C[b.phase] }, line: { color: C[b.phase] } });
    }
    for (const d of r.milestones) {
      s.addShape(pptx.ShapeType.diamond, { x: x(d) - 0.06, y: y + 0.09, w: 0.12, h: 0.12, fill: { color: C.milestone }, line: { color: 'FFFFFF' } });
    }
    if (r.beyond) s.addText(r.beyond, { x: x(100) + 0.05, y, w: 0.8, h: rowH, fontSize: 8, color: C.muted, fontFace: font, valign: 'middle' });
    s.addShape(pptx.ShapeType.line, { x: labelX, y: y + rowH, w: trackX + trackW - labelX, h: 0, line: { color: C.line, width: 0.5 } });
    y += rowH;
  }

  // Value at stake
  s.addText('VALEUR EN JEU (MOTEUR)', { x: 8.4, y: top, w: 4.5, h: 0.25, fontSize: 8, bold: true, color: C.muted, fontFace: font });
  const rows = m.table.map((row, i) => row.map((text, j) => ({
    text,
    options: {
      bold: i === 0 || i === m.table.length - 1, color: C.ink, fontSize: 8, fontFace: font,
      align: (j === 3 ? 'right' : 'left') as 'right' | 'left',
      fill: { color: i === 0 ? C.soft : 'FFFFFF' },
    },
  })));
  s.addTable(rows, { x: 8.4, y: top + 0.3, w: 4.5, colW: [1.7, 0.95, 1.2, 0.65], border: { type: 'solid', pt: 0.5, color: C.line } });

  // Governance and risks
  const box = (title: string, items: string[], bx: number) => {
    s.addShape(pptx.ShapeType.rect, { x: bx, y: 5.85, w: 6.15, h: 1.05, fill: { color: C.soft }, line: { color: C.soft } });
    s.addText([
      { text: title, options: { bold: true, fontSize: 9, color: C.accent, breakLine: true } },
      ...(items.length ? items : ['—']).map((t) => ({ text: t, options: { bullet: true, fontSize: 9, color: C.ink, breakLine: true } })),
    ], { x: bx + 0.1, y: 5.9, w: 5.95, h: 0.95, fontFace: font, valign: 'top' });
  };
  box('Gouvernance', m.governance, 0.4);
  box('Risques clés', m.risks, 6.75);

  s.addText(m.footnote, { x: 0.4, y: 7.0, w: 12.5, h: 0.35, fontSize: 7, color: C.muted, fontFace: font });

  if (output === 'nodebuffer') return pptx.write({ outputType: 'nodebuffer' });
  await pptx.writeFile({ fileName });
  return null;
}
