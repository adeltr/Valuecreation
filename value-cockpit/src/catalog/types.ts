import type { SectorArchetype } from '../ontology/registry';

export interface AnalysisRef {
  id: string;                      // '<archetype>-NN', e.g. 'airline-13'
  archetype: SectorArchetype;
  title: string;
  part: string;                    // letter, meaning is archetype-specific
  partLabel: string;               // e.g. 'Operational Efficiency'
  relatedMetricCodes: string[];    // ∈ active vocabulary (validated by build script)
  relatedCauseCategories: string[];
  relatedLeverCategories: string[];
  sourcePath: string;              // relative to project root, e.g. data/analysis-library/airline/13 - …md
}
