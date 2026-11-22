import { create, all } from 'mathjs';

const math = create(all, {});
math.import({
  import: () => { throw new Error('disabled'); },
  createUnit: () => { throw new Error('disabled'); },
  evaluate: () => { throw new Error('disabled'); },
}, { override: true });

export function evaluateFormula(formula: string, scope: Record<string, number>): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (math as any).parse(formula).compile().evaluate({ ...scope });
  if (typeof result !== 'number' || !Number.isFinite(result)) {
    throw new Error(`Formula did not yield a finite number: ${formula}`);
  }
  return result;
}

export function extractDependencies(formula: string): string[] {
  const deps = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (math as any).parse(formula).traverse((node: any, _path: string, parent: any) => {
    // The function name of a call (min, max…) is a SymbolNode too: it is not a metric.
    if (node.isSymbolNode && !(parent?.isFunctionNode && parent.fn === node)) deps.add(node.name);
  });
  return [...deps];
}
