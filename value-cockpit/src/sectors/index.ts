import type { SectorSpec } from './types';
import { manufacturing } from './manufacturing';
import { biotech } from './biotech';
import { retailBank } from './retail-bank';
import { commercialBank } from './commercial-bank';
import { lifeInsurance } from './life-insurance';
import { autoInsurance } from './auto-insurance';
import { pcInsurance } from './pc-insurance';
import { healthPayor } from './health-payor';
import { wineSpirits } from './wine-spirits';
import { wasteManagement } from './waste-management';
import { thirdPartyLogistics } from './third-party-logistics';
import { pharma } from './pharma';
import { metalsMining } from './metals-mining';
import { medicalDevice } from './medical-device';
import { media } from './media';
import { hospitality } from './hospitality';
import { healthcareProvider } from './healthcare-provider';
import { electricityGeneration } from './electricity-generation';
import { cosmetics } from './cosmetics';
import { agriculture } from './agriculture';
import { chemical } from './chemical';
import { retail } from './retail';

/** Level-2 sectors defined by a spec (docs/14). Keys must match SPEC_ARCHETYPES in the registry. */
export const SPECS = { manufacturing, retail, chemical, agriculture, cosmetics, 'electricity-generation': electricityGeneration, 'healthcare-provider': healthcareProvider, hospitality, media, 'medical-device': medicalDevice, 'metals-mining': metalsMining, pharma, 'third-party-logistics': thirdPartyLogistics, 'waste-management': wasteManagement, 'wine-spirits': wineSpirits, 'health-payor': healthPayor, 'pc-insurance': pcInsurance, 'auto-insurance': autoInsurance, 'life-insurance': lifeInsurance, 'commercial-bank': commercialBank, 'retail-bank': retailBank, biotech } satisfies Record<string, SectorSpec>;
