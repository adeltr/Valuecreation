import type { DossierCase } from '../../dossier/format';

/** How many inputs have a stated source; the others are still the template's illustrative values. */
export function reliability(c: Pick<DossierCase, 'inputs' | 'provenance'>): { total: number; sourced: number; demo: string[] } {
  const codes = Object.keys(c.inputs);
  const demo = codes.filter((code) => !c.provenance[code]);
  return { total: codes.length, sourced: codes.length - demo.length, demo };
}
