---
name: value-cockpit
description: Use on EVERY task of the value creation cockpit project. Encodes the four non-negotiable domain invariants and the ontology constraint. Read before writing or editing any file in this repo.
---

# Value Cockpit — invariants (v2)

These hold on every task. A change that violates one is a task failure, even
if all tests pass.

## 1. No LLM-sourced numbers in deliverables
- `ScenarioResult` is produced ONLY by `engine/scenario.ts`.
- `ScenarioResult.computedBy` is the literal `'engine'` — never widen it.
- `CopilotProposal` has no `scenarioResults` field. Do not add one.
- If a task tempts you to let Claude return a computed figure (impact in €,
  equity delta, recalculated KPI), stop: that figure comes from the engine.

## 2. No naked confidence scores
- A `Lever.confidence` (0..1) is invalid without a non-empty
  `confidenceBasis`. The zod schema enforces this. Do not relax it.

## 3. Ontology constrains generation
- Lever `category`, cause `category`, and every `impactMetricCode` must belong
  to the ACTIVE vocabulary (base ∪ sector extension via `registry.ts`).
- The sanitizer rejects anything outside the active vocabulary.
- Adding a term = add it to the extension AND its IRI to `context.jsonld` in
  the same commit. Never hardcode a term elsewhere.
- `EXIT_MULTIPLE` is a scenario ASSUMPTION; `MULTIPLE_EXPANSION` is never a
  proposable lever category.

## 4. Analyst gate before simulation
- A scenario may only reference levers with `status='validated'`.
- Copilot ingestion ALWAYS lands as `status='hypothesis'`.
- The engine throws an explicit error on a non-validated lever.
- Same principle for knowledge: during catalog curation, an unknown metric
  cited in a source file is LISTED as a candidate, never invented into the
  vocabulary or a frontmatter.

## Engineering conventions
- TDD: failing test → run (confirm fail) → minimal impl → run (confirm pass)
  → commit. One behavior per test.
- The engine is pure (no I/O, no Date.now(), no randomness) and never imports
  ontology, repo, or copilot — it operates on plain `Metric[]`.
- Deltas: `deltaKind='absolute'` in the target metric's unit;
  `'percent'` is relative to the current value.
- Money unrounded mid-calc; round only at the display boundary.
- Documented limitation: lever deltas on the same metric are additive (no
  interactions — phase 3). Any synthesis must mention it.
