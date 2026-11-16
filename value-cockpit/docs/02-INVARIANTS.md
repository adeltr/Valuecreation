# 02 · Invariants non négociables & conventions

Toute violation = échec de tâche, même si les tests passent.

## Invariant 1 — Aucun chiffre LLM dans un livrable
- `ScenarioResult` est produit UNIQUEMENT par `engine/scenario.ts`.
- `ScenarioResult.computedBy` est le littéral `'engine'` — ne jamais élargir.
- `CopilotProposal` n'a pas de champ `scenarioResults`. Ne pas en ajouter.
- Si une tâche pousse à laisser Claude retourner un chiffre calculé (impact en
  €, delta d'equity, KPI recalculé) : stop, ce chiffre vient du moteur.

## Invariant 2 — Aucun score de confiance sans base
- Un `Lever.confidence` (0..1) est invalide sans `confidenceBasis` non vide
  (zod `min(1)`). Ne pas assouplir. Vaut pour tout artefact scoré futur.

## Invariant 3 — L'ontologie contraint la génération
- Levier : `category` ∈ vocabulaire actif, `impactMetricCode` ∈ codes actifs
  hors `NON_LEVER_CODES` (ENTRY/EXIT_MULTIPLE, HOLD_YEARS, NET_DEBT_ENTRY —
  structure du deal, posée par l'analyste).
- Cause : `category` ∈ catégories actives.
- Le sanitizer rejette tout terme hors vocabulaire actif.
- Ajouter un terme = l'ajouter dans l'ontologie (base ou extension) ET son IRI
  dans `context.jsonld`, même commit. Jamais de terme codé en dur ailleurs.

## Invariant 4 — Gate analyste avant simulation
- Un scénario ne référence que des leviers `status='validated'`.
- L'ingestion copilote produit TOUJOURS `status='hypothesis'`.
- Raison : `confidenceBasis` peut lui-même être halluciné ; le garde-fou final
  est humain. Le moteur lève une erreur explicite sur un levier non validé.

## Conventions d'ingénierie
- **TDD** : test qui échoue → run (confirme l'échec) → impl minimale → run
  (confirme le pass) → commit. Un comportement par test.
- **Moteur pur** : pas d'I/O, pas de `Date.now()`, pas d'aléatoire. C'est ce
  qui rend la simulation auditable.
- Le moteur n'importe jamais l'ontologie, le repo ou le copilote — il opère
  sur des `Metric[]` nus.
- Stockage derrière l'interface `Repository` (in-memory en phase 1).
- Montants en `number` non arrondis ; arrondi uniquement à la frontière
  d'affichage (UI).
- Limitation documentée : deltas de leviers sur une même métrique = additifs ;
  pas d'interactions (phase 3). Toute synthèse doit le mentionner.
