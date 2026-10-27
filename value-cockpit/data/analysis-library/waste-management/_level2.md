# Waste Management — niveau 2 (spec `src/sectors/waste-management.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Waste Management Company »,
> `data/kpi-library/Waste Management.md`, analyses #n de ce dossier.

## Formules

```
TONS_COLLECTED_EXIT    = TONS_COLLECTED_MT * (1 + VOLUME_GROWTH) ^ HOLD_YEARS
REVENUE_EXIT           = TONS_COLLECTED_EXIT * (PRICE_PER_TON * (1 + PRICE_GROWTH) ^ HOLD_YEARS + RECYCLING_RATE * COMMODITY_PRICE_PER_TON)
OPERATING_COSTS_EXIT   = TONS_COLLECTED_EXIT * (COLLECTION_COST_PER_TON + DISPOSAL_COST_PER_TON * (1 - RECYCLING_RATE))
EBITDA_EXIT            = REVENUE_EXIT - OPERATING_COSTS_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Collecte, tri et élimination agrégés par tonne ; SG&A inclus dans les coûts par tonne.
- Le recyclage évite l'élimination et rapporte le prix matière ; la volatilité de ce prix est une cause exogène.
- Pas de modélisation de la durée de vie des décharges ni des provisions de fermeture (diagnostics #1, #36).

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `TONS_COLLECTED_MT` | count | #4 MSW growth, #25, #29 (Mt par an) |
| `VOLUME_GROWTH` | percent | #4 (Annual Growth Rate), #44 acquisitions |
| `PRICE_PER_TON` | currency | #41 franchise fees, #42 contracts, #45 tipping fees |
| `PRICE_GROWTH` | percent | #42, #45 — indexation contractuelle |
| `RECYCLING_RATE` | percent | #8, #9 (Recycling Rate), #13, #38 |
| `COMMODITY_PRICE_PER_TON` | currency | #10 (Recycling Revenue), #11, #14 |
| `COLLECTION_COST_PER_TON` | currency | #25 route density, #26 transfer stations, #27 fleet |
| `DISPOSAL_COST_PER_TON` | currency | #3 residuals, #20 landfill gas, #21 WTE |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `REMAINING_LANDFILL_LIFE` | years | #1 |
| `ROUTE_DENSITY` | ratio | #25 (tons/mile) |
| `DIVERSION_RATE` | percent | #13, #17, #28 |
| `MRF_RECOVERY_RATE` | percent | #8 |
| `LANDFILL_CLOSURE_LIABILITY` | currency | #1, #36 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `ROUTE_OPTIMIZATION` | COLLECTION_COST_PER_TON | -1 | #25, #26, #29 |
| `FLEET_CONVERSION` | COLLECTION_COST_PER_TON | -0.5 | #27 |
| `PRICING_DISCIPLINE` | PRICE_GROWTH | 0.01 | #41, #42, #43, #45 |
| `DISPOSAL_INTERNALIZATION` | DISPOSAL_COST_PER_TON | -1 | #3, #12, #26 |
| `RECYCLING_VALUE` | RECYCLING_RATE | 0.02 | #8, #9, #10, #14, #50 |
| `WASTE_TO_ENERGY` | DISPOSAL_COST_PER_TON | -0.5 | #7, #19, #20, #21 |
| `TUCK_IN_ACQUISITIONS` | VOLUME_GROWTH | 0.01 | #44 |
| `CAPEX_DISCIPLINE` (base) | — | — | #5, #12, #50 |

## Causes

- `COMMODITY_PRICES` (exogène, jamais un levier) — #10, #11
- `ENVIRONMENTAL_LIABILITY` — #1, #2, #36, #39

Référence moteur (démo) : EBITDA_EXIT = 333.7022860211163.
