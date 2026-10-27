# Cosmetics — niveau 2 (spec `src/sectors/cosmetics.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Cosmetics Company »,
> `data/kpi-library/Cosmetics & Personal Care.md`, analyses #n de ce dossier.

## Formules

```
REVENUE_EXIT           = REVENUE * ((1 + VOLUME_GROWTH) * (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = GROSS_MARGIN - AP_RATE - RD_RATE - OVERHEAD_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Volume et prix-mix composent indépendamment (pas d'élasticité, phase 3).
- Les 17 analyses produit/R&D (efficacité, tests, stabilité) restent qualitatives : catalogue et diagnostics.
- OVERHEAD_RATE est un choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `VOLUME_GROWTH` | percent | #20 loyalty, #29 channels, #32 e-commerce |
| `PRICE_MIX_GROWTH` | percent | #27 limited editions, #28 luxury vs mass, #44 pricing |
| `GROSS_MARGIN` | percent | #1 (Product Profit), #3 (Formulation Cost, Profit Margin) |
| `AP_RATE` | percent | #18, #19 (influencer ROI), #32, #34 sampling |
| `RD_RATE` | percent | #2 (R&D Cost per Product), #45 |
| `OVERHEAD_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `NEW_PRODUCT_SUCCESS_RATE` | percent | #2 (Innovation Success Rate) |
| `CUSTOMER_RETENTION_RATE` | percent | #20 (Retention Rate), #33 ; KPI Beauty Box Subscription Retention |
| `ONLINE_SALES_SHARE` | percent | #32 |
| `TIME_TO_MARKET` | days | #2 (Average Time to Market) |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `FORMULATION_COST` | GROSS_MARGIN | 0.01 | #3, #35 |
| `INFLUENCER_DIGITAL` | AP_RATE | -0.01 | #18, #19, #32 |
| `PREMIUMIZATION` | PRICE_MIX_GROWTH | 0.01 | #26, #27, #28, #44 |
| `LOYALTY_SUBSCRIPTION` | VOLUME_GROWTH | 0.01 | #20, #33, #34 |
| `CHANNEL_EXPANSION` | VOLUME_GROWTH | 0.01 | #22, #29, #30, #31 |
| `RD_PRODUCTIVITY` | RD_RATE | -0.005 | #2, #11, #14 |
| `COST_PROCUREMENT` (base) | — | — | #35 |
| `WC_DIO` (base) | — | — | #1, #36 |
| `PRICING` (base) | — | — | #44 |
| `MIX` (base) | — | — | #1 |

## Causes

- `CLEAN_BEAUTY_TRENDS` — #21, #25
- `RETAILER_POWER` — #30, #31

Référence moteur (démo) : EBITDA_EXIT = 112.83473337393349.
