# Retail — niveau 2 (spec `src/sectors/retail.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Retail Company »,
> `data/kpi-library/Retail.md`, analyses #n de ce dossier.

## Formules

```
REVENUE_EXIT           = REVENUE * ((1 + LFL_GROWTH) * (1 + NET_STORE_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = GROSS_MARGIN - MARKDOWN_RATE - SHRINKAGE_RATE - STORE_LABOR_RATE - OCCUPANCY_COST_RATE - SGA_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Croissance = like-for-like × surface nette ; pas de cannibalisation explicite (#18 en diagnostic).
- Coûts magasin en % des ventes : les loyers fixes ne baissent pas en % quand le LFL croît (levier opérationnel ignoré).
- SGA_RATE est un choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `LFL_GROWTH` | percent | #1 Same-Store Sales Growth ; KPI SSSG |
| `NET_STORE_GROWTH` | percent | #17 closures, #18 expansion & cannibalisation |
| `GROSS_MARGIN` | percent | #20, #26, #27, #30, #31 (Gross Profit Margin) ; KPI GMROI |
| `MARKDOWN_RATE` | percent | #20, #30 (Markdown Percentage) ; KPI Average Discount Depth |
| `SHRINKAGE_RATE` | percent | #34 (Shrinkage Rate) ; KPI Shrinkage Rate |
| `STORE_LABOR_RATE` | percent | #16 (Labor Cost Percentage) |
| `OCCUPANCY_COST_RATE` | percent | #15 (Rent-to-Sales Ratio) ; KPI Cost per Square Foot |
| `SGA_RATE` | percent | choix d'analyste — siège, marketing, e-commerce |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CONVERSION_RATE` | percent | #2, #4, #17, #21, #25, #32 ; KPI Retail Conversion Rate |
| `SALES_PER_SQ_FT` | currency | #4, #13, #15, #28 ; KPI Sales Per Square Foot |
| `OUT_OF_STOCK_RATE` | percent | #11 ; KPI Stock-Out Rate |
| `ONLINE_SALES_SHARE` | percent | #6, #14 ; KPI Online Sales as a % of Total |
| `RETURN_RATE` | percent | #3, #6 ; KPI Product Return Rate |
| `AVERAGE_TRANSACTION_VALUE` | currency | #8, #22, #23, #25 ; KPI ATV |
| `GMROI` | ratio | #33 ; KPI Gross Margin Return on Inventory Investment |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `MERCHANDISING_ASSORTMENT` | GROSS_MARGIN | 0.01 | #13, #26, #28, #29, #31 |
| `MARKDOWN_OPTIMIZATION` | MARKDOWN_RATE | -0.01 | #20, #21, #30 |
| `LOSS_PREVENTION` | SHRINKAGE_RATE | -0.005 | #34 |
| `LABOR_SCHEDULING` | STORE_LABOR_RATE | -0.01 | #16 |
| `STORE_PORTFOLIO` | OCCUPANCY_COST_RATE | -0.01 | #4, #15, #17, #18 |
| `OMNICHANNEL` | LFL_GROWTH | 0.01 | #6, #12, #14 |
| `CUSTOMER_LOYALTY` | LFL_GROWTH | 0.01 | #2, #7, #22, #23, #24 |
| `PRICING` (base) | — | — | #20 |
| `MIX` (base) | — | — | #5, #29 |
| `COST_PROCUREMENT` (base) | — | — | #27, #35 |
| `WC_DIO` (base) | — | — | #10, #11 |

## Causes

- `ECOMMERCE_SHIFT` — #6, #12, #14
- `SEASONALITY` (exogène, jamais un levier) — #5 ; KPI Seasonality Index

Référence moteur (démo) : EBITDA_EXIT = 97.27485108223809.
