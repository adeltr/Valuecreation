import { describe, it, expect } from 'vitest';
import { parseInputsCsv, inputsTemplateCsv } from './inputsCsv';
import { TEMPLATES } from '../../templates';

const metrics = TEMPLATES.airline!.instantiate('c', TEMPLATES.airline!.demoInputs);
const codes = metrics.filter((m) => !m.isCalculated).map((m) => m.code);

describe('inputs CSV (export from Excel)', () => {
  it('reads code;value lines — semicolon with decimal comma, comma or tab with decimal point', () => {
    expect(parseInputsCsv('LOAD_FACTOR;0,8\nEBITDA_ENTRY;140', codes).values).toEqual({ LOAD_FACTOR: 0.8, EBITDA_ENTRY: 140 });
    expect(parseInputsCsv('LOAD_FACTOR,0.8\nEBITDA_ENTRY,140', codes).values).toEqual({ LOAD_FACTOR: 0.8, EBITDA_ENTRY: 140 });
    expect(parseInputsCsv('LOAD_FACTOR\t0.8', codes).values).toEqual({ LOAD_FACTOR: 0.8 });
  });

  it('accepts the template as exported: header, label and unit columns, value last; empty values are skipped', () => {
    const csv = inputsTemplateCsv(metrics, 'airline');
    expect(csv.split('\n')[0]).toBe('code;libellé;unité;valeur');
    expect(csv).toMatch(/LOAD_FACTOR;Load Factor;percent;\n/);
    const filled = csv.replace('LOAD_FACTOR;Load Factor;percent;', 'LOAD_FACTOR;Load Factor;percent;0,81');
    expect(parseInputsCsv(filled, codes)).toEqual({ values: { LOAD_FACTOR: 0.81 }, errors: [] });
  });

  it('understands percentages, thousands separators and a BOM', () => {
    expect(parseInputsCsv('﻿LOAD_FACTOR;82 %\nEBITDA_ENTRY;1 250,5\nASK;"12 000"', codes).values).toEqual({ LOAD_FACTOR: 0.82, EBITDA_ENTRY: 1250.5, ASK: 12000 });
  });

  it('reports what it could not use, line by line, and never guesses', () => {
    const r = parseInputsCsv('LOAD_FACTOR;abc\nMOIC;3\nEBITDA_ENTRY;140\nEBITDA_ENTRY;150', codes);
    expect(r.values).toEqual({ EBITDA_ENTRY: 140 });
    expect(r.errors).toEqual([
      'ligne 1 : valeur illisible pour LOAD_FACTOR (« abc »)',
      'ligne 2 : MOIC n\'est pas un input de ce modèle',
      'ligne 4 : EBITDA_ENTRY en double (première valeur gardée)',
    ]);
  });
});
