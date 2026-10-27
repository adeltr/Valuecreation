import { initialState, type CockpitState } from './store';

export type CaseContent = Pick<CockpitState, 'name' | 'archetype' | 'inputs' | 'levers' | 'rootCauses' | 'scenario'>;

const canon = (v: unknown): unknown => Array.isArray(v) ? v.map(canon)
  : v && typeof v === 'object'
    ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, canon(x)]))
    : v;

/** Key-order-independent fingerprint of what a dossier stores (no error, no id counter). */
export function fingerprint({ name, archetype, inputs, levers, rootCauses, scenario }: CaseContent): string {
  return JSON.stringify(canon({ name, archetype, inputs, levers, rootCauses, scenario }));
}

/** True unless the case is an untouched demo or exactly the one last saved / opened (`clean`). */
export function hasUnsavedWork(state: CockpitState, clean: string | null): boolean {
  const current = fingerprint(state);
  return current !== clean && current !== fingerprint(initialState(state.archetype));
}
