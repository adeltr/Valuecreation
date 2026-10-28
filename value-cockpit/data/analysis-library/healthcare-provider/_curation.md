# Curation healthcare-provider — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `healthcare-provider` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

47 analyses · 8 sans métrique ni levier (qualitatives) · 12 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | REVENUE_GROWTH, VOLUME_GROWTH | VOLUME, COST_OPS, SERVICE_LINE_GROWTH | MARKET | REVENUE_GROWTH←growth · VOLUME←expand · COST_OPS←staff · MARKET←trends |
| 02 | A | — | COST_OPS | OPERATIONAL | COST_OPS←staff · OPERATIONAL←quality |
| 03 | A | READMISSION_RATE | VOLUME | FINANCIAL | VOLUME←expand · FINANCIAL←costs |
| 04 | A | — | COST_OPS | REGULATORY | COST_OPS←staff · REGULATORY←compliance |
| 05 | A | BED_OCCUPANCY_RATE, AVERAGE_LENGTH_OF_STAY, READMISSION_RATE | LOS_OPTIMIZATION | FINANCIAL | FINANCIAL←costs |
| 06 | A | — | COST_OPS, LOS_OPTIMIZATION, SUPPLY_STANDARDIZATION | FINANCIAL | COST_OPS←staff · FINANCIAL←cost |
| 07 | A | — | COST_OPS | FINANCIAL, REGULATORY | COST_OPS←staff · FINANCIAL←financial · REGULATORY←compliance |
| 08 | B | OR_UTILIZATION | COST_OPS | — | COST_OPS←efficiency |
| 09 | B | — | COST_OPS | — | COST_OPS←staffing |
| 10 | B | REIMBURSEMENT_GROWTH, CASE_MIX_INDEX | CDI_PAYER_MIX | REGULATORY | REGULATORY←compliance |
| 11 | B | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←maintenance · OPERATIONAL←maintenance · FINANCIAL←costs |
| 12 | B | READMISSION_RATE | LOS_OPTIMIZATION | FINANCIAL | FINANCIAL←costs |
| 13 | B | SUPPLY_COST_RATE | SUPPLY_STANDARDIZATION | FINANCIAL | FINANCIAL←costs |
| 14 | C | SUPPLY_COST_RATE | COST_PROCUREMENT, COST_OPS, SUPPLY_STANDARDIZATION | OPERATIONAL, FINANCIAL, MARKET | COST_PROCUREMENT←purchasing · COST_OPS←staffing · OPERATIONAL←quality · FINANCIAL←cost · MARKET←industry |
| 15 | C | DSO, REVENUE_LEAKAGE_RATE, DAYS_IN_AR | COST_OPS, WC_DSO, REVENUE_CYCLE | OPERATIONAL, FINANCIAL | DSO←collections · COST_OPS←staff · WC_DSO←billing · OPERATIONAL←process · FINANCIAL←financial |
| 16 | C | EBITDA_MARGIN, REIMBURSEMENT_GROWTH | VOLUME, MIX, WC_DSO, CDI_PAYER_MIX | FINANCIAL, REIMBURSEMENT_PRESSURE | EBITDA_MARGIN←margin · VOLUME←expanding · MIX←mix · WC_DSO←billing · FINANCIAL←margin |
| 17 | C | REVENUE_LEAKAGE_RATE | VOLUME, REVENUE_CYCLE | OPERATIONAL, FINANCIAL, REIMBURSEMENT_PRESSURE | VOLUME←expand · OPERATIONAL←operational · FINANCIAL←financial |
| 18 | C | — | CDI_PAYER_MIX | FINANCIAL | FINANCIAL←costs |
| 19 | C | — | CDI_PAYER_MIX | OPERATIONAL, FINANCIAL, REIMBURSEMENT_PRESSURE | OPERATIONAL←quality · FINANCIAL←financial |
| 20 | D | — | COST_OPS | — | COST_OPS←staff |
| 21 | D | NO_SHOW_RATE | VOLUME, COST_OPS | OPERATIONAL | VOLUME←expand · COST_OPS←staffing · OPERATIONAL←processes |
| 22 | D | — | VOLUME, SERVICE_LINE_GROWTH | OPERATIONAL | VOLUME←retention · OPERATIONAL←processes |
| 23 | D | — | VOLUME | OPERATIONAL | VOLUME←expand · OPERATIONAL←quality |
| 24 | D | — | — | — |  |
| 25 | D | NO_SHOW_RATE | VOLUME, COST_OPS | — | VOLUME←expanding · COST_OPS←staff |
| 26 | E | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←staff · OPERATIONAL←operational · REGULATORY←regulatory |
| 27 | E | — | COST_OPS, WC_DSO | OPERATIONAL, REGULATORY | COST_OPS←automated · WC_DSO←collection · OPERATIONAL←processes · REGULATORY←compliance |
| 28 | F | — | COST_OPS | — | COST_OPS←staff |
| 29 | F | — | COST_OPS | OPERATIONAL | COST_OPS←staff · OPERATIONAL←processes |
| 30 | F | LABOR_COST_RATE | VOLUME, COST_OPS, WORKFORCE_PRODUCTIVITY | — | VOLUME←expand · COST_OPS←efficiency |
| 31 | G | — | VOLUME | FINANCIAL | VOLUME←expand · FINANCIAL←cost |
| 32 | G | — | — | FINANCIAL | FINANCIAL←costs |
| 33 | G | — | VOLUME | — | VOLUME←expand |
| 34 | G | STAFF_TURNOVER_RATE | VOLUME, COST_OPS | OPERATIONAL, ORGANIZATIONAL | VOLUME←channels · COST_OPS←efficiency · OPERATIONAL←operational · ORGANIZATIONAL←organizational |
| 35 | G | — | VOLUME, COST_OPS | FINANCIAL | VOLUME←expand · COST_OPS←staff · FINANCIAL←costs |
| 36 | H | NO_SHOW_RATE | VOLUME, COST_OPS | FINANCIAL | VOLUME←expand · COST_OPS←staff · FINANCIAL←financial |
| 37 | H | — | VOLUME, COST_OPS | — | VOLUME←expand · COST_OPS←efficiency |
| 38 | H | REVENUE_GROWTH, VOLUME_GROWTH | VOLUME, COST_OPS, SERVICE_LINE_GROWTH | MARKET | REVENUE_GROWTH←growth · VOLUME←expand · COST_OPS←efficiency · MARKET←market |
| 39 | H | EBITDA_MARGIN, REVENUE_GROWTH, VOLUME_GROWTH | VOLUME, COST_OPS, SERVICE_LINE_GROWTH | FINANCIAL, ORGANIZATIONAL, MARKET | EBITDA_MARGIN←profitability · REVENUE_GROWTH←expansion · VOLUME←expand · COST_OPS←efficiency · FINANCIAL←financial · ORGANIZATIONAL←organization · MARKET←market |
| 40 | H | — | VOLUME, COST_OPS | OPERATIONAL, FINANCIAL, ORGANIZATIONAL | VOLUME←expand · COST_OPS←staff · OPERATIONAL←operational · FINANCIAL←financial · ORGANIZATIONAL←organization |
| 41 | H | REVENUE_GROWTH | COST_OPS | FINANCIAL, ORGANIZATIONAL, MARKET | REVENUE_GROWTH←demand · COST_OPS←staffing · FINANCIAL←financial · ORGANIZATIONAL←organizational · MARKET←market |
| 42 | I | LABOR_COST_RATE, STAFF_TURNOVER_RATE | VOLUME, COST_OPS, WORKFORCE_PRODUCTIVITY | ORGANIZATIONAL, LABOR | VOLUME←distribution · COST_OPS←staffing · ORGANIZATIONAL←staff |
| 43 | I | STAFF_TURNOVER_RATE | VOLUME, COST_OPS, WORKFORCE_PRODUCTIVITY | ORGANIZATIONAL, LABOR | VOLUME←distribution · COST_OPS←staffing · ORGANIZATIONAL←staff |
| 44 | J | — | VOLUME, COST_OPS | ORGANIZATIONAL | VOLUME←expand · COST_OPS←staff · ORGANIZATIONAL←organization |
| 45 | J | CAPEX | COST_OPS, CAPEX_DISCIPLINE | OPERATIONAL, FINANCIAL | CAPEX←capital investment · COST_OPS←staff · OPERATIONAL←operational · FINANCIAL←capital |
| 46 | J | BED_OCCUPANCY_RATE | COST_OPS, LOS_OPTIMIZATION | OPERATIONAL | COST_OPS←staff · OPERATIONAL←operational |
| 47 | J | — | VOLUME | ORGANIZATIONAL | VOLUME←expand · ORGANIZATIONAL←organization |

Libellés des parties : A Clinical Performance and Quality · B Operational Efficiency and Resource · C Financial Performance and Revenue Management · D Patient Experience and Access · E Regulatory Compliance and Risk Management · F Technology Utilization and Digital Engagement · G Population Health and Care Coordination · H Specialty Services and Market Expansion · I Staffing and Workforce Optimization · J Community Impact and Health Equity.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
