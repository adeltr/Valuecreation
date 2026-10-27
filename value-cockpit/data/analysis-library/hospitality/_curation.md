# Curation hospitality — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `hospitality` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

33 analyses · 0 sans métrique ni levier (qualitatives) · 1 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | REVENUE_GROWTH | PRICING, VOLUME | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · PRICING←pricing · VOLUME←distribution · COMMERCIAL←pricing · MARKET←demand |
| 02 | A | REVENUE_GROWTH | PRICING | MARKET | REVENUE_GROWTH←growth · PRICING←pricing · MARKET←trend |
| 03 | A | EBITDA_MARGIN | VOLUME, MIX | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · VOLUME←distribution · MIX←mix · COMMERCIAL←channel · FINANCIAL←costs |
| 04 | A | — | PRICING, MIX | — | PRICING←promotional · MIX←mix |
| 05 | A | EBITDA_MARGIN | PRICING | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←promotions · COMMERCIAL←promotions · FINANCIAL←profitability |
| 06 | A | DIO | PRICING | COMMERCIAL | DIO←inventory · PRICING←promotions · COMMERCIAL←pricing |
| 07 | A | — | PRICING | OPERATIONAL | PRICING←pricing · OPERATIONAL←process |
| 08 | A | — | MIX, COST_OPS | — | MIX←portfolio · COST_OPS←staff |
| 09 | A | EBITDA_MARGIN | PRICING, COST_PROCUREMENT | FINANCIAL | EBITDA_MARGIN←profitable · PRICING←pricing · COST_PROCUREMENT←supplier · FINANCIAL←cost |
| 10 | A | — | VOLUME, COST_OPS | FINANCIAL | VOLUME←expand · COST_OPS←staff · FINANCIAL←financial |
| 11 | A | — | PRICING, VOLUME | COMMERCIAL | PRICING←pricing · VOLUME←channels · COMMERCIAL←pricing |
| 12 | A | EBITDA_MARGIN | PRICING, VOLUME | FINANCIAL | EBITDA_MARGIN←profitability · PRICING←pricing · VOLUME←loyalty · FINANCIAL←profitability |
| 13 | A | REVENUE_GROWTH, DIO | — | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · COMMERCIAL←pricing · MARKET←demand |
| 14 | B | — | VOLUME, COST_OPS | COMMERCIAL | VOLUME←loyalty · COST_OPS←staff · COMMERCIAL←brand |
| 15 | B | — | VOLUME | COMMERCIAL | VOLUME←distribution · COMMERCIAL←pricing |
| 16 | C | — | PRICING, COST_OPS | — | PRICING←pricing · COST_OPS←staff |
| 17 | D | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←staff · OPERATIONAL←quality · FINANCIAL←costs |
| 18 | D | — | PRICING, COST_OPS | — | PRICING←pricing · COST_OPS←staff |
| 19 | D | EBITDA_MARGIN | COST_PROCUREMENT, COST_OPS, WC_DIO | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COST_PROCUREMENT←supplier · COST_OPS←labor · WC_DIO←inventory · OPERATIONAL←operational · FINANCIAL←profitability |
| 20 | D | — | COST_PROCUREMENT, COST_OPS | COMMERCIAL, FINANCIAL | COST_PROCUREMENT←supplier · COST_OPS←staff · COMMERCIAL←price · FINANCIAL←cost |
| 21 | D | EBITDA_MARGIN, DIO | PRICING, COST_PROCUREMENT, COST_OPS, WC_DIO | FINANCIAL | EBITDA_MARGIN←profitable · DIO←inventory · PRICING←discounts · COST_PROCUREMENT←supplier · COST_OPS←staff · WC_DIO←inventory · FINANCIAL←profitable |
| 22 | D | EBITDA_MARGIN | PRICING, VOLUME, COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←promotions · VOLUME←loyalty · COST_OPS←staffing · OPERATIONAL←quality · FINANCIAL←profitability |
| 23 | D | — | PRICING, COST_OPS | COMMERCIAL, FINANCIAL, MARKET | PRICING←promotions · COST_OPS←staff · COMMERCIAL←brand · FINANCIAL←financial · MARKET←market |
| 24 | E | — | PRICING | COMMERCIAL | PRICING←promotional · COMMERCIAL←marketing |
| 25 | E | REVENUE_GROWTH | PRICING, VOLUME, WC_DIO | COMMERCIAL, MARKET | REVENUE_GROWTH←market share · PRICING←pricing · VOLUME←loyalty · WC_DIO←inventory · COMMERCIAL←pricing · MARKET←competitors |
| 26 | F | EBITDA_MARGIN | VOLUME | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · VOLUME←loyalty · OPERATIONAL←operational · FINANCIAL←profitability |
| 27 | F | — | PRICING, COST_PROCUREMENT, COST_OPS, WC_DIO | FINANCIAL, MARKET | PRICING←price · COST_PROCUREMENT←purchasing · COST_OPS←labor · WC_DIO←inventory · FINANCIAL←financial · MARKET←industry |
| 28 | F | EBITDA_MARGIN | PRICING | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←pricing · COMMERCIAL←sales · FINANCIAL←profitability |
| 29 | G | — | PRICING, COST_OPS | COMMERCIAL | PRICING←pricing · COST_OPS←staff · COMMERCIAL←pricing |
| 30 | G | EBITDA_MARGIN, REVENUE_GROWTH | PRICING, COST_PROCUREMENT, COST_OPS | FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←market share · PRICING←pricing · COST_PROCUREMENT←supplier · COST_OPS←labor · FINANCIAL←profitability · MARKET←market |
| 31 | G | — | PRICING, VOLUME, COST_OPS | COMMERCIAL | PRICING←promotions · VOLUME←loyalty · COST_OPS←staffing · COMMERCIAL←pricing |
| 32 | G | EBITDA_MARGIN | PRICING | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitable · PRICING←promotions · OPERATIONAL←operational · FINANCIAL←financial |
| 33 | G | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←efficiency · OPERATIONAL←operational · FINANCIAL←costs |

Libellés des parties : A Revenue & Pricing Management · B Guest Experience · C Technology · D Operations & Hospitality Services · E Marketing & Competitive Positioning · F Ownership & Financial Structures · G Events & Alternative Offerings.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
