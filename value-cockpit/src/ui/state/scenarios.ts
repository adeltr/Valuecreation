import { runCaseScenario, type CockpitState } from './store';

export interface ScenarioRow { name: string; MOIC: number; IRR: number; levers: number; exitMultiple: number; holdYears: number }

const EMPTY = { leverIds: [], applied: {}, assumptions: {} };

/** The base case and every saved scenario, side by side. Engine-computed; a scenario the engine refuses is left out. */
export function compareScenarios(state: CockpitState): ScenarioRow[] {
  const rows: ScenarioRow[] = [];
  for (const [name, scenario] of [['Base (sans levier)', EMPTY] as const, ...Object.entries(state.savedScenarios)]) {
    try {
      const v = new Map(runCaseScenario(state, scenario).map((r) => [r.metricCode, r.value]));
      rows.push({
        name, MOIC: v.get('MOIC')!, IRR: v.get('IRR')!, levers: scenario.leverIds.length,
        exitMultiple: v.get('EXIT_MULTIPLE')!, holdYears: v.get('HOLD_YEARS')!,
      });
    } catch { /* shown by the simulation panel when it is the current scenario */ }
  }
  return rows;
}

export interface SensitivityGrid { multiples: number[]; years: number[]; /** moic[multiple][year]; null when the engine refuses the cell. */ moic: (number | null)[][] }

/** MOIC of the current scenario for exit multiples ±2 and holding periods ±1 around the analyst's values. */
export function sensitivityGrid(state: CockpitState): SensitivityGrid {
  const multiple = state.scenario.assumptions.EXIT_MULTIPLE ?? state.inputs.EXIT_MULTIPLE;
  const hold = state.scenario.assumptions.HOLD_YEARS ?? state.inputs.HOLD_YEARS;
  const multiples = [-2, -1, 0, 1, 2].map((d) => multiple + d).filter((m) => m > 0);
  const years = [-1, 0, 1].map((d) => hold + d).filter((y) => y > 0);
  const moic = multiples.map((m) => years.map((y) => {
    try {
      const r = runCaseScenario(state, { ...state.scenario, assumptions: { ...state.scenario.assumptions, EXIT_MULTIPLE: m, HOLD_YEARS: y } });
      return r.find((x) => x.metricCode === 'MOIC')!.value;
    } catch { return null; }
  }));
  return { multiples, years, moic };
}
