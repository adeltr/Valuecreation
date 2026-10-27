# Curation pharma — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `pharma` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

37 analyses · 10 sans métrique ni levier (qualitatives) · 30 à contenu réglementaire.

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | — | VOLUME, COST_OPS | — | VOLUME←expand · COST_OPS←efficiency |
| 02 | A | — | VOLUME | OPERATIONAL | VOLUME←retention · OPERATIONAL←process |
| 03 | A | — | COST_OPS | FINANCIAL | COST_OPS←automation · FINANCIAL←investments |
| 04 | A | — | — | — |  |
| 05 | A | — | — | OPERATIONAL | OPERATIONAL←process |
| 06 | A | — | — | MARKET | MARKET←market |
| 07 | A | — | — | OPERATIONAL | OPERATIONAL←process |
| 08 | A | — | VOLUME | FINANCIAL | VOLUME←expand · FINANCIAL←costs |
| 09 | A | — | — | MARKET | MARKET←market |
| 10 | B | — | — | MARKET | MARKET←market |
| 11 | B | — | — | OPERATIONAL, FINANCIAL, MARKET | OPERATIONAL←operational · FINANCIAL←financial · MARKET←market |
| 12 | B | — | COST_PROCUREMENT, COST_OPS | OPERATIONAL | COST_PROCUREMENT←supplier · COST_OPS←maintenance · OPERATIONAL←manufacturing |
| 13 | B | — | — | COMMERCIAL, OPERATIONAL, ORGANIZATIONAL, MARKET | COMMERCIAL←marketing · OPERATIONAL←manufacturing · ORGANIZATIONAL←organization · MARKET←market |
| 14 | B | — | PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←price · COMMERCIAL←price · FINANCIAL←cost · MARKET←market |
| 15 | B | — | — | COMMERCIAL, MARKET | COMMERCIAL←marketing · MARKET←market |
| 16 | C | — | COST_PROCUREMENT | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←supplier · OPERATIONAL←supply chain · FINANCIAL←cost |
| 17 | C | EBITDA_MARGIN, REVENUE_GROWTH | PRICING, VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←market share · PRICING←pricing · VOLUME←market share · COMMERCIAL←pricing · OPERATIONAL←manufacturers · FINANCIAL←cost · MARKET←competitive |
| 18 | C | — | VOLUME | FINANCIAL | VOLUME←expand · FINANCIAL←cost |
| 19 | C | — | WC_DSO | OPERATIONAL, FINANCIAL, MARKET | WC_DSO←collection · OPERATIONAL←operational · FINANCIAL←financial · MARKET←market |
| 20 | C | — | VOLUME, WC_DSO | OPERATIONAL | VOLUME←distribution · WC_DSO←collection · OPERATIONAL←operational |
| 21 | D | EBITDA_MARGIN, REVENUE_GROWTH | PRICING | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←market |
| 22 | D | — | PRICING | COMMERCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · MARKET←market |
| 23 | D | — | VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL | VOLUME←expand · COMMERCIAL←marketing · OPERATIONAL←process · FINANCIAL←cost |
| 24 | D | REVENUE_GROWTH | VOLUME | MARKET | REVENUE_GROWTH←growth · VOLUME←expand · MARKET←competitive |
| 25 | D | REVENUE_GROWTH | PRICING | COMMERCIAL, OPERATIONAL, MARKET | REVENUE_GROWTH←market share · PRICING←pricing · COMMERCIAL←pricing · OPERATIONAL←manufacturing · MARKET←markets |
| 26 | D | — | PRICING, VOLUME | COMMERCIAL, MARKET | PRICING←pricing · VOLUME←expand · COMMERCIAL←pricing · MARKET←market |
| 27 | D | — | PRICING, VOLUME | COMMERCIAL, MARKET | PRICING←pricing · VOLUME←expand · COMMERCIAL←pricing · MARKET←markets |
| 28 | D | REVENUE_GROWTH | — | COMMERCIAL | REVENUE_GROWTH←growth · COMMERCIAL←brand |
| 29 | E | REVENUE_GROWTH | — | FINANCIAL, MARKET | REVENUE_GROWTH←new markets · FINANCIAL←costs · MARKET←markets |
| 30 | E | — | VOLUME | FINANCIAL, MARKET | VOLUME←expand · FINANCIAL←costs · MARKET←competitive |
| 31 | E | EBITDA_MARGIN, REVENUE_GROWTH | VOLUME, MIX, COST_OPS | FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←market share · VOLUME←expand · MIX←portfolio · COST_OPS←efficiency · FINANCIAL←profitability · MARKET←market |
| 32 | F | REVENUE_GROWTH | — | COMMERCIAL, ORGANIZATIONAL, MARKET | REVENUE_GROWTH←growth · COMMERCIAL←sales · ORGANIZATIONAL←training · MARKET←competitive |
| 33 | F | — | VOLUME, COST_OPS | COMMERCIAL, FINANCIAL | VOLUME←expand · COST_OPS←efficiency · COMMERCIAL←channel · FINANCIAL←cost |
| 34 | G | — | MIX | MARKET | MIX←portfolio · MARKET←competitive |
| 35 | G | — | MIX | MARKET | MIX←portfolio · MARKET←market |
| 36 | G | — | PRICING | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · OPERATIONAL←quality · FINANCIAL←costs · MARKET←market |
| 37 | G | — | — | MARKET | MARKET←market |

Libellés des parties : A Research & Development · B Regulatory & Compliance · C Operations & Supply Chain · D Marketing & Market Access · E Licensing & Partnerships · F Sales & Commercialization · G Financial Analysis.

## Hors vocabulaire

Analyses réglementaires / conformité (02, 04, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37) : aucune cause de base ne les exprime. Candidat : remonter `REGULATORY` (déjà utilisé par aero et airline) dans la base.

## Tes arbitrages attendus

1. Corrige les lignes du mapping qui ne te conviennent pas (le reste sera appliqué tel quel).
2. `REGULATORY` dans la base : oui / non ?
