# 11 · Archétypes = types d'entreprise · priorité Airline

> Statut : **validé par l'analyste**. D1, D3, Airline (docs/12) et les 15 fiches de niveau 2
> (docs/14) sont implémentés ; D2 (familles de bridge non-EBITDA) reste en phase 3 ; D4
> s'applique à chaque nouvel archétype. La section « brouillon Airline »
> ci-dessous est historique : la version retenue est dans docs/12.

## Constats (vault Umbrex, index reçus)

1. Le vault a deux arbres : `01 - Comprendre un secteur` (secteur → sous-secteurs,
   descriptif) et `02 - Analyser une entreprise` (type d'entreprise → ~40
   analyses). Plus `KPI — <x>` et `04 - KPI par fonction`.
2. L'unité opérationnelle est le **type d'entreprise** (`Airline Company`,
   `Auto Insurance Company`…), pas le secteur : un secteur porte plusieurs
   types (Insurance → Auto, Life, P&C) et un type pointe vers un secteur
   parent ET un fichier KPI qui peuvent différer (Airline → Travel &
   Hospitality / KPI Travel & Logistics).
3. Les lettres de partie (`A`, `B`…) n'ont pas le même sens d'un type à
   l'autre ; certains index sautent des lettres (Auto Insurance : A–E puis I).
4. Volume : ~40 analyses × N types → curation lot par lot (docs/08) intenable
   au-delà de 3–5 archétypes.
5. Le bridge EBITDA/MOIC ne convient pas à tous : assurance (combined ratio,
   P/BV), biotech pré-revenu (rNPV, runway).

## Décisions proposées

### D1 — Archétype = type d'entreprise Umbrex
`SECTOR_ARCHETYPES` liste des types d'entreprise (`aero`, `airline`, `cpg`…).
Le secteur Umbrex devient une métadonnée (`parentSector`) utile au contexte
copilote, pas une couche d'ontologie. Les stubs `industrials/retail/services`
sont supprimés quand le premier vrai archétype les remplace.

### D2 — Familles de bridge
| Famille | Archétypes | Phase |
|---|---|---|
| `ebitda` (actuel, 2 points) | aero, airline, cpg, cosmetics, agriculture… | 1–2 |
| `insurance` (combined ratio, float, P/BV) | auto/life/P&C insurance | 3 |
| `prerevenue` (pipeline rNPV, runway) | biotech | 3 |

En v1 on n'ajoute que des archétypes de la famille `ebitda`.

### D3 — Catalogue v2 (« clean les tables »)
`AnalysisRef` gagne `archetype` et `partLabel` ; l'id devient
`<archetype>-NN` ; un catalogue par archétype (`<archetype>.catalog.json`) ;
`build-catalog.ts` prend l'archétype en argument. Les tables de curation
(mappings + métriques candidates) vivent dans un fichier propre par
archétype, `data/analysis-library/<archetype>/_curation.md`, jamais dans les
fichiers sources ni dans le chat.

### D4 — Curation à l'échelle
Par archétype : je pré-remplis TOUS les frontmatters d'un coup avec la
section source citée pour chaque mapping, dans `_curation.md`. Tu valides en
une revue (tableau). Les lots de 5–6 restent pour A&D, déjà engagé.

## Niveaux (validé)

- **Niveau 2** — extension sectorielle + template dédié pour les 19 types EBITDA :
  `saas`, `aero`, `airline`, `cpg` (extensions écrites à la main, docs/04, 05, 12, 13) et
  les 15 autres types, dérivés des fiches `src/sectors/` (docs/14) : agriculture, chemical,
  cosmetics, electricity-generation, healthcare-provider, hospitality, manufacturing, media,
  medical-device, metals-mining, pharma, retail, third-party-logistics, waste-management,
  wine-spirits.
- **Niveau 1** — vocabulaire de base + template EBITDA générique (`src/templates/ebitda.ts`).
  Plus aucun type à ce niveau ; le mécanisme est conservé pour un futur type (Telecommunications,
  écarté pour l'instant). Les tables de curation pré-remplies par mots-clés (`scripts/prefill-curation.ts`)
  restent appliquées telles quelles et sont enrichies par `apply-level2`.
- **Hors EBITDA (phase 3, fait — docs/16)** — auto/life/P&C insurance, commercial/retail bank (P/BV), biotech (rNPV) ; health payor finalement en famille EBITDA. Historique : auto/life/P&C insurance, commercial/retail bank, health
  payor, biotech : analyses importées, pas d'archétype tant que leur bridge n'existe pas.

## Inventaire des archétypes (d'après les liens des 32 fichiers KPI)

27 types d'entreprise : A&D, Agriculture, Airline, Auto Insurance,
Biotechnology, Chemical, Commercial Bank, CPG, Cosmetics, Electricity
Generation, Health Payor, Healthcare Provider, Hospitality, Life Insurance,
Manufacturing, Media & Entertainment, Medical Device, Metals & Mining,
Pharmaceutical, P&C Insurance, Retail Bank, Retail, SaaS, Telecommunications,
Third Party Logistics, Waste Management, Wine Beer & Spirits.
Les fichiers KPI (`data/kpi-library/`) sont des glossaires : nom +
description, sans formule ni benchmark. Une formule de template reste donc
TOUJOURS un arbitrage d'analyste.

## Airline — brouillon d'extension (candidats à arbitrer, docs/09 §pré-requis)

> Table de revue détaillée, rapprochée du vault : `data/analysis-library/airline/_curation.md`.
> Écart avec le brouillon ci-dessous : ANCILLARY, CAPACITY_GROWTH, CASK_EX_FUEL
> et FLEET_UTILIZATION n'existent pas dans le KPI vault ; seul `CASK` existe.

**Drivers opérationnels candidats (≤ 8)** : `ASK` (capacité), `LOAD_FACTOR`,
`YIELD` (revenu passage / RPK), `ANCILLARY_PER_PAX`, `CASK_EX_FUEL`,
`FUEL_COST_PER_ASK`, `FLEET_UTILIZATION` (block hours/jour) ;
diagnostic benchmarké : `ON_TIME_PERFORMANCE`.

**Formules de liaison candidates** :
```
ASK_EXIT          = ASK × (1 + CAPACITY_GROWTH) ^ HOLD_YEARS
RASK              = LOAD_FACTOR × YIELD + ANCILLARY_PER_ASK
REVENUE_EXIT      = ASK_EXIT × RASK
EBITDA_EXIT       = ASK_EXIT × (RASK − CASK_EX_FUEL − FUEL_COST_PER_ASK)
```
(`CASK_EX_FUEL` pris hors D&A pour rester au niveau EBITDA — approximation à
documenter.)

**Catégories de leviers candidates** : `NETWORK_OPTIMIZATION` (#1–6),
`REVENUE_MANAGEMENT` (#22, #25), `ANCILLARY` (#23, #27), `FLEET_PRODUCTIVITY`
(#8, #11), `FUEL_EFFICIENCY` (#10, #36), `CREW_PRODUCTIVITY` (#17),
`AIRPORT_GROUND_COST` (#16, #19, #20), `FLEET_FINANCING` (#9, #34).

**Causes candidates** : `REGULATORY` (#7 droits de trafic, #30 ETS),
`FUEL_PRICE` (#33 — exogène, jamais un levier), `LABOR` (#17).

**Questions ouvertes pour toi**
1. EBITDA ou **EBITDAR** (loyers d'avions) comme base du bridge ? Et la dette
   locative (IFRS 16) dans `NET_DEBT` ?
2. La couverture carburant (#33) : cause/contexte seulement, ou levier ?
3. Cargo (#24) : dans le périmètre v1 ou hors périmètre ?

## Fichiers du vault dont j'ai besoin pour Airline
1. ~~Les 40 analyses Airline~~ reçues, importées dans `data/analysis-library/airline/`.
2. ~~`KPI — Travel & Logistics`~~ reçu (`data/kpi-library/`).
3. ~~`04 - KPI par fonction`~~ reçu (`data/kpi-library/fonctions/`).
4. Optionnel : `01 - Comprendre un secteur/Travel & Hospitality.md` + son
   dossier `Sous-secteurs` (contexte copilote, benchmarks de marges).

## Ordre d'exécution après validation
1. D1 + D3 (registry, catalogue v2) — refactor TDD, A&D migré sans régression.
2. Extension + template `airline` (docs/09 étapes 1–5) avec TES arbitrages.
3. Copie des 40 analyses → `data/analysis-library/airline/` → `_curation.md`
   → ta revue → `airline.catalog.json`.
4. Reprise de la curation A&D (lot 1 : 01–06) dans le même format.
