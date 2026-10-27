# Curation A&D — rapprochement extension ↔ sources

> Constat : les codes de `src/ontology/sectors/aero.ts` viennent de docs/05,
> pas du vault. Rapprochement avec `data/kpi-library/Aerospace & Defense.md`
> (50 KPI) et les 44 analyses de ce dossier (recherche plein texte).

| Code aero | Rôle | KPI vault le plus proche | Cité dans les analyses ? |
|---|---|---|---|
| `BOOK_TO_BILL` | **formule** (croissance du CA) | aucun | **non** (0 fichier) |
| `FIXED_PRICE_SHARE` | **formule** (marge) | aucun | oui (5 fichiers, « fixed-price ») |
| `COST_OVERRUN_RATE` | **formule** (marge) | ≈ Losses Due to Production Rework | oui (6 fichiers, « overrun ») |
| `BACKLOG` | diagnostic | ≈ Weighted Average Contract Length (indirect) | **non** |
| `ON_TIME_DELIVERY` | diagnostic | aucun | oui (5 fichiers) |
| `WIN_RATE` | diagnostic | Project Bidding Success Rate | oui (3 fichiers) |
| `TOP5_CONTRACT_SHARE` | diagnostic | ≈ Diversification of Customer Base | à vérifier |
| `FACILITY_UTILIZATION` | diagnostic | ≈ Asset Utilization Ratio | à vérifier |
| `MRO_CYCLE_DAYS` | diagnostic | ≈ MRO Contracts (pas la même mesure) | à vérifier |

**À trancher :** `BOOK_TO_BILL` et `BACKLOG` ne figurent nulle part dans les
sources Umbrex. Ils restent valides comme choix d'analyste (docs/05 les a
posés), mais la justification de la formule `REVENUE × BOOK_TO_BILL^HOLD_YEARS`
doit venir de toi, pas du framework.

KPI du vault absents de l'extension, à considérer : Percentage of Revenue from
Government Contracts, Sustainment Costs, Spare Parts Availability, Operational
Availability (Ao), Ratio of Civilian to Defense Revenue.

---

# Curation A&D — mapping des 44 analyses (pré-rempli, D4)

> Statut : **à arbitrer** (une seule revue). Vocabulaire utilisé = vocabulaire
> `aero` actif (base ∪ extension). Ce qui n'y entre pas est listé en §C comme
> candidat, jamais inventé dans un frontmatter. Justification = section
> « Data required » / « Steps to improve » de chaque analyse.

## A. Décision BOOK_TO_BILL / BACKLOG

Aucune source Umbrex ne cite ni `BOOK_TO_BILL` ni `BACKLOG`. Le moteur A&D en
dépend pourtant : `REVENUE_EXIT = REVENUE × BOOK_TO_BILL ^ HOLD_YEARS`.

- **(a) Recommandé :** les garder comme choix d'analyste, comme
  `CAPACITY_GROWTH` pour Airline. Le book-to-bill est le standard de marché
  pour lire la croissance d'un contractor. Ils restent sans analyse liée dans
  le catalogue.
- (b) Remplacer par un `REVENUE_GROWTH` générique : on perd le lien avec le
  carnet de commandes.

## B. Mapping proposé

| # | Partie | quant | levers | causes |
|---|---|---|---|---|
| 01 | A | FIXED_PRICE_SHARE, COST_OVERRUN_RATE, ON_TIME_DELIVERY, WIN_RATE, TOP5_CONTRACT_SHARE | CONTRACT_MIX, COMMERCIAL_PIPELINE, PROGRAM_EXECUTION | PROGRAM, COMMERCIAL |
| 02 | A | — | EXPORT_FMS | GEOPOLITICAL, MARKET |
| 03 | A | ON_TIME_DELIVERY, COST_OVERRUN_RATE, WIN_RATE | EXPORT_FMS, PROGRAM_EXECUTION | REGULATORY, GEOPOLITICAL |
| 04 | A | REVENUE, EBITDA_MARGIN, OPEX | COST_OPS, COST_PROCUREMENT | MARKET, ORGANIZATIONAL |
| 05 | A | DSO | WC_MILESTONES, EXPORT_FMS | GEOPOLITICAL, FINANCIAL |
| 06 | A | — | EXPORT_FMS | REGULATORY, GEOPOLITICAL |
| 07 | A | — | COMMERCIAL_PIPELINE, EXPORT_FMS | MARKET, GEOPOLITICAL |
| 08 | A | — | — | REGULATORY, GEOPOLITICAL |
| 09 | B | FACILITY_UTILIZATION | CAPACITY_UTILIZATION, SUPPLY_CHAIN_CONTROL | OPERATIONAL |
| 10 | B | — | SUPPLY_CHAIN_CONTROL | REGULATORY, OPERATIONAL |
| 11 | B | MRO_CYCLE_DAYS | MRO_EFFICIENCY | OPERATIONAL |
| 12 | B | COGS, ON_TIME_DELIVERY | SUPPLY_CHAIN_CONTROL, COST_PROCUREMENT | OPERATIONAL, GEOPOLITICAL |
| 13 | B | ON_TIME_DELIVERY | SUPPLY_CHAIN_CONTROL | REGULATORY, OPERATIONAL |
| 14 | B | — | — | REGULATORY |
| 15 | B | — | — | REGULATORY |
| 16 | B | — | OFFSET_STRATEGY | REGULATORY, GEOPOLITICAL |
| 17 | C | — | — | MARKET, ORGANIZATIONAL |
| 18 | C | — | — | MARKET |
| 19 | C | — | — | MARKET, REGULATORY |
| 20 | C | — | — | MARKET, REGULATORY |
| 21 | C | — | — | MARKET, REGULATORY |
| 22 | C | — | COST_OPS | MARKET |
| 23 | C | — | — | MARKET, REGULATORY |
| 24 | C | — | — | MARKET, REGULATORY |
| 25 | C | — | — | MARKET, REGULATORY |
| 26 | C | — | — | MARKET, REGULATORY |
| 27 | C | — | — | MARKET, REGULATORY |
| 28 | D | — | — | MARKET, REGULATORY |
| 29 | D | — | — | MARKET, REGULATORY |
| 30 | D | — | — | MARKET, REGULATORY |
| 31 | D | — | — | MARKET, REGULATORY |
| 32 | D | — | — | MARKET, REGULATORY |
| 33 | D | — | — | REGULATORY |
| 34 | D | — | — | REGULATORY, OPERATIONAL |
| 35 | D | — | — | REGULATORY |
| 36 | E | TOP5_CONTRACT_SHARE | COMMERCIAL_PIPELINE | MARKET, GEOPOLITICAL |
| 37 | E | FIXED_PRICE_SHARE, COST_OVERRUN_RATE | MRO_EFFICIENCY, CONTRACT_MIX | PROGRAM |
| 38 | E | WIN_RATE, FIXED_PRICE_SHARE | COMMERCIAL_PIPELINE, PRICING | COMMERCIAL |
| 39 | E | COST_OVERRUN_RATE | CAPACITY_UTILIZATION | PROGRAM, MARKET |
| 40 | E | COST_OVERRUN_RATE, ON_TIME_DELIVERY, FIXED_PRICE_SHARE | PROGRAM_EXECUTION, CONTRACT_MIX, SUPPLY_CHAIN_CONTROL | PROGRAM |
| 41 | E | — | — | REGULATORY, GEOPOLITICAL |
| 42 | E | — | — | REGULATORY, GEOPOLITICAL |
| 43 | E | — | — | ORGANIZATIONAL |
| 44 | E | — | — | REGULATORY |

Constat : les parties C et D (R&D, technologie, cyber, soit 19 analyses)
n'ont aucune métrique ni aucun levier dans le vocabulaire actuel. Elles
alimentent seulement les causes. C'est conforme au design (qualitatif = causes
+ catalogue), mais l'arbre A&D ne voit pas l'innovation.

## C. Candidats hors vocabulaire (à trancher, rien n'est ajouté)

| Candidat | Type | Source | Pile proposée |
|---|---|---|---|
| `DEFENSE_REVENUE_SHARE` | métrique | #36 Data required ; KPI « Percentage of Revenue from Government Contracts » | 2 (diagnostic) |
| `CLASSIFIED_REVENUE_SHARE` | métrique | #41 Data required | 2 |
| `RD_INTENSITY` | métrique | #17–#31 « R&D budget allocation » ; KPI « % of Defense Budget Allocated to R&D » | 2 |
| `OPERATIONAL_AVAILABILITY` | métrique | #11 « operational readiness » ; KPI « Operational Availability (Ao) » | 2 |
| `SPARE_PARTS_AVAILABILITY` | métrique | #11 ; KPI du même nom | 2 |
| `SUSTAINMENT_COST` | métrique | #37 ; KPI « Sustainment Costs » | 2 |
| `WORKFORCE_TURNOVER` | métrique | #43 « Historical turnover rates » | 2 |
| `RD_PORTFOLIO` | catégorie de levier | « Increase R&D investment… » (#17–#31) | à trancher |
| `CYBER` | catégorie de cause | #33–#35 | à trancher, sinon `REGULATORY` |

## Tes arbitrages attendus (A&D)

1. BOOK_TO_BILL / BACKLOG : (a) ou (b) ?
2. Mapping §B : corrige les lignes qui ne te conviennent pas.
3. Candidats §C : lesquels entrent au vocabulaire (pile 2), et `RD_PORTFOLIO` / `CYBER` oui ou non ?
