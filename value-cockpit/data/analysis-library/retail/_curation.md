# Curation retail — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `retail` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

35 analyses · 5 sans métrique ni levier (qualitatives) · 2 à contenu réglementaire.

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | REVENUE_GROWTH | PRICING, WC_DIO | COMMERCIAL | REVENUE_GROWTH←growth · PRICING←promotional · WC_DIO←inventory · COMMERCIAL←sales |
| 02 | A | — | PRICING, MIX | COMMERCIAL, OPERATIONAL | PRICING←promotions · MIX←assortment · COMMERCIAL←customers · OPERATIONAL←operational |
| 03 | A | — | — | COMMERCIAL, OPERATIONAL | COMMERCIAL←customer · OPERATIONAL←quality |
| 04 | A | — | MIX | COMMERCIAL, OPERATIONAL, MARKET | MIX←assortment · COMMERCIAL←sales · OPERATIONAL←operational · MARKET←competition |
| 05 | A | REVENUE_GROWTH, DIO | PRICING, MIX, WC_DIO | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · PRICING←promotions · MIX←assortment · WC_DIO←inventory · COMMERCIAL←sales · MARKET←demand |
| 06 | A | — | VOLUME, WC_DIO | COMMERCIAL | VOLUME←channel · WC_DIO←inventory · COMMERCIAL←sales |
| 07 | A | — | COST_PROCUREMENT | COMMERCIAL | COST_PROCUREMENT←purchase · COMMERCIAL←customer |
| 08 | A | — | PRICING, VOLUME | COMMERCIAL | PRICING←promotions · VOLUME←cross-selling · COMMERCIAL←sales |
| 09 | A | — | PRICING | COMMERCIAL | PRICING←promotions · COMMERCIAL←sales |
| 10 | B | DIO | WC_DIO | — | DIO←inventory · WC_DIO←inventory |
| 11 | B | REVENUE_GROWTH, DIO | PRICING, COST_PROCUREMENT, WC_DIO | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · PRICING←promotions · COST_PROCUREMENT←supplier · WC_DIO←inventory · COMMERCIAL←customer · MARKET←demand |
| 12 | B | — | COST_OPS, WC_DIO | COMMERCIAL, OPERATIONAL, FINANCIAL | COST_OPS←labor · WC_DIO←inventory · COMMERCIAL←customer · OPERATIONAL←processes · FINANCIAL←cost |
| 13 | B | EBITDA_MARGIN, REVENUE_GROWTH, DIO | PRICING | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←margin · REVENUE_GROWTH←demand · DIO←stockouts · PRICING←promotional · COMMERCIAL←sales · FINANCIAL←margin · MARKET←demand |
| 14 | B | — | VOLUME, WC_DIO | COMMERCIAL, OPERATIONAL | VOLUME←expand · WC_DIO←inventory · COMMERCIAL←sales · OPERATIONAL←operational |
| 15 | B | — | COST_OPS, WC_DIO | FINANCIAL | COST_OPS←productivity · WC_DIO←inventory · FINANCIAL←cost |
| 16 | B | — | COST_OPS | COMMERCIAL, FINANCIAL | COST_OPS←automate · COMMERCIAL←customer · FINANCIAL←costs |
| 17 | B | — | — | OPERATIONAL | OPERATIONAL←operational |
| 18 | B | REVENUE_GROWTH | VOLUME | COMMERCIAL | REVENUE_GROWTH←expansion · VOLUME←retention · COMMERCIAL←sales |
| 19 | B | — | COST_PROCUREMENT | OPERATIONAL | COST_PROCUREMENT←sourcing · OPERATIONAL←operations |
| 20 | C | REVENUE_GROWTH | PRICING | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · PRICING←discount · COMMERCIAL←pricing · MARKET←demand |
| 21 | C | — | PRICING, VOLUME | COMMERCIAL, FINANCIAL | PRICING←promotions · VOLUME←cross-selling · COMMERCIAL←marketing · FINANCIAL←investment |
| 22 | C | — | VOLUME | COMMERCIAL, FINANCIAL | VOLUME←loyalty · COMMERCIAL←customers · FINANCIAL←investment |
| 23 | C | — | MIX | COMMERCIAL | MIX←assortment · COMMERCIAL←customer |
| 24 | C | — | — | COMMERCIAL | COMMERCIAL←consumer |
| 25 | C | REVENUE_GROWTH | — | COMMERCIAL | REVENUE_GROWTH←customer acquisition · COMMERCIAL←sales |
| 26 | D | EBITDA_MARGIN | PRICING, VOLUME, MIX, COST_PROCUREMENT, WC_DIO | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←margin · PRICING←pricing · VOLUME←cross-selling · MIX←assortment · COST_PROCUREMENT←vendor · WC_DIO←inventory · COMMERCIAL←pricing · FINANCIAL←margin |
| 27 | D | — | COST_PROCUREMENT | COMMERCIAL | COST_PROCUREMENT←supplier · COMMERCIAL←pricing |
| 28 | D | — | — | COMMERCIAL | COMMERCIAL←sales |
| 29 | D | REVENUE_GROWTH, DIO | MIX, COST_PROCUREMENT, WC_DIO | COMMERCIAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · MIX←assortment · COST_PROCUREMENT←suppliers · WC_DIO←inventory · COMMERCIAL←customer · FINANCIAL←costs · MARKET←demand |
| 30 | D | REVENUE_GROWTH, DIO | PRICING, WC_DIO | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · DIO←inventory · PRICING←discount · WC_DIO←inventory · COMMERCIAL←sales · MARKET←demand |
| 31 | D | REVENUE_GROWTH | PRICING, WC_DSO, WC_DIO | COMMERCIAL, MARKET | REVENUE_GROWTH←demand · PRICING←promotional · WC_DSO←collection · WC_DIO←inventory · COMMERCIAL←sales · MARKET←demand |
| 32 | D | — | — | COMMERCIAL | COMMERCIAL←customer |
| 33 | E | EBITDA_MARGIN, DIO | PRICING, COST_PROCUREMENT, WC_DIO | FINANCIAL | EBITDA_MARGIN←margin · DIO←inventory · PRICING←pricing · COST_PROCUREMENT←supplier · WC_DIO←inventory · FINANCIAL←margin |
| 34 | E | DIO | COST_PROCUREMENT, WC_DIO | COMMERCIAL, OPERATIONAL | DIO←inventory · COST_PROCUREMENT←vendor · WC_DIO←inventory · COMMERCIAL←sales · OPERATIONAL←operational |
| 35 | E | — | COST_PROCUREMENT | COMMERCIAL, OPERATIONAL | COST_PROCUREMENT←supplier · COMMERCIAL←customer · OPERATIONAL←quality |

Libellés des parties : A Finance · B Operations · C Marketing · D Merchandising · E Finance.

## Hors vocabulaire

Analyses réglementaires / conformité (28, 35) : aucune cause de base ne les exprime. Candidat : remonter `REGULATORY` (déjà utilisé par aero et airline) dans la base.

## Tes arbitrages attendus

1. Corrige les lignes du mapping qui ne te conviennent pas (le reste sera appliqué tel quel).
2. `REGULATORY` dans la base : oui / non ?
