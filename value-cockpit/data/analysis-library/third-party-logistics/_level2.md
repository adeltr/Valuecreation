# Third Party Logistics — niveau 2 (spec `src/sectors/third-party-logistics.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Third Party Logistics Company »,
> `data/kpi-library/Travel & Logistics.md`, analyses #n de ce dossier.

## Formules

```
CORE_REVENUE_EXIT      = REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_GROWTH)) ^ HOLD_YEARS
REVENUE_EXIT           = CORE_REVENUE_EXIT * (1 + ACCESSORIAL_REVENUE_RATIO)
OPERATING_COSTS_EXIT   = CORE_REVENUE_EXIT * (PURCHASED_TRANSPORT_RATE / (1 - EMPTY_MILES_RATE) + WAREHOUSE_LABOR_RATE + FACILITY_COST_RATE + SGA_RATE)
EBITDA_EXIT            = REVENUE_EXIT - OPERATING_COSTS_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Activités transport et entreposage agrégées en taux de coût sur le chiffre d'affaires cœur.
- Kilomètres à vide appliqués à tout le transport acheté (approximation des contrats au kilomètre).
- SGA_RATE est un choix d'analyste.

## Interactions (moteur, scénarios)

- `PRICE_GROWTH` → `VOLUME_GROWTH` : Δ cible = `PRICE_ELASTICITY` (démo -0.5) × Δ source — choix d'analyste — à calibrer sur #21 (structures tarifaires)

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `VOLUME_GROWTH` | percent | #25, #26 omni-channel, #28 I2M, #35 cross-border |
| `PRICE_GROWTH` | percent | #21 contract & pricing structures, #23 gainsharing |
| `ACCESSORIAL_REVENUE_RATIO` | ratio | #38 accessorial & ancillary fees, #33 reclassification |
| `PURCHASED_TRANSPORT_RATE` | percent | #2 carriers, #9 ocean, #36 modal mix (Cost per Mile) |
| `EMPTY_MILES_RATE` | percent | #10, #39 (Empty Miles Reduction) |
| `WAREHOUSE_LABOR_RATE` | percent | #11–#14 (Units per Labor Hour) |
| `FACILITY_COST_RATE` | percent | #1 network footprint, #12 slotting, #27 multi-client facilities |
| `SGA_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `ON_TIME_DELIVERY` | percent | #3, #9 (On-Time Delivery / Arrival Rate) ; KPI OTIF |
| `TRAILER_UTILIZATION` | percent | #4 |
| `UNITS_PER_LABOR_HOUR` | ratio | #14 |
| `CONSOLIDATION_RATE` | percent | #8 |
| `DRIVER_TURNOVER_RATE` | percent | #40 |
| `FACILITY_UTILIZATION` | percent | #1, #27 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `CARRIER_PROCUREMENT` | PURCHASED_TRANSPORT_RATE | -0.01 | #2, #9, #19, #24 |
| `BACKHAUL_OPTIMIZATION` | EMPTY_MILES_RATE | -0.03 | #10, #39 |
| `WAREHOUSE_AUTOMATION` | WAREHOUSE_LABOR_RATE | -0.01 | #11, #12, #13, #14 |
| `NETWORK_OPTIMIZATION` | FACILITY_COST_RATE | -0.01 | #1, #6, #27, #34 |
| `ACCESSORIAL_PRICING` | ACCESSORIAL_REVENUE_RATIO | 0.01 | #21, #23, #33, #37, #38 |
| `VALUE_ADDED_SERVICES` | VOLUME_GROWTH | 0.01 | #25, #26, #28 |
| `COST_OPS` (base) | — | — | #15, #16, #17, #20 |

## Causes

- `FREIGHT_RATES` (exogène, jamais un levier) — #19, #36
- `LABOR` — #40

Référence moteur (démo) : EBITDA_EXIT = 164.50285022528476.
