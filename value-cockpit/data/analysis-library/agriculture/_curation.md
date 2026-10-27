# Curation agriculture — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `agriculture` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

39 analyses · 5 sans métrique ni levier (qualitatives) · 14 à contenu réglementaire.

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | EBITDA_MARGIN | COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COST_OPS←efficiency · OPERATIONAL←production · FINANCIAL←profitability |
| 02 | A | — | — | OPERATIONAL | OPERATIONAL←production |
| 03 | A | — | COST_OPS | OPERATIONAL | COST_OPS←staff · OPERATIONAL←production |
| 04 | A | EBITDA_MARGIN | — | FINANCIAL | EBITDA_MARGIN←profitability · FINANCIAL←profitability |
| 05 | A | — | COST_OPS | FINANCIAL | COST_OPS←staff · FINANCIAL←costs |
| 06 | A | — | — | — |  |
| 07 | A | — | — | — |  |
| 08 | A | — | — | — |  |
| 09 | A | — | COST_OPS | OPERATIONAL | COST_OPS←efficient · OPERATIONAL←operations |
| 10 | A | REVENUE_GROWTH | VOLUME, COST_OPS | OPERATIONAL | REVENUE_GROWTH←growth · VOLUME←retention · COST_OPS←staff · OPERATIONAL←quality |
| 11 | A | — | COST_PROCUREMENT, COST_OPS | FINANCIAL | COST_PROCUREMENT←suppliers · COST_OPS←staff · FINANCIAL←cost |
| 12 | B | — | COST_OPS | OPERATIONAL | COST_OPS←productivity · OPERATIONAL←operations |
| 13 | B | — | COST_OPS | — | COST_OPS←efficiency |
| 14 | B | — | COST_PROCUREMENT, COST_OPS | FINANCIAL | COST_PROCUREMENT←sourcing · COST_OPS←productivity · FINANCIAL←cost |
| 15 | B | EBITDA_MARGIN | COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · COST_OPS←productivity · OPERATIONAL←operations · FINANCIAL←profitability |
| 16 | B | EBITDA_MARGIN, REVENUE_GROWTH | COST_OPS | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · REVENUE_GROWTH←expansion · COST_OPS←efficient · OPERATIONAL←operational · FINANCIAL←profitability |
| 17 | B | — | VOLUME, COST_OPS | OPERATIONAL | VOLUME←distribution · COST_OPS←efficiency · OPERATIONAL←operations |
| 18 | B | — | COST_OPS | OPERATIONAL | COST_OPS←staff · OPERATIONAL←operations |
| 19 | B | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←efficiency · OPERATIONAL←quality · FINANCIAL←costs |
| 20 | C | — | VOLUME, COST_OPS | — | VOLUME←distribution · COST_OPS←staff |
| 21 | C | — | VOLUME | — | VOLUME←retention |
| 22 | C | — | COST_OPS | — | COST_OPS←energy |
| 23 | C | — | VOLUME | MARKET | VOLUME←expand · MARKET←markets |
| 24 | C | — | VOLUME | OPERATIONAL | VOLUME←expand · OPERATIONAL←quality |
| 25 | D | — | COST_PROCUREMENT | FINANCIAL | COST_PROCUREMENT←vendors · FINANCIAL←investment |
| 26 | D | — | MIX | — | MIX←portfolio |
| 27 | D | — | MIX | FINANCIAL | MIX←portfolio · FINANCIAL←investment |
| 28 | D | — | COST_OPS | FINANCIAL | COST_OPS←maintenance · FINANCIAL←investment |
| 29 | D | — | PRICING, VOLUME, COST_OPS | OPERATIONAL | PRICING←prices · VOLUME←channels · COST_OPS←energy · OPERATIONAL←production |
| 30 | E | — | COST_OPS, WC_DIO | OPERATIONAL, FINANCIAL, MARKET | COST_OPS←staff · WC_DIO←inventory · OPERATIONAL←supply chain · FINANCIAL←cost · MARKET←market |
| 31 | E | EBITDA_MARGIN, REVENUE_GROWTH | VOLUME, COST_PROCUREMENT, COST_OPS | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←demand · VOLUME←channels · COST_PROCUREMENT←purchase · COST_OPS←staff · COMMERCIAL←pricing · OPERATIONAL←production · FINANCIAL←profitability · MARKET←market |
| 32 | E | — | COST_OPS | COMMERCIAL, OPERATIONAL | COST_OPS←staff · COMMERCIAL←consumers · OPERATIONAL←supply chain |
| 33 | E | EBITDA_MARGIN | PRICING, WC_DSO | OPERATIONAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←pricing · WC_DSO←collection · OPERATIONAL←quality · FINANCIAL←profitability |
| 34 | E | — | VOLUME, COST_PROCUREMENT, COST_OPS | COMMERCIAL, MARKET | VOLUME←channels · COST_PROCUREMENT←sourcing · COST_OPS←labor · COMMERCIAL←brand · MARKET←market |
| 35 | E | — | VOLUME, COST_OPS | COMMERCIAL, FINANCIAL | VOLUME←channels · COST_OPS←staff · COMMERCIAL←consumer · FINANCIAL←financially |
| 36 | F | — | COST_OPS | FINANCIAL | COST_OPS←efficiently · FINANCIAL←financial |
| 37 | F | — | — | COMMERCIAL | COMMERCIAL←price |
| 38 | F | — | PRICING, COST_PROCUREMENT | COMMERCIAL, MARKET | PRICING←pricing · COST_PROCUREMENT←suppliers · COMMERCIAL←consumer · MARKET←market |
| 39 | F | — | VOLUME | — | VOLUME←expand |

Libellés des parties : A Crop Management & Soil Health · B Livestock Management & Animal Health · C Environmental Sustainability & Resource · D Technology & Innovation in Agriculture · E Market Positioning & Value Chain · F Regulatory Compliance & Risk Management.

## Hors vocabulaire

Analyses réglementaires / conformité (05, 11, 13, 16, 18, 24, 26, 31, 32, 34, 35, 36, 38, 39) : aucune cause de base ne les exprime. Candidat : remonter `REGULATORY` (déjà utilisé par aero et airline) dans la base.

## Tes arbitrages attendus

1. Corrige les lignes du mapping qui ne te conviennent pas (le reste sera appliqué tel quel).
2. `REGULATORY` dans la base : oui / non ?
