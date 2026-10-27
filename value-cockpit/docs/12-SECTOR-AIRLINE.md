# 12 · Extension Airline

Archétype `airline` = Umbrex « Airline Company » (secteur parent Travel &
Hospitality, KPI Travel & Logistics). Vocabulaire et mapping arbitrés par
l'analyste dans `data/analysis-library/airline/_curation.md`.

## Drivers opérationnels

| Code | Unité | Rôle | Source |
|---|---|---|---|
| `ASK` | count | capacité offerte | KPI vault, #13 |
| `LOAD_FACTOR` | percent | `RPK = ASK × LF` | KPI vault, #13 |
| `YIELD` | currency / RPK | revenu billet | KPI vault, #3 |
| `ANCILLARY_PER_PAX` | currency | revenus annexes | #23 |
| `CASK_EX_FUEL` | currency / ASK | coûts hors carburant, hors D&A | KPI CASK, #8 |
| `FUEL_CASK` | currency / ASK | coût carburant | #33 |
| `AVG_TRIP_KM` | count | passagers = RPK / trajet moyen | KPI Average Length of Haul |
| `CAPACITY_GROWTH` | percent | croissance de l'ASK | **choix d'analyste** |

Diagnostic benchmarké (pas de formule v1) : `FLEET_UTILIZATION`,
`AIRCRAFT_DOWNTIME`, `ON_TIME_PERFORMANCE`, `TURNAROUND_MINUTES`,
`LABOR_COST_PER_FLIGHT`, `MARKET_SHARE`, `BREAKEVEN_LOAD_FACTOR`,
`LOYALTY_BREAKAGE_RATE`. Cargo hors périmètre v1.

## Formules (src/templates/airline.ts)

```
ASK_EXIT             = ASK × (1 + CAPACITY_GROWTH) ^ HOLD_YEARS
RPK_EXIT             = ASK_EXIT × LOAD_FACTOR
PASSENGERS_EXIT      = RPK_EXIT / AVG_TRIP_KM
REVENUE_EXIT         = RPK_EXIT × YIELD + PASSENGERS_EXIT × ANCILLARY_PER_PAX
OPERATING_COSTS_EXIT = ASK_EXIT × (CASK_EX_FUEL + FUEL_CASK)
EBITDA_EXIT          = REVENUE_EXIT − OPERATING_COSTS_EXIT
```
Bridge deux points de la base ensuite. **Approximations :** `EBITDA_ENTRY`
est la donnée historique (input), donc un levier ne bouge jamais le prix
d'entrée ; base EBITDA et non EBITDAR ; trajet moyen constant.

## Leviers et causes

Leviers : `NETWORK_OPTIMIZATION` (LF, capacité) · `REVENUE_MANAGEMENT` (yield) ·
`ANCILLARY` · `FLEET_PRODUCTIVITY`, `CREW_PRODUCTIVITY`, `AIRPORT_GROUND_COST`
(CASK hors carburant) · `FUEL_EFFICIENCY` (fuel CASK) · `FLEET_FINANCING`
(qualitatif v1 : la dette nette n'est pas une cible de levier) · `ALLIANCES`.

Causes ajoutées : `REGULATORY` (#7, #30, #32) · `FUEL_PRICE` (#10, #33, #36 —
exogène, jamais un levier) · `LABOR` (#12, #17).

## Catalogue

40 analyses, parties A–I, dans `src/catalog/airline.catalog.json`, généré par
`npm run catalog:build -- airline`. Injecté dans le prompt du copilote.

## Tests de référence (src/templates/airline.test.ts)

ASK 10 000, LF 82 %, yield 0,09, ancillary 15 €/pax, trajet 1 500 km, CASK
hors carburant 0,045, fuel CASK 0,022, croissance 4 %/an, EBITDA d'entrée 150,
multiples 6x/6x, 5 ans, dette nette 400, FCF 40/an.
- `FUEL_EFFICIENCY` fuel CASK −0,002 (absolu) ⇒ coûts de sortie −ASK_EXIT × 0,002,
  MOIC ↑, `EQUITY_ENTRY` inchangé.
- `NETWORK_OPTIMIZATION` LF +2 pts ⇒ hausse du revenu billet ET ancillary.
