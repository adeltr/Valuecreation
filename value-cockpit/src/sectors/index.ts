import type { SectorSpec } from './types';
import { manufacturing } from './manufacturing';
import { agriculture } from './agriculture';
import { chemical } from './chemical';
import { retail } from './retail';

/** Level-2 sectors defined by a spec (docs/14). Keys must match SPEC_ARCHETYPES in the registry. */
export const SPECS = { manufacturing, retail, chemical, agriculture } satisfies Record<string, SectorSpec>;
