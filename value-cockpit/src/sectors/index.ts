import type { SectorSpec } from './types';
import { manufacturing } from './manufacturing';
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
export const SPECS = { manufacturing, retail, chemical, agriculture, cosmetics, 'electricity-generation': electricityGeneration, 'healthcare-provider': healthcareProvider, hospitality, media, 'medical-device': medicalDevice, 'metals-mining': metalsMining, pharma, 'third-party-logistics': thirdPartyLogistics } satisfies Record<string, SectorSpec>;
