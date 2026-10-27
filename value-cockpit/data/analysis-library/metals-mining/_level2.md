# Metals & Mining — niveau 2 (spec `src/sectors/metals-mining.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Metals & Mining Company »,
> `data/kpi-library/Metals & Mining.md`, analyses #n de ce dossier.

## Formules

```
ORE_MILLED_EXIT        = ORE_THROUGHPUT_MT * (1 + THROUGHPUT_GROWTH) ^ HOLD_YEARS
METAL_PRODUCED_EXIT    = ORE_MILLED_EXIT * HEAD_GRADE * RECOVERY_RATE
REVENUE_EXIT           = METAL_PRODUCED_EXIT * METAL_PRICE
OPERATING_COSTS_EXIT   = ORE_MILLED_EXIT * (MINING_COST_PER_TONNE + PROCESSING_COST_PER_TONNE)
EBITDA_EXIT            = REVENUE_EXIT * (1 - ROYALTY_RATE) - OPERATING_COSTS_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Un minerai, un métal payable : pas de sous-produits ni de pénalités de concentré (#40 en catalogue).
- Teneur et coûts constants jusqu'à la sortie : la séquence de mine (#5, #9) reste en diagnostic.
- METAL_PRICE est une hypothèse de marché (cause COMMODITY_PRICES), jamais un levier.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `ORE_THROUGHPUT_MT` | count | #9 production capacity, #11 throughput (Mt de minerai) |
| `THROUGHPUT_GROWTH` | percent | #9, #11, #39 |
| `HEAD_GRADE` | percent | #1 cut-off grade, #8, #15 dilution |
| `RECOVERY_RATE` | percent | #8, #38, #40, #46 (Recovery Rate) |
| `METAL_PRICE` | currency | #24, #29 ($ par tonne de métal) — hypothèse de marché |
| `MINING_COST_PER_TONNE` | currency | #5 stripping ratio, #10 cash cost, #13, #14 |
| `PROCESSING_COST_PER_TONNE` | currency | #20 water & energy, #44, #46 (Processing Cost per Unit) |
| `ROYALTY_RATE` | percent | #27, #43 (Royalty Payment) |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `STRIPPING_RATIO` | ratio | #5 |
| `MINE_LIFE` | years | #9 |
| `RESERVE_REPLACEMENT_RATE` | ratio | #2 (RRR) |
| `EQUIPMENT_UTILIZATION` | percent | #11, #12 |
| `LTIFR` | ratio | #36 |
| `CARBON_INTENSITY` | ratio | #18 (Emission Intensity) |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `GRADE_CONTROL` | HEAD_GRADE | 0.0003 | #6, #15, #38 |
| `RECOVERY_OPTIMIZATION` | RECOVERY_RATE | 0.01 | #8, #40, #46 |
| `THROUGHPUT_DEBOTTLENECKING` | THROUGHPUT_GROWTH | 0.01 | #11, #12, #39 |
| `MINING_COST_EFFICIENCY` | MINING_COST_PER_TONNE | -0.5 | #5, #10, #13, #14 |
| `PROCESSING_ENERGY_EFFICIENCY` | PROCESSING_COST_PER_TONNE | -0.5 | #20, #28, #44 |
| `OFFTAKE_ROYALTY` | ROYALTY_RATE | -0.005 | #27, #43 |
| `CAPEX_DISCIPLINE` (base) | — | — | #16, #25 |
| `WC_DIO` (base) | — | — | #33 |

## Causes

- `COMMODITY_PRICES` (exogène, jamais un levier) — #24, #29, #30
- `GEOTECHNICAL_RISK` — #34, #35
- `GEOPOLITICAL` — #41, #42

Référence moteur (démo) : EBITDA_EXIT = 543.631722202829.
