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
     d. composition, indépendante de l'ordre des leviers :
        valeur = (base + Σ deltas absolute) × Π(1 + deltas percent)
        absolute : DSO −20 jours, churn −2 pts ; percent : churn −50 % relatif
  4. règles d'interaction du template (InteractionRule, une seule passe) :
        cible += coefficient × (source après leviers − source avant leviers)
     - source, cible, coefficient : des INPUTS ; le coefficient est saisi par
       l'analyste (ex. PRICE_ELASTICITY, jamais cible de levier) ;
     - une hypothèse (EXIT_MULTIPLE, HOLD_YEARS…) ne déclenche jamais de règle ;
     - pas de chaîne : une cible ne peut pas être la source d'une autre règle.
  5. resolveMetrics(perturbé)
  6. un ScenarioResult par métrique, computedBy = 'engine' (littéral)
```

## Sémantique des deltas — règle de lecture
`deltaKind='absolute'` s'exprime dans l'unité de la métrique cible (jours pour
DSO, points pour un percent). `deltaKind='percent'` est toujours relatif à la
valeur courante. Toute UI doit afficher l'unité résolue pour éviter l'ambiguïté
« −20 ».

## Limitations documentées (phase 3)
- Interactions : seulement les règles déclarées par le template (prix → volume
  via `PRICE_ELASTICITY` pour chemical, cosmetics, cpg, manufacturing, 3PL,
  waste-management, wine-spirits ; élasticités par défaut = choix d'analyste à
  calibrer). Pas de cannibalisation entre leviers au-delà de ces règles.
- `NET_DEBT_EXIT = NET_DEBT_ENTRY − FCF_ANNUAL × HOLD_YEARS` : FCF constant,
  pas de cash sweep ni d'échéancier de dette.
- Pas de période intermédiaire : deux points, entry/exit.
