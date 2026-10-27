# Curation saas — mapping pré-rempli (niveau 1)

> Statut : **à arbitrer**. Proposition automatique par mots-clés sur le vocabulaire
> actif `saas` (base ∪ extension) :
> métriques ← titre + Goal, leviers ← titres « Steps to improve », causes ← titre + Goal.
> La colonne « indices » donne le mot qui a déclenché chaque proposition. Rien n'est
> appliqué aux fichiers avant ta validation ; aucun terme n'est ajouté au vocabulaire.

35 analyses · 1 sans métrique ni levier (qualitatives) · 0 à contenu réglementaire.

## Mapping proposé

| # | Partie | quant | levers | causes | indices |
|---|---|---|---|---|---|
| 01 | A | EBITDA_MARGIN, COGS | COST_OPS | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←margins · COGS←cost of goods · COST_OPS←labor · COMMERCIAL←customers · FINANCIAL←cost |
| 02 | A | REVENUE_GROWTH, ARR | VOLUME, RETENTION, EXPANSION | COMMERCIAL | REVENUE_GROWTH←growth · ARR←recurring revenue · VOLUME←customer acquisition · RETENTION←retention · EXPANSION←upsells · COMMERCIAL←customers |
| 03 | A | — | PRICING, VOLUME, EXPANSION | COMMERCIAL | PRICING←priced · VOLUME←cross-sell · EXPANSION←upsell · COMMERCIAL←customer |
| 04 | A | REVENUE_GROWTH, EXPANSION_RATE | PRICING, VOLUME, EXPANSION | COMMERCIAL | REVENUE_GROWTH←growth · EXPANSION_RATE←upsells · PRICING←pricing · VOLUME←cross-sells · EXPANSION←upsell · COMMERCIAL←customer |
| 05 | A | — | COST_OPS | FINANCIAL | COST_OPS←automate · FINANCIAL←cash |
| 06 | A | REVENUE_GROWTH, EXPANSION_RATE, LTV | PRICING, RETENTION, EXPANSION | COMMERCIAL | REVENUE_GROWTH←expansion · EXPANSION_RATE←expansion revenue · LTV←lifetime value · PRICING←pricing · RETENTION←customer success · EXPANSION←upsell · COMMERCIAL←customers |
| 07 | A | — | VOLUME, RETENTION, EXPANSION | COMMERCIAL | VOLUME←expand · RETENTION←renewal · EXPANSION←upsell · COMMERCIAL←customers |
| 08 | A | GROSS_CHURN | PRICING, VOLUME | COMMERCIAL | GROSS_CHURN←churn · PRICING←pricing · VOLUME←expand · COMMERCIAL←customers |
| 09 | A | — | VOLUME, WC_DSO, RETENTION, SALES_EFFICIENCY | — | VOLUME←retention · WC_DSO←collection · RETENTION←churn · SALES_EFFICIENCY←pipeline |
| 10 | A | EBITDA_MARGIN, REVENUE_GROWTH | PRICING | COMMERCIAL, FINANCIAL | EBITDA_MARGIN←margins · REVENUE_GROWTH←customer acquisition · PRICING←discount · COMMERCIAL←customer · FINANCIAL←margins |
| 11 | A | — | PRICING, VOLUME, COST_OPS, RETENTION, EXPANSION | ORGANIZATIONAL | PRICING←pricing · VOLUME←retention · COST_OPS←productivity · RETENTION←customer success · EXPANSION←upsell · ORGANIZATIONAL←employee |
| 12 | B | — | PRICING, RETENTION, SALES_EFFICIENCY | COMMERCIAL, OPERATIONAL | PRICING←discounts · RETENTION←onboarding · SALES_EFFICIENCY←conversion · COMMERCIAL←customers · OPERATIONAL←process |
| 13 | B | — | PRICING, SALES_EFFICIENCY | COMMERCIAL, OPERATIONAL | PRICING←promotions · SALES_EFFICIENCY←sales cycle · COMMERCIAL←customer · OPERATIONAL←process |
| 14 | B | REVENUE_GROWTH, CAC | SALES_EFFICIENCY | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←customer acquisition · CAC←acquisition cost · SALES_EFFICIENCY←conversion · COMMERCIAL←customer · FINANCIAL←cost |
| 15 | B | — | COST_OPS | COMMERCIAL, OPERATIONAL | COST_OPS←automated · COMMERCIAL←sales · OPERATIONAL←process |
| 16 | B | REVENUE_GROWTH | COST_OPS, SALES_EFFICIENCY | COMMERCIAL, FINANCIAL, MARKET | REVENUE_GROWTH←growth · COST_OPS←automation · SALES_EFFICIENCY←conversion · COMMERCIAL←sales · FINANCIAL←investments · MARKET←industry |
| 17 | B | REVENUE_GROWTH, CAC | PRICING, VOLUME, RETENTION, SALES_EFFICIENCY | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←customer acquisition · CAC←acquisition cost · PRICING←pricing · VOLUME←retention · RETENTION←retention · SALES_EFFICIENCY←cac · COMMERCIAL←customer · FINANCIAL←cost |
| 18 | B | — | PRICING | COMMERCIAL, OPERATIONAL | PRICING←pricing · COMMERCIAL←customers · OPERATIONAL←quality |
| 19 | B | REVENUE_GROWTH | VOLUME, RETENTION | — | REVENUE_GROWTH←growth · VOLUME←expand · RETENTION←retention |
| 20 | C | — | PRICING, VOLUME, RETENTION, EXPANSION | COMMERCIAL | PRICING←pricing · VOLUME←cross-sell · RETENTION←customer success · EXPANSION←upsell · COMMERCIAL←customer |
| 21 | C | GROSS_CHURN | RETENTION | COMMERCIAL | GROSS_CHURN←churn · RETENTION←customer success · COMMERCIAL←customers |
| 22 | C | REVENUE_GROWTH, GROSS_CHURN, NRR, EXPANSION_RATE | PRICING, VOLUME, COST_OPS, RETENTION, EXPANSION | COMMERCIAL | REVENUE_GROWTH←expansion · GROSS_CHURN←churn · NRR←net revenue retention · EXPANSION_RATE←upsells · PRICING←pricing · VOLUME←retention · COST_OPS←automate · RETENTION←customer success · EXPANSION←expansion · COMMERCIAL←customers |
| 23 | C | REVENUE_GROWTH, GROSS_CHURN | RETENTION | COMMERCIAL | REVENUE_GROWTH←growth · GROSS_CHURN←churn · RETENTION←onboarding · COMMERCIAL←customers |
| 24 | C | REVENUE_GROWTH, CAC, LTV | PRICING, VOLUME, RETENTION, EXPANSION | COMMERCIAL, FINANCIAL | REVENUE_GROWTH←customer acquisition · CAC←acquisition costs · LTV←lifetime value · PRICING←pricing · VOLUME←retention · RETENTION←retention · EXPANSION←upsell · COMMERCIAL←customer · FINANCIAL←costs |
| 25 | C | — | — | COMMERCIAL, FINANCIAL | COMMERCIAL←customer · FINANCIAL←costs |
| 26 | C | REVENUE_GROWTH, GROSS_CHURN | — | COMMERCIAL | REVENUE_GROWTH←growth · GROSS_CHURN←churn · COMMERCIAL←customer |
| 27 | C | GROSS_CHURN | VOLUME, RETENTION | COMMERCIAL | GROSS_CHURN←churn · VOLUME←expand · RETENTION←churn · COMMERCIAL←customer |
| 28 | C | — | COST_OPS | COMMERCIAL, OPERATIONAL | COST_OPS←automate · COMMERCIAL←customer · OPERATIONAL←process |
| 29 | D | — | VOLUME | COMMERCIAL | VOLUME←expand · COMMERCIAL←customer |
| 30 | D | — | COST_OPS, RETENTION | COMMERCIAL, OPERATIONAL | COST_OPS←automate · RETENTION←onboarding · COMMERCIAL←customer · OPERATIONAL←process |
| 31 | D | GROSS_CHURN | RETENTION | OPERATIONAL | GROSS_CHURN←churn · RETENTION←onboarding · OPERATIONAL←process |
| 32 | D | EXPANSION_RATE | PRICING, EXPANSION | COMMERCIAL | EXPANSION_RATE←upselling · PRICING←pricing · EXPANSION←upsell · COMMERCIAL←pricing |
| 33 | D | GROSS_CHURN | RETENTION | COMMERCIAL | GROSS_CHURN←churn · RETENTION←onboarding · COMMERCIAL←customers |
| 34 | D | — | VOLUME, RETENTION | COMMERCIAL | VOLUME←retention · RETENTION←onboarding · COMMERCIAL←customers |
| 35 | D | GROSS_CHURN | RETENTION | COMMERCIAL, OPERATIONAL | GROSS_CHURN←churn · RETENTION←onboarding · COMMERCIAL←customers · OPERATIONAL←process |

Libellés des parties : A Finance & Revenue · B Sales & Marketing · C Customer Retention & Success · D Product & Engagement.

## Hors vocabulaire

Aucune analyse réglementaire détectée.

## Tes arbitrages attendus

1. Corrige les lignes du mapping qui ne te conviennent pas (le reste sera appliqué tel quel).
2. `REGULATORY` dans la base : oui / non ?
