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
