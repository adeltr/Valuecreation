import type { AnalysisRef } from './types';
import type { SectorArchetype } from '../ontology/registry';
import aero from './aero.catalog.json';
import airline from './airline.catalog.json';

const CATALOGS: Partial<Record<SectorArchetype, AnalysisRef[]>> = {
  aero: aero as AnalysisRef[],
  airline: airline as AnalysisRef[],
};

/** Curated analysis protocols for an archetype (empty when none). Never carries values. */
export function getCatalog(archetype: SectorArchetype): AnalysisRef[] {
  return CATALOGS[archetype] ?? [];
}
