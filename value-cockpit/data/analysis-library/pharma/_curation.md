# Curation pharma — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `pharma` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

37 analyses · 10 sans métrique ni levier (qualitatives) · 30 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | — | VOLUME, COST_OPS | — | VOLUME←expand · COST_OPS←efficiency |
| 02 | A | — | VOLUME | OPERATIONAL, REGULATORY | VOLUME←retention · OPERATIONAL←process · REGULATORY←regulatory |
| 03 | A | — | COST_OPS | FINANCIAL | COST_OPS←automation · FINANCIAL←investments |
| 04 | A | — | — | REGULATORY | REGULATORY←regulatory |
| 05 | A | — | — | OPERATIONAL | OPERATIONAL←process |
| 06 | A | — | — | MARKET, REGULATORY | MARKET←market · REGULATORY←regulatory |
| 07 | A | — | — | OPERATIONAL | OPERATIONAL←process |
| 08 | A | — | VOLUME | FINANCIAL | VOLUME←expand · FINANCIAL←costs |
| 09 | A | — | — | MARKET, REGULATORY | MARKET←market · REGULATORY←fda |
| 10 | B | — | — | MARKET, REGULATORY | MARKET←market · REGULATORY←regulatory |
| 11 | B | — | — | OPERATIONAL, FINANCIAL, MARKET, REGULATORY | OPERATIONAL←operational · FINANCIAL←financial · MARKET←market · REGULATORY←regulatory |
| 12 | B | — | COST_PROCUREMENT, COST_OPS | OPERATIONAL, REGULATORY | COST_PROCUREMENT←supplier · COST_OPS←maintenance · OPERATIONAL←manufacturing · REGULATORY←compliance |
| 13 | B | — | — | COMMERCIAL, OPERATIONAL, ORGANIZATIONAL, MARKET, REGULATORY | COMMERCIAL←marketing · OPERATIONAL←manufacturing · ORGANIZATIONAL←organization · MARKET←market · REGULATORY←regulatory |
| 14 | B | — | PRICING | COMMERCIAL, FINANCIAL, MARKET, REGULATORY | PRICING←price · COMMERCIAL←price · FINANCIAL←cost · MARKET←market · REGULATORY←regulatory |
| 15 | B | — | — | COMMERCIAL, MARKET, REGULATORY | COMMERCIAL←marketing · MARKET←market · REGULATORY←fda |
| 16 | C | — | COST_PROCUREMENT | OPERATIONAL, FINANCIAL, REGULATORY | COST_PROCUREMENT←supplier · OPERATIONAL←supply chain · FINANCIAL←cost · REGULATORY←compliance |
| 17 | C | EBITDA_MARGIN, REVENUE_GROWTH | PRICING, VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←market share · PRICING←pricing · VOLUME←market share · COMMERCIAL←pricing · OPERATIONAL←manufacturers · FINANCIAL←cost · MARKET←competitive |
| 18 | C | — | VOLUME | FINANCIAL, REGULATORY | VOLUME←expand · FINANCIAL←cost · REGULATORY←compliance |
| 19 | C | — | WC_DSO | OPERATIONAL, FINANCIAL, MARKET, REGULATORY | WC_DSO←collection · OPERATIONAL←operational · FINANCIAL←financial · MARKET←market · REGULATORY←regulatory |
| 20 | C | — | VOLUME, WC_DSO | OPERATIONAL, REGULATORY | VOLUME←distribution · WC_DSO←collection · OPERATIONAL←operational · REGULATORY←regulatory |
| 21 | D | EBITDA_MARGIN, REVENUE_GROWTH | PRICING | COMMERCIAL, FINANCIAL, MARKET, REGULATORY | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←market · REGULATORY←regulatory |
| 22 | D | — | PRICING | COMMERCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · MARKET←market |
| 23 | D | — | VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL, REGULATORY | VOLUME←expand · COMMERCIAL←marketing · OPERATIONAL←process · FINANCIAL←cost · REGULATORY←regulatory |
| 24 | D | REVENUE_GROWTH | VOLUME | MARKET | REVENUE_GROWTH←growth · VOLUME←expand · MARKET←competitive |
| 25 | D | REVENUE_GROWTH | PRICING | COMMERCIAL, OPERATIONAL, MARKET, REGULATORY | REVENUE_GROWTH←market share · PRICING←pricing · COMMERCIAL←pricing · OPERATIONAL←manufacturing · MARKET←markets · REGULATORY←regulatory |
| 26 | D | — | PRICING, VOLUME | COMMERCIAL, MARKET, REGULATORY | PRICING←pricing · VOLUME←expand · COMMERCIAL←pricing · MARKET←market · REGULATORY←regulatory |
| 27 | D | — | PRICING, VOLUME | COMMERCIAL, MARKET, REGULATORY | PRICING←pricing · VOLUME←expand · COMMERCIAL←pricing · MARKET←markets · REGULATORY←regulation |
| 28 | D | REVENUE_GROWTH | — | COMMERCIAL | REVENUE_GROWTH←growth · COMMERCIAL←brand |
| 29 | E | REVENUE_GROWTH | — | FINANCIAL, MARKET, REGULATORY | REVENUE_GROWTH←new markets · FINANCIAL←costs · MARKET←markets · REGULATORY←licensing |
| 30 | E | — | VOLUME | FINANCIAL, MARKET, REGULATORY | VOLUME←expand · FINANCIAL←costs · MARKET←competitive · REGULATORY←licensing |
| 31 | E | EBITDA_MARGIN, REVENUE_GROWTH | VOLUME, MIX, COST_OPS | FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←market share · VOLUME←expand · MIX←portfolio · COST_OPS←efficiency · FINANCIAL←profitability · MARKET←market |
| 32 | F | REVENUE_GROWTH | — | COMMERCIAL, ORGANIZATIONAL, MARKET | REVENUE_GROWTH←growth · COMMERCIAL←sales · ORGANIZATIONAL←training · MARKET←competitive |
| 33 | F | — | VOLUME, COST_OPS | COMMERCIAL, FINANCIAL | VOLUME←expand · COST_OPS←efficiency · COMMERCIAL←channel · FINANCIAL←cost |
| 34 | G | — | MIX | MARKET | MIX←portfolio · MARKET←competitive |
| 35 | G | — | MIX | MARKET, REGULATORY | MIX←portfolio · MARKET←market · REGULATORY←regulatory |
| 36 | G | — | PRICING | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET, REGULATORY | PRICING←pricing · COMMERCIAL←pricing · OPERATIONAL←quality · FINANCIAL←costs · MARKET←market · REGULATORY←regulatory |
| 37 | G | — | — | MARKET, REGULATORY | MARKET←market · REGULATORY←regulatory |

Libellés des parties : A Research & Development · B Regulatory & Compliance · C Operations & Supply Chain · D Marketing & Market Access · E Licensing & Partnerships · F Sales & Commercialization · G Financial Analysis.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
