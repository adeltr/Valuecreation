import { evaluateFormula, extractDependencies } from '../engine/formula';
import { section } from '../catalog/markdown';

/**
 * A formula of an analysis protocol made computable: its natural-language variables become
 * inputs, the expression is evaluated by the engine. Nothing is guessed: a formula the parser
 * cannot read entirely stays text.
 */
export interface ParsedFormula {
  output: string;
  variables: string[];            // natural-language names, in order of appearance
  expression: string;             // engine expression over v0, v1, …
  percentOutput: boolean;         // the protocol multiplies by 100
  source: string;                 // the formula as written in the analysis
  step: string | null;            // step-by-step title it comes from
}

type Token = { kind: 'num' | 'op'; text: string } | { kind: 'name'; text: string };

const OPS = '+-*/^()';
const NAME_CHAR = /[A-Za-z0-9&'’.,%$€£ ]/;
// A variable is a noun phrase: prose (verbs of the protocol, lowercase starts) means the line is not a formula.
const PROSE = /^[a-z]|\b(?:This|These|Compare|Assess|Evaluate|Determine|Adjust|Use|Calculate|shows?|indicates?|means)\b/;

function normalize(expr: string): string {
  return expr
    .replace(/[×⋅·]/g, '*').replace(/÷/g, '/').replace(/[−–—]/g, '-')
    .replace(/\s[xX]\s/g, ' * ')
    .replace(/\s+/g, ' ').trim()
    .replace(/[.;:]\s+[A-Z].*$/, '')   // end of sentence: what follows is prose
    .replace(/[.;]$/, '');
}

/** Content of the parenthesis opening at `i`, or null when unbalanced. */
function groupAt(s: string, i: number): string | null {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '(') depth++;
    if (s[j] === ')' && --depth === 0) return s.slice(i + 1, j);
  }
  return null;
}

function tokenize(s: string): Token[] | null {
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === ' ') { i++; continue; }
    if (/\d/.test(ch) && (out.length === 0 || out[out.length - 1].kind === 'op')) {
      const m = s.slice(i).match(/^\d+(\.\d+)?/)!;
      const after = s[i + m[0].length];
      if (!after || after === ' ' || OPS.includes(after) || after === '%') {
        out.push({ kind: 'num', text: m[0] }); i += m[0].length;
        if (s[i] === '%') i++;
        continue;
      }
    }
    if (ch === '(') {
      // "Revenue Passenger Kilometers (RPK)", "Fuel Efficiency (ASK or RPK)": a label, not a group.
      const prev = out[out.length - 1];
      const inner = groupAt(s, i);
      if (inner === null) return null;
      if (prev?.kind === 'name' && /^[A-Za-z0-9&.' ]+$/.test(inner) && /[A-Za-z]/.test(inner)) {
        prev.text = `${prev.text} (${inner.trim()})`;
        i += inner.length + 2;
        continue;
      }
    }
    if (OPS.includes(ch)) { out.push({ kind: 'op', text: ch }); i++; continue; }
    if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (j < s.length && (NAME_CHAR.test(s[j]) || (s[j] === '-' && /[A-Za-z]/.test(s[j - 1] ?? '') && /[A-Za-z]/.test(s[j + 1] ?? '')))) j++;
      out.push({ kind: 'name', text: s.slice(i, j).trim().replace(/[.,]$/, '') });
      i = j;
      continue;
    }
    return null; // Σ, ≥, functions in words… : not computable
  }
  return out;
}

export function parseFormula(raw: string): ParsedFormula | null {
  const text = raw.replace(/`/g, '').trim();
  const eq = text.indexOf('=');
  if (eq < 0 || text.indexOf('=', eq + 1) >= 0) return null;
  const output = text.slice(0, eq).replace(/\*\*/g, '').trim();
  const expr = normalize(text.slice(eq + 1));
  if (!output || !/^[A-Za-z]/.test(output) || output.length > 80) return null;

  const tokens = tokenize(expr);
  if (!tokens || !tokens.some((t) => t.kind === 'op' && t.text !== '(' && t.text !== ')')) return null;
  const variables: string[] = [];
  const parts = tokens.map((t) => {
    if (t.kind !== 'name') return t.text;
    if (t.text.length > 90 || PROSE.test(t.text)) return null;
    let k = variables.indexOf(t.text);
    if (k < 0) { variables.push(t.text); k = variables.length - 1; }
    return `v${k}`;
  });
  if (parts.includes(null) || variables.length === 0) return null;
  const expression = parts.join(' ');
  try { extractDependencies(expression); } catch { return null; }
  return { output, variables, expression, percentOutput: /\*\s*100$/.test(expression), source: text, step: null };
}

export function evaluateParsed(f: ParsedFormula, values: Record<string, number>): number {
  const scope: Record<string, number> = {};
  f.variables.forEach((name, k) => {
    const v = values[name];
    if (v === undefined || !Number.isFinite(v)) throw new Error(`Valeur manquante : ${name}`);
    scope[`v${k}`] = v;
  });
  return evaluateFormula(f.expression, scope);
}

/** Computable formulas of the step-by-step section, deduplicated, each with its step title. */
export function extractFormulas(content: string): ParsedFormula[] {
  const out: ParsedFormula[] = [];
  let step: string | null = null;
  for (const line of section(content, '🪜')) {
    const title = line.match(/^\s*\d+\.\s+\*\*(.+?):?\*\*/);
    if (title) step = title[1].replace(/:$/, '').trim();
    const candidates = [...line.matchAll(/`([^`]*=[^`]*)`/g)].map((m) => m[1]);
    if (candidates.length === 0 && line.includes('=')) {
      candidates.push(line.replace(/^\s*(?:[-*•]|\d+\.)?\s*(?:\*\*[^*]+\*\*:?)?\s*/, ''));
    }
    for (const c of candidates) {
      const f = parseFormula(c);
      if (f && !out.some((o) => o.output === f.output && o.expression === f.expression && o.variables.join() === f.variables.join())) {
        out.push({ ...f, step });
      }
    }
  }
  return out;
}
