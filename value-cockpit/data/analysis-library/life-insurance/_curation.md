# Curation life-insurance — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `life-insurance` (base ∪ extension) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

49 analyses · 15 sans métrique ni levier (qualitatives) · 13 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | LAPSE_RATE | PRICING, VOLUME, PERSISTENCY_PROGRAM | — | PRICING←discounts · VOLUME←retention |
| 02 | A | PERSISTENCY_RATE | PRICING, VOLUME, COST_OPS, PERSISTENCY_PROGRAM | FINANCIAL | PRICING←discounts · VOLUME←loyalty · COST_OPS←automation · FINANCIAL←profitability |
| 03 | A | REVENUE_GROWTH | VOLUME, PERSISTENCY_PROGRAM | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←customer acquisition · VOLUME←retention · COMMERCIAL←customer · FINANCIAL←profitability |
| 04 | A | LAPSE_RATE | VOLUME, PERSISTENCY_PROGRAM | FINANCIAL, MARKET | VOLUME←retention · FINANCIAL←financial · MARKET←trends |
| 05 | A | PERSISTENCY_RATE | VOLUME | COMMERCIAL | VOLUME←retention · COMMERCIAL←channel |
| 06 | A | — | PRICING, VOLUME | COMMERCIAL | PRICING←pricing · VOLUME←loyalty · COMMERCIAL←pricing |
| 07 | B | RESERVES | — | FINANCIAL, REGULATORY | FINANCIAL←financial · REGULATORY←regulatory |
| 08 | B | BENEFITS_RATIO, MORTALITY_EXPERIENCE_RATIO | PRICING, MORTALITY_UNDERWRITING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←financial · MARKET←trend |
| 09 | B | — | PRICING | FINANCIAL | PRICING←pricing · FINANCIAL←financial |
| 10 | B | — | — | FINANCIAL, MARKET, REGULATORY | FINANCIAL←financial · MARKET←market · REGULATORY←compliance |
| 11 | B | RESERVES | PRICING | FINANCIAL, REGULATORY | PRICING←pricing · FINANCIAL←profitability · REGULATORY←regulatory |
| 12 | B | MORTALITY_EXPERIENCE_RATIO | MORTALITY_UNDERWRITING | COMMERCIAL | COMMERCIAL←pricing |
| 13 | B | BENEFITS_RATIO, MORTALITY_EXPERIENCE_RATIO | VOLUME, MORTALITY_UNDERWRITING | FINANCIAL | VOLUME←retention · FINANCIAL←margin |
| 14 | C | REVENUE_GROWTH, VNB_MARGIN | PRICING, VOLUME, COST_OPS | FINANCIAL | REVENUE_GROWTH←growth · PRICING←pricing · VOLUME←distribution · COST_OPS←efficiency · FINANCIAL←profitability |
| 15 | C | — | PRICING, VOLUME, COST_OPS, PRODUCT_MIX_OPTIMIZATION | FINANCIAL, MARKET | PRICING←pricing · VOLUME←distribution · COST_OPS←maintenance · FINANCIAL←profitability · MARKET←market |
| 16 | C | — | PRODUCT_MIX_OPTIMIZATION | FINANCIAL | FINANCIAL←financial |
| 17 | C | — | PRICING, VOLUME, PRODUCT_MIX_OPTIMIZATION | COMMERCIAL, FINANCIAL | PRICING←pricing · VOLUME←retention · COMMERCIAL←customer · FINANCIAL←financial |
| 18 | C | BENEFITS_RATIO | PRICING, VOLUME, PRODUCT_MIX_OPTIMIZATION | COMMERCIAL, FINANCIAL | PRICING←pricing · VOLUME←distribution · COMMERCIAL←pricing · FINANCIAL←profitability |
| 19 | C | — | PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←trends |
| 20 | C | BENEFITS_RATIO | PRICING | COMMERCIAL, FINANCIAL | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability |
| 21 | C | — | PRICING, VOLUME, COST_OPS | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · VOLUME←retention · COST_OPS←efficiency · COMMERCIAL←customer · FINANCIAL←profitability · MARKET←trends |
| 22 | C | REVENUE_GROWTH, RESERVE_GROWTH, GROSS_PREMIUMS, PREMIUM_GROWTH | PRICING, VOLUME | COMMERCIAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · PRICING←pricing · VOLUME←distribution · COMMERCIAL←sales · FINANCIAL←profitability · MARKET←trends |
| 23 | D | SOLVENCY_RATIO | PRICING, COST_OPS | FINANCIAL, REGULATORY | PRICING←pricing · COST_OPS←efficiency · FINANCIAL←capital · REGULATORY←compliance |
| 24 | D | SOLVENCY_RATIO | COST_OPS | FINANCIAL, REGULATORY | COST_OPS←efficiency · FINANCIAL←capital · REGULATORY←regulatory |
| 25 | D | SOLVENCY_RATIO | — | FINANCIAL, REGULATORY, INTEREST_RATES | FINANCIAL←financial · REGULATORY←regulatory |
| 26 | D | — | PRICING, MIX, COST_OPS | FINANCIAL | PRICING←pricing · MIX←product lines · COST_OPS←efficiency · FINANCIAL←capital |
| 27 | D | — | — | FINANCIAL, REGULATORY | FINANCIAL←financing · REGULATORY←regulatory |
| 28 | D | — | REINSURANCE_OPTIMIZATION | FINANCIAL, MARKET, LONGEVITY_RISK | FINANCIAL←capital · MARKET←trends |
| 29 | E | INVESTMENT_SPREAD, DURATION_GAP | MIX, ALM_OPTIMIZATION | FINANCIAL, INTEREST_RATES | MIX←mix · FINANCIAL←investment |
| 30 | E | — | VOLUME, ALM_OPTIMIZATION | FINANCIAL, MARKET, INTEREST_RATES | VOLUME←distribution · FINANCIAL←financial · MARKET←market |
| 31 | F | EXPENSE_RATIO | VOLUME, COST_OPS, DISTRIBUTION_EFFICIENCY | COMMERCIAL, FINANCIAL | VOLUME←channels · COST_OPS←efficiently · COMMERCIAL←channel · FINANCIAL←cost |
| 32 | F | REVENUE_GROWTH | VOLUME, COST_OPS, DISTRIBUTION_EFFICIENCY | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←customer acquisition · VOLUME←cross-selling · COST_OPS←staff · COMMERCIAL←channel · FINANCIAL←cost |
| 33 | F | PREMIUM_GROWTH | PRICING, VOLUME, COST_OPS | COMMERCIAL, FINANCIAL | PRICING←discounts · VOLUME←distribution · COST_OPS←automate · COMMERCIAL←customer · FINANCIAL←profitability |
| 34 | G | — | PRICING, VOLUME, REINSURANCE_OPTIMIZATION | FINANCIAL | PRICING←pricing · VOLUME←retention · FINANCIAL←cost |
| 35 | G | — | — | FINANCIAL, LONGEVITY_RISK | FINANCIAL←financial |
| 36 | H | — | — | OPERATIONAL, REGULATORY | OPERATIONAL←processes · REGULATORY←regulatory |
| 37 | H | — | — | FINANCIAL, REGULATORY | FINANCIAL←cost · REGULATORY←regulatory |
| 38 | I | — | COST_OPS, ADMIN_AUTOMATION | COMMERCIAL, OPERATIONAL, FINANCIAL, MARKET | COST_OPS←automation · COMMERCIAL←customer · OPERATIONAL←operational · FINANCIAL←financial · MARKET←competitive |
| 39 | I | — | PRICING, VOLUME, COST_OPS, PERSISTENCY_PROGRAM | COMMERCIAL | PRICING←discounts · VOLUME←retention · COST_OPS←efficiency · COMMERCIAL←customer |
| 40 | J | — | COST_OPS, ADMIN_AUTOMATION | COMMERCIAL, OPERATIONAL, FINANCIAL | COST_OPS←automated · COMMERCIAL←customer · OPERATIONAL←process · FINANCIAL←costs |
| 41 | J | — | COST_OPS, MORTALITY_UNDERWRITING | OPERATIONAL, FINANCIAL | COST_OPS←automated · OPERATIONAL←process · FINANCIAL←costs |
| 42 | J | OPEX, EXPENSE_RATIO, LAPSE_RATE | VOLUME, COST_OPS, DISTRIBUTION_EFFICIENCY | OPERATIONAL, FINANCIAL, MARKET | OPEX←operating cost · VOLUME←channel · COST_OPS←automation · OPERATIONAL←operational · FINANCIAL←cost · MARKET←industry |
| 43 | J | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←efficient · OPERATIONAL←operational · FINANCIAL←financial |
| 44 | K | — | — | MARKET | MARKET←competitive |
| 45 | K | REVENUE_GROWTH | VOLUME | COMMERCIAL, MARKET | REVENUE_GROWTH←growth · VOLUME←distribution · COMMERCIAL←customer · MARKET←market |
| 46 | K | — | — | FINANCIAL, REGULATORY | FINANCIAL←profitability · REGULATORY←regulatory |
| 47 | K | — | — | FINANCIAL, MARKET | FINANCIAL←financial · MARKET←competitive |
| 48 | K | — | — | COMMERCIAL, OPERATIONAL, FINANCIAL | COMMERCIAL←customer · OPERATIONAL←process · FINANCIAL←financial |
| 49 | K | — | — | FINANCIAL | FINANCIAL←financial |

Libellés des parties : A Policyholder Behavior and Retention · B Actuarial and Reserve Management · C Profitability and Product Performance · D Capital and Solvency Management · E Investment and Asset-Liability Management · F Distribution and Channel Performance · G Risk Management and Hedging · H Regulatory Compliance and Financial Reporting · I Customer Experience and Digital Transformation · J Operational Efficiency and Cost Management · K Market Strategy and Competitive Positioning.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
