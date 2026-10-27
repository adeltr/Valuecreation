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
