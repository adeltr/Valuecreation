# Curation wine-spirits — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `wine-spirits` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

48 analyses · 15 sans métrique ni levier (qualitatives) · 9 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | — | PRICING | COMMERCIAL, MARKET | PRICING←pricing · COMMERCIAL←consumer · MARKET←market |
| 02 | A | REVENUE_GROWTH, VOLUME_GROWTH | VOLUME | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · VOLUME←distribution · COMMERCIAL←consumer · MARKET←market |
| 03 | A | — | — | COMMERCIAL, MARKET | COMMERCIAL←consumer · MARKET←markets |
| 04 | A | — | VOLUME, MIX | COMMERCIAL | VOLUME←channels · MIX←portfolio · COMMERCIAL←customer |
| 05 | A | REVENUE_GROWTH, VOLUME_GROWTH | VOLUME, ROUTE_TO_MARKET | COMMERCIAL | REVENUE_GROWTH←growth · VOLUME←channel · COMMERCIAL←channel |
| 06 | A | REVENUE_GROWTH, DIO | PRICING, WC_DIO | COMMERCIAL, OPERATIONAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · PRICING←promotions · WC_DIO←inventory · COMMERCIAL←marketing · OPERATIONAL←production · MARKET←demand |
| 07 | A | REVENUE_GROWTH, VOLUME_GROWTH, ONLINE_SALES_SHARE | VOLUME, DTC_EXPANSION | COMMERCIAL | REVENUE_GROWTH←growth · VOLUME←expand · COMMERCIAL←channels |
| 08 | A | — | COST_OPS, DTC_EXPANSION | COMMERCIAL, OPERATIONAL | COST_OPS←efficiency · COMMERCIAL←customer · OPERATIONAL←quality |
| 09 | A | — | PRICING, COST_OPS | COMMERCIAL | PRICING←promotions · COST_OPS←staff · COMMERCIAL←customer |
| 10 | B | REVENUE_GROWTH | MIX | COMMERCIAL, MARKET | REVENUE_GROWTH←growth · MIX←portfolio · COMMERCIAL←brand · MARKET←market |
| 11 | B | — | PRICING, VOLUME | MARKET | PRICING←pricing · VOLUME←expand · MARKET←competitive |
| 12 | B | PRICE_MIX_GROWTH | PREMIUMIZATION | COMMERCIAL | COMMERCIAL←pricing |
| 13 | B | AP_RATE | MARKETING_EFFECTIVENESS | COMMERCIAL | COMMERCIAL←marketing |
| 14 | B | AP_RATE | PRICING, MARKETING_EFFECTIVENESS | COMMERCIAL | PRICING←promotion · COMMERCIAL←brand |
| 15 | B | PRICE_MIX_GROWTH | VOLUME, WC_DIO, PREMIUMIZATION | COMMERCIAL | VOLUME←channels · WC_DIO←inventory · COMMERCIAL←sales |
| 16 | B | PRICE_MIX_GROWTH | PRICING, VOLUME, PREMIUMIZATION | COMMERCIAL, MARKET | PRICING←pricing · VOLUME←distribution · COMMERCIAL←brands · MARKET←market |
| 17 | B | — | — | COMMERCIAL | COMMERCIAL←brands |
| 18 | B | AP_RATE | MARKETING_EFFECTIVENESS | COMMERCIAL, MARKET | COMMERCIAL←brand · MARKET←competitions |
| 19 | B | — | — | COMMERCIAL | COMMERCIAL←brands |
| 20 | C | — | INNOVATION_NPD | MARKET | MARKET←market |
| 21 | C | — | INNOVATION_NPD | COMMERCIAL, MARKET | COMMERCIAL←consumer · MARKET←market |
| 22 | C | REVENUE_GROWTH | VOLUME, INNOVATION_NPD | COMMERCIAL, MARKET | REVENUE_GROWTH←growth · VOLUME←expand · COMMERCIAL←consumer · MARKET←trend |
| 23 | C | AGING_INVENTORY_YEARS | WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | COMMERCIAL←brand · OPERATIONAL←process · FINANCIAL←costs |
| 24 | C | — | PRICING | COMMERCIAL, OPERATIONAL | PRICING←pricing · COMMERCIAL←brand · OPERATIONAL←quality |
| 25 | C | GROSS_MARGIN | COST_PROCUREMENT, PRODUCTION_EFFICIENCY | COMMERCIAL, OPERATIONAL, FINANCIAL | COST_PROCUREMENT←vendor · COMMERCIAL←brand · OPERATIONAL←production · FINANCIAL←cost |
| 26 | D | COGS | COST_PROCUREMENT | OPERATIONAL, FINANCIAL | COGS←raw material · COST_PROCUREMENT←supplier · OPERATIONAL←supply chain · FINANCIAL←cost |
| 27 | D | DISTRIBUTION_COST_RATE, DISTRIBUTOR_DEPENDENCY | VOLUME, ROUTE_TO_MARKET | MARKET, DISTRIBUTOR_POWER | VOLUME←distribution · MARKET←market |
| 28 | D | COGS | COST_PROCUREMENT | OPERATIONAL, FINANCIAL | COGS←production costs · COST_PROCUREMENT←suppliers · OPERATIONAL←quality · FINANCIAL←costs |
| 29 | D | COGS, DIO, HARVEST_YIELD_VARIANCE | COST_PROCUREMENT | OPERATIONAL, FINANCIAL, MARKET, WEATHER_CLIMATE | COGS←raw materials · DIO←inventory · COST_PROCUREMENT←sourcing · OPERATIONAL←production · FINANCIAL←cost · MARKET←industry |
| 30 | D | — | — | OPERATIONAL, WEATHER_CLIMATE | OPERATIONAL←quality |
| 31 | D | HARVEST_YIELD_VARIANCE | — | OPERATIONAL, MARKET, WEATHER_CLIMATE | OPERATIONAL←quality · MARKET←industry |
| 32 | E | REVENUE_GROWTH, GROSS_MARGIN | VOLUME, COST_OPS, PRODUCTION_EFFICIENCY | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←expansion · VOLUME←expand · COST_OPS←automation · OPERATIONAL←production · FINANCIAL←cost · MARKET←demand |
| 33 | E | GROSS_MARGIN | COST_PROCUREMENT, COST_OPS, PRODUCTION_EFFICIENCY | OPERATIONAL, FINANCIAL, REGULATORY | COST_PROCUREMENT←sourcing · COST_OPS←maintenance · OPERATIONAL←process · FINANCIAL←cost · REGULATORY←regulatory |
| 34 | E | DIO, AGING_INVENTORY_YEARS | WC_DIO | OPERATIONAL, FINANCIAL | DIO←inventory · WC_DIO←inventory · OPERATIONAL←quality · FINANCIAL←cost |
| 35 | E | — | — | OPERATIONAL | OPERATIONAL←quality |
| 36 | E | — | COST_PROCUREMENT, COST_OPS | COMMERCIAL, OPERATIONAL, MARKET | COST_PROCUREMENT←supplier · COST_OPS←automation · COMMERCIAL←brand · OPERATIONAL←quality · MARKET←industry |
| 37 | F | — | COST_OPS | OPERATIONAL, FINANCIAL, MARKET, REGULATORY | COST_OPS←staff · OPERATIONAL←operational · FINANCIAL←financial · MARKET←industry · REGULATORY←regulatory |
| 38 | F | — | COST_OPS | MARKET, REGULATORY | COST_OPS←staff · MARKET←industry · REGULATORY←regulation |
| 39 | F | — | — | COMMERCIAL, MARKET, REGULATORY | COMMERCIAL←brand · MARKET←market · REGULATORY←compliance |
| 40 | F | EBITDA_MARGIN, COGS, EXCISE_TAX_RATE | PRICING, COST_OPS, TAX_TARIFF_OPTIMIZATION | COMMERCIAL, OPERATIONAL, FINANCIAL, REGULATORY | EBITDA_MARGIN←profitability · COGS←production costs · PRICING←pricing · COST_OPS←efficiency · COMMERCIAL←pricing · OPERATIONAL←production · FINANCIAL←cost · REGULATORY←compliance |
| 41 | G | EBITDA_MARGIN, PRICE_MIX_GROWTH, GROSS_MARGIN | PRICING | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←margin · PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←margin · MARKET←competitive |
| 42 | G | ONLINE_SALES_SHARE | PRICING, VOLUME, DTC_EXPANSION | COMMERCIAL | PRICING←promotions · VOLUME←expand · COMMERCIAL←consumer |
| 43 | G | AP_RATE | VOLUME, MARKETING_EFFECTIVENESS | COMMERCIAL, FINANCIAL | VOLUME←channels · COMMERCIAL←marketing · FINANCIAL←investment |
| 44 | G | EBITDA_MARGIN, DISTRIBUTION_COST_RATE | VOLUME, ROUTE_TO_MARKET | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · VOLUME←channel · COMMERCIAL←channel · FINANCIAL←profitability · MARKET←market |
| 45 | G | — | PREMIUMIZATION | COMMERCIAL, MARKET | COMMERCIAL←sales · MARKET←market |
| 46 | G | CUSTOMER_RETENTION_RATE | VOLUME, COST_PROCUREMENT | COMMERCIAL | VOLUME←loyalty · COST_PROCUREMENT←purchase · COMMERCIAL←customer |
| 47 | H | — | COST_PROCUREMENT | COMMERCIAL, OPERATIONAL, REGULATORY | COST_PROCUREMENT←sourcing · COMMERCIAL←consumer · OPERATIONAL←production · REGULATORY←regulatory |
| 48 | H | — | — | COMMERCIAL, MARKET | COMMERCIAL←brand · MARKET←market |

Libellés des parties : A Market and Consumer Insights · B Brand Positioning and Marketing Strategy · C Product Innovation and Development · D Supply Chain and Sourcing Stability · E Production and Quality Control · F Regulatory and Compliance · G Financial and Revenue Optimization · H Sustainability and Environmental Impact.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
