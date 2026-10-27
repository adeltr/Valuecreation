# Curation media — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `media` (base) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

35 analyses · 3 sans métrique ni levier (qualitatives) · 15 à contenu réglementaire (cause REGULATORY).

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | EBITDA_MARGIN | — | FINANCIAL | EBITDA_MARGIN←profitability · FINANCIAL←profitability |
| 02 | A | — | VOLUME | COMMERCIAL | VOLUME←distribution · COMMERCIAL←brand |
| 03 | A | REVENUE_GROWTH | VOLUME, MIX | REGULATORY | REVENUE_GROWTH←growth · VOLUME←loyalty · MIX←portfolio · REGULATORY←licensing |
| 04 | A | — | VOLUME | COMMERCIAL | VOLUME←expand · COMMERCIAL←brand |
| 05 | A | — | VOLUME | COMMERCIAL, FINANCIAL | VOLUME←distribution · COMMERCIAL←brand · FINANCIAL←investment |
| 06 | A | EBITDA_MARGIN | — | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitable · COMMERCIAL←marketing · FINANCIAL←profitable |
| 07 | A | — | VOLUME, MIX | — | VOLUME←distribution · MIX←mix |
| 08 | B | EBITDA_MARGIN | VOLUME | COMMERCIAL, FINANCIAL, REGULATORY | EBITDA_MARGIN←profitable · VOLUME←expand · COMMERCIAL←brand · FINANCIAL←profitable · REGULATORY←licensing |
| 09 | B | — | VOLUME, COST_OPS | — | VOLUME←distribution · COST_OPS←automated |
| 10 | B | — | PRICING, VOLUME | OPERATIONAL | PRICING←pricing · VOLUME←distribution · OPERATIONAL←process |
| 11 | B | — | — | COMMERCIAL, MARKET, REGULATORY | COMMERCIAL←brand · MARKET←competition · REGULATORY←licensing |
| 12 | B | — | VOLUME | FINANCIAL | VOLUME←distribution · FINANCIAL←financial |
| 13 | B | EBITDA_MARGIN | — | COMMERCIAL, FINANCIAL, REGULATORY | EBITDA_MARGIN←profitability · COMMERCIAL←channels · FINANCIAL←profitability · REGULATORY←licensing |
| 14 | B | — | PRICING | — | PRICING←promotional |
| 15 | B | EBITDA_MARGIN | PRICING, WC_DIO | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←margins · PRICING←promotional · WC_DIO←inventory · COMMERCIAL←channel · FINANCIAL←margins |
| 16 | B | — | VOLUME | MARKET | VOLUME←distribution · MARKET←market |
| 17 | B | — | PRICING, VOLUME | COMMERCIAL | PRICING←promotional · VOLUME←channel · COMMERCIAL←channel |
| 18 | C | EBITDA_MARGIN | PRICING | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←pricing · COMMERCIAL←marketing · FINANCIAL←profitability |
| 19 | C | — | PRICING, MIX | — | PRICING←pricing · MIX←mix |
| 20 | C | REVENUE_GROWTH | VOLUME | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←expansion · VOLUME←loyalty · COMMERCIAL←brand · FINANCIAL←financial |
| 21 | D | — | VOLUME | COMMERCIAL, MARKET | VOLUME←retention · COMMERCIAL←brand · MARKET←markets |
| 22 | D | EBITDA_MARGIN | VOLUME | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · VOLUME←distribution · COMMERCIAL←brand · FINANCIAL←profitability |
| 23 | D | — | — | COMMERCIAL | COMMERCIAL←brand |
| 24 | E | — | PRICING, VOLUME | MARKET | PRICING←promotional · VOLUME←distribution · MARKET←markets |
| 25 | E | — | PRICING | — | PRICING←promotional |
| 26 | E | — | COST_PROCUREMENT | FINANCIAL | COST_PROCUREMENT←purchase · FINANCIAL←finance |
| 27 | F | — | — | FINANCIAL, ORGANIZATIONAL | FINANCIAL←financial · ORGANIZATIONAL←talent |
| 28 | F | — | VOLUME | OPERATIONAL, FINANCIAL, MARKET | VOLUME←channels · OPERATIONAL←production · FINANCIAL←financing · MARKET←market |
| 29 | F | REVENUE_GROWTH | — | OPERATIONAL, FINANCIAL, MARKET | REVENUE_GROWTH←market share · OPERATIONAL←operational · FINANCIAL←financial · MARKET←market |
| 30 | G | — | VOLUME, COST_OPS | OPERATIONAL, MARKET, REGULATORY | VOLUME←distribution · COST_OPS←automate · OPERATIONAL←production · MARKET←industry · REGULATORY←compliance |
| 31 | G | — | VOLUME, MIX, COST_OPS | COMMERCIAL, REGULATORY | VOLUME←expand · MIX←product lines · COST_OPS←staff · COMMERCIAL←marketing · REGULATORY←compliance |
| 32 | H | — | VOLUME, WC_DIO | COMMERCIAL, REGULATORY | VOLUME←expanding · WC_DIO←inventory · COMMERCIAL←brand · REGULATORY←licensing |
| 33 | I | EBITDA_MARGIN | PRICING, VOLUME | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←profitability · PRICING←discounts · VOLUME←loyalty · COMMERCIAL←channels · FINANCIAL←profitability |
| 34 | I | — | COST_PROCUREMENT | COMMERCIAL | COST_PROCUREMENT←purchase · COMMERCIAL←brand |
| 35 | I | — | VOLUME | COMMERCIAL | VOLUME←expand · COMMERCIAL←marketing |

Libellés des parties : A Content Strategy & Portfolio · B Rights, Licensing & Distribution · C Live & Experiential Entertainment · D Sports & Gaming · E Technology & Innovation · F Financing & Partnerships · G Regulatory, Compliance & Guilds · H Merchandising & Ancillary Revenue · I Audience Engagement & Monetization.

## Arbitrages

1. Corrige les lignes du mapping qui ne te conviennent pas ; le reste est appliqué tel quel
   (`tsx scripts/apply-curation.ts <archetype>` puis `npm run catalog:build -- <archetype>`).
