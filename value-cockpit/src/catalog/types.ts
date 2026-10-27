export interface AnalysisRef {
  id: string;                      // 'aero-01' … 'aero-44'
  title: string;
  part: string;                    // 'A' (strategy), 'B' (ops), 'C' (R&D)…
  relatedMetricCodes: string[];    // ∈ active vocabulary (validated by build script)
  relatedCauseCategories: string[];
  relatedLeverCategories: string[];
  sourcePath: string;              // relative to project root, e.g. data/analysis-library/aero/01-…md
}
