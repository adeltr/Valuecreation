# Value Creation Cockpit Core v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic headless core of a PE value-creation cockpit — layered ontology (base + SaaS extension), two-point equity/MOIC bridge, calc engine with analyst gating, and a constrained Claude copilot contract.

**Architecture:** Pure functional core. An ontology registry assembles the active vocabulary (base ∪ sector extension) per company; a sector template instantiates metrics + linkage formulas; the simulation engine = the metric resolver re-run after perturbing inputs (delta semantics absolute/percent), restricted to analyst-validated levers; exit multiple is a scenario assumption, never a lever. Claude proposes causes/levers only; the engine owns every figure.

**Tech Stack:** Vite, React, TypeScript, Vitest, zod, mathjs, Express (proxy).

---

## File Structure

- `src/ontology/base.ts` — base vocabulary: bridge/P&L/WC metric codes + meta, generic lever & cause categories, node types, units, delta kinds.
- `src/ontology/sectors/saas.ts` — SaaS extension: operational metric codes + meta, SaaS lever categories.
- `src/ontology/registry.ts` — assembles the ACTIVE vocabulary for a sector archetype; conformance guards validate against it.
- `src/ontology/context.jsonld` — JSON-LD `@context` (FIBO-aligned IRIs) covering base + saas terms.
- `src/domain/types.ts` — domain types (Company with `sectorArchetype`, Lever with `deltaKind`, ScenarioAssumption, ScenarioResult).
- `src/domain/schemas.ts` — zod schema factories bound to an active vocabulary.
- `src/templates/saas.ts` — SaaS template: instantiates a company's Metrics (inputs + linkage formulas incl. the two-point bridge).
- `src/engine/formula.ts` — `evaluateFormula`, `extractDependencies` (supports `^`).
- `src/engine/graph.ts` — `topoSort` with cycle detection.
- `src/engine/resolver.ts` — `resolveMetrics`.
- `src/engine/scenario.ts` — `runScenario` (deltaKind, validated-only gate, assumptions).
- `src/copilot/proposal.ts` — proposal schema factory + `sanitizeProposal` (active vocabulary).
- `src/copilot/ingest.ts` — `ingestProposal` (tags source/status).
- `src/server/proxy.ts` — `buildSystemPrompt` (active vocabulary injected), `handleProposal`, Express app.

Engine files never import ontology, repo, or copilot — they operate on plain `Metric[]`.

---

### Task 0: Scaffold the project

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `src/index.ts`

- [ ] **Step 1: Initialize and install**

Run:
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install zod mathjs express
npm install -D vitest @types/express
```

- [ ] **Step 2: Add test scripts and vitest config**

Modify `package.json` scripts:
```json
"scripts": { "dev": "vite", "build": "tsc && vite build", "test": "vitest run", "test:watch": "vitest" }
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['src/**/*.test.ts'] } });
```

- [ ] **Step 3: Verify the toolchain**

Create `src/index.ts`:
```ts
export const VERSION = '0.2.0';
```
Run: `npm test`
Expected: PASS (no tests, no failures).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: scaffold vite+ts+vitest core v2"
```

---

### Task 1: Base ontology vocabulary

**Files:**
- Create: `src/ontology/base.ts`
- Test: `src/ontology/base.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { BASE_METRIC_CODES, BASE_METRIC_META, BASE_LEVER_CATEGORIES, DELTA_KINDS } from './base';

describe('base vocabulary', () => {
  it('covers the two-point bridge', () => {
    for (const code of ['EBITDA_ENTRY','EBITDA_EXIT','ENTRY_MULTIPLE','EXIT_MULTIPLE',
                        'NET_DEBT_ENTRY','NET_DEBT_EXIT','EQUITY_ENTRY','EQUITY_EXIT',
                        'MOIC','HOLD_YEARS','FCF_ANNUAL']) {
      expect(BASE_METRIC_CODES).toContain(code);
    }
  });
  it('gives every base code a unit', () => {
    for (const code of BASE_METRIC_CODES) expect(BASE_METRIC_META[code]?.unit).toBeTypeOf('string');
  });
  it('does NOT offer multiple expansion as a lever category', () => {
    expect(BASE_LEVER_CATEGORIES).not.toContain('MULTIPLE_EXPANSION');
  });
  it('defines delta kinds', () => {
    expect(DELTA_KINDS).toEqual(['absolute', 'percent']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/ontology/base.test.ts`
Expected: FAIL with "Cannot find module './base'".

- [ ] **Step 3: Write minimal implementation**

```ts
export const NODE_TYPES = ['kpi', 'driver', 'sub_driver'] as const;
export type NodeType = (typeof NODE_TYPES)[number];

export const UNITS = ['currency', 'days', 'percent', 'ratio', 'count', 'years'] as const;
export type Unit = (typeof UNITS)[number];

export const DELTA_KINDS = ['absolute', 'percent'] as const;
export type DeltaKind = (typeof DELTA_KINDS)[number];

// Exit multiple is a scenario ASSUMPTION, not a lever — hence no MULTIPLE_EXPANSION here.
export const BASE_LEVER_CATEGORIES = [
  'PRICING', 'VOLUME', 'MIX',
  'COST_PROCUREMENT', 'COST_OPS',
  'WC_DSO', 'WC_DIO', 'WC_DPO',
  'CAPEX_DISCIPLINE',
] as const;

export const BASE_CAUSE_CATEGORIES = [
  'COMMERCIAL', 'OPERATIONAL', 'FINANCIAL', 'ORGANIZATIONAL', 'MARKET',
] as const;

export const BASE_METRIC_CODES = [
  // P&L (entry-period)
  'REVENUE', 'COGS', 'GROSS_PROFIT', 'OPEX', 'EBITDA_ENTRY', 'EBITDA_MARGIN',
  // Working capital & cash
  'DSO', 'DIO', 'DPO', 'WORKING_CAPITAL', 'CAPEX', 'FCF_ANNUAL',
  // Two-point bridge
  'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS',
  'NET_DEBT_ENTRY', 'NET_DEBT_EXIT',
  'EBITDA_EXIT', 'EQUITY_ENTRY', 'EQUITY_EXIT', 'MOIC',
] as const;

export interface MetricMeta { unit: Unit; fiboRef?: string }

export const BASE_METRIC_META: Record<(typeof BASE_METRIC_CODES)[number], MetricMeta> = {
  REVENUE: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:Revenue' },
  COGS: { unit: 'currency' },
  GROSS_PROFIT: { unit: 'currency' },
  OPEX: { unit: 'currency' },
  EBITDA_ENTRY: { unit: 'currency', fiboRef: 'fibo-fnd-acc-aeq:EBITDA' },
  EBITDA_MARGIN: { unit: 'percent' },
  DSO: { unit: 'days' },
  DIO: { unit: 'days' },
  DPO: { unit: 'days' },
  WORKING_CAPITAL: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:WorkingCapital' },
  CAPEX: { unit: 'currency' },
  FCF_ANNUAL: { unit: 'currency' },
  ENTRY_MULTIPLE: { unit: 'ratio' },
  EXIT_MULTIPLE: { unit: 'ratio' },
  HOLD_YEARS: { unit: 'years' },
  NET_DEBT_ENTRY: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:NetDebt' },
  NET_DEBT_EXIT: { unit: 'currency' },
  EBITDA_EXIT: { unit: 'currency' },
  EQUITY_ENTRY: { unit: 'currency' },
  EQUITY_EXIT: { unit: 'currency' },
  MOIC: { unit: 'ratio' },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/ontology/base.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ontology/base.ts src/ontology/base.test.ts
git commit -m "feat(ontology): base vocabulary with two-point bridge, no multiple lever"
```

---

### Task 2: SaaS extension + registry

**Files:**
- Create: `src/ontology/sectors/saas.ts`, `src/ontology/registry.ts`
- Test: `src/ontology/registry.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { getActiveVocabulary } from './registry';

describe('ontology registry', () => {
  const saas = getActiveVocabulary('saas');
  it('saas vocabulary = base ∪ saas extension', () => {
    expect(saas.metricCodes).toContain('EBITDA_EXIT');   // base
    expect(saas.metricCodes).toContain('GROSS_CHURN');   // extension
    expect(saas.leverCategories).toContain('PRICING');   // base
    expect(saas.leverCategories).toContain('RETENTION'); // extension
  });
  it('generic archetype has no saas terms', () => {
    const generic = getActiveVocabulary('generic');
    expect(generic.metricCodes).not.toContain('GROSS_CHURN');
  });
  it('guards validate against the ACTIVE vocabulary', () => {
    expect(saas.isLeverCategory('RETENTION')).toBe(true);
    expect(getActiveVocabulary('generic').isLeverCategory('RETENTION')).toBe(false);
    expect(saas.isLeverCategory('SYNERGY_MAGIC')).toBe(false);
  });
  it('every saas metric code has meta with a unit', () => {
    for (const code of saas.metricCodes) expect(saas.metricMeta[code]?.unit).toBeTypeOf('string');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/ontology/registry.test.ts`
Expected: FAIL with "Cannot find module './registry'".

- [ ] **Step 3: Write minimal implementation**

Create `src/ontology/sectors/saas.ts`:
```ts
import type { MetricMeta } from '../base';

export const SAAS_METRIC_CODES = [
  'ARR', 'GROSS_CHURN', 'EXPANSION_RATE', 'NRR', 'CAC', 'LTV', 'ARR_EXIT',
] as const;

export const SAAS_METRIC_META: Record<(typeof SAAS_METRIC_CODES)[number], MetricMeta> = {
  ARR: { unit: 'currency' },
  GROSS_CHURN: { unit: 'percent' },
  EXPANSION_RATE: { unit: 'percent' },
  NRR: { unit: 'ratio' },
  CAC: { unit: 'currency' },
  LTV: { unit: 'currency' },
  ARR_EXIT: { unit: 'currency' },
};

export const SAAS_LEVER_CATEGORIES = ['RETENTION', 'EXPANSION', 'SALES_EFFICIENCY'] as const;
```

Create `src/ontology/registry.ts`:
```ts
import {
  BASE_METRIC_CODES, BASE_METRIC_META, BASE_LEVER_CATEGORIES,
  BASE_CAUSE_CATEGORIES, NODE_TYPES, type MetricMeta,
} from './base';
import { SAAS_METRIC_CODES, SAAS_METRIC_META, SAAS_LEVER_CATEGORIES } from './sectors/saas';

export const SECTOR_ARCHETYPES = ['generic', 'saas', 'industrials', 'retail', 'services'] as const;
export type SectorArchetype = (typeof SECTOR_ARCHETYPES)[number];

export interface ActiveVocabulary {
  metricCodes: string[];
  metricMeta: Record<string, MetricMeta>;
  leverCategories: string[];
  causeCategories: string[];
  nodeTypes: string[];
  isMetricCode(v: unknown): boolean;
  isLeverCategory(v: unknown): boolean;
  isCauseCategory(v: unknown): boolean;
}

// industrials/retail/services: stubs for now — extend like saas in phase 3.
const EXTENSIONS: Partial<Record<SectorArchetype, {
  codes: readonly string[]; meta: Record<string, MetricMeta>; levers: readonly string[];
}>> = {
  saas: { codes: SAAS_METRIC_CODES, meta: SAAS_METRIC_META, levers: SAAS_LEVER_CATEGORIES },
};

export function getActiveVocabulary(archetype: SectorArchetype): ActiveVocabulary {
  const ext = EXTENSIONS[archetype];
  const metricCodes = [...BASE_METRIC_CODES, ...(ext?.codes ?? [])];
  const metricMeta = { ...BASE_METRIC_META, ...(ext?.meta ?? {}) };
  const leverCategories = [...BASE_LEVER_CATEGORIES, ...(ext?.levers ?? [])];
  const causeCategories = [...BASE_CAUSE_CATEGORIES];
  return {
    metricCodes, metricMeta, leverCategories, causeCategories, nodeTypes: [...NODE_TYPES],
    isMetricCode: (v) => metricCodes.includes(v as string),
    isLeverCategory: (v) => leverCategories.includes(v as string),
    isCauseCategory: (v) => causeCategories.includes(v as string),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/ontology/registry.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ontology/sectors/saas.ts src/ontology/registry.ts src/ontology/registry.test.ts
git commit -m "feat(ontology): layered vocabulary (base + saas) behind a registry"
```

---

### Task 3: JSON-LD context (base + saas)

**Files:**
- Create: `src/ontology/context.jsonld`
- Test: `src/ontology/context.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { getActiveVocabulary } from './registry';

describe('JSON-LD context', () => {
  const ctx = JSON.parse(readFileSync('src/ontology/context.jsonld', 'utf8'))['@context'];
  it('maps every active saas metric code to an IRI', () => {
    for (const code of getActiveVocabulary('saas').metricCodes) {
      expect(ctx[code], `${code} missing from context`).toBeDefined();
    }
  });
  it('declares the project namespace', () => {
    expect(ctx['vcc']).toBe('https://vcc.dev/ontology#');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/ontology/context.test.ts`
Expected: FAIL with "ENOENT ... context.jsonld".

- [ ] **Step 3: Write minimal implementation**

```json
{
  "@context": {
    "vcc": "https://vcc.dev/ontology#",
    "fibo-fnd-acc-cur": "https://spec.edmcouncil.org/fibo/ontology/FND/Accounting/CurrencyAmount/",
    "fibo-fnd-acc-aeq": "https://spec.edmcouncil.org/fibo/ontology/FND/Accounting/AccountingEquity/",
    "REVENUE": "fibo-fnd-acc-cur:Revenue",
    "COGS": "vcc:COGS",
    "GROSS_PROFIT": "vcc:GrossProfit",
    "OPEX": "vcc:Opex",
    "EBITDA_ENTRY": "fibo-fnd-acc-aeq:EBITDA",
    "EBITDA_MARGIN": "vcc:EbitdaMargin",
    "DSO": "vcc:DaysSalesOutstanding",
    "DIO": "vcc:DaysInventoryOutstanding",
    "DPO": "vcc:DaysPayableOutstanding",
    "WORKING_CAPITAL": "fibo-fnd-acc-cur:WorkingCapital",
    "CAPEX": "vcc:Capex",
    "FCF_ANNUAL": "vcc:AnnualFreeCashFlow",
    "ENTRY_MULTIPLE": "vcc:EntryMultiple",
    "EXIT_MULTIPLE": "vcc:ExitMultiple",
    "HOLD_YEARS": "vcc:HoldPeriodYears",
    "NET_DEBT_ENTRY": "fibo-fnd-acc-cur:NetDebt",
    "NET_DEBT_EXIT": "vcc:NetDebtAtExit",
    "EBITDA_EXIT": "vcc:EbitdaAtExit",
    "EQUITY_ENTRY": "vcc:EquityValueAtEntry",
    "EQUITY_EXIT": "vcc:EquityValueAtExit",
    "MOIC": "vcc:MultipleOnInvestedCapital",
    "ARR": "vcc:AnnualRecurringRevenue",
    "GROSS_CHURN": "vcc:GrossChurnRate",
    "EXPANSION_RATE": "vcc:ExpansionRate",
    "NRR": "vcc:NetRevenueRetention",
    "CAC": "vcc:CustomerAcquisitionCost",
    "LTV": "vcc:CustomerLifetimeValue",
    "ARR_EXIT": "vcc:ArrAtExit"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/ontology/context.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ontology/context.jsonld src/ontology/context.test.ts
git commit -m "feat(ontology): JSON-LD context covering base + saas"
```

---

### Task 4: Domain types

**Files:**
- Create: `src/domain/types.ts`

- [ ] **Step 1: Write the types (no test — pure types)**

```ts
import type { SectorArchetype } from '../ontology/registry';
import type { NodeType, Unit, DeltaKind } from '../ontology/base';

export type UUID = string;
export type ISODate = string;
export type GeneratedSource = 'claude' | 'analyst';
export type Severity = 'low' | 'medium' | 'high';
export type LeverStatus = 'hypothesis' | 'validated' | 'rejected';

export interface Company {
  id: UUID;
  name: string;
  sectorArchetype: SectorArchetype;   // drives template + active vocabulary
  businessModel: string | null;
  thesis: string | null;              // short investment thesis, shapes copilot context
}

export interface Metric {
  id: UUID;
  companyId: UUID;
  code: string;                       // validated against the ACTIVE vocabulary
  label: string;
  unit: Unit;
  isCalculated: boolean;
  formula: string | null;             // over sibling metric codes
  currentValue: number | null;
  benchmarkValue: number | null;
  benchmarkSource: string | null;
}

export interface DriverNode { id: UUID; companyId: UUID; metricId: UUID | null; label: string; nodeType: NodeType }
export interface DriverEdge { id: UUID; parentId: UUID; childId: UUID; operator: 'add'|'subtract'|'multiply'|'divide'|'reference' }

export interface RootCause {
  id: UUID; nodeId: UUID; description: string;
  category: string; severity: Severity;
  source: GeneratedSource; evidence: string | null; createdAt: ISODate;
}

export interface Lever {
  id: UUID; nodeId: UUID; causeId: UUID | null;
  label: string; mechanism: string;
  category: string;
  impactMetricCode: string;
  expectedDelta: number;
  deltaKind: DeltaKind;               // 'absolute' | 'percent' — v2
  timeToImpactDays: number;
  effort: 'low'|'medium'|'high';
  confidence: number;
  confidenceBasis: string;
  source: GeneratedSource; status: LeverStatus;
}

export interface ScenarioLever { scenarioId: UUID; leverId: UUID; appliedDelta: number; deltaKind: DeltaKind }

/** Analyst-set exogenous override (EXIT_MULTIPLE, HOLD_YEARS). Never copilot-proposed. */
export interface ScenarioAssumption { scenarioId: UUID; metricCode: string; value: number }

export interface ScenarioResult { scenarioId: UUID; metricCode: string; value: number; computedBy: 'engine' }
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/domain/types.ts
git commit -m "feat(domain): v2 types — archetype, deltaKind, scenario assumptions"
```

---

### Task 5: zod schema factory (bound to active vocabulary)

**Files:**
- Create: `src/domain/schemas.ts`
- Test: `src/domain/schemas.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { makeLeverSchema } from './schemas';
import { getActiveVocabulary } from '../ontology/registry';

const saasSchema = makeLeverSchema(getActiveVocabulary('saas'));
const genericSchema = makeLeverSchema(getActiveVocabulary('generic'));

const base = {
  id: 'l1', nodeId: 'n1', causeId: null, label: 'Reduce churn', mechanism: 'CS playbook',
  category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
  expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
  effort: 'medium', confidence: 0.6, source: 'claude', status: 'hypothesis',
};

describe('makeLeverSchema', () => {
  it('rejects empty/missing confidenceBasis', () => {
    expect(saasSchema.safeParse({ ...base, confidenceBasis: '' }).success).toBe(false);
    expect(saasSchema.safeParse(base).success).toBe(false);
  });
  it('accepts a grounded saas lever', () => {
    expect(saasSchema.safeParse({ ...base, confidenceBasis: '2 portfolio cases, churn -1.5pts realized' }).success).toBe(true);
  });
  it('rejects the same lever under the generic vocabulary (RETENTION unknown)', () => {
    expect(genericSchema.safeParse({ ...base, confidenceBasis: 'x' }).success).toBe(false);
  });
  it('rejects an invalid deltaKind', () => {
    expect(saasSchema.safeParse({ ...base, confidenceBasis: 'x', deltaKind: 'vibes' }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/domain/schemas.test.ts`
Expected: FAIL with "Cannot find module './schemas'".

- [ ] **Step 3: Write minimal implementation**

```ts
import { z } from 'zod';
import type { ActiveVocabulary } from '../ontology/registry';
import { DELTA_KINDS } from '../ontology/base';

const inVocab = (check: (v: unknown) => boolean, what: string) =>
  z.string().refine(check, { message: `not in active vocabulary: ${what}` });

export function makeLeverSchema(vocab: ActiveVocabulary) {
  return z.object({
    id: z.string(),
    nodeId: z.string(),
    causeId: z.string().nullable(),
    label: z.string().min(1),
    mechanism: z.string().min(1),
    category: inVocab(vocab.isLeverCategory, 'lever category'),
    impactMetricCode: inVocab(vocab.isMetricCode, 'metric code'),
    expectedDelta: z.number(),
    deltaKind: z.enum(DELTA_KINDS),
    timeToImpactDays: z.number().int().nonnegative(),
    effort: z.enum(['low', 'medium', 'high']),
    confidence: z.number().min(0).max(1),
    confidenceBasis: z.string().min(1, 'confidenceBasis is required'),
    source: z.enum(['claude', 'analyst']),
    status: z.enum(['hypothesis', 'validated', 'rejected']),
  });
}

export function makeRootCauseSchema(vocab: ActiveVocabulary) {
  return z.object({
    id: z.string(),
    nodeId: z.string(),
    description: z.string().min(1),
    category: inVocab(vocab.isCauseCategory, 'cause category'),
    severity: z.enum(['low', 'medium', 'high']),
    source: z.enum(['claude', 'analyst']),
    evidence: z.string().nullable(),
    createdAt: z.string(),
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/domain/schemas.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/schemas.ts src/domain/schemas.test.ts
git commit -m "feat(domain): vocabulary-bound zod schemas, deltaKind, confidenceBasis"
```

---

### Task 6: Formula evaluator

**Files:**
- Create: `src/engine/formula.ts`
- Test: `src/engine/formula.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { evaluateFormula, extractDependencies } from './formula';

describe('formula', () => {
  it('evaluates arithmetic over metric codes', () => {
    expect(evaluateFormula('REVENUE - COGS - OPEX', { REVENUE: 120, COGS: 80, OPEX: 22 })).toBe(18);
  });
  it('supports power (needed for NRR ^ HOLD_YEARS)', () => {
    expect(evaluateFormula('ARR * NRR ^ HOLD_YEARS', { ARR: 100, NRR: 1.1, HOLD_YEARS: 2 })).toBeCloseTo(121, 6);
  });
  it('extracts referenced codes', () => {
    expect(extractDependencies('ARR * NRR ^ HOLD_YEARS').sort()).toEqual(['ARR', 'HOLD_YEARS', 'NRR']);
  });
  it('throws on a non-finite result', () => {
    expect(() => evaluateFormula('A / B', { A: 1, B: 0 })).toThrow(/finite/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/engine/formula.test.ts`
Expected: FAIL with "Cannot find module './formula'".

- [ ] **Step 3: Write minimal implementation**

```ts
import { create, all } from 'mathjs';

const math = create(all, {});
math.import({
  import: () => { throw new Error('disabled'); },
  createUnit: () => { throw new Error('disabled'); },
  evaluate: () => { throw new Error('disabled'); },
}, { override: true });

export function evaluateFormula(formula: string, scope: Record<string, number>): number {
  const result = (math as any).parse(formula).compile().evaluate({ ...scope });
  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new Error(`Formula did not yield a finite number: ${formula}`);
  }
  return result;
}

export function extractDependencies(formula: string): string[] {
  const deps = new Set<string>();
  (math as any).parse(formula).traverse((node: any) => {
    if (node.isSymbolNode) deps.add(node.name);
  });
  return [...deps];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/engine/formula.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/formula.ts src/engine/formula.test.ts
git commit -m "feat(engine): safe formula evaluator with power support"
```

---

### Task 7: Dependency graph + cycle detection

**Files:**
- Create: `src/engine/graph.ts`
- Test: `src/engine/graph.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { topoSort } from './graph';

describe('graph', () => {
  it('orders dependencies before dependents', () => {
    const order = topoSort(new Map([
      ['MOIC', ['EQUITY_EXIT', 'EQUITY_ENTRY']],
      ['EQUITY_EXIT', []],
      ['EQUITY_ENTRY', []],
    ]));
    expect(order.indexOf('EQUITY_EXIT')).toBeLessThan(order.indexOf('MOIC'));
  });
  it('throws on a cycle with the cycle path in the message', () => {
    expect(() => topoSort(new Map([['A', ['B']], ['B', ['A']]]))).toThrow(/cycle.*A.*B/is);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/engine/graph.test.ts`
Expected: FAIL with "Cannot find module './graph'".

- [ ] **Step 3: Write minimal implementation**

```ts
export function topoSort(deps: Map<string, string[]>): string[] {
  const order: string[] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  const visit = (node: string, trail: string[]): void => {
    const s = state.get(node);
    if (s === 'done') return;
    if (s === 'visiting') {
      throw new Error(`Dependency cycle detected: ${[...trail, node].join(' -> ')}`);
    }
    state.set(node, 'visiting');
    for (const dep of deps.get(node) ?? []) visit(dep, [...trail, node]);
    state.set(node, 'done');
    order.push(node);
  };

  for (const node of deps.keys()) visit(node, []);
  return order;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/engine/graph.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/graph.ts src/engine/graph.test.ts
git commit -m "feat(engine): topological sort with explicit cycle error"
```

---

### Task 8: Metric resolver

**Files:**
- Create: `src/engine/resolver.ts`
- Test: `src/engine/resolver.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { resolveMetrics } from './resolver';
import type { Metric } from '../domain/types';

export const m = (code: string, value: number | null, formula: string | null = null): Metric => ({
  id: code, companyId: 'c1', code, label: code,
  unit: 'currency', isCalculated: formula !== null, formula,
  currentValue: value, benchmarkValue: null, benchmarkSource: null,
});

describe('resolveMetrics', () => {
  it('computes chained calculated metrics', () => {
    const out = resolveMetrics([
      m('ARR', 100), m('GROSS_CHURN', 0.12), m('EXPANSION_RATE', 0.07), m('HOLD_YEARS', 4),
      m('NRR', null, '1 + EXPANSION_RATE - GROSS_CHURN'),
      m('ARR_EXIT', null, 'ARR * NRR ^ HOLD_YEARS'),
    ]);
    expect(out.get('NRR')).toBeCloseTo(0.95, 10);
    expect(out.get('ARR_EXIT')).toBeCloseTo(100 * 0.95 ** 4, 6);
  });
  it('throws when a dependency has no value', () => {
    expect(() => resolveMetrics([m('NRR', null, '1 + EXPANSION_RATE - GROSS_CHURN')]))
      .toThrow(/missing value/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/engine/resolver.test.ts`
Expected: FAIL with "Cannot find module './resolver'".

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Metric } from '../domain/types';
import { evaluateFormula, extractDependencies } from './formula';
import { topoSort } from './graph';

export function resolveMetrics(metrics: Metric[]): Map<string, number> {
  const byCode = new Map(metrics.map((x) => [x.code, x]));
  const deps = new Map<string, string[]>();
  for (const x of metrics) {
    deps.set(x.code, x.isCalculated && x.formula ? extractDependencies(x.formula) : []);
  }

  const values = new Map<string, number>();
  for (const code of topoSort(deps)) {
    const metric = byCode.get(code);
    if (!metric) continue;
    if (metric.isCalculated && metric.formula) {
      const scope: Record<string, number> = {};
      for (const dep of extractDependencies(metric.formula)) {
        const v = values.get(dep);
        if (v === undefined) throw new Error(`Missing value for ${dep} (needed by ${code})`);
        scope[dep] = v;
      }
      values.set(code, evaluateFormula(metric.formula, scope));
    } else if (metric.currentValue !== null) {
      values.set(code, metric.currentValue);
    }
  }
  return values;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/engine/resolver.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/resolver.ts src/engine/resolver.test.ts
git commit -m "feat(engine): metric resolver (topological evaluation)"
```

---

### Task 9: SaaS template (instantiation + two-point bridge)

**Files:**
- Create: `src/templates/saas.ts`
- Test: `src/templates/saas.test.ts`

This is the worked sector example: operational → financial → bridge linkage formulas, ready for the resolver.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { instantiateSaasTemplate } from './saas';
import { resolveMetrics } from '../engine/resolver';

describe('saas template', () => {
  const metrics = instantiateSaasTemplate('c1', {
    ARR: 100, GROSS_CHURN: 0.10, EXPANSION_RATE: 0.12, EBITDA_MARGIN: 0.20,
    ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 4,
    NET_DEBT_ENTRY: 60, FCF_ANNUAL: 8,
  });
  it('resolves the full chain churn -> NRR -> ARR_EXIT -> EBITDA_EXIT -> MOIC', () => {
    const v = resolveMetrics(metrics);
    expect(v.get('NRR')).toBeCloseTo(1.02, 10);
    expect(v.get('ARR_EXIT')).toBeCloseTo(100 * 1.02 ** 4, 4);
    expect(v.get('EBITDA_EXIT')).toBeCloseTo(v.get('ARR_EXIT')! * 0.2, 6);
    const equityEntry = 100 * 0.2 * 8 - 60;
    expect(v.get('EQUITY_ENTRY')).toBeCloseTo(equityEntry, 6);
    const netDebtExit = 60 - 8 * 4;
    expect(v.get('MOIC')).toBeCloseTo((v.get('EBITDA_EXIT')! * 8 - netDebtExit) / equityEntry, 6);
  });
  it('every instantiated code belongs to the saas active vocabulary', async () => {
    const { getActiveVocabulary } = await import('../ontology/registry');
    const vocab = getActiveVocabulary('saas');
    for (const x of metrics) expect(vocab.isMetricCode(x.code), x.code).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/templates/saas.test.ts`
Expected: FAIL with "Cannot find module './saas'".

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Metric } from '../domain/types';
import { getActiveVocabulary } from '../ontology/registry';

export type SaasInputs = {
  ARR: number; GROSS_CHURN: number; EXPANSION_RATE: number; EBITDA_MARGIN: number;
  ENTRY_MULTIPLE: number; EXIT_MULTIPLE: number; HOLD_YEARS: number;
  NET_DEBT_ENTRY: number; FCF_ANNUAL: number;
};

const FORMULAS: Record<string, string> = {
  NRR: '1 + EXPANSION_RATE - GROSS_CHURN',
  ARR_EXIT: 'ARR * NRR ^ HOLD_YEARS',
  REVENUE: 'ARR',
  EBITDA_ENTRY: 'ARR * EBITDA_MARGIN',
  EBITDA_EXIT: 'ARR_EXIT * EBITDA_MARGIN',
  EQUITY_ENTRY: 'EBITDA_ENTRY * ENTRY_MULTIPLE - NET_DEBT_ENTRY',
  NET_DEBT_EXIT: 'NET_DEBT_ENTRY - FCF_ANNUAL * HOLD_YEARS',
  EQUITY_EXIT: 'EBITDA_EXIT * EXIT_MULTIPLE - NET_DEBT_EXIT',
  MOIC: 'EQUITY_EXIT / EQUITY_ENTRY',
};

export function instantiateSaasTemplate(companyId: string, inputs: SaasInputs): Metric[] {
  const vocab = getActiveVocabulary('saas');
  const make = (code: string, value: number | null, formula: string | null): Metric => {
    if (!vocab.isMetricCode(code)) throw new Error(`Template emits unknown code: ${code}`);
    return {
      id: `${companyId}:${code}`, companyId, code, label: code,
      unit: vocab.metricMeta[code].unit, isCalculated: formula !== null, formula,
      currentValue: value, benchmarkValue: null, benchmarkSource: null,
    };
  };
  return [
    ...Object.entries(inputs).map(([code, value]) => make(code, value, null)),
    ...Object.entries(FORMULAS).map(([code, formula]) => make(code, null, formula)),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/templates/saas.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/templates/saas.ts src/templates/saas.test.ts
git commit -m "feat(templates): saas template with two-point equity bridge"
```

---

### Task 10: Scenario engine (deltaKind + analyst gate + assumptions)

**Files:**
- Create: `src/engine/scenario.ts`
- Test: `src/engine/scenario.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';
import { instantiateSaasTemplate } from '../templates/saas';
import type { Lever, ScenarioLever, ScenarioAssumption } from '../domain/types';

const metrics = instantiateSaasTemplate('c1', {
  ARR: 100, GROSS_CHURN: 0.10, EXPANSION_RATE: 0.12, EBITDA_MARGIN: 0.20,
  ENTRY_MULTIPLE: 8, EXIT_MULTIPLE: 8, HOLD_YEARS: 4,
  NET_DEBT_ENTRY: 60, FCF_ANNUAL: 8,
});

const churnLever = (status: Lever['status']): Lever => ({
  id: 'lev-churn', nodeId: 'n1', causeId: null,
  label: 'Onboarding & CS playbook', mechanism: 'Cut gross churn',
  category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
  expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
  effort: 'medium', confidence: 0.6, confidenceBasis: '2 portfolio cases',
  source: 'claude', status,
});

const sl: ScenarioLever[] = [{ scenarioId: 's1', leverId: 'lev-churn', appliedDelta: -0.02, deltaKind: 'absolute' }];

describe('runScenario', () => {
  it('REFUSES a non-validated lever (analyst gate, invariant 4)', () => {
    expect(() => runScenario('s1', metrics, [churnLever('hypothesis')], sl, []))
      .toThrow(/validated/i);
  });
  it('propagates churn -2pts to MOIC, all engine-computed', () => {
    const results = runScenario('s1', metrics, [churnLever('validated')], sl, []);
    const get = (c: string) => results.find((r) => r.metricCode === c)!;
    expect(get('NRR').value).toBeCloseTo(1.04, 10);
    expect(get('ARR_EXIT').value).toBeCloseTo(100 * 1.04 ** 4, 4);
    expect(results.every((r) => r.computedBy === 'engine')).toBe(true);
  });
  it('applies percent deltas relatively', () => {
    const pctLever = { ...churnLever('validated'), deltaKind: 'percent' as const };
    const slPct: ScenarioLever[] = [{ scenarioId: 's1', leverId: 'lev-churn', appliedDelta: -0.5, deltaKind: 'percent' }];
    const results = runScenario('s1', metrics, [pctLever], slPct, []);
    const churn = results.find((r) => r.metricCode === 'GROSS_CHURN')!;
    expect(churn.value).toBeCloseTo(0.05, 10);  // 0.10 * (1 - 0.5)
  });
  it('exit multiple sensitivity via assumptions yields distinct MOICs', () => {
    const lever = [churnLever('validated')];
    const moicAt = (mult: number) => {
      const a: ScenarioAssumption[] = [{ scenarioId: 's1', metricCode: 'EXIT_MULTIPLE', value: mult }];
      return runScenario('s1', metrics, lever, sl, a).find((r) => r.metricCode === 'MOIC')!.value;
    };
    expect(moicAt(7)).toBeLessThan(moicAt(8));
    expect(moicAt(8)).toBeLessThan(moicAt(9));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/engine/scenario.test.ts`
Expected: FAIL with "Cannot find module './scenario'".

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Metric, Lever, ScenarioLever, ScenarioAssumption, ScenarioResult } from '../domain/types';
import { resolveMetrics } from './resolver';

export function runScenario(
  scenarioId: string,
  metrics: Metric[],
  levers: Lever[],
  scenarioLevers: ScenarioLever[],
  assumptions: ScenarioAssumption[],
): ScenarioResult[] {
  const leverById = new Map(levers.map((l) => [l.id, l]));
  const perturbed = metrics.map((x) => ({ ...x }));
  const byCode = new Map(perturbed.map((x) => [x.code, x]));

  // Analyst-set exogenous overrides (e.g. EXIT_MULTIPLE) — inputs only.
  for (const a of assumptions) {
    const t = byCode.get(a.metricCode);
    if (!t) throw new Error(`Assumption targets missing metric: ${a.metricCode}`);
    if (t.isCalculated) throw new Error(`Cannot assume a calculated metric: ${t.code}`);
    t.currentValue = a.value;
  }

  // Levers — analyst gate (invariant 4) + delta semantics.
  for (const sl of scenarioLevers) {
    const lever = leverById.get(sl.leverId);
    if (!lever) throw new Error(`Unknown lever: ${sl.leverId}`);
    if (lever.status !== 'validated') {
      throw new Error(`Lever "${lever.label}" is not validated by an analyst — refused in simulation`);
    }
    const t = byCode.get(lever.impactMetricCode);
    if (!t) throw new Error(`Lever targets missing metric: ${lever.impactMetricCode}`);
    if (t.isCalculated) throw new Error(`Cannot perturb a calculated metric: ${t.code}`);
    const base = t.currentValue ?? 0;
    t.currentValue = sl.deltaKind === 'percent' ? base * (1 + sl.appliedDelta) : base + sl.appliedDelta;
  }

  const values = resolveMetrics(perturbed);
  return [...values].map(([metricCode, value]) => ({ scenarioId, metricCode, value, computedBy: 'engine' as const }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/engine/scenario.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/scenario.ts src/engine/scenario.test.ts
git commit -m "feat(engine): scenario engine — deltaKind, analyst gate, assumptions"
```

---

### Task 11: Copilot proposal sanitizer (vocabulary-bound)

**Files:**
- Create: `src/copilot/proposal.ts`
- Test: `src/copilot/proposal.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { sanitizeProposal } from './proposal';
import { getActiveVocabulary } from '../ontology/registry';

const vocab = getActiveVocabulary('saas');
const lever = {
  nodeId: 'n1', causeId: null, label: 'Cut churn', mechanism: 'CS playbook',
  category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
  expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
  effort: 'medium', confidence: 0.6, confidenceBasis: '2 portfolio cases',
};

describe('sanitizeProposal', () => {
  it('strips smuggled scenarioResults', () => {
    const clean = sanitizeProposal({ levers: [lever], scenarioResults: [{ metricCode: 'MOIC', value: 9 }] }, vocab);
    expect((clean as any).scenarioResults).toBeUndefined();
  });
  it('rejects a lever missing confidenceBasis', () => {
    const { confidenceBasis, ...bad } = lever;
    expect(() => sanitizeProposal({ levers: [bad] }, vocab)).toThrow(/confidenceBasis/i);
  });
  it('rejects out-of-active-vocabulary categories', () => {
    expect(() => sanitizeProposal({ levers: [{ ...lever, category: 'MULTIPLE_EXPANSION' }] }, vocab)).toThrow();
    expect(() => sanitizeProposal({ levers: [lever] }, getActiveVocabulary('generic'))).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/copilot/proposal.test.ts`
Expected: FAIL with "Cannot find module './proposal'".

- [ ] **Step 3: Write minimal implementation**

```ts
import { z } from 'zod';
import type { ActiveVocabulary } from '../ontology/registry';
import { DELTA_KINDS } from '../ontology/base';

export function makeProposalSchema(vocab: ActiveVocabulary) {
  const inVocab = (check: (v: unknown) => boolean, what: string) =>
    z.string().refine(check, { message: `not in active vocabulary: ${what}` });

  const ProposedLever = z.object({
    nodeId: z.string(),
    causeId: z.string().nullable(),
    label: z.string().min(1),
    mechanism: z.string().min(1),
    category: inVocab(vocab.isLeverCategory, 'lever category'),
    impactMetricCode: inVocab(vocab.isMetricCode, 'metric code'),
    expectedDelta: z.number(),
    deltaKind: z.enum(DELTA_KINDS),
    timeToImpactDays: z.number().int().nonnegative(),
    effort: z.enum(['low', 'medium', 'high']),
    confidence: z.number().min(0).max(1),
    confidenceBasis: z.string().min(1, 'confidenceBasis is required'),
  });

  const ProposedCause = z.object({
    nodeId: z.string(),
    description: z.string().min(1),
    category: inVocab(vocab.isCauseCategory, 'cause category'),
    severity: z.enum(['low', 'medium', 'high']),
    evidence: z.string().nullable(),
  });

  return z.object({
    rootCauses: z.array(ProposedCause).optional(),
    levers: z.array(ProposedLever).optional(),
  }).strict();
}

export type CopilotProposal = z.infer<ReturnType<typeof makeProposalSchema>>;

export function sanitizeProposal(raw: unknown, vocab: ActiveVocabulary): CopilotProposal {
  const { scenarioResults, assumptions, ...rest } = (raw ?? {}) as Record<string, unknown>;
  return makeProposalSchema(vocab).parse(rest);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/copilot/proposal.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/copilot/proposal.ts src/copilot/proposal.test.ts
git commit -m "feat(copilot): vocabulary-bound sanitizer, strips results & assumptions"
```

---

### Task 12: Proposal ingestion

**Files:**
- Create: `src/copilot/ingest.ts`
- Test: `src/copilot/ingest.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { ingestProposal } from './ingest';

let n = 0;
const id = () => `id-${++n}`;

describe('ingestProposal', () => {
  it('tags levers as claude-sourced hypotheses (never validated)', () => {
    const { levers } = ingestProposal({
      levers: [{
        nodeId: 'n1', causeId: null, label: 'Cut churn', mechanism: 'm',
        category: 'RETENTION', impactMetricCode: 'GROSS_CHURN',
        expectedDelta: -0.02, deltaKind: 'absolute', timeToImpactDays: 90,
        effort: 'medium', confidence: 0.6, confidenceBasis: 'b',
      }],
    }, id);
    expect(levers[0].source).toBe('claude');
    expect(levers[0].status).toBe('hypothesis');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/copilot/ingest.test.ts`
Expected: FAIL with "Cannot find module './ingest'".

- [ ] **Step 3: Write minimal implementation**

```ts
import type { CopilotProposal } from './proposal';
import type { Lever, RootCause } from '../domain/types';

export function ingestProposal(
  proposal: CopilotProposal,
  newId: () => string,
  now: () => string = () => new Date().toISOString().slice(0, 10),
): { levers: Lever[]; rootCauses: RootCause[] } {
  const levers: Lever[] = (proposal.levers ?? []).map((p) => ({
    ...p, id: newId(), source: 'claude', status: 'hypothesis',
  }));
  const rootCauses: RootCause[] = (proposal.rootCauses ?? []).map((p) => ({
    ...p, id: newId(), source: 'claude', createdAt: now(),
  }));
  return { levers, rootCauses };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/copilot/ingest.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/copilot/ingest.ts src/copilot/ingest.test.ts
git commit -m "feat(copilot): ingestion always lands as hypothesis"
```

---

### Task 13: Claude API proxy (active vocabulary injected)

**Files:**
- Create: `src/server/proxy.ts`
- Test: `src/server/proxy.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, handleProposal } from './proxy';

describe('proxy', () => {
  it('system prompt injects the ACTIVE vocabulary for the archetype', () => {
    const saas = buildSystemPrompt('saas');
    expect(saas).toMatch(/RETENTION/);
    expect(saas).toMatch(/GROSS_CHURN/);
    expect(saas).toMatch(/confidenceBasis/);
    expect(buildSystemPrompt('generic')).not.toMatch(/RETENTION/);
  });
  it('handleProposal sanitizes a model reply against the archetype vocabulary', async () => {
    const fakeCall = async () => JSON.stringify({
      levers: [], rootCauses: [], scenarioResults: [{ metricCode: 'MOIC', value: 9 }],
    });
    const out = await handleProposal('saas', 'analyse', fakeCall);
    expect((out as any).scenarioResults).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/server/proxy.test.ts`
Expected: FAIL with "Cannot find module './proxy'".

- [ ] **Step 3: Write minimal implementation**

```ts
import express from 'express';
import { sanitizeProposal, type CopilotProposal } from '../copilot/proposal';
import { getActiveVocabulary, type SectorArchetype } from '../ontology/registry';

export function buildSystemPrompt(archetype: SectorArchetype): string {
  const v = getActiveVocabulary(archetype);
  return [
    'You propose root causes and levers for a PE value driver tree.',
    'Return ONLY a JSON object: { "rootCauses": [...], "levers": [...] }. No prose, no markdown.',
    `Lever.category MUST be one of: ${v.leverCategories.join(', ')}.`,
    `RootCause.category MUST be one of: ${v.causeCategories.join(', ')}.`,
    `impactMetricCode MUST be one of: ${v.metricCodes.join(', ')}.`,
    "Every lever MUST include deltaKind ('absolute' or 'percent') and a non-empty confidenceBasis.",
    'NEVER output computed figures, scenario results, exit multiples, or assumptions — the engine and the analyst own those.',
  ].join('\n');
}

export async function handleProposal(
  archetype: SectorArchetype,
  userMessage: string,
  callModel: (system: string, user: string) => Promise<string>,
): Promise<CopilotProposal> {
  const text = await callModel(buildSystemPrompt(archetype), userMessage);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return sanitizeProposal(JSON.parse(cleaned), getActiveVocabulary(archetype));
}

export function createServer(callModel: (s: string, u: string) => Promise<string>) {
  const app = express();
  app.use(express.json());
  app.post('/api/propose', async (req, res) => {
    try {
      const archetype = (req.body?.archetype ?? 'generic') as SectorArchetype;
      res.json(await handleProposal(archetype, String(req.body?.message ?? ''), callModel));
    } catch (e) {
      res.status(422).json({ error: (e as Error).message });
    }
  });
  return app;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/server/proxy.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/server/proxy.ts src/server/proxy.test.ts
git commit -m "feat(server): proxy injects active vocabulary, sanitizes per archetype"
```

---

## Self-Review

**1. Spec coverage**
- SPEC §2.1 two-point bridge → Task 1 (codes), Task 9 (formulas), end-to-end test in Task 9/10. ✓
- SPEC §2.2 multiple = assumption → Task 1 (no MULTIPLE_EXPANSION category + test asserting absence), Task 4 (`ScenarioAssumption`), Task 10 (sensitivity test), Task 11 (sanitizer strips `assumptions`), Task 13 (prompt forbids). ✓
- SPEC §3 invariant 1 → Task 10 (`computedBy: 'engine'`), Task 11 (strip + `.strict()`). ✓
- SPEC §3 invariant 2 → Tasks 5 & 11 (`confidenceBasis: min(1)`). ✓
- SPEC §3 invariant 3 → Task 2 (registry guards), Tasks 5/11 (vocabulary-bound schemas), Task 13 (prompt injects active vocabulary). ✓
- SPEC §3 invariant 4 (analyst gate) → Task 10 (refuses non-validated lever, with test), Task 12 (ingestion always lands as `hypothesis`). ✓
- SPEC §4 layered ontology → Tasks 1–3. Stubs industrials/retail/services declared in registry comment (phase 3). ✓
- SPEC §5 deltaKind → Tasks 1/4/5/10 (absolute + percent paths both tested). ✓
- SPEC §5 limitation (additive deltas, no interactions) → documented in SPEC; no task needed (phase 3). ✓
- SPEC §10 sensitivity → Task 10 test (EXIT_MULTIPLE 7/8/9 → strictly increasing MOIC). ✓
- Out of scope by design: UI, Postgres repository, driver-node graph construction (UI plan), other sector templates (phase 3).

**2. Placeholder scan** — no TBD/TODO/“similar to”; all code steps show full code; all run steps state expected outcomes. ✓

**3. Type consistency** — `Metric` (Task 4) consumed unchanged by resolver (8), template (9), scenario (10). `deltaKind` defined Task 1, used Tasks 4/5/10/11. `ScenarioAssumption` defined Task 4, consumed Task 10, stripped Task 11. `instantiateSaasTemplate` signature consistent between Tasks 9 and 10. Metric codes are `string` validated at runtime against the active vocabulary (a deliberate loosening vs v1's global literal union — required by layering). ✓

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-11-value-cockpit-core-v2.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
