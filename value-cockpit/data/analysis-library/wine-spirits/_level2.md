# Wine, Beer & Spirits — niveau 2 (spec `src/sectors/wine-spirits.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Wine, Beer & Spirits Company »,
> `data/kpi-library/Wine, Beer, and Spirits.md`, analyses #n de ce dossier.

## Formules

```
REVENUE_EXIT           = REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = GROSS_MARGIN - EXCISE_TAX_RATE - AP_RATE - DISTRIBUTION_COST_RATE - OVERHEAD_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Volume et prix-mix composent indépendamment (pas d'élasticité, phase 3).
- Le vieillissement des stocks pèse sur le BFR (DIO, AGING_INVENTORY_YEARS), pas sur la marge.
- OVERHEAD_RATE est un choix d'analyste.

## Interactions (moteur, scénarios)

- `PRICE_MIX_GROWTH` → `VOLUME_GROWTH` : Δ cible = `PRICE_ELASTICITY` (démo -0.8) × Δ source — choix d'analyste — #12 premiumisation (price elasticity) pour calibrer

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `VOLUME_GROWTH` | percent | #2 emerging markets, #5 channels, #7 e-commerce |
| `PRICE_MIX_GROWTH` | percent | #12 premiumization (price elasticity), #15, #16, #41 |
| `GROSS_MARGIN` | percent | #41 (Gross Margin), #25, #32, #33 |
| `EXCISE_TAX_RATE` | percent | #40 (Tax Burden per Unit) |
| `AP_RATE` | percent | #13, #14, #18, #43 (marketing ROI) |
| `DISTRIBUTION_COST_RATE` | percent | #27, #44 (Cost-to-Revenue Ratio) |
| `OVERHEAD_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `ONLINE_SALES_SHARE` | percent | #7, #42 |
| `DISTRIBUTOR_DEPENDENCY` | percent | #27 (Dependency Ratio) |
| `AGING_INVENTORY_YEARS` | years | #23, #34 |
| `HARVEST_YIELD_VARIANCE` | percent | #29, #31 |
| `CUSTOMER_RETENTION_RATE` | percent | #46 (Churn Rate, CLV) |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `PREMIUMIZATION` | PRICE_MIX_GROWTH | 0.01 | #12, #15, #16, #45 |
| `ROUTE_TO_MARKET` | DISTRIBUTION_COST_RATE | -0.01 | #5, #27, #44 |
| `MARKETING_EFFECTIVENESS` | AP_RATE | -0.01 | #13, #14, #18, #43 |
| `DTC_EXPANSION` | VOLUME_GROWTH | 0.01 | #7, #8, #42 |
| `INNOVATION_NPD` | VOLUME_GROWTH | 0.01 | #20, #21, #22 |
| `PRODUCTION_EFFICIENCY` | GROSS_MARGIN | 0.01 | #25, #32, #33 |
| `TAX_TARIFF_OPTIMIZATION` | EXCISE_TAX_RATE | -0.005 | #40 |
| `WC_DIO` (base) | — | — | #23, #34 |
| `COST_PROCUREMENT` (base) | — | — | #26, #28 |
| `PRICING` (base) | — | — | #41 |

## Causes

- `WEATHER_CLIMATE` (exogène, jamais un levier) — #29, #30, #31
- `DISTRIBUTOR_POWER` — #27

Référence moteur (démo) : EBITDA_EXIT = 120.95247414097092.
