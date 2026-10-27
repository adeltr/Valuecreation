# Curation chemical — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `chemical` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

41 analyses · 8 sans métrique ni levier (qualitatives) · 13 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←downtime · OPERATIONAL←capacity · FINANCIAL←costs |
| 02 | A | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←energy · OPERATIONAL←production · FINANCIAL←cost |
| 03 | A | EBITDA_MARGIN, COGS | COST_PROCUREMENT, COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitable · COGS←production costs · COST_PROCUREMENT←raw material · COST_OPS←staff · OPERATIONAL←production · FINANCIAL←costs |
| 04 | A | COGS | — | OPERATIONAL, FINANCIAL | COGS←production costs · OPERATIONAL←production · FINANCIAL←costs |
| 05 | A | REVENUE_GROWTH, DIO | COST_OPS | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · COST_OPS←lean · OPERATIONAL←production · FINANCIAL←cost · MARKET←demand |
| 06 | A | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←maintenance · OPERATIONAL←maintenance · FINANCIAL←cost |
| 07 | A | — | — | OPERATIONAL, FINANCIAL, REGULATORY | OPERATIONAL←production · FINANCIAL←cost · REGULATORY←compliance |
| 08 | A | EBITDA_MARGIN, COGS | COST_PROCUREMENT, COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COGS←raw material · COST_PROCUREMENT←raw material · COST_OPS←energy · OPERATIONAL←production · FINANCIAL←costs |
| 09 | A | — | COST_OPS | OPERATIONAL | COST_OPS←maintenance · OPERATIONAL←process |
| 10 | A | EBITDA_MARGIN, COGS | COST_PROCUREMENT, COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COGS←raw material · COST_PROCUREMENT←raw material · COST_OPS←energy · OPERATIONAL←process · FINANCIAL←cost |
| 11 | B | REVENUE_GROWTH, DIO | COST_PROCUREMENT, WC_DSO, WC_DIO | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · COST_PROCUREMENT←supplier · WC_DSO←receivables · WC_DIO←inventory · OPERATIONAL←supply chain · FINANCIAL←capital · MARKET←market |
| 12 | B | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←production · FINANCIAL←capital |
| 13 | B | EBITDA_MARGIN, REVENUE_GROWTH | PRICING | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←margin · REVENUE_GROWTH←demand · PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←margin · MARKET←market |
| 14 | B | COGS | MIX, COST_PROCUREMENT | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | COGS←raw material · MIX←portfolio · COST_PROCUREMENT←supplier · COMMERCIAL←price · OPERATIONAL←production · FINANCIAL←costs · MARKET←market |
| 15 | B | EBITDA_MARGIN | — | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · OPERATIONAL←production · FINANCIAL←cost |
| 16 | C | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←energy · OPERATIONAL←production · REGULATORY←regulatory |
| 17 | C | — | COST_OPS | MARKET, REGULATORY | COST_OPS←efficiency · MARKET←markets · REGULATORY←regulatory |
| 18 | C | — | COST_OPS | OPERATIONAL, FINANCIAL, REGULATORY | COST_OPS←maintenance · OPERATIONAL←process · FINANCIAL←financial · REGULATORY←regulatory |
| 19 | C | — | — | FINANCIAL, REGULATORY | FINANCIAL←financial · REGULATORY←regulatory |
| 20 | C | — | — | FINANCIAL, REGULATORY | FINANCIAL←costs · REGULATORY←compliance |
| 21 | C | — | COST_PROCUREMENT | OPERATIONAL, MARKET, REGULATORY | COST_PROCUREMENT←supplier · OPERATIONAL←production · MARKET←market · REGULATORY←compliance |
| 22 | C | — | — | FINANCIAL, REGULATORY | FINANCIAL←cost · REGULATORY←regulatory |
| 23 | C | — | — | COMMERCIAL, REGULATORY | COMMERCIAL←customers · REGULATORY←certification |
| 24 | D | EBITDA_MARGIN, REVENUE_GROWTH | PRICING, MIX | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · PRICING←pricing · MIX←portfolio · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←market |
| 25 | D | REVENUE_GROWTH | VOLUME | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · VOLUME←new market · COMMERCIAL←customer · MARKET←market |
| 26 | D | — | VOLUME | MARKET | VOLUME←expand · MARKET←competitive |
| 27 | D | REVENUE_GROWTH | — | OPERATIONAL, MARKET, REGULATORY | REVENUE_GROWTH←expansion · OPERATIONAL←operations · MARKET←market · REGULATORY←regulatory |
| 28 | D | REVENUE_GROWTH | PRICING, VOLUME | MARKET | REVENUE_GROWTH←market share · PRICING←pricing · VOLUME←retention · MARKET←competitive |
| 29 | D | EBITDA_MARGIN | PRICING, VOLUME | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←pricing · VOLUME←expand · COMMERCIAL←customer · FINANCIAL←profitability |
| 30 | D | REVENUE_GROWTH | VOLUME | MARKET | REVENUE_GROWTH←market share · VOLUME←loyalty · MARKET←competitive |
| 31 | E | — | COST_OPS | OPERATIONAL, FINANCIAL, MARKET | COST_OPS←automation · OPERATIONAL←process · FINANCIAL←investments · MARKET←competitiveness |
| 32 | E | — | COST_OPS | OPERATIONAL, FINANCIAL, ORGANIZATIONAL, MARKET | COST_OPS←automation · OPERATIONAL←process · FINANCIAL←investments · ORGANIZATIONAL←workforce · MARKET←competitively |
| 33 | F | — | — | MARKET | MARKET←competitive |
| 34 | F | — | VOLUME, WC_DIO | COMMERCIAL, OPERATIONAL, MARKET | VOLUME←channels · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←process · MARKET←market |
| 35 | F | — | — | MARKET | MARKET←market |
| 36 | F | — | COST_PROCUREMENT | OPERATIONAL, FINANCIAL, MARKET, REGULATORY | COST_PROCUREMENT←supplier · OPERATIONAL←supply chain · FINANCIAL←cost · MARKET←market · REGULATORY←regulatory |
| 37 | G | — | COST_PROCUREMENT, WC_DIO | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←supplier · WC_DIO←inventory · OPERATIONAL←supply chain · FINANCIAL←costs |
| 38 | G | — | COST_PROCUREMENT | OPERATIONAL | COST_PROCUREMENT←supplier · OPERATIONAL←supply chain |
| 39 | G | COGS | — | OPERATIONAL, FINANCIAL, MARKET | COGS←raw materials · OPERATIONAL←logistics · FINANCIAL←costs · MARKET←markets |
| 40 | G | — | COST_PROCUREMENT | COMMERCIAL, OPERATIONAL | COST_PROCUREMENT←suppliers · COMMERCIAL←customer · OPERATIONAL←quality |
| 41 | G | REVENUE_GROWTH | COST_OPS | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · COST_OPS←efficiency · OPERATIONAL←quality · FINANCIAL←costs · MARKET←competitive |

Libellés des parties : A Production & Process Optimization · B Finance · C Regulatory & Compliance · D Sales & Marketing · E Technology · F Research & Development (R&D) · G Supply Chain.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
