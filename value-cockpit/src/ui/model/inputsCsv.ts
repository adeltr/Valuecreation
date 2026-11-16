import type { Metric } from '../../domain/types';
import { describeMetric } from '../../ontology/labels';

/** The inputs of a model as a CSV to fill in Excel: code;libellé;unité;valeur. */
export function inputsTemplateCsv(metrics: Metric[], archetype: string): string {
  const cell = (s: string) => s.replace(/[;\n"]/g, ' ');
  return ['code;libellé;unité;valeur',
    ...metrics.filter((m) => !m.isCalculated).map((m) => `${m.code};${cell(describeMetric(m.code, archetype).label)};${m.unit};`), ''].join('\n');
}

function parseNumber(raw: string, decimalComma: boolean): number | null {
  let s = raw.trim().replace(/^"|"$/g, '').replace(/[\s  ]/g, '');
  const percent = s.endsWith('%');
  if (percent) s = s.slice(0, -1);
  if (decimalComma) s = s.replace(/\./g, '').replace(',', '.');
  else s = s.replace(/,(?=\d{3}(\D|$))/g, '');
  if (!/^[-+]?\d+(\.\d+)?$/.test(s)) return null;
  const v = Number(s);
  return percent ? v / 100 : v;
}

/**
 * Reads "code<sep>…<sep>value" lines (separator ; , or tab; the value is the last cell). With
 * a semicolon the decimal mark is a comma (French Excel). Unknown codes, unreadable values and
 * duplicates are reported, never guessed.
 */
export function parseInputsCsv(text: string, validCodes: string[]): { values: Record<string, number>; errors: string[] } {
  const values: Record<string, number> = {};
  const errors: string[] = [];
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const sep = lines.some((l) => l.includes(';')) ? ';' : lines.some((l) => l.includes('\t')) ? '\t' : ',';
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const cells = line.split(sep);
    const code = cells[0].trim().replace(/^"|"$/g, '');
    if (i === 0 && code.toLowerCase() === 'code') return;
    const raw = cells.length > 1 ? cells[cells.length - 1] : '';
    if (!raw.trim()) return; // template row left empty
    if (!validCodes.includes(code)) { errors.push(`ligne ${i + 1} : ${code} n'est pas un input de ce modèle`); return; }
    if (code in values) { errors.push(`ligne ${i + 1} : ${code} en double (première valeur gardée)`); return; }
    const v = parseNumber(raw, sep === ';');
    if (v === null) { errors.push(`ligne ${i + 1} : valeur illisible pour ${code} (« ${raw.trim()} »)`); return; }
    values[code] = v;
  });
  return { values, errors };
}
