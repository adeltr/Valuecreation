# 13 · Extension CPG (Consumer Packaged Goods)

Archétype `cpg` (niveau 2) = Umbrex « Consumer Packaged Goods Company » (secteur
Consumer & Retail, KPI Consumer Packaged Goods). Proposition et arbitrages :
`data/analysis-library/cpg/_level2.md` (choix par défaut retenus : `REVENUE` = ventes brutes).

## Formules (src/templates/cpg.ts)

```
REVENUE_EXIT       = REVENUE × ((1 + VOLUME_GROWTH) × (1 + PRICE_MIX_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT = GROSS_MARGIN − TRADE_SPEND_RATE − AP_RATE − OVERHEAD_RATE
EBITDA_EXIT        = REVENUE_EXIT × EBITDA_MARGIN_EXIT
```
Logique « gross-to-net » de l'analyse #43 ; tous les taux en % des ventes brutes.
**Approximations :** `EBITDA_ENTRY` = donnée historique (un levier ne bouge jamais le prix
d'entrée) ; volume et prix-mix composent indépendamment (pas d'élasticité prix → volume,
phase 3) ; `OVERHEAD_RATE` est un choix d'analyste (aucun taux dans les sources).

## Vocabulaire

- Inputs : `VOLUME_GROWTH`, `PRICE_MIX_GROWTH`, `GROSS_MARGIN`, `TRADE_SPEND_RATE`,
  `AP_RATE`, `OVERHEAD_RATE`.
- Diagnostics benchmarkés : `MARKET_SHARE`, `OUT_OF_STOCK_RATE`, `PRIVATE_LABEL_SHARE`,
  `RETAILER_CONCENTRATION`, `NEW_PRODUCT_SUCCESS_RATE`, `PROMO_ROI`.
- Leviers CPG : `TRADE_SPEND_OPTIMIZATION`, `MARKETING_EFFECTIVENESS`, `ROUTE_TO_MARKET`,
  `IN_STORE_EXECUTION`, `INNOVATION_NPD` ; base réutilisée : `PRICING`, `MIX`,
  `COST_PROCUREMENT`, `COST_OPS`, `WC_DIO`.
- Causes : `RETAILER_POWER`, `COMMODITY_PRICES` (exogène, jamais un levier) + base.

## Catalogue
43 analyses (parties A–E) dans `src/catalog/cpg.catalog.json` : mapping niveau 1 enrichi
des termes CPG d'après les analyses citées dans `_level2.md`.

## Tests de référence (src/templates/cpg.test.ts)
Ventes brutes 1 000, volume +3 %, prix-mix +2 %, marge brute 45 %, trade 12 %, A&P 8 %,
frais fixes 10 % (marge EBITDA 15 %), EBITDA d'entrée 150, multiples 10x, 5 ans.
- `TRADE_SPEND_OPTIMIZATION` trade −1 pt ⇒ marge de sortie 16 %, `EQUITY_ENTRY` inchangé.
- `ROUTE_TO_MARKET` volume +1 pt ⇒ chiffre d'affaires de sortie composé à 4 % × 2 %.
