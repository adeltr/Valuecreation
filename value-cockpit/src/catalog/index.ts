import type { AnalysisRef } from './types';
import type { SectorArchetype } from '../ontology/registry';
import aero from './aero.catalog.json';
import airline from './airline.catalog.json';
import saas from './saas.catalog.json';
import agriculture from './agriculture.catalog.json';
import chemical from './chemical.catalog.json';
import cosmetics from './cosmetics.catalog.json';
import cpg from './cpg.catalog.json';
import electricityGeneration from './electricity-generation.catalog.json';
import healthcareProvider from './healthcare-provider.catalog.json';
import hospitality from './hospitality.catalog.json';
import manufacturing from './manufacturing.catalog.json';
import media from './media.catalog.json';
import medicalDevice from './medical-device.catalog.json';
import metalsMining from './metals-mining.catalog.json';
import pharma from './pharma.catalog.json';
import retail from './retail.catalog.json';
import thirdPartyLogistics from './third-party-logistics.catalog.json';
import wasteManagement from './waste-management.catalog.json';
import wineSpirits from './wine-spirits.catalog.json';

const CATALOGS: Partial<Record<SectorArchetype, AnalysisRef[]>> = {
  aero: aero as AnalysisRef[],
  airline: airline as AnalysisRef[],
  saas: saas as AnalysisRef[],
  agriculture: agriculture as AnalysisRef[],
  chemical: chemical as AnalysisRef[],
  cosmetics: cosmetics as AnalysisRef[],
  cpg: cpg as AnalysisRef[],
  'electricity-generation': electricityGeneration as AnalysisRef[],
  'healthcare-provider': healthcareProvider as AnalysisRef[],
  hospitality: hospitality as AnalysisRef[],
  manufacturing: manufacturing as AnalysisRef[],
  media: media as AnalysisRef[],
  'medical-device': medicalDevice as AnalysisRef[],
  'metals-mining': metalsMining as AnalysisRef[],
  pharma: pharma as AnalysisRef[],
  retail: retail as AnalysisRef[],
  'third-party-logistics': thirdPartyLogistics as AnalysisRef[],
  'waste-management': wasteManagement as AnalysisRef[],
  'wine-spirits': wineSpirits as AnalysisRef[],
};

/** Curated analysis protocols for an archetype (empty when none). Never carries values. */
export function getCatalog(archetype: SectorArchetype): AnalysisRef[] {
  return CATALOGS[archetype] ?? [];
}
