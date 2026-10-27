# Curation electricity-generation — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `electricity-generation` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

47 analyses · 1 sans métrique ni levier (qualitatives) · 33 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | INSTALLED_CAPACITY_GW, CAPACITY_FACTOR | COST_OPS, AVAILABILITY_IMPROVEMENT | OPERATIONAL | COST_OPS←maintenance · OPERATIONAL←capacity |
| 02 | A | HEAT_RATE | COST_PROCUREMENT, COST_OPS, HEAT_RATE_IMPROVEMENT | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←procurement · COST_OPS←maintenance · OPERATIONAL←operational · FINANCIAL←costs |
| 03 | A | HEAT_RATE | COST_OPS, HEAT_RATE_IMPROVEMENT | FINANCIAL | COST_OPS←maintenance · FINANCIAL←cost |
| 04 | A | CAPACITY_FACTOR, FORCED_OUTAGE_RATE | COST_OPS, AVAILABILITY_IMPROVEMENT | OPERATIONAL | COST_OPS←maintenance · OPERATIONAL←capacity |
| 05 | A | EBITDA_MARGIN, REVENUE_GROWTH | PRICING, COST_OPS | OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · PRICING←price · COST_OPS←efficiency · OPERATIONAL←operational · FINANCIAL←profitability · MARKET←demand |
| 06 | A | REVENUE_GROWTH, OM_COST_PER_MWH | COST_OPS, OM_EFFICIENCY | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · COST_OPS←maintenance · OPERATIONAL←operational · FINANCIAL←cost · MARKET←demand |
| 07 | B | FUEL_COST_PER_GJ | MIX, COST_PROCUREMENT, COST_OPS, FUEL_PROCUREMENT | OPERATIONAL, FINANCIAL | MIX←mix · COST_PROCUREMENT←suppliers · COST_OPS←energy · OPERATIONAL←operational · FINANCIAL←cost |
| 08 | B | FUEL_COST_PER_GJ | COST_PROCUREMENT, FUEL_PROCUREMENT | OPERATIONAL, FINANCIAL, FUEL_PRICE | COST_PROCUREMENT←suppliers · OPERATIONAL←supply chain · FINANCIAL←cost |
| 09 | B | — | COST_PROCUREMENT, COST_OPS, FUEL_PROCUREMENT | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←suppliers · COST_OPS←efficiency · OPERATIONAL←operational · FINANCIAL←cost |
| 10 | B | — | COST_PROCUREMENT, COST_OPS | FINANCIAL, REGULATORY | COST_PROCUREMENT←purchased · COST_OPS←energy · FINANCIAL←financial · REGULATORY←regulatory |
| 11 | C | REALIZED_POWER_PRICE | PRICING, COMMERCIAL_OPTIMIZATION | FINANCIAL, MARKET, REGULATORY | PRICING←price · FINANCIAL←financial · MARKET←market · REGULATORY←regulatory |
| 12 | C | OM_COST_PER_MWH | COST_PROCUREMENT, COST_OPS, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL, MARKET | COST_PROCUREMENT←procurement · COST_OPS←efficiency · CAPEX_DISCIPLINE←capex · OPERATIONAL←operational · FINANCIAL←cost · MARKET←competitiveness |
| 13 | C | REALIZED_POWER_PRICE, HEDGE_COVERAGE | PRICING, COMMERCIAL_OPTIMIZATION | COMMERCIAL, FINANCIAL, MARKET, POWER_MARKET_PRICES | PRICING←price · COMMERCIAL←price · FINANCIAL←financial · MARKET←market |
| 14 | C | REALIZED_POWER_PRICE | VOLUME, COST_OPS, COMMERCIAL_OPTIMIZATION | OPERATIONAL, FINANCIAL, MARKET, REGULATORY | VOLUME←expand · COST_OPS←energy · OPERATIONAL←capacity · FINANCIAL←financial · MARKET←markets · REGULATORY←regulation |
| 15 | C | EBITDA_MARGIN | COST_OPS | FINANCIAL | EBITDA_MARGIN←profitability · COST_OPS←efficiency · FINANCIAL←capital |
| 16 | C | EBITDA_MARGIN | PRICING, COST_PROCUREMENT, COST_OPS, COMMERCIAL_OPTIMIZATION | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · PRICING←pricing · COST_PROCUREMENT←purchase · COST_OPS←energy · COMMERCIAL←sales · OPERATIONAL←capacity · FINANCIAL←profitability · MARKET←market |
| 17 | C | REALIZED_POWER_PRICE | PRICING, MIX, COMMERCIAL_OPTIMIZATION | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET, POWER_MARKET_PRICES | PRICING←price · MIX←portfolio · COMMERCIAL←price · OPERATIONAL←operational · FINANCIAL←cost · MARKET←market |
| 18 | D | CARBON_INTENSITY | COST_OPS | OPERATIONAL, FINANCIAL, REGULATORY | COST_OPS←efficiency · OPERATIONAL←operations · FINANCIAL←cost · REGULATORY←compliance |
| 19 | D | — | COST_OPS | FINANCIAL, REGULATORY | COST_OPS←efficiency · FINANCIAL←cost · REGULATORY←regulatory |
| 20 | D | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←staff · OPERATIONAL←operations · REGULATORY←regulatory |
| 21 | D | — | COST_OPS, WC_DSO | OPERATIONAL, REGULATORY | COST_OPS←maintenance · WC_DSO←collection · OPERATIONAL←operational · REGULATORY←regulatory |
| 22 | D | CARBON_INTENSITY | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←energy · OPERATIONAL←operations · REGULATORY←regulatory |
| 23 | E | — | VOLUME, COST_OPS | OPERATIONAL, FINANCIAL | VOLUME←expanding · COST_OPS←energy · OPERATIONAL←capacity · FINANCIAL←costs |
| 24 | E | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←energy · OPERATIONAL←operational · REGULATORY←regulation |
| 25 | E | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←automatic · OPERATIONAL←operational · REGULATORY←regulation |
| 26 | E | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←efficiency · OPERATIONAL←operational · FINANCIAL←costs |
| 27 | E | — | VOLUME, COST_OPS | OPERATIONAL | VOLUME←expand · COST_OPS←staff · OPERATIONAL←operations |
| 28 | F | — | COST_OPS | OPERATIONAL, WEATHER_CLIMATE | COST_OPS←maintenance · OPERATIONAL←operations |
| 29 | F | EBITDA_MARGIN, FUEL_COST_PER_GJ, HEDGE_COVERAGE | PRICING, COST_PROCUREMENT, COST_OPS | COMMERCIAL, FINANCIAL, FUEL_PRICE | EBITDA_MARGIN←margins · PRICING←price · COST_PROCUREMENT←procurement · COST_OPS←energy · COMMERCIAL←price · FINANCIAL←financial |
| 30 | F | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←maintenance · OPERATIONAL←operational · REGULATORY←compliance |
| 31 | G | CAPACITY_GROWTH, RENEWABLE_SHARE | COST_OPS, RENEWABLE_BUILDOUT | OPERATIONAL, FINANCIAL, REGULATORY | COST_OPS←energy · OPERATIONAL←operational · FINANCIAL←financial · REGULATORY←regulatory |
| 32 | G | — | COST_OPS | OPERATIONAL, FINANCIAL, WEATHER_CLIMATE | COST_OPS←energy · OPERATIONAL←operational · FINANCIAL←cost |
| 33 | G | OPEX | VOLUME, COST_OPS, HEAT_RATE_IMPROVEMENT | OPERATIONAL, FINANCIAL | OPEX←operating costs · VOLUME←expand · COST_OPS←efficiency · OPERATIONAL←processes · FINANCIAL←costs |
| 34 | G | — | VOLUME, COST_OPS | OPERATIONAL | VOLUME←expand · COST_OPS←energy · OPERATIONAL←operational |
| 35 | H | — | COST_OPS | OPERATIONAL | COST_OPS←automated · OPERATIONAL←operational |
| 36 | H | CAPACITY_GROWTH | COST_OPS, RENEWABLE_BUILDOUT | OPERATIONAL, FINANCIAL | COST_OPS←efficient · OPERATIONAL←operational · FINANCIAL←cost |
| 37 | H | CAPACITY_GROWTH | COST_OPS, RENEWABLE_BUILDOUT | OPERATIONAL, FINANCIAL | COST_OPS←energy · OPERATIONAL←operational · FINANCIAL←financial |
| 38 | I | REVENUE_GROWTH | COST_OPS | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · COST_OPS←energy · OPERATIONAL←capacity · FINANCIAL←costs · MARKET←demand |
| 39 | I | REVENUE_GROWTH, RESERVE_MARGIN | COST_OPS | MARKET | REVENUE_GROWTH←demand · COST_OPS←energy · MARKET←demand |
| 40 | I | EBITDA_MARGIN, REVENUE_GROWTH, RESERVE_MARGIN | COST_OPS | OPERATIONAL, FINANCIAL, MARKET, REGULATORY | EBITDA_MARGIN←margin · REVENUE_GROWTH←demand · COST_OPS←energy · OPERATIONAL←capacity · FINANCIAL←margin · MARKET←demand · REGULATORY←compliance |
| 41 | I | REVENUE_GROWTH | PRICING, VOLUME, COST_OPS | MARKET | REVENUE_GROWTH←demand · PRICING←pricing · VOLUME←expand · COST_OPS←automated · MARKET←demand |
| 42 | J | CAPEX, OM_COST_PER_MWH | COST_OPS, CAPEX_DISCIPLINE, AVAILABILITY_IMPROVEMENT, OM_EFFICIENCY | OPERATIONAL, FINANCIAL | CAPEX←capital expenditure · COST_OPS←maintenance · CAPEX_DISCIPLINE←capex · OPERATIONAL←maintenance · FINANCIAL←capital |
| 43 | J | — | COST_OPS, WC_DIO, OM_EFFICIENCY, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL | COST_OPS←maintenance · WC_DIO←inventory · OPERATIONAL←maintenance · FINANCIAL←investments |
| 44 | J | — | CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL, REGULATORY | OPERATIONAL←operational · FINANCIAL←cost · REGULATORY←regulatory |
| 45 | J | CURTAILMENT_RATE | VOLUME, COST_OPS | FINANCIAL | VOLUME←distribution · COST_OPS←efficiency · FINANCIAL←cost |
| 46 | J | — | PRICING, COST_OPS | FINANCIAL, REGULATORY | PRICING←price · COST_OPS←energy · FINANCIAL←cost · REGULATORY←regulatory |
| 47 | J | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←efficient · OPERATIONAL←processes · REGULATORY←regulations |

Libellés des parties : A Operational Performance and Efficiency · B Fuel and Energy Resource Management · C Financial and Market Strategy · D Regulatory and Environmental Compliance · E Grid Integration and Reliability · F Risk Management and Resilience · G Renewable Energy and Sustainability · H Technological Innovation and Modernization · I Capacity Planning and Utilization · J Lifecycle and Asset Management.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
