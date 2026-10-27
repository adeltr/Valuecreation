# CPG — niveau 2 : candidats d'extension (à arbitrer)

> Statut : **proposition**. Rien n'est dans l'ontologie ni dans un template tant que tu
> n'as pas tranché (docs/09 §pré-requis). Sources : `data/kpi-library/Consumer Packaged
> Goods.md` (50 KPI, glossaire sans formule) et les formules des 43 analyses CPG (#n).
> Règle docs/09 : ≤ 10 codes opérationnels, une formule seulement si elle est sourcée ou
> si tu la poses explicitement.

## 1. Arbre de valeur proposé

```
REVENUE_EXIT       = REVENUE × ((1 + VOLUME_GROWTH) × (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT = GROSS_MARGIN − TRADE_SPEND_RATE − AP_RATE − OVERHEAD_RATE
EBITDA_EXIT        = REVENUE_EXIT × EBITDA_MARGIN_EXIT
```
Logique « gross-to-net » de l'analyse #43 : `Net Profit = Revenue − (COGS + Trade Promotions
+ Retailer Fees + Logistics Costs)`. `REVENUE` = ventes brutes (gross sales), tous les taux
en % de `REVENUE`. `EBITDA_ENTRY` reste la donnée historique (un levier ne bouge jamais
le prix d'entrée, comme Airline et le template générique).

## 2. Pile 1 — inputs liés par formule

| Code candidat | Unité | Rôle | Sources |
|---|---|---|---|
| `VOLUME_GROWTH` | percent | croissance volume / an | #10, #27, #31, #36, #39 (`Sales Growth (%)`) ; KPI Market Share Growth, Rate of Sale |
| `PRICE_MIX_GROWTH` | percent | effet prix + mix / an | #13 (discount depth), #21 (price-pack, `Price Elasticity`), #23 (mix) ; KPI Price Per Unit |
| `GROSS_MARGIN` | percent | marge brute | #6, #11, #13, #19, #21, #23, #42, #43 (`Gross Margin (%)`) |
| `TRADE_SPEND_RATE` | percent | dépenses promo enseignes | #16, #42, #43 (`ROI = (Incremental Gross Profit − Trade Spend) / Trade Spend`) ; KPI Trade Spend Efficiency |
| `AP_RATE` | percent | publicité & promotion consommateur | #1, #4, #10, #15 (`ROMI = (Revenue − Marketing Spend) / Marketing Spend`) ; KPI Cost Per Impression |
| `OVERHEAD_RATE` | percent | frais fixes (SG&A, logistique) | **choix d'analyste** (#43 cite retailer fees + logistics, sans taux) |

## 3. Pile 2 — diagnostics benchmarkés (pas de formule v1)

| Code candidat | Unité | Sources |
|---|---|---|
| `MARKET_SHARE` | percent | #10, #11, #19, #22, #27 ; KPI Market Penetration |
| `OUT_OF_STOCK_RATE` | percent | #17 (`Out-of-Stock Frequency`) ; KPI Out-of-Stock Rate, Lost Sales |
| `PRIVATE_LABEL_SHARE` | percent | #22 ; KPI Private Label Share |
| `RETAILER_CONCENTRATION` | percent | #14 ; KPI Customer Concentration Ratio, Retailer Dependence |
| `NEW_PRODUCT_SUCCESS_RATE` | percent | #34 (`Success Rate`) ; KPI New Product Success Rate |
| `PROMO_ROI` | ratio | #16, #20, #42, #43 |

Hors périmètre v1 (catalogue seulement) : SKU count (#23), spoilage (#28, #30), on-time
delivery (#24–#26, #31), défauts / rappels (#25, #33), NPS / sentiment (#3, #7, #9),
empreinte carbone (#38). Rotation des stocks : base `DIO` (#24, #28, #30, #31, #43).

## 4. Catégories de leviers

Réutiliser la base là où elle couvre déjà : `PRICING` (#13, #21), `MIX` (#1, #23, #41),
`COST_PROCUREMENT` (#6, #25, #26, #40), `COST_OPS` (#24, #28), `WC_DIO` (#30).
Ajouter 5 catégories propres à CPG :

| Catégorie | Cible | Analyses |
|---|---|---|
| `TRADE_SPEND_OPTIMIZATION` | TRADE_SPEND_RATE ↓ | #14, #16, #42, #43 |
| `MARKETING_EFFECTIVENESS` | AP_RATE ↓ à volume égal, VOLUME_GROWTH ↑ | #1, #4, #10, #15, #20 |
| `ROUTE_TO_MARKET` | VOLUME_GROWTH ↑ | #11, #12, #27, #31, #32 |
| `IN_STORE_EXECUTION` | VOLUME_GROWTH ↑ (out-of-stock ↓) | #17, #18, #19, #20 |
| `INNOVATION_NPD` | VOLUME_GROWTH, PRICE_MIX_GROWTH ↑ | #34, #35, #36, #39 |

## 5. Causes

Base suffisante pour l'essentiel (`COMMERCIAL`, `MARKET`, `OPERATIONAL`, `REGULATORY`…).
Deux candidats propres à CPG :
- `RETAILER_POWER` — #14, #22 (private label), KPI Retailer Dependence.
- `COMMODITY_PRICES` — #26, #40, KPI Commodity Price Sensitivity (exogène, jamais un levier).

## 6. Tes arbitrages

1. **Arbre** : valider la décomposition volume × prix-mix et la marge
   `GROSS_MARGIN − TRADE_SPEND_RATE − AP_RATE − OVERHEAD_RATE` ?
2. **`REVENUE` = ventes brutes** (trade spend en charge, comme #43), ou ventes nettes
   (trade spend déjà déduit, et `TRADE_SPEND_RATE` sort de la formule) ?
3. **`OVERHEAD_RATE`** comme choix d'analyste (aucun taux dans les sources) ?
4. **Pile 2** : garder les 6 diagnostics ?
5. **Leviers** : les 5 catégories CPG + réutilisation de la base ?
6. **Causes** : `RETAILER_POWER` et `COMMODITY_PRICES` ?

Limite à garder en tête : pas d'élasticité prix → volume dans le moteur (interactions entre
leviers = phase 3) ; une hausse de `PRICE_MIX_GROWTH` ne réduit pas `VOLUME_GROWTH` toute seule.
