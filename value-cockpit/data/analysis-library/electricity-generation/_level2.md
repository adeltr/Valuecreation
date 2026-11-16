# Electricity Generation — niveau 2 (spec `src/sectors/electricity-generation.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Electricity Generation Company »,
> `data/kpi-library/Energy.md`, analyses #n de ce dossier.

## Formules

```
GENERATION_TWH_EXIT    = INSTALLED_CAPACITY_GW * (1 + CAPACITY_GROWTH) ^ HOLD_YEARS * CAPACITY_FACTOR * 8.76
REVENUE_EXIT           = GENERATION_TWH_EXIT * REALIZED_POWER_PRICE
OPERATING_COSTS_EXIT   = GENERATION_TWH_EXIT * (HEAT_RATE * FUEL_COST_PER_GJ + OM_COST_PER_MWH)
EBITDA_EXIT            = REVENUE_EXIT - OPERATING_COSTS_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Un parc agrégé (une capacité, un facteur de charge, un heat rate moyens) ; pas de dispatch par centrale (#5).
- Prix réalisé et coût du combustible en hypothèses : spreads et couverture restent des causes et diagnostics.
- Revenus de capacité et services système inclus dans le prix réalisé (#14).

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `INSTALLED_CAPACITY_GW` | count | #1 Generation Capacity ; KPI Baseload Capacity |
| `CAPACITY_GROWTH` | percent | #31 renewables build-out, #36 storage, #37 distributed generation |
| `CAPACITY_FACTOR` | percent | #1, #4 (Capacity Factor) ; KPI Capacity Factor |
| `REALIZED_POWER_PRICE` | currency | #11 PPA, #13 hedging, #14 capacity payments, #17 spot price ($/MWh) |
| `HEAT_RATE` | ratio | #2, #3 (Heat Rate) — GJ par MWh |
| `FUEL_COST_PER_GJ` | currency | #7, #8, #29 (Fuel Cost Exposure) |
| `OM_COST_PER_MWH` | currency | #6 start-up costs, #42 maintenance planning, #12 LCOE |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `FORCED_OUTAGE_RATE` | percent | #4 |
| `CARBON_INTENSITY` | ratio | #18, #22 ; KPI Carbon Intensity |
| `RESERVE_MARGIN` | percent | #39, #40 |
| `HEDGE_COVERAGE` | percent | #13, #29 |
| `RENEWABLE_SHARE` | percent | #31 |
| `CURTAILMENT_RATE` | percent | #45 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `AVAILABILITY_IMPROVEMENT` | CAPACITY_FACTOR | 0.02 | #1, #4, #42 |
| `HEAT_RATE_IMPROVEMENT` | HEAT_RATE | -0.2 | #2, #3, #33 |
| `FUEL_PROCUREMENT` | FUEL_COST_PER_GJ | -0.2 | #7, #8, #9 |
| `COMMERCIAL_OPTIMIZATION` | REALIZED_POWER_PRICE | 2 | #11, #13, #14, #16, #17 |
| `OM_EFFICIENCY` | OM_COST_PER_MWH | -0.5 | #6, #42, #43 |
| `RENEWABLE_BUILDOUT` | CAPACITY_GROWTH | 0.01 | #31, #36, #37 |
| `CAPEX_DISCIPLINE` (base) | — | — | #42, #43, #44 |

## Causes

- `FUEL_PRICE` (exogène, jamais un levier) — #8, #29
- `POWER_MARKET_PRICES` (exogène, jamais un levier) — #13, #17
- `WEATHER_CLIMATE` (exogène, jamais un levier) — #28, #32

Référence moteur (démo) : EBITDA_EXIT = 510.6682857424896.
