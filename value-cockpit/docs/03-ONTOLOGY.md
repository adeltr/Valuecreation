# 03 · Ontologie en couches & guide d'extension sectorielle

## Décision
Ontologie formelle **légère** : vocabulaire contrôlé TypeScript + contexte
JSON-LD aligné FIBO. Pas de triplestore/reasoner OWL en phase 1 (différé phase
3, si corpus de deals). 90 % de la valeur (contrainte, sémantique partagée,
porte de sortie RDF), 10 % de la complexité.

## Structure

```
src/ontology/
  base.ts            ← commun à tout deal : bridge, P&L, BFR, capex
  sectors/saas.ts    ← extension SaaS
  sectors/aero.ts    ← extension Aerospace & Defense
  registry.ts        ← assemble le vocabulaire ACTIF = base ∪ extension(secteur)
  context.jsonld     ← IRI de chaque terme (FIBO quand le concept existe)
```

Le **vocabulaire actif** d'une analyse dépend du `sectorArchetype` de la
Company. Guards, schémas zod et sanitizer valident contre lui — jamais contre
une liste globale figée.

## Contrat du registry

```ts
interface ActiveVocabulary {
  metricCodes: string[];
  metricMeta: Record<string, { unit: Unit; fiboRef?: string }>;
  leverCategories: string[];
  causeCategories: string[];          // extensible par secteur (ex. GEOPOLITICAL en A&D)
  nodeTypes: string[];
  isMetricCode(v: unknown): boolean;
  isLeverCategory(v: unknown): boolean;
  isCauseCategory(v: unknown): boolean;
}
getActiveVocabulary(archetype: SectorArchetype): ActiveVocabulary
```

Note v2.1 : les extensions peuvent ajouter des **catégories de causes** en plus
des métriques et leviers (requis par A&D : GEOPOLITICAL, REGULATORY).

## Guide : écrire une extension sectorielle

Une extension fournit QUATRE choses :

1. **Métriques opérationnelles** (codes + unités) — uniquement celles qui sont
   (a) mesurables avec les données réellement disponibles en due diligence et
   (b) reliables au financier par une formule OU utiles en diagnostic benchmarké.
2. **Formules de liaison** L3 → L2 → L1 (vivent dans le template
   `src/templates/<secteur>.ts`) — déterministes, dimensionnellement saines,
   approximations documentées.
3. **Catégories de leviers** sectorielles.
4. **Catégories de causes** sectorielles si nécessaire.

Et déclare explicitement ce qui **reste qualitatif** : les analyses de risque
(sanctions, géopolitique, compliance) ne deviennent PAS des formules — elles
deviennent des catégories de causes + du contexte de diagnostic pour le
copilote. Forcer une formule sur un risque qualitatif fabrique de la fausse
rigueur, exactement ce que l'invariant 1 combat.

Checklist d'ajout d'un terme : code dans l'extension → meta (unité) → IRI dans
`context.jsonld` → si calculé, formule dans le template → test registry.

## FIBO & JSON-LD
- Namespace projet : `https://vcc.dev/ontology#` (préfixe `vcc`).
- Aligner sur FIBO quand le concept existe (EBITDA, NetDebt, WorkingCapital…),
  `vcc:` sinon. Le mapping vit dans `context.jsonld` ; les `fiboRef` dans les
  meta sont des références, on ne charge pas FIBO.
- Export RDF/Turtle possible plus tard sans réécriture du modèle.
