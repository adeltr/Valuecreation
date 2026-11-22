# Curation health-payor — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `health-payor` (base ∪ extension) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

41 analyses · 22 sans métrique ni levier (qualitatives) · 7 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | MEDICAL_LOSS_RATIO | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←efficiency · OPERATIONAL←quality · FINANCIAL←costs |
| 02 | A | EBITDA_MARGIN, PREMIUM_PMPM, PREMIUM_TREND | RATE_ADEQUACY | COMMERCIAL, FINANCIAL, MARKET | EBITDA_MARGIN←profitability · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←competitiveness |
| 03 | A | MEDICAL_LOSS_RATIO | CARE_MANAGEMENT | OPERATIONAL, FINANCIAL | OPERATIONAL←quality · FINANCIAL←cost |
| 04 | A | — | — | FINANCIAL | FINANCIAL←cost |
| 05 | A | — | — | FINANCIAL, RISK_POOL_SELECTION | FINANCIAL←financial |
| 06 | A | — | PHARMACY_MANAGEMENT | FINANCIAL | FINANCIAL←cost |
| 07 | A | — | PHARMACY_MANAGEMENT | FINANCIAL, MEDICAL_COST_TREND | FINANCIAL←cost |
| 08 | A | — | — | FINANCIAL, MEDICAL_COST_TREND | FINANCIAL←cost |
| 09 | A | — | VALUE_BASED_CONTRACTING | OPERATIONAL, FINANCIAL | OPERATIONAL←quality · FINANCIAL←costs |
| 10 | A | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←quality · FINANCIAL←cost |
| 11 | B | MEMBERS, MEMBER_GROWTH, CUSTOMER_RETENTION_RATE | VOLUME, MEMBER_ENGAGEMENT | — | VOLUME←retention |
| 12 | B | NET_PROMOTER_SCORE | MEMBER_ENGAGEMENT | — |  |
| 13 | B | — | VOLUME, MEMBER_ENGAGEMENT | — | VOLUME←expand |
| 14 | B | — | — | FINANCIAL | FINANCIAL←costs |
| 15 | B | — | VOLUME, WC_DSO | FINANCIAL | VOLUME←expand · WC_DSO←collection · FINANCIAL←costs |
| 16 | C | MEDICAL_LOSS_RATIO | CARE_MANAGEMENT | FINANCIAL | FINANCIAL←costs |
| 17 | C | — | CARE_MANAGEMENT | FINANCIAL | FINANCIAL←costs |
| 18 | C | — | CARE_MANAGEMENT | FINANCIAL | FINANCIAL←costs |
| 19 | C | — | — | FINANCIAL | FINANCIAL←costs |
| 20 | C | — | — | FINANCIAL | FINANCIAL←costs |
| 21 | C | READMISSION_RATE | CARE_MANAGEMENT | — |  |
| 22 | C | — | CARE_MANAGEMENT | FINANCIAL | FINANCIAL←costs |
| 23 | D | — | VOLUME, MIX | FINANCIAL, REGULATORY | VOLUME←expand · MIX←mix · FINANCIAL←costs · REGULATORY←regulatory |
| 24 | D | — | VOLUME, VALUE_BASED_CONTRACTING | OPERATIONAL, FINANCIAL | VOLUME←expand · OPERATIONAL←quality · FINANCIAL←costs |
| 25 | D | REVENUE_GROWTH | VOLUME, VALUE_BASED_CONTRACTING | OPERATIONAL, FINANCIAL | REVENUE_GROWTH←expansion · VOLUME←expand · OPERATIONAL←quality · FINANCIAL←costs |
| 26 | D | — | VOLUME, VALUE_BASED_CONTRACTING | OPERATIONAL, FINANCIAL | VOLUME←expand · OPERATIONAL←quality · FINANCIAL←cost |
| 27 | E | — | VOLUME | FINANCIAL, RISK_POOL_SELECTION | VOLUME←expand · FINANCIAL←costs |
| 28 | E | — | — | OPERATIONAL, FINANCIAL, MARKET | OPERATIONAL←quality · FINANCIAL←cost · MARKET←industry |
| 29 | E | — | VOLUME, WC_DSO | OPERATIONAL, FINANCIAL | VOLUME←expand · WC_DSO←collection · OPERATIONAL←quality · FINANCIAL←costs |
| 30 | F | ADMIN_EXPENSE_RATIO | COST_OPS, ADMIN_AUTOMATION | OPERATIONAL, FINANCIAL | COST_OPS←automation · OPERATIONAL←processing · FINANCIAL←costs |
| 31 | F | CLAIMS_DENIAL_RATE | PAYMENT_INTEGRITY | OPERATIONAL, MARKET | OPERATIONAL←process · MARKET←trends |
| 32 | F | — | COST_OPS, PAYMENT_INTEGRITY | OPERATIONAL, FINANCIAL | COST_OPS←automate · OPERATIONAL←processing · FINANCIAL←costs |
| 33 | F | STAR_RATING | — | OPERATIONAL, MARKET, REGULATORY | OPERATIONAL←quality · MARKET←industry · REGULATORY←compliance |
| 34 | F | — | VOLUME | REGULATORY | VOLUME←expand · REGULATORY←compliance |
| 35 | G | — | VOLUME | OPERATIONAL, FINANCIAL, MARKET | VOLUME←expand · OPERATIONAL←quality · FINANCIAL←cost · MARKET←trends |
| 36 | G | — | VOLUME | OPERATIONAL, FINANCIAL | VOLUME←expand · OPERATIONAL←quality · FINANCIAL←costs |
| 37 | G | IN_NETWORK_UTILIZATION_RATE | VOLUME | FINANCIAL, MARKET | VOLUME←expand · FINANCIAL←costs · MARKET←trends |
| 38 | G | — | ADMIN_AUTOMATION | OPERATIONAL | OPERATIONAL←quality |
| 39 | G | — | COST_OPS | OPERATIONAL | COST_OPS←efficiency · OPERATIONAL←processes |
| 40 | H | MEMBERS, MEMBER_GROWTH, STAR_RATING | MEMBER_ENGAGEMENT | OPERATIONAL, FINANCIAL, REGULATORY | OPERATIONAL←quality · FINANCIAL←costs · REGULATORY←compliance |
| 41 | H | MEMBERS, MEMBER_GROWTH, ADMIN_EXPENSE_RATIO | COST_OPS, ADMIN_AUTOMATION | OPERATIONAL | COST_OPS←automate · OPERATIONAL←process |

Libellés des parties : A Financial Performance and Cost Management · B Member Experience and Engagement · C Care and Disease Management Programs · D Provider Network and Contracting · E Risk Assessment and Population Health · F Claims Management and Compliance · G Access to Care and Integration · H Government Programs and Regulatory.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
