# Curation commercial-bank — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `commercial-bank` (base ∪ extension) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

40 analyses · 10 sans métrique ni levier (qualitatives) · 16 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | NET_INTEREST_MARGIN | PRICING | OPERATIONAL, FINANCIAL, INTEREST_RATES | PRICING←pricing · OPERATIONAL←operations · FINANCIAL←margin |
| 02 | A | NON_INTEREST_INCOME_SHARE | PRICING, VOLUME, FEE_BUSINESS_GROWTH | FINANCIAL | PRICING←pricing · VOLUME←expand · FINANCIAL←profitability |
| 03 | A | COST_INCOME_RATIO | COST_PROCUREMENT, COST_OPS, COST_TRANSFORMATION | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←vendor · COST_OPS←automation · OPERATIONAL←quality · FINANCIAL←cost |
| 04 | B | LOANS, COST_OF_RISK, NPL_RATIO | PRICING, MIX, CREDIT_RISK_MANAGEMENT | OPERATIONAL, FINANCIAL, CREDIT_CYCLE | PRICING←pricing · MIX←portfolio · OPERATIONAL←quality · FINANCIAL←financial |
| 05 | B | LOAN_GROWTH | COST_OPS, CREDIT_RISK_MANAGEMENT | OPERATIONAL, REGULATORY | COST_OPS←automation · OPERATIONAL←processes · REGULATORY←regulatory |
| 06 | B | — | COST_OPS | — | COST_OPS←automatically |
| 07 | B | SECTOR_CONCENTRATION | — | MARKET | MARKET←industry |
| 08 | B | COST_OF_RISK, NPL_RATIO | CREDIT_RISK_MANAGEMENT | — |  |
| 09 | B | LOAN_GROWTH | PRICING, VOLUME, COST_OPS, ORIGINATION_GROWTH | — | PRICING←pricing · VOLUME←expand · COST_OPS←efficiency |
| 10 | B | NET_INTEREST_MARGIN | PRICING, LOAN_PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←market |
| 11 | B | — | COST_OPS, ORIGINATION_GROWTH | FINANCIAL | COST_OPS←staff · FINANCIAL←cash |
| 12 | B | — | PRICING, VOLUME, COST_PROCUREMENT, COST_OPS, ORIGINATION_GROWTH | OPERATIONAL, FINANCIAL | PRICING←pricing · VOLUME←expand · COST_PROCUREMENT←suppliers · COST_OPS←automation · OPERATIONAL←supply chain · FINANCIAL←financing |
| 13 | B | — | PRICING, COST_OPS | — | PRICING←pricing · COST_OPS←energy |
| 14 | B | LOANS, LOAN_GROWTH | PRICING, ORIGINATION_GROWTH | OPERATIONAL, FINANCIAL, MARKET | PRICING←pricing · OPERATIONAL←capacity · FINANCIAL←financing · MARKET←markets |
| 15 | C | COST_OF_RISK | CREDIT_RISK_MANAGEMENT | CREDIT_CYCLE |  |
| 16 | C | — | — | FINANCIAL, INTEREST_RATES, CREDIT_CYCLE | FINANCIAL←capital |
| 17 | C | — | MIX | FINANCIAL, MARKET | MIX←portfolio · FINANCIAL←investments · MARKET←market |
| 18 | C | — | COST_OPS | REGULATORY | COST_OPS←automate · REGULATORY←regulatory |
| 19 | C | — | — | — |  |
| 20 | C | — | — | OPERATIONAL, CYBER | OPERATIONAL←operational |
| 21 | C | — | COST_OPS, CREDIT_RISK_MANAGEMENT | REGULATORY | COST_OPS←automated · REGULATORY←compliance |
| 22 | C | RWA_DENSITY | — | FINANCIAL | FINANCIAL←capital |
| 23 | D | LOAN_TO_DEPOSIT_RATIO, COST_OF_FUNDS | PRICING, VOLUME, COST_OPS, DEPOSIT_FRANCHISE | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · VOLUME←retention · COST_OPS←efficiency · COMMERCIAL←pricing · FINANCIAL←cost · MARKET←competitive |
| 24 | D | LOAN_TO_DEPOSIT_RATIO, LIQUIDITY_COVERAGE_RATIO | VOLUME, DEPOSIT_FRANCHISE | FINANCIAL, MARKET, REGULATORY | VOLUME←channel · FINANCIAL←costs · MARKET←market · REGULATORY←regulatory |
| 25 | D | CET1_RATIO, RWA_DENSITY | MIX | FINANCIAL, REGULATORY | MIX←portfolio · FINANCIAL←capital · REGULATORY←regulatory |
| 26 | D | NET_INTEREST_MARGIN | PRICING, MIX, DEPOSIT_FRANCHISE | FINANCIAL, REGULATORY, INTEREST_RATES | PRICING←pricing · MIX←mix · FINANCIAL←profitability · REGULATORY←regulatory |
| 27 | D | NET_INTEREST_MARGIN | MIX, LOAN_PRICING | COMMERCIAL, FINANCIAL | MIX←mix · COMMERCIAL←pricing · FINANCIAL←costs |
| 28 | E | COST_INCOME_RATIO | COST_TRANSFORMATION | FINANCIAL, MARKET | FINANCIAL←costs · MARKET←markets |
| 29 | E | — | PRICING, VOLUME | COMMERCIAL | PRICING←pricing · VOLUME←retention · COMMERCIAL←customer |
| 30 | F | — | VOLUME | COMMERCIAL, OPERATIONAL, FINANCIAL | VOLUME←expand · COMMERCIAL←channels · OPERATIONAL←operational · FINANCIAL←profitability |
| 31 | F | REVENUE_GROWTH, COST_INCOME_RATIO | COST_OPS, COST_TRANSFORMATION | OPERATIONAL | REVENUE_GROWTH←growth · COST_OPS←maintenance · OPERATIONAL←operational |
| 32 | G | NON_INTEREST_INCOME_SHARE | PRICING, VOLUME, COST_OPS, FEE_BUSINESS_GROWTH | FINANCIAL | PRICING←pricing · VOLUME←cross-sell · COST_OPS←automation · FINANCIAL←cash |
| 33 | G | NON_INTEREST_INCOME_SHARE | PRICING, FEE_BUSINESS_GROWTH | COMMERCIAL, FINANCIAL | PRICING←pricing · COMMERCIAL←customer · FINANCIAL←profitability |
| 34 | G | NON_INTEREST_INCOME_SHARE | PRICING, FEE_BUSINESS_GROWTH | — | PRICING←pricing |
| 35 | H | — | PRICING, MIX, COST_PROCUREMENT, COST_OPS, ORIGINATION_GROWTH | OPERATIONAL, FINANCIAL | PRICING←pricing · MIX←portfolio · COST_PROCUREMENT←vendor · COST_OPS←automation · OPERATIONAL←operational · FINANCIAL←financing |
| 36 | H | — | — | FINANCIAL | FINANCIAL←financial |
| 37 | H | — | PRICING, VOLUME, COST_OPS, FEE_BUSINESS_GROWTH | FINANCIAL | PRICING←pricing · VOLUME←cross-sell · COST_OPS←automation · FINANCIAL←finance |
| 38 | H | — | VOLUME | FINANCIAL | VOLUME←expand · FINANCIAL←finance |
| 39 | H | — | PRICING, MIX | OPERATIONAL, FINANCIAL, MARKET | PRICING←price · MIX←portfolio · OPERATIONAL←operations · FINANCIAL←finance · MARKET←market |
| 40 | I | — | — | FINANCIAL | FINANCIAL←financial |

Libellés des parties : A Financial Performance and Efficiency · B Lending and Credit Management · C Risk Management and Compliance · D Capital, Liquidity, and Funding · E Operations and Process Improvement · F Digital and Technology Transformation · G Payment Services and Transaction Banking · H Specialized and Industry-Specific Solutions · I Mergers and Acquisitions.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
