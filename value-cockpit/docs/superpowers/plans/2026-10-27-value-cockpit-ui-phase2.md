# Value Creation Cockpit — Phase 2 UI Plan

**Goal:** a React UI on top of the headless core: driver graph · company view ·
copilot · simulation + 100-day plan (docs/01 §phasage).

**Architecture:** the UI holds state in a pure reducer (`src/ui/state/store.ts`)
and never computes a figure: every number shown comes from `resolveMetrics` or
`runScenario`, rounded only in `src/ui/model/format.ts` (display boundary).
Pure view-models (`src/ui/model/*`) are unit-tested in node; components are
tested with Testing Library under jsdom.

**Invariants carried into the UI**
1. Figures: engine only. `computedBy` shown on the simulation panel.
2. Levers keep their `confidenceBasis`; the copilot path goes through
   `sanitizeProposal` + `ingestProposal` (always `hypothesis`).
3. The store refuses to put a non-validated lever in a scenario; rejecting a
   lever removes it from the scenario.
4. Assumptions are limited to `SCENARIO_ASSUMPTION_CODES` (EXIT_MULTIPLE,
   HOLD_YEARS — docs/06). Every synthesis states the additive-levers limitation.

**Stack:** Vite + React 18, `@xyflow/react` (graph), Testing Library + jsdom.

## Tasks (TDD, one commit each)

- [x] **UI-0 Scaffold** — `index.html`, `vite.config.ts` (react plugin, `/api` proxy),
  `src/ui/main.tsx`, vitest picks up `*.test.tsx`; smoke test renders the app.
- [x] **UI-1 Templates registry** — `src/templates/index.ts`: `TEMPLATES[archetype]`
  (instantiate + demo inputs) for saas, aero, airline; `SCENARIO_ASSUMPTION_CODES` in base.
- [x] **UI-2 Store** — reducer: select archetype, edit input, ingest copilot proposal,
  validate/reject lever, toggle scenario lever (gate), set applied delta, set assumption (allow-list).
- [x] **UI-3 View-models** — `format.ts` (units → display), `graph.ts` (metrics →
  layered nodes/edges L1 bridge · L2 financial · L3 operational), `hundredDay.ts`
  (validated levers ≤ 100 days vs later, with catalog analyses per lever category).
- [x] **UI-4 Panels** — CompanyView (inputs + resolved metrics), DriverGraph (React Flow,
  click a node → analyses to run from the catalog), CopilotPanel (send to `/api/propose`
  or paste JSON → hypotheses → Validate/Reject), SimulationPanel (validated levers,
  applied deltas, exit-multiple sensitivity, bridge baseline vs scenario), HundredDayPlan.
- [x] **UI-5 App** — layout 3+1 panels, integration test: validating a lever makes it
  selectable and changes the scenario MOIC; a hypothesis never reaches the engine.

Out of scope: persistence (in-memory), auth, a real model call in the proxy entry point
(next step), lever interactions (phase 3).

## Run

`npm run dev` (Vite, http://localhost:5173). The copilot button calls `/api/propose`,
proxied to `localhost:8787`; until a server entry point wires `createServer` to a model,
use the panel's offline mode (paste a copilot JSON reply) — it goes through the same
sanitizer and ingestion.
