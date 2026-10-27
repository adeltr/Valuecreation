# Curation retail-bank — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `retail-bank` (base ∪ extension) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

45 analyses · 6 sans métrique ni levier (qualitatives) · 5 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | CUSTOMERS | VOLUME, CROSS_SELL | COMMERCIAL | VOLUME←cross-sell · COMMERCIAL←customer |
| 02 | A | NET_PROMOTER_SCORE | VOLUME, COST_OPS | COMMERCIAL | VOLUME←loyalty · COST_OPS←staff · COMMERCIAL←customer |
| 03 | A | CROSS_SELL_RATIO | PRICING, VOLUME, CROSS_SELL | COMMERCIAL | PRICING←discounts · VOLUME←channels · COMMERCIAL←customers |
| 04 | A | REVENUE_GROWTH, REVENUE_PER_CUSTOMER, COST_TO_SERVE | VOLUME | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←customer acquisition · VOLUME←retention · COMMERCIAL←customer · FINANCIAL←cost |
| 05 | A | — | VOLUME, COST_OPS | COMMERCIAL | VOLUME←channels · COST_OPS←staff · COMMERCIAL←customer |
| 06 | A | — | — | COMMERCIAL, FINANCIAL | COMMERCIAL←customer · FINANCIAL←financial |
| 07 | A | DIGITAL_ADOPTION_RATE | VOLUME, DIGITAL_MIGRATION | COMMERCIAL, FINANCIAL, FINTECH_COMPETITION | VOLUME←expand · COMMERCIAL←customer · FINANCIAL←financial |
| 08 | A | — | — | COMMERCIAL, FINANCIAL | COMMERCIAL←customer · FINANCIAL←financial |
| 09 | A | REVENUE_PER_CUSTOMER, COST_TO_SERVE | PRICING, VOLUME | COMMERCIAL, FINANCIAL | PRICING←pricing · VOLUME←channels · COMMERCIAL←customer · FINANCIAL←profitability |
| 10 | A | CUSTOMER_ATTRITION_RATE | VOLUME, ATTRITION_REDUCTION | COMMERCIAL, FINANCIAL | VOLUME←retention · COMMERCIAL←customer · FINANCIAL←profitability |
| 11 | A | — | VOLUME | COMMERCIAL | VOLUME←expand · COMMERCIAL←customer |
| 12 | A | — | MIX, COST_OPS | COMMERCIAL, OPERATIONAL | MIX←portfolio · COST_OPS←automated · COMMERCIAL←customer · OPERATIONAL←quality |
| 13 | B | REVENUE_GROWTH, LOANS_PER_CUSTOMER, DEPOSIT_GROWTH | PRICING, VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · PRICING←pricing · VOLUME←channels · COMMERCIAL←customer · OPERATIONAL←quality · FINANCIAL←financial · MARKET←trends |
| 14 | B | LOANS_PER_CUSTOMER | MIX | MARKET | MIX←portfolio · MARKET←market |
| 15 | B | — | VOLUME, ATTRITION_REDUCTION | COMMERCIAL, FINANCIAL | VOLUME←retention · COMMERCIAL←customer · FINANCIAL←investment |
| 16 | B | NPL_RATIO | MIX | FINANCIAL, CREDIT_CYCLE | MIX←portfolio · FINANCIAL←financial |
| 17 | B | — | — | FINANCIAL | FINANCIAL←debt |
| 18 | B | REVENUE_GROWTH | VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←demand · VOLUME←retention · COMMERCIAL←customer · OPERATIONAL←capacity · FINANCIAL←debt · MARKET←demand |
| 19 | B | COST_OF_RISK | COST_OPS, CREDIT_RISK_MANAGEMENT | COMMERCIAL, CREDIT_CYCLE | COST_OPS←efficiency · COMMERCIAL←customer |
| 20 | C | — | COST_OPS | OPERATIONAL, FINANCIAL, REGULATORY | COST_OPS←automate · OPERATIONAL←operations · FINANCIAL←financial · REGULATORY←compliance |
| 21 | C | COST_OF_RISK, NPL_RATIO | MIX, CREDIT_RISK_MANAGEMENT | OPERATIONAL | MIX←portfolio · OPERATIONAL←quality |
| 22 | C | — | FRAUD_PREVENTION | OPERATIONAL | OPERATIONAL←operations |
| 23 | C | — | COST_OPS, CREDIT_RISK_MANAGEMENT | OPERATIONAL, FINANCIAL | COST_OPS←automated · OPERATIONAL←process · FINANCIAL←cost |
| 24 | C | COST_TO_SERVE | VOLUME, COST_OPS | OPERATIONAL, FINANCIAL, MARKET | VOLUME←cross-selling · COST_OPS←automate · OPERATIONAL←operational · FINANCIAL←cost · MARKET←competitiveness |
| 25 | C | — | COST_OPS | OPERATIONAL, FINANCIAL, REGULATORY | COST_OPS←automated · OPERATIONAL←operations · FINANCIAL←cost · REGULATORY←regulatory |
| 26 | C | CET1_RATIO | VOLUME | FINANCIAL, REGULATORY | VOLUME←channel · FINANCIAL←capital · REGULATORY←regulatory |
| 27 | D | — | COST_OPS, BRANCH_OPTIMIZATION | COMMERCIAL, OPERATIONAL, FINANCIAL | COST_OPS←automating · COMMERCIAL←customer · OPERATIONAL←operational · FINANCIAL←profitability |
| 28 | D | — | VOLUME, DIGITAL_MIGRATION | COMMERCIAL, FINANCIAL | VOLUME←channels · COMMERCIAL←channel · FINANCIAL←cost |
| 29 | D | — | COST_OPS, BRANCH_OPTIMIZATION | OPERATIONAL, FINANCIAL | COST_OPS←maintenance · OPERATIONAL←operational · FINANCIAL←cost |
| 30 | E | DIGITAL_ADOPTION_RATE | DIGITAL_MIGRATION | COMMERCIAL, FINTECH_COMPETITION | COMMERCIAL←customer |
| 31 | E | — | — | — |  |
| 32 | E | REVENUE_GROWTH | COST_PROCUREMENT, COST_OPS | OPERATIONAL, FINANCIAL | REVENUE_GROWTH←growth · COST_PROCUREMENT←vendor · COST_OPS←efficient · OPERATIONAL←operational · FINANCIAL←costs |
| 33 | F | — | PRICING, MIX, DEPOSIT_PRICING | FINANCIAL, INTEREST_RATES | PRICING←pricing · MIX←portfolio · FINANCIAL←margin |
| 34 | F | — | PRICING, DEPOSIT_PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←competitive |
| 35 | G | REVENUE_GROWTH, CUSTOMERS, CUSTOMER_GROWTH | VOLUME | COMMERCIAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · VOLUME←expand · COMMERCIAL←customer · FINANCIAL←financial · MARKET←market |
| 36 | G | REVENUE_GROWTH, DEPOSIT_GROWTH | PRICING, VOLUME, DEPOSIT_PRICING | COMMERCIAL, OPERATIONAL, MARKET | REVENUE_GROWTH←growth · PRICING←promotional · VOLUME←loyalty · COMMERCIAL←customer · OPERATIONAL←operations · MARKET←trends |
| 37 | G | — | VOLUME, CROSS_SELL | COMMERCIAL, FINANCIAL | VOLUME←cross-selling · COMMERCIAL←customers · FINANCIAL←investment |
| 38 | G | — | VOLUME, PRICING | — | VOLUME←expanding |
| 39 | G | — | PRICING, VOLUME, DIGITAL_MIGRATION | OPERATIONAL | PRICING←pricing · VOLUME←expand · OPERATIONAL←operations |
| 40 | G | — | COST_OPS | COMMERCIAL, FINANCIAL | COST_OPS←staff · COMMERCIAL←customer · FINANCIAL←financial |
| 41 | G | REVENUE_PER_CUSTOMER, CROSS_SELL_RATIO | PRICING, VOLUME, CROSS_SELL | COMMERCIAL, FINANCIAL | PRICING←discounts · VOLUME←loyalty · COMMERCIAL←customer · FINANCIAL←financial |
| 42 | G | CUSTOMER_ATTRITION_RATE | VOLUME, ATTRITION_REDUCTION | COMMERCIAL, MARKET | VOLUME←loyalty · COMMERCIAL←customer · MARKET←trends |
| 43 | G | — | PRICING | COMMERCIAL, INTEREST_RATES | PRICING←pricing · COMMERCIAL←customer |
| 44 | G | REVENUE_GROWTH | — | COMMERCIAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · COMMERCIAL←customer · FINANCIAL←financial · MARKET←trends |
| 45 | G | REVENUE_GROWTH, CUSTOMERS, CUSTOMER_GROWTH | VOLUME | MARKET, FINTECH_COMPETITION | REVENUE_GROWTH←growth · VOLUME←expand · MARKET←market |

Libellés des parties : A Customer Behavior and Engagement · B Product and Portfolio Performance · C Operational Efficiency and Risk Management · D Branch and Channel Performance · E Digital and Technological Capabilities · F Financial Performance and Revenue Management · G Market Penetration and Strategic Growth.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
