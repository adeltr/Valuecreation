# Curation auto-insurance — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `auto-insurance` (base ∪ extension) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

39 analyses · 6 sans métrique ni levier (qualitatives) · 14 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | AVERAGE_PREMIUM | PRICING, RATING_SOPHISTICATION | COMMERCIAL, FINANCIAL | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←costs |
| 02 | A | — | PRICING | MARKET | PRICING←discounts · MARKET←trends |
| 03 | A | — | PRICING | COMMERCIAL, FINANCIAL | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability |
| 04 | A | — | PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←prices · COMMERCIAL←pricing · FINANCIAL←cost · MARKET←trends |
| 05 | A | — | PRICING, COST_PROCUREMENT | FINANCIAL | PRICING←pricing · COST_PROCUREMENT←vendors · FINANCIAL←financial |
| 06 | A | — | PRICING | — | PRICING←discount |
| 07 | A | AVERAGE_PREMIUM | RATING_SOPHISTICATION | COMMERCIAL | COMMERCIAL←pricing |
| 08 | A | REVENUE_GROWTH, POLICY_GROWTH | PRICING, TELEMATICS_UBI, SEGMENT_GROWTH | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←growth · PRICING←discounts · COMMERCIAL←pricing · FINANCIAL←profitability |
| 09 | A | — | PRICING | COMMERCIAL | PRICING←pricing · COMMERCIAL←pricing |
| 10 | A | — | PRICING, COST_PROCUREMENT, COST_OPS | COMMERCIAL, FINANCIAL | PRICING←discounts · COST_PROCUREMENT←vendor · COST_OPS←maintenance · COMMERCIAL←pricing · FINANCIAL←cost |
| 11 | A | — | PRICING, VOLUME, RATING_SOPHISTICATION | FINANCIAL, REGULATORY | PRICING←discounts · VOLUME←retention · FINANCIAL←profitability · REGULATORY←license |
| 12 | A | — | PRICING | COMMERCIAL, FINANCIAL | COMMERCIAL←customer · FINANCIAL←profitability |
| 13 | B | POLICY_GROWTH, TELEMATICS_PENETRATION | PRICING, COST_PROCUREMENT, TELEMATICS_UBI | COMMERCIAL | PRICING←pricing · COST_PROCUREMENT←vendors · COMMERCIAL←price |
| 14 | B | AVERAGE_PREMIUM | COST_OPS, LEAKAGE_CONTROL | — | COST_OPS←automated |
| 15 | B | — | PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←financial · MARKET←market |
| 16 | B | — | PRICING | COMMERCIAL, FINANCIAL | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability |
| 17 | B | REVENUE_GROWTH, POLICIES_IN_FORCE, POLICY_GROWTH | PRICING, VOLUME, SEGMENT_GROWTH | COMMERCIAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · PRICING←pricing · VOLUME←retention · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←market |
| 18 | B | — | TELEMATICS_UBI | — |  |
| 19 | B | — | PRICING, RATING_SOPHISTICATION | COMMERCIAL | PRICING←discounts · COMMERCIAL←pricing |
| 20 | B | — | PRICING | COMMERCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · MARKET←market |
| 21 | B | POLICIES_IN_FORCE | PRICING | FINANCIAL, ORGANIZATIONAL | PRICING←pricing · FINANCIAL←profitability · ORGANIZATIONAL←employee |
| 22 | C | CLAIM_FREQUENCY, CLAIM_SEVERITY | PRICING | COMMERCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · MARKET←trends |
| 23 | C | CLAIMS_SETTLEMENT_DAYS | COST_OPS, CLAIMS_EXCELLENCE | — | COST_OPS←automate |
| 24 | C | SUBROGATION_RECOVERY_RATE | COST_PROCUREMENT, COST_OPS, RECOVERY_SALVAGE | OPERATIONAL, FINANCIAL | COST_PROCUREMENT←vendors · COST_OPS←automated · OPERATIONAL←processes · FINANCIAL←financial |
| 25 | C | CLAIM_SEVERITY | COST_PROCUREMENT, REPAIR_NETWORK | FINANCIAL, REPAIR_COST_INFLATION | COST_PROCUREMENT←supplier · FINANCIAL←cost |
| 26 | C | CLAIM_SEVERITY, DIRECT_REPAIR_SHARE | REPAIR_NETWORK | COMMERCIAL, OPERATIONAL, FINANCIAL | COMMERCIAL←customer · OPERATIONAL←quality · FINANCIAL←cost |
| 27 | C | — | PRICING, VOLUME, COST_PROCUREMENT, REPAIR_NETWORK | COMMERCIAL, OPERATIONAL, FINANCIAL, REPAIR_COST_INFLATION | PRICING←discounts · VOLUME←expand · COST_PROCUREMENT←suppliers · COMMERCIAL←customer · OPERATIONAL←quality · FINANCIAL←cost |
| 28 | C | THEFT_RECOVERY_RATE | RECOVERY_SALVAGE | FINANCIAL | FINANCIAL←costs |
| 29 | D | CLAIM_FREQUENCY, LOSS_RATIO | PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←profitability · MARKET←trends |
| 30 | D | FLOAT_RATIO | — | RESERVE_RISK |  |
| 31 | D | — | COST_OPS | FINANCIAL | COST_OPS←efficiency · FINANCIAL←capital |
| 32 | E | — | PRICING | COMMERCIAL, FINANCIAL, REPAIR_COST_INFLATION | PRICING←discounts · COMMERCIAL←pricing · FINANCIAL←profitability |
| 33 | E | — | VOLUME, SEGMENT_GROWTH | MARKET | VOLUME←expand · MARKET←trends |
| 34 | E | — | PRICING, SEGMENT_GROWTH | FINANCIAL, REGULATORY | PRICING←pricing · FINANCIAL←profitability · REGULATORY←regulatory |
| 35 | E | — | PRICING, VOLUME, TELEMATICS_UBI | — | PRICING←discounts · VOLUME←expand |
| 36 | E | TELEMATICS_PENETRATION | COST_OPS, SEGMENT_GROWTH | COMMERCIAL | COST_OPS←maintenance · COMMERCIAL←pricing |
| 37 | E | — | VOLUME, COST_OPS, REPAIR_NETWORK, CLAIMS_EXCELLENCE | COMMERCIAL, OPERATIONAL, FINANCIAL | VOLUME←expand · COST_OPS←automatically · COMMERCIAL←customer · OPERATIONAL←operational · FINANCIAL←costs |
| 38 | E | DIRECT_REPAIR_SHARE | PRICING, REPAIR_NETWORK | COMMERCIAL, OPERATIONAL, FINANCIAL | PRICING←pricing · COMMERCIAL←customer · OPERATIONAL←quality · FINANCIAL←cost |
| 39 | I | — | PRICING | COMMERCIAL, FINANCIAL | PRICING←discounts · COMMERCIAL←pricing · FINANCIAL←profitability |

Libellés des parties : A Pricing & Product Strategy · B Underwriting & Risk Segmentation · C Claims & Loss Management · D Financial Performance & Reserving · E Technology, Mobility & Operational Efficiency · I Specialty & Niche Segments.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
