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
  sectorArchetype: SectorArchetype;
  businessModel: string | null;
  thesis: string | null;
}

export interface Metric {
  id: UUID;
  companyId: UUID;
  code: string;
  label: string;
  unit: Unit;
  isCalculated: boolean;
  formula: string | null;
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
  deltaKind: DeltaKind;
  timeToImpactDays: number;
  effort: 'low'|'medium'|'high';
  confidence: number;
  confidenceBasis: string;
  source: GeneratedSource; status: LeverStatus;
  /** One-off cost of implementing the lever (currency). Set by the analyst only, never by the copilot. */
  implementationCost?: number;
  /** Who validated or rejected it, and when (audit trail, docs/22). */
  decision?: { by: string; at: ISODate };
  /** The analyst who wrote it, for a lever not proposed by the copilot. */
  createdBy?: string;
}

export interface ScenarioLever { scenarioId: UUID; leverId: UUID; appliedDelta: number; deltaKind: DeltaKind }

/** Analyst-set exogenous override (EXIT_MULTIPLE, HOLD_YEARS). Never copilot-proposed. */
export interface ScenarioAssumption { scenarioId: UUID; metricCode: string; value: number }

/**
 * Analyst-set interaction between two inputs (docs/06): after the levers, the target moves by
 * coefficient × (source after levers − source before levers). E.g. price-mix → volume through
 * an elasticity. Defined by the sector template, never proposed by the copilot.
 */
export interface InteractionRule { sourceCode: string; targetCode: string; coefficientCode: string }

/** Optional behaviours of the scenario engine; each names the input it reads or feeds. */
export interface ScenarioOptions {
  /** Holding period in years: a lever whose first impact comes later does not move the exit. */
  horizonYearsCode?: string;
  /** Cost input the implementation costs of the scenario levers are added to. */
  costCode?: string;
}

export interface ScenarioResult { scenarioId: UUID; metricCode: string; value: number; computedBy: 'engine' }
