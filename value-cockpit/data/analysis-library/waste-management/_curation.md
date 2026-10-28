# Curation waste-management — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `waste-management` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

50 analyses · 8 sans métrique ni levier (qualitatives) · 24 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | REMAINING_LANDFILL_LIFE, LANDFILL_CLOSURE_LIABILITY | COST_OPS | OPERATIONAL, FINANCIAL, REGULATORY, ENVIRONMENTAL_LIABILITY | COST_OPS←energy · OPERATIONAL←capacity · FINANCIAL←financial · REGULATORY←regulatory |
| 02 | A | — | COST_OPS, WC_DSO | REGULATORY, ENVIRONMENTAL_LIABILITY | COST_OPS←efficiency · WC_DSO←collection · REGULATORY←compliance |
| 03 | A | DISPOSAL_COST_PER_TON | DISPOSAL_INTERNALIZATION | OPERATIONAL, FINANCIAL | OPERATIONAL←processing · FINANCIAL←cost |
| 04 | A | TONS_COLLECTED_MT, VOLUME_GROWTH | — | OPERATIONAL, MARKET, REGULATORY | OPERATIONAL←capacity · MARKET←trend · REGULATORY←compliance |
| 05 | A | CAPEX | COST_OPS, CAPEX_DISCIPLINE | FINANCIAL, REGULATORY | COST_OPS←maintenance · FINANCIAL←financial · REGULATORY←regulatory |
| 06 | A | — | PRICING | OPERATIONAL, FINANCIAL | PRICING←price · OPERATIONAL←operations · FINANCIAL←financially |
| 07 | A | DSO | COST_OPS, WC_DSO, WASTE_TO_ENERGY | OPERATIONAL | DSO←collection · COST_OPS←maintenance · WC_DSO←collection · OPERATIONAL←operation |
| 08 | B | RECYCLING_RATE, MRF_RECOVERY_RATE | MIX, COST_PROCUREMENT, COST_OPS, RECYCLING_VALUE | OPERATIONAL | MIX←mix · COST_PROCUREMENT←suppliers · COST_OPS←staff · OPERATIONAL←operational |
| 09 | B | RECYCLING_RATE | PRICING, VOLUME, WC_DSO, RECYCLING_VALUE | — | PRICING←pricing · VOLUME←expand · WC_DSO←collection |
| 10 | B | COMMODITY_PRICE_PER_TON | PRICING, VOLUME, MIX, WC_DIO, RECYCLING_VALUE | COMMERCIAL, COMMODITY_PRICES | PRICING←price · VOLUME←expand · MIX←portfolio · WC_DIO←inventory · COMMERCIAL←price |
| 11 | B | COMMODITY_PRICE_PER_TON | PRICING, VOLUME, COST_PROCUREMENT | OPERATIONAL, FINANCIAL, COMMODITY_PRICES | PRICING←pricing · VOLUME←expand · COST_PROCUREMENT←purchases · OPERATIONAL←operational · FINANCIAL←financial |
| 12 | B | CAPEX | COST_OPS, DISPOSAL_INTERNALIZATION, CAPEX_DISCIPLINE | OPERATIONAL | COST_OPS←energy · OPERATIONAL←processing |
| 13 | B | RECYCLING_RATE, DIVERSION_RATE | — | FINANCIAL | FINANCIAL←costs |
| 14 | B | REVENUE_GROWTH, COMMODITY_PRICE_PER_TON | WC_DSO, RECYCLING_VALUE | OPERATIONAL, MARKET | REVENUE_GROWTH←demand · WC_DSO←collection · OPERATIONAL←operations · MARKET←market |
| 15 | C | — | VOLUME, MIX | OPERATIONAL, FINANCIAL, REGULATORY | VOLUME←new markets · MIX←mix · OPERATIONAL←operational · FINANCIAL←costs · REGULATORY←compliance |
| 16 | C | — | COST_PROCUREMENT, COST_OPS | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←vendors · COST_OPS←efficiency · OPERATIONAL←operational · FINANCIAL←cost |
| 17 | C | DIVERSION_RATE | VOLUME, COST_OPS | OPERATIONAL | VOLUME←retention · COST_OPS←efficiency · OPERATIONAL←operational |
| 18 | C | — | — | REGULATORY | REGULATORY←compliance |
| 19 | C | — | COST_OPS, WASTE_TO_ENERGY | OPERATIONAL, FINANCIAL | COST_OPS←energy · OPERATIONAL←production · FINANCIAL←financial |
| 20 | D | DISPOSAL_COST_PER_TON | VOLUME, COST_OPS, WC_DSO, WASTE_TO_ENERGY | OPERATIONAL | VOLUME←expand · COST_OPS←energy · WC_DSO←collection · OPERATIONAL←quality |
| 21 | D | DISPOSAL_COST_PER_TON | COST_OPS, WASTE_TO_ENERGY | OPERATIONAL, REGULATORY | COST_OPS←automatic · OPERATIONAL←operational · REGULATORY←compliance |
| 22 | D | — | COST_PROCUREMENT, COST_OPS | — | COST_PROCUREMENT←suppliers · COST_OPS←efficiency |
| 23 | D | — | COST_OPS | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | COST_OPS←efficiency · COMMERCIAL←prices · OPERATIONAL←processing · FINANCIAL←costs · MARKET←market |
| 24 | D | — | WC_DSO | FINANCIAL | WC_DSO←collection · FINANCIAL←cost |
| 25 | E | DSO, TONS_COLLECTED_MT, COLLECTION_COST_PER_TON, ROUTE_DENSITY | COST_OPS, ROUTE_OPTIMIZATION | OPERATIONAL, FINANCIAL | DSO←collection · COST_OPS←efficient · OPERATIONAL←operational · FINANCIAL←costs |
| 26 | E | DSO, COLLECTION_COST_PER_TON | WC_DSO, ROUTE_OPTIMIZATION, DISPOSAL_INTERNALIZATION | OPERATIONAL, FINANCIAL | DSO←collection · WC_DSO←collection · OPERATIONAL←processing · FINANCIAL←costs |
| 27 | E | DSO, COLLECTION_COST_PER_TON | COST_PROCUREMENT, COST_OPS, FLEET_CONVERSION | OPERATIONAL, FINANCIAL | DSO←collection · COST_PROCUREMENT←suppliers · COST_OPS←energy · OPERATIONAL←operational · FINANCIAL←costs |
| 28 | E | DSO, DIVERSION_RATE | VOLUME, WC_DSO | — | DSO←collection · VOLUME←expand · WC_DSO←collection |
| 29 | E | DSO, TONS_COLLECTED_MT | COST_OPS, WC_DSO, ROUTE_OPTIMIZATION | OPERATIONAL | DSO←collection · COST_OPS←efficient · WC_DSO←collections · OPERATIONAL←processes |
| 30 | F | — | — | FINANCIAL, REGULATORY | FINANCIAL←costs · REGULATORY←compliance |
| 31 | F | DSO | WC_DSO | OPERATIONAL, FINANCIAL | DSO←collection · WC_DSO←collection · OPERATIONAL←processing · FINANCIAL←cost |
| 32 | F | — | — | REGULATORY | REGULATORY←compliance |
| 33 | F | DSO | PRICING, VOLUME, COST_PROCUREMENT, WC_DSO | REGULATORY | DSO←collection · PRICING←discount · VOLUME←expand · COST_PROCUREMENT←suppliers · WC_DSO←collection · REGULATORY←regulatory |
| 34 | F | — | VOLUME, COST_OPS, WC_DSO | REGULATORY | VOLUME←expand · COST_OPS←staff · WC_DSO←collection · REGULATORY←compliance |
| 35 | G | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←staff · OPERATIONAL←operations · REGULATORY←regulatory |
| 36 | G | LANDFILL_CLOSURE_LIABILITY | — | OPERATIONAL, FINANCIAL, REGULATORY, ENVIRONMENTAL_LIABILITY | OPERATIONAL←operational · FINANCIAL←financial · REGULATORY←regulatory |
| 37 | G | — | VOLUME, COST_OPS, WC_DSO | REGULATORY | VOLUME←channels · COST_OPS←staff · WC_DSO←collection · REGULATORY←regulatory |
| 38 | G | RECYCLING_RATE | COST_OPS, WC_DSO | FINANCIAL | COST_OPS←efficiency · WC_DSO←collection · FINANCIAL←financial |
| 39 | G | — | VOLUME, COST_OPS | OPERATIONAL, REGULATORY, ENVIRONMENTAL_LIABILITY | VOLUME←channels · COST_OPS←staff · OPERATIONAL←operations · REGULATORY←regulatory |
| 40 | G | — | COST_OPS | REGULATORY | COST_OPS←maintenance · REGULATORY←regulatory |
| 41 | G | DSO, PRICE_PER_TON | COST_OPS, WC_DSO, PRICING_DISCIPLINE | OPERATIONAL, FINANCIAL, REGULATORY | DSO←collection · COST_OPS←efficiencies · WC_DSO←billing · OPERATIONAL←operations · FINANCIAL←cost · REGULATORY←compliance |
| 42 | H | EBITDA_MARGIN, PRICE_PER_TON, PRICE_GROWTH | PRICING, VOLUME, WC_DSO, PRICING_DISCIPLINE | COMMERCIAL, FINANCIAL, REGULATORY | EBITDA_MARGIN←profitability · PRICING←pricing · VOLUME←cross-selling · WC_DSO←collection · COMMERCIAL←pricing · FINANCIAL←profitability · REGULATORY←regulatory |
| 43 | H | EBITDA_MARGIN | PRICING, COST_OPS, PRICING_DISCIPLINE | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←pricing · COST_OPS←efficiency · OPERATIONAL←operational · FINANCIAL←profitability |
| 44 | H | EBITDA_MARGIN, VOLUME_GROWTH | TUCK_IN_ACQUISITIONS | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · COMMERCIAL←customer · OPERATIONAL←operational · FINANCIAL←profitability · MARKET←market |
| 45 | H | PRICE_PER_TON, PRICE_GROWTH | PRICING, PRICING_DISCIPLINE | COMMERCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · MARKET←industry |
| 46 | I | — | WC_DSO | OPERATIONAL | WC_DSO←collection · OPERATIONAL←operational |
| 47 | I | — | — | COMMERCIAL, REGULATORY | COMMERCIAL←brand · REGULATORY←regulatory |
| 48 | I | — | COST_PROCUREMENT | OPERATIONAL | COST_PROCUREMENT←procurement · OPERATIONAL←manufacturers |
| 49 | I | — | PRICING, COST_OPS | OPERATIONAL | PRICING←price · COST_OPS←energy · OPERATIONAL←operations |
| 50 | J | EBITDA_MARGIN, CAPEX | COST_PROCUREMENT, COST_OPS, RECYCLING_VALUE, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COST_PROCUREMENT←vendors · COST_OPS←automation · OPERATIONAL←processing · FINANCIAL←investment |

Libellés des parties : A Landfill Management & Operations · B Recycling & Materials Recovery · C Organics & Composting · D Waste-to-Energy & Thermal Treatment · E Fleet & Collection Optimization · F Hazardous & Specialized Waste Handling · G Regulatory Compliance & Environmental Impact · H Financial & Contractual Structuring · I Sustainability & ESG · J Technology & Innovation.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
