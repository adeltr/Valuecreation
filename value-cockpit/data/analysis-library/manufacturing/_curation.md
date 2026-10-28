# Curation manufacturing — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `manufacturing` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

47 analyses · 2 sans métrique ni levier (qualitatives) · 6 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | PLANT_UTILIZATION | COST_OPS, CAPACITY_DEBOTTLENECKING | OPERATIONAL | COST_OPS←efficiency · OPERATIONAL←capacity |
| 02 | A | CONVERSION_COST_RATE, OEE | LEAN_OEE | OPERATIONAL | OPERATIONAL←operational |
| 03 | A | COGS | COST_PROCUREMENT, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | COGS←raw materials · COST_PROCUREMENT←supplier · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←supply chain · FINANCIAL←cost |
| 04 | A | MANUFACTURING_LEAD_TIME | COST_PROCUREMENT, COST_OPS | OPERATIONAL | COST_PROCUREMENT←supplier · COST_OPS←lean · OPERATIONAL←production |
| 05 | A | CONVERSION_COST_RATE | COST_OPS, LEAN_OEE | OPERATIONAL, FINANCIAL | COST_OPS←scrap · OPERATIONAL←manufacturing · FINANCIAL←costs |
| 06 | A | DIO | MIX, COST_PROCUREMENT, WC_DIO | COMMERCIAL | DIO←inventory · MIX←mix · COST_PROCUREMENT←supplier · WC_DIO←inventory · COMMERCIAL←sales |
| 07 | A | SCRAP_RATE, FIRST_PASS_YIELD | COST_PROCUREMENT, COST_OPS, QUALITY_YIELD | COMMERCIAL, OPERATIONAL | COST_PROCUREMENT←supplier · COST_OPS←maintenance · COMMERCIAL←customer · OPERATIONAL←quality |
| 08 | A | REVENUE_GROWTH, PLANT_UTILIZATION, VOLUME_GROWTH | CAPACITY_DEBOTTLENECKING | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←expansion · OPERATIONAL←capacity · FINANCIAL←investments · MARKET←demand |
| 09 | A | MAINTENANCE_COST_RATE, MACHINE_DOWNTIME_RATE | COST_OPS, PREDICTIVE_MAINTENANCE | OPERATIONAL, FINANCIAL | COST_OPS←maintenance · OPERATIONAL←maintenance · FINANCIAL←costs |
| 10 | A | CONVERSION_COST_RATE | COST_OPS, WC_DIO, LEAN_OEE | OPERATIONAL, FINANCIAL | COST_OPS←lean · WC_DIO←inventory · OPERATIONAL←process · FINANCIAL←cost |
| 11 | A | OEE | COST_OPS, LEAN_OEE | OPERATIONAL | COST_OPS←downtime · OPERATIONAL←manufacturing |
| 12 | A | REVENUE_GROWTH, DIO, VOLUME_GROWTH | — | COMMERCIAL, OPERATIONAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · COMMERCIAL←customer · OPERATIONAL←production · MARKET←demand |
| 13 | A | — | LEAN_OEE | OPERATIONAL, FINANCIAL | OPERATIONAL←process · FINANCIAL←costs |
| 14 | A | DIO | WC_DIO | OPERATIONAL, FINANCIAL | DIO←inventory · OPERATIONAL←production · FINANCIAL←costs |
| 15 | A | — | COST_OPS, WC_DIO | OPERATIONAL, FINANCIAL | COST_OPS←automated · WC_DIO←inventory · OPERATIONAL←logistics · FINANCIAL←cost |
| 16 | A | DIO | COST_OPS, WC_DIO | OPERATIONAL, FINANCIAL, ORGANIZATIONAL | DIO←inventory · COST_OPS←lean · WC_DIO←inventory · OPERATIONAL←operations · FINANCIAL←cost · ORGANIZATIONAL←organization |
| 17 | A | REVENUE_GROWTH, DIO, PLANT_UTILIZATION, VOLUME_GROWTH | COST_PROCUREMENT, COST_OPS, CAPACITY_DEBOTTLENECKING | OPERATIONAL, MARKET | REVENUE_GROWTH←demand · DIO←stockouts · COST_PROCUREMENT←suppliers · COST_OPS←labor · OPERATIONAL←capacity · MARKET←demand |
| 18 | B | EBITDA_MARGIN, COGS, MATERIAL_COST_RATE | PRICING, COST_PROCUREMENT, COST_OPS, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COGS←raw materials · PRICING←pricing · COST_PROCUREMENT←sourcing · COST_OPS←scrap · WC_DIO←inventory · COMMERCIAL←pricing · OPERATIONAL←processes · FINANCIAL←cost |
| 19 | B | SUPPLIER_ON_TIME_DELIVERY | COST_PROCUREMENT | OPERATIONAL, FINANCIAL, SUPPLIER_RISK | COST_PROCUREMENT←supplier · OPERATIONAL←supply chain · FINANCIAL←financial |
| 20 | B | FIRST_PASS_YIELD, SUPPLIER_ON_TIME_DELIVERY | COST_PROCUREMENT, QUALITY_YIELD | COMMERCIAL, OPERATIONAL, REGULATORY | COST_PROCUREMENT←supplier · COMMERCIAL←customer · OPERATIONAL←quality · REGULATORY←regulatory |
| 21 | B | COGS, MATERIAL_COST_RATE, SUPPLIER_ON_TIME_DELIVERY | COST_PROCUREMENT, COST_OPS, WC_DIO | OPERATIONAL, FINANCIAL, SUPPLIER_RISK | COGS←raw material · COST_PROCUREMENT←supplier · COST_OPS←automate · WC_DIO←inventory · OPERATIONAL←process · FINANCIAL←cost |
| 22 | B | DIO | VOLUME, MIX, COST_PROCUREMENT, COST_OPS, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | DIO←inventory · VOLUME←expand · MIX←product line · COST_PROCUREMENT←vendor · COST_OPS←efficiency · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←supply chain · FINANCIAL←costs |
| 23 | B | — | COST_PROCUREMENT, COST_OPS | OPERATIONAL, FINANCIAL, MARKET, SUPPLIER_RISK | COST_PROCUREMENT←vendors · COST_OPS←efficiency · OPERATIONAL←production · FINANCIAL←cost · MARKET←competitiveness |
| 24 | C | — | COST_OPS, AUTOMATION | OPERATIONAL, FINANCIAL | COST_OPS←automation · OPERATIONAL←operations · FINANCIAL←costs |
| 25 | C | — | VOLUME, COST_OPS, AUTOMATION | OPERATIONAL, FINANCIAL, MARKET | VOLUME←expand · COST_OPS←automation · OPERATIONAL←manufacturing · FINANCIAL←costs · MARKET←competitive |
| 26 | C | — | COST_OPS, AUTOMATION | OPERATIONAL, FINANCIAL | COST_OPS←automate · OPERATIONAL←production · FINANCIAL←costs |
| 27 | C | MAINTENANCE_COST_RATE, MACHINE_DOWNTIME_RATE | COST_OPS, WC_DIO, PREDICTIVE_MAINTENANCE | OPERATIONAL | COST_OPS←maintenance · WC_DIO←inventory · OPERATIONAL←manufacturers |
| 28 | C | DIO, MAINTENANCE_COST_RATE | COST_PROCUREMENT, COST_OPS, WC_DIO, PREDICTIVE_MAINTENANCE | OPERATIONAL, FINANCIAL | DIO←inventory · COST_PROCUREMENT←suppliers · COST_OPS←maintenance · WC_DIO←inventory · OPERATIONAL←maintenance · FINANCIAL←costs |
| 29 | C | EBITDA_MARGIN, DIO, CONVERSION_COST_RATE, MANUFACTURING_LEAD_TIME | COST_OPS, LEAN_OEE | COMMERCIAL, OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · DIO←inventory · COST_OPS←automate · COMMERCIAL←customer · OPERATIONAL←manufacturing · FINANCIAL←profitability |
| 30 | C | — | COST_OPS | OPERATIONAL, FINANCIAL, ENERGY_PRICES | COST_OPS←energy · OPERATIONAL←manufacturing · FINANCIAL←costs |
| 31 | D | CAPEX | COST_OPS, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL | CAPEX←capital expenditure · COST_OPS←maintenance · CAPEX_DISCIPLINE←capex · OPERATIONAL←operational · FINANCIAL←capital |
| 32 | D | EBITDA_MARGIN, COGS, CONVERSION_COST_RATE, MATERIAL_COST_RATE | PRICING, COST_PROCUREMENT, COST_OPS, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | EBITDA_MARGIN←margins · COGS←cost of goods · PRICING←pricing · COST_PROCUREMENT←supplier · COST_OPS←lean · WC_DIO←inventory · COMMERCIAL←pricing · OPERATIONAL←production · FINANCIAL←cost |
| 33 | D | CAPEX | COST_OPS, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL, ORGANIZATIONAL | COST_OPS←maintenance · OPERATIONAL←operational · FINANCIAL←costs · ORGANIZATIONAL←organizations |
| 34 | D | EBITDA_MARGIN, CAPEX | COST_OPS, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COST_OPS←efficient · CAPEX_DISCIPLINE←asset utilization · OPERATIONAL←manufacturing · FINANCIAL←capital |
| 35 | D | EBITDA_MARGIN, REVENUE_GROWTH, DIO, DSO, DPO | COST_PROCUREMENT, COST_OPS, WC_DSO, WC_DIO, WC_DPO | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · DIO←inventory · DSO←receivable · DPO←payable · COST_PROCUREMENT←supplier · COST_OPS←automated · WC_DSO←receivable · WC_DIO←inventory · WC_DPO←payment terms · COMMERCIAL←customer · OPERATIONAL←manufacturing · FINANCIAL←capital · MARKET←demand |
| 36 | E | — | VOLUME, MIX, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | VOLUME←expand · MIX←product lines · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←production · FINANCIAL←cost |
| 37 | E | MANUFACTURING_LEAD_TIME | COST_OPS | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | COST_OPS←efficiency · COMMERCIAL←customer · OPERATIONAL←process · FINANCIAL←costs · MARKET←market |
| 38 | E | EBITDA_MARGIN, REVENUE_GROWTH | COST_OPS, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · COST_OPS←efficiency · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←manufacturing · FINANCIAL←cost · MARKET←demand |
| 39 | E | EBITDA_MARGIN, COGS, SCRAP_RATE, FIRST_PASS_YIELD | COST_OPS, QUALITY_YIELD | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COGS←raw materials · COST_OPS←scrap · OPERATIONAL←production · FINANCIAL←costs |
| 40 | E | REVENUE_GROWTH, DIO | WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←production · FINANCIAL←costs · MARKET←market |
| 41 | F | EBITDA_MARGIN | COST_PROCUREMENT, COST_OPS | COMMERCIAL, OPERATIONAL, FINANCIAL, REGULATORY | EBITDA_MARGIN←profitability · COST_PROCUREMENT←suppliers · COST_OPS←energy · COMMERCIAL←customer · OPERATIONAL←operations · FINANCIAL←profitability · REGULATORY←regulatory |
| 42 | F | — | COST_OPS | OPERATIONAL, FINANCIAL, REGULATORY, ENERGY_PRICES | COST_OPS←energy · OPERATIONAL←production · FINANCIAL←costs · REGULATORY←compliance |
| 43 | F | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←energy · OPERATIONAL←operational · REGULATORY←compliance |
| 44 | F | — | COST_OPS | OPERATIONAL | COST_OPS←staff · OPERATIONAL←logistics |
| 45 | G | DIO | COST_PROCUREMENT, COST_OPS, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | DIO←inventory · COST_PROCUREMENT←supplier · COST_OPS←maintenance · WC_DIO←inventory · COMMERCIAL←customers · OPERATIONAL←logistics · FINANCIAL←cost |
| 46 | G | REVENUE_GROWTH, PLANT_UTILIZATION | WC_DIO, CAPACITY_DEBOTTLENECKING | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · WC_DIO←inventory · OPERATIONAL←manufacturing · FINANCIAL←costs · MARKET←demand |
| 47 | G | — | COST_OPS | OPERATIONAL, ORGANIZATIONAL, MARKET, REGULATORY | COST_OPS←maintenance · OPERATIONAL←operations · ORGANIZATIONAL←employee · MARKET←industry · REGULATORY←compliance |

Libellés des parties : A Operations · B Supply Chain and Procurement · C Technology and Automation · D Finance and Asset Management · E Product and Process Development · F Environmental and Sustainability · G Logistics and Aftermarket Services.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
