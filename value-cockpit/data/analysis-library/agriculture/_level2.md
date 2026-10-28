# Agriculture — niveau 2 (spec `src/sectors/agriculture.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Agriculture Company »,
> `data/kpi-library/Agriculture.md`, analyses #n de ce dossier.

## Formules

```
REVENUE_EXIT           = REVENUE * ((1 + AREA_GROWTH) * (1 + CROP_YIELD_GROWTH) * (1 + PRICE_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = 1 - INPUT_COST_RATE - WATER_ENERGY_COST_RATE - LABOR_MACHINERY_COST_RATE - SGA_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Modèle centré cultures (surface × rendement × prix) ; l'élevage (#12–#19) reste en diagnostic et dans le catalogue.
- Rendement et prix composent sans aléa climatique : le climat est une cause exogène, pas un scénario stochastique.
- SGA_RATE est un choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `AREA_GROWTH` | percent | #4 rotation, #7 land-use, #29 greenhouse conversion |
| `CROP_YIELD_GROWTH` | percent | #1 Crop Yield and Farm Productivity ; KPI Crop Yield |
| `PRICE_GROWTH` | percent | #31 specialty/organic premium ; prix de marché = choix d'analyste |
| `INPUT_COST_RATE` | percent | #2, #5, #10, #11, #14 (semences, engrais, phyto, alimentation) |
| `WATER_ENERGY_COST_RATE` | percent | #20 irrigation, #22 on-farm energy |
| `LABOR_MACHINERY_COST_RATE` | percent | #28 machinery utilisation, #25 ; KPI Agricultural Worker Turnover |
| `SGA_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `SOIL_ORGANIC_MATTER` | percent | #2, #8 |
| `LIVESTOCK_MORTALITY_RATE` | percent | #12, #18 |
| `IRRIGATION_EFFICIENCY` | percent | #20 |
| `CROP_INSURANCE_COVERAGE` | percent | #37 |
| `ORGANIC_SHARE` | percent | #31, #34 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `PRECISION_AGRONOMY` | CROP_YIELD_GROWTH | 0.01 | #1, #2, #3, #10, #11, #25 |
| `INPUT_OPTIMIZATION` | INPUT_COST_RATE | -0.01 | #5, #11, #13, #14 |
| `WATER_ENERGY_EFFICIENCY` | WATER_ENERGY_COST_RATE | -0.01 | #20, #22 |
| `MECHANIZATION` | LABOR_MACHINERY_COST_RATE | -0.01 | #25, #28 |
| `PREMIUM_CHANNELS` | PRICE_GROWTH | 0.01 | #31, #33, #34, #35 |
| `LAND_EXPANSION` | AREA_GROWTH | 0.01 | #4, #7, #29 |
| `COST_PROCUREMENT` (base) | — | — | #14 |
| `WC_DIO` (base) | — | — | #30 |

## Causes

- `WEATHER_CLIMATE` (exogène, jamais un levier) — #21, #37
- `COMMODITY_PRICES` (exogène, jamais un levier) — #37 ; prix agricoles
- `PESTS_DISEASE` — #3, #6, #18

Référence moteur (démo) : EBITDA_EXIT = 75.00482279765205.
