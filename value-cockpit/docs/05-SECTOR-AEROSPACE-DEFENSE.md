# 05 · Extension sectorielle — Aerospace & Defense

Deuxième template (tâche 14, addendum au plan). Dérivé du framework
propriétaire « How to Analyze an Aerospace & Defense Company » (44 analyses,
vault Obsidian) — c'est le différenciateur du produit : un secteur industriel
où la connaissance métier est encodée, pas générique.

## Comment le framework 44 analyses se projette dans le système

Trois familles — ne PAS tout convertir en formules :

| Famille | Analyses (exemples) | Devient |
|---|---|---|
| Quantifiable & reliable | portfolio de contrats (#1), capacité de production (#9), MRO (#11), performance FMS (#3) | **métriques + formules** |
| Structurant leviers/causes | consolidation M&A (#4), intégration verticale (#12), offsets (#16), mix contractuel (#1) | **catégories de leviers** |
| Risque qualitatif | géopolitique (#2), sanctions (#8), compliance FAR/DFARS (#15), ESG (#14) | **catégories de causes + contexte copilote** — JAMAIS de formules |

## Métriques

### Inputs opérationnels (reliés par formules)
| Code | Unité | Source (analyse) | Rôle |
|---|---|---|---|
| BOOK_TO_BILL | ratio | #1, #3 | commandes/facturation — proxy de croissance du carnet |
| FIXED_PRICE_SHARE | percent | #1 | part du revenu en contrats fixed-price |
| COST_OVERRUN_RATE | percent | #1, #15 | dépassements de coûts, en % du revenu des contrats affectés |

### Inputs de diagnostic (benchmarkés, pas de formule v1)
| Code | Unité | Source | Lecture |
|---|---|---|---|
| BACKLOG | currency | #1 | visibilité du carnet (en années de revenu) |
| ON_TIME_DELIVERY | percent | #1, #3 | exécution — driver qualitatif du win rate |
| WIN_RATE | percent | #1 | conversion des appels d'offres |
| TOP5_CONTRACT_SHARE | percent | #1 | concentration — risque de dépendance |
| FACILITY_UTILIZATION | percent | #9 | capacité disponible sans capex |
| MRO_CYCLE_DAYS | days | #11 | efficacité MRO vs benchmark |

## Formules de liaison (template `src/templates/aero.ts`)

```
REVENUE_EXIT        = REVENUE × BOOK_TO_BILL ^ HOLD_YEARS
EBITDA_MARGIN_EXIT  = EBITDA_MARGIN − COST_OVERRUN_RATE × FIXED_PRICE_SHARE
EBITDA_ENTRY        = REVENUE × EBITDA_MARGIN
EBITDA_EXIT         = REVENUE_EXIT × EBITDA_MARGIN_EXIT
+ bridge de base (EQUITY_ENTRY/EXIT, NET_DEBT_EXIT, MOIC — voir 01)
```

**L'insight clé encodé** (analyse #1) : les dépassements de coûts ne détruisent
la marge que sur la part **fixed-price** du portefeuille — sur cost-plus ils
sont refacturés au client. D'où le produit `COST_OVERRUN_RATE ×
FIXED_PRICE_SHARE` : c'est une approximation linéaire documentée, mais elle
capture la vraie mécanique du secteur, et elle rend le mix contractuel
simulable (déplacer le mix change l'exposition aux overruns).

Approximations documentées : book-to-bill soutenu comme proxy de croissance
(suppose la conversion du carnet à rythme constant) ; marge linéaire en
overruns ; pas de modélisation des pénalités de retard (diagnostic v1).

## Catégories de leviers (sources : sections « Steps to improve » du framework)

| Catégorie | Cible typique | Exemple de levier |
|---|---|---|
| PROGRAM_EXECUTION | COST_OVERRUN_RATE ↓ | discipline EVM, revues de jalons (#1, #15) |
| CONTRACT_MIX | FIXED_PRICE_SHARE | rééquilibrer fixed-price/cost-plus à la renégociation (#1) |
| COMMERCIAL_PIPELINE | BOOK_TO_BILL ↑ | bid/no-bid discipliné, win rate (#1) |
| EXPORT_FMS | BOOK_TO_BILL ↑ | expansion FMS/DCS sur budgets en croissance (#3, #6) |
| MRO_EFFICIENCY | MRO_CYCLE_DAYS ↓ | maintenance prédictive, gestion des pièces (#11) |
| CAPACITY_UTILIZATION | FACILITY_UTILIZATION ↑ | débottlenecking, ordonnancement (#9) |
| SUPPLY_CHAIN_CONTROL | COST_OVERRUN_RATE ↓ | dual sourcing, intégration verticale ciblée (#10, #12) |
| OFFSET_STRATEGY | BOOK_TO_BILL ↑ | participation industrielle locale compétitive (#16) |
| WC_MILESTONES | DSO ↓ (base) | jalons de paiement, avances clients (#5) |

## Catégories de causes ajoutées par l'extension
`GEOPOLITICAL` (#2, #8) · `REGULATORY` (#8, #15 — ITAR/EAR/FAR/DFARS) ·
`PROGRAM` (dérives d'exécution propres aux programmes longs).

Ces analyses de risque alimentent le **contexte de diagnostic du copilote** ET
le **catalogue d'analyses** ci-dessous : le copilote peut invoquer
« concentration top-5 », « exposition sanctions », « dépendance FMS » comme
causes — mais jamais les chiffrer.

## Catalogue d'analyses (les 44 analyses comme nœuds du graphe)

Chaque analyse du framework devient une entité `AnalysisRef` — un **protocole
de diagnostic** de première classe dans l'ontologie et le graphe. Règle
absolue : une analyse POINTE vers des métriques/causes/leviers, elle ne
produit JAMAIS de valeurs (les chiffres restent au moteur, invariant 1).

```ts
interface AnalysisRef {
  id: string;                    // 'aero-01' … 'aero-44'
  title: string;
  part: string;                  // 'A' (strategy), 'B' (ops), 'C' (R&D)…
  relatedMetricCodes: string[];  // ∈ vocabulaire actif (validé)
  relatedCauseCategories: string[];
  relatedLeverCategories: string[];
  sourcePath: string;            // chemin du .md dans data/analysis-library/
}
```

Rôle dans chaque mode :
- **Exploration** — l'analyste clique une cause (`GEOPOLITICAL`) ou une
  métrique (`COST_OVERRUN_RATE`) → le graphe affiche les analyses à mener pour
  confirmer/infirmer (#2, #8 / #1, #15). Le qualitatif est visible et
  actionnable sans être chiffré.
- **Construction** — chaque catégorie de levier référence les analyses qui la
  documentent (sections « Steps to improve » du framework).
- **Copilote** — le champ `evidence` d'une cause proposée peut citer un id
  d'analyse (`'cf. aero-08'`) : l'hypothèse devient traçable vers un protocole
  vérifiable.

Impact ontologie : `NODE_TYPES` gagne `'analysis'` ; le graphe relie
`analysis → metric/cause/lever` par des arêtes de type `informs`. Le catalogue
A&D vit dans `src/catalog/aero.catalog.json`, validé par un test d'intégrité
référentielle (tout code référencé ∈ vocabulaire actif). Voir doc 08 pour le
pipeline d'ingestion des fichiers sources.

## Addendum au plan — Tâche 14 (même pattern que les tâches 2 et 9)

**Fichiers :** `src/ontology/sectors/aero.ts` (codes, meta, leviers, causes),
`src/templates/aero.ts` (formules ci-dessus), tests miroirs de
`registry.test.ts` et `saas.test.ts`.

**Test end-to-end de référence :** revenu 500, marge 12 %, book-to-bill 1.06,
fixed-price 60 %, overruns 3 %, multiples 9x/9x, hold 5 ans, dette nette 300,
FCF 25/an. Levier validé PROGRAM_EXECUTION : overruns −1.5 pts (absolu) ⇒
marge exit passe de `0.12 − 0.03×0.6 = 0.102` à `0.12 − 0.015×0.6 = 0.111` ⇒
EBITDA_EXIT et MOIC recalculés par le moteur, `computedBy='engine'`.
Second test : levier CONTRACT_MIX fixed-price 60 → 45 % ⇒ même mécanique par
l'autre facteur du produit.
