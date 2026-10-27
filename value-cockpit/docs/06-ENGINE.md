# 06 · Moteur déterministe

Quatre modules purs (pas d'I/O, pas de Date.now(), pas d'aléatoire), qui
opèrent sur des `Metric[]` nus — jamais d'import de l'ontologie, du repo ou du
copilote.

## formula.ts
- `evaluateFormula(formula, scope)` : mathjs parse/compile sur un scope de
  codes de métriques. Résultat non fini ⇒ erreur. Fonctions dangereuses
  (`import`, `createUnit`, `evaluate` global) désactivées.
- Supporte `^` (puissance) — requis par `NRR ^ HOLD_YEARS` et
  `BOOK_TO_BILL ^ HOLD_YEARS`.
- `extractDependencies(formula)` : codes référencés (SymbolNodes).

## graph.ts
- `topoSort(deps)` : tri topologique DFS, cycle ⇒ erreur explicite incluant le
  chemin (`A -> B -> A`). C'est le garde-fou anti-boucle-infinie du résolveur.

## resolver.ts
- `resolveMetrics(metrics)` : évalue en ordre topologique. Input ⇒
  `currentValue` ; calculée ⇒ formule sur les valeurs déjà résolues.
  Dépendance manquante ⇒ erreur nommant la métrique et son demandeur.

## scenario.ts — la simulation EST le résolveur après perturbation

```
runScenario(scenarioId, metrics, levers, scenarioLevers, assumptions):
  1. clone des métriques
  2. assumptions (analyste) : override d'INPUTS exogènes (EXIT_MULTIPLE,
     HOLD_YEARS). Cible calculée ⇒ erreur.
  3. leviers : pour chaque scenarioLever
     a. lever.status ≠ 'validated' ⇒ ERREUR (invariant 4, gate analyste)
     b. cible calculée ⇒ erreur (on ne perturbe que des inputs)
     c. scenarioLever.deltaKind ≠ lever.deltaKind ⇒ erreur
     d. application selon deltaKind :
        absolute : valeur + delta        (DSO −20 jours, churn −2 pts)
        percent  : valeur × (1 + delta)  (churn −50 % relatif)
  4. resolveMetrics(perturbé)
  5. un ScenarioResult par métrique, computedBy = 'engine' (littéral)
```

## Sémantique des deltas — règle de lecture
`deltaKind='absolute'` s'exprime dans l'unité de la métrique cible (jours pour
DSO, points pour un percent). `deltaKind='percent'` est toujours relatif à la
valeur courante. Toute UI doit afficher l'unité résolue pour éviter l'ambiguïté
« −20 ».

## Limitations documentées (phase 3)
- Deltas additifs sur une même métrique cible : pas d'interactions ni de
  cannibalisation entre leviers.
- `NET_DEBT_EXIT = NET_DEBT_ENTRY − FCF_ANNUAL × HOLD_YEARS` : FCF constant,
  pas de cash sweep ni d'échéancier de dette.
- Pas de période intermédiaire : deux points, entry/exit.
