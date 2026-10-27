export function topoSort(deps: Map<string, string[]>): string[] {
  const order: string[] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  const visit = (node: string, trail: string[]): void => {
    const s = state.get(node);
    if (s === 'done') return;
    if (s === 'visiting') {
      throw new Error(`Dependency cycle detected: ${[...trail, node].join(' -> ')}`);
    }
    state.set(node, 'visiting');
    for (const dep of deps.get(node) ?? []) visit(dep, [...trail, node]);
    state.set(node, 'done');
    order.push(node);
  };

  for (const node of deps.keys()) visit(node, []);
  return order;
}
