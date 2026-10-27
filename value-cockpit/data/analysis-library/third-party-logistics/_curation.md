# Curation third-party-logistics — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `third-party-logistics` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

40 analyses · 14 sans métrique ni levier (qualitatives) · 7 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | REVENUE_GROWTH | VOLUME | COMMERCIAL, OPERATIONAL, MARKET | REVENUE_GROWTH←demand · VOLUME←expand · COMMERCIAL←customer · OPERATIONAL←capacity · MARKET←demand |
| 02 | A | — | — | OPERATIONAL, FINANCIAL, MARKET | OPERATIONAL←quality · FINANCIAL←cost · MARKET←industry |
| 03 | A | — | VOLUME | COMMERCIAL, OPERATIONAL, MARKET | VOLUME←expand · COMMERCIAL←customer · OPERATIONAL←operations · MARKET←competitive |
| 04 | A | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←maintenance · OPERATIONAL←operations · FINANCIAL←cost |
| 05 | A | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←operations · FINANCIAL←cost |
| 06 | A | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←capacity · FINANCIAL←cost |
| 07 | A | — | VOLUME | OPERATIONAL | VOLUME←expand · OPERATIONAL←supply chain |
| 08 | A | — | — | FINANCIAL | FINANCIAL←costs |
| 09 | A | — | MIX | FINANCIAL, MARKET | MIX←portfolio · FINANCIAL←cost · MARKET←competitiveness |
| 10 | A | — | VOLUME | MARKET | VOLUME←expand · MARKET←industry |
| 11 | B | — | COST_OPS | OPERATIONAL | COST_OPS←labor · OPERATIONAL←operations |
| 12 | B | REVENUE_GROWTH | COST_OPS | OPERATIONAL, MARKET | REVENUE_GROWTH←demand · COST_OPS←staff · OPERATIONAL←operations · MARKET←demand |
| 13 | B | DIO | MIX, COST_OPS | OPERATIONAL | DIO←inventory · MIX←skus · COST_OPS←labor · OPERATIONAL←operations |
| 14 | B | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←automation · OPERATIONAL←operations · FINANCIAL←costs |
| 15 | B | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←supply chain · FINANCIAL←costs |
| 16 | C | — | COST_OPS | OPERATIONAL | COST_OPS←staff · OPERATIONAL←supply chain |
| 17 | C | DIO | WC_DSO | COMMERCIAL, OPERATIONAL | DIO←inventory · WC_DSO←collection · COMMERCIAL←customer · OPERATIONAL←supply chain |
| 18 | C | — | VOLUME | OPERATIONAL | VOLUME←expand · OPERATIONAL←supply chain |
| 19 | C | — | VOLUME | MARKET | VOLUME←expand · MARKET←competitive |
| 20 | C | — | — | FINANCIAL | FINANCIAL←cost |
| 21 | D | — | PRICING | COMMERCIAL, FINANCIAL, MARKET | PRICING←pricing · COMMERCIAL←pricing · FINANCIAL←cost · MARKET←market |
| 22 | D | — | — | COMMERCIAL, OPERATIONAL, FINANCIAL | COMMERCIAL←customer · OPERATIONAL←logistics · FINANCIAL←cost |
| 23 | D | — | — | COMMERCIAL, OPERATIONAL, FINANCIAL | COMMERCIAL←customers · OPERATIONAL←supply chain · FINANCIAL←cost |
| 24 | D | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←operations · FINANCIAL←cost |
| 25 | E | — | PRICING, VOLUME, COST_OPS | COMMERCIAL, OPERATIONAL | PRICING←pricing · VOLUME←expand · COST_OPS←automation · COMMERCIAL←customer · OPERATIONAL←logistics |
| 26 | E | DIO | — | COMMERCIAL | DIO←inventory · COMMERCIAL←channel |
| 27 | E | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←labor · OPERATIONAL←operations · FINANCIAL←costs |
| 28 | E | DIO | WC_DIO | OPERATIONAL | DIO←inventory · WC_DIO←inventory · OPERATIONAL←manufacturing |
| 29 | F | — | COST_OPS | OPERATIONAL, REGULATORY | COST_OPS←staff · OPERATIONAL←processes · REGULATORY←compliance |
| 30 | F | — | COST_OPS | COMMERCIAL, REGULATORY | COST_OPS←maintenance · COMMERCIAL←customer · REGULATORY←compliance |
| 31 | F | — | — | REGULATORY | REGULATORY←regulatory |
| 32 | F | — | — | OPERATIONAL, REGULATORY | OPERATIONAL←supply chain · REGULATORY←compliance |
| 33 | F | — | COST_OPS | FINANCIAL | COST_OPS←staff · FINANCIAL←costs |
| 34 | G | — | MIX | OPERATIONAL | MIX←portfolio · OPERATIONAL←capacity |
| 35 | G | — | VOLUME, COST_OPS | OPERATIONAL, MARKET, REGULATORY | VOLUME←distribution · COST_OPS←efficiency · OPERATIONAL←logistics · MARKET←markets · REGULATORY←regulations |
| 36 | H | — | — | OPERATIONAL, FINANCIAL | OPERATIONAL←operational · FINANCIAL←cost |
| 37 | H | — | COST_OPS | OPERATIONAL, FINANCIAL | COST_OPS←automate · OPERATIONAL←process · FINANCIAL←financial |
| 38 | H | — | — | COMMERCIAL, FINANCIAL | COMMERCIAL←customer · FINANCIAL←cost |
| 39 | H | — | COST_OPS | FINANCIAL | COST_OPS←labor · FINANCIAL←costs |
| 40 | I | — | — | — |  |

Libellés des parties : A Transportation & Network Strategy · B Warehousing & Fulfillment · C Technology & Systems · D Commercial & Contractual Structures · E Value-Added & Specialized Services · F Trade & Regulatory Compliance · G Strategic Growth & Resilience · H Cost Optimization & Efficiency · I Workforce & Labor Management.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
