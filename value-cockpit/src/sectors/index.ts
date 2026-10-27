import type { SectorSpec } from './types';
import { manufacturing } from './manufacturing';

/** Level-2 sectors defined by a spec (docs/14). Keys must match SPEC_ARCHETYPES in the registry. */
export const SPECS = { manufacturing } satisfies Record<string, SectorSpec>;
