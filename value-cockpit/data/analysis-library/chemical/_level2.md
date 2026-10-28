# Chemical — niveau 2 (spec `src/sectors/chemical.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Chemical Company »,
> `data/kpi-library/Chemicals.md`, analyses #n de ce dossier.

## Formules

```
VOLUME_INDEX_EXIT      = min((1 + VOLUME_GROWTH) ^ HOLD_YEARS, 1 / PLANT_UTILIZATION)
REVENUE_EXIT           = REVENUE * VOLUME_INDEX_EXIT * (1 + PRICE_GROWTH) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = 1 - FEEDSTOCK_COST_RATE / PRODUCT_YIELD - ENERGY_COST_RATE - MAINTENANCE_COST_RATE - SGA_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Le prix et le coût matière évoluent séparément : pas de spread produit–feedstock modélisé (cyclicité = cause COMMODITY_PRICES).
- La capacité plafonne le volume (#1) ; coûts en % du chiffre d'affaires.
- SGA_RATE est un choix d'analyste.

## Interactions (moteur, scénarios)

- `PRICE_GROWTH` → `VOLUME_GROWTH` : Δ cible = `PRICE_ELASTICITY` (démo -0.5) × Δ source — choix d'analyste (B2B, contrats indexés) — à calibrer sur #13, #26

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `VOLUME_GROWTH` | percent | #25 end-market demand, #27 expansion ; KPI Production Volume |
| `PRICE_GROWTH` | percent | #13 pricing by segment, #26 specialty vs commodity |
| `PLANT_UTILIZATION` | percent | #1 (CUR) ; KPI Plant Utilization Against Planned Capacity |
| `FEEDSTOCK_COST_RATE` | percent | #36 ; KPI Feedstock Costs as a % of Sales |
| `PRODUCT_YIELD` | percent | #3 (Product Yield), #8 (Reaction Efficiency) ; KPI Yield on Key Reactions |
| `ENERGY_COST_RATE` | percent | #2 (Energy Cost per Unit) ; KPI Energy Intensity |
| `MAINTENANCE_COST_RATE` | percent | #6 (Maintenance Cost per Unit) ; KPI Maintenance Cost as a % of Replacement Value |
| `SGA_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `SPECIALTY_REVENUE_SHARE` | percent | #26, #33, #34 |
| `CATALYST_EFFICIENCY` | ratio | #4, #10 |
| `PROCESS_SAFETY_INCIDENTS` | count | #18 ; KPI Process Safety Incidents |
| `CARBON_INTENSITY` | ratio | #16 ; KPI Carbon Emissions per Unit of Output |
| `INNOVATION_RATE` | percent | #35 (Innovation Rate) |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `YIELD_IMPROVEMENT` | PRODUCT_YIELD | 0.02 | #3, #4, #8, #10 |
| `ENERGY_EFFICIENCY` | ENERGY_COST_RATE | -0.01 | #2, #16 |
| `FEEDSTOCK_SOURCING` | FEEDSTOCK_COST_RATE | -0.01 | #14, #36, #38, #39 |
| `RELIABILITY_MAINTENANCE` | MAINTENANCE_COST_RATE | -0.005 | #6, #9 |
| `SPECIALTY_MIX_SHIFT` | PRICE_GROWTH | 0.01 | #13, #24, #26, #33, #34 |
| `CAPACITY_DEBOTTLENECKING` | PLANT_UTILIZATION | -0.05 | #1, #5, #12 |
| `WC_DIO` (base) | — | — | #11 |
| `WC_DSO` (base) | — | — | #11 |
| `CAPEX_DISCIPLINE` (base) | — | — | #12 |
| `PRICING` (base) | — | — | #13 |

## Causes

- `COMMODITY_PRICES` (exogène, jamais un levier) — #14, #36, #39 ; KPI Raw Material Price Volatility
- `ENERGY_PRICES` (exogène, jamais un levier) — #2, #16

Référence moteur (démo) : EBITDA_EXIT = 208.43647930342894.
