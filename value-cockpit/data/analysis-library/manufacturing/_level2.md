# Manufacturing — niveau 2 (spec `src/sectors/manufacturing.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Manufacturing Company »,
> `data/kpi-library/Manufacturing.md`, analyses #n de ce dossier.

## Formules

```
VOLUME_INDEX_EXIT      = min((1 + VOLUME_GROWTH) ^ HOLD_YEARS, 1 / PLANT_UTILIZATION)
REVENUE_EXIT           = REVENUE * VOLUME_INDEX_EXIT * (1 + PRICE_GROWTH) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = 1 - MATERIAL_COST_RATE / (1 - SCRAP_RATE) - CONVERSION_COST_RATE - MAINTENANCE_COST_RATE - SGA_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Coûts en % du chiffre d'affaires : pas de levier opérationnel (coûts fixes) quand le volume croît.
- La capacité plafonne le volume ; l'investissement qui la lève passe par PLANT_UTILIZATION (levier) et CAPEX (diagnostic).
- PRICE_GROWTH et SGA_RATE sont des choix d'analyste (aucune analyse Umbrex dédiée).

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `VOLUME_GROWTH` | percent | #8, #12, #17 (capacity vs demand) |
| `PRICE_GROWTH` | percent | choix d'analyste — aucune analyse de prix |
| `PLANT_UTILIZATION` | percent | #1, #8, #17, #46 ; KPI Capacity Utilization Rate |
| `MATERIAL_COST_RATE` | percent | #18 BOM, #21, #32 ; KPI Materials Usage Variance |
| `SCRAP_RATE` | percent | #7, #39 ; KPI Scrap Rate, First Pass Yield |
| `CONVERSION_COST_RATE` | percent | #2 OEE, #5 lean, #10, #29, #32 |
| `MAINTENANCE_COST_RATE` | percent | #9, #27, #28 ; KPI Maintenance Costs as a % of Revenue |
| `SGA_RATE` | percent | choix d'analyste — frais commerciaux et généraux |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `OEE` | percent | #2, #11 ; KPI Overall Equipment Effectiveness |
| `FIRST_PASS_YIELD` | percent | #7, #20, #39 ; KPI First Pass Yield |
| `SUPPLIER_ON_TIME_DELIVERY` | percent | #19, #20, #21 ; KPI Supplier On-Time Delivery Rate |
| `MANUFACTURING_LEAD_TIME` | days | #4, #29, #37 ; KPI Manufacturing Lead Time |
| `MACHINE_DOWNTIME_RATE` | percent | #9, #27 ; KPI Machine Downtime Rate |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `LEAN_OEE` | CONVERSION_COST_RATE | -0.02 | #2, #5, #10, #11, #13, #29 |
| `QUALITY_YIELD` | SCRAP_RATE | -0.02 | #7, #20, #39 |
| `PREDICTIVE_MAINTENANCE` | MAINTENANCE_COST_RATE | -0.01 | #9, #27, #28 |
| `AUTOMATION` | CONVERSION_COST_RATE | -0.01 | #24, #25, #26 |
| `CAPACITY_DEBOTTLENECKING` | PLANT_UTILIZATION | -0.05 | #1, #8, #17, #46 |
| `COST_PROCUREMENT` (base) | — | — | #18, #19, #21, #22 |
| `WC_DIO` (base) | — | — | #6, #14, #16, #22, #35 |
| `CAPEX_DISCIPLINE` (base) | — | — | #31, #33, #34 |
| `COST_OPS` (base) | — | — | #15, #30, #42 |

## Causes

- `SUPPLIER_RISK` — #19, #21, #23
- `ENERGY_PRICES` (exogène, jamais un levier) — #30, #42

Référence moteur (démo) : EBITDA_EXIT = 132.05672352.
