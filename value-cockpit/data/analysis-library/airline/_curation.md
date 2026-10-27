# Curation Airline — table de revue (KPI + 40 analyses)

> Statut : **validé par l'analyste** (tous les choix proposés retenus). Appliqué dans
> `src/ontology/sectors/airline.ts`, `src/templates/airline.ts`, les frontmatters des
> 40 analyses et `src/catalog/airline.catalog.json`. Sources :
> `data/kpi-library/Travel & Logistics.md` (KPI vault) et les 40 analyses de ce
> dossier (formules citées avec leur numéro). Piles (docs/08) : **1** = input
> relié par formule · **2** = diagnostic benchmarké · **3** = hors périmètre v1.

## 1. Vocabulaire — métriques candidates

### Pile 1 proposée — inputs liés par formule

| Code candidat | Unité | Source vault | Formule source (analyse) | Statut |
|---|---|---|---|---|
| `ASK` | count | KPI ASK | #13 `Load Factor = (RPK / ASK) x 100` | sourcé |
| `LOAD_FACTOR` | percent | KPI Load Factor | #1, #3, #6, #10, #13, #22 | sourcé |
| `YIELD` | currency / RPK | KPI Yield | #3 `Yield = Total Passenger Revenue / RPK` (#6, #22, #25) | sourcé |
| `CASK_EX_FUEL` | currency / ASK | KPI CASK (total) | #8 `CASK = Total Operating Costs / ASK` moins la part carburant | dérivé : à valider |
| `FUEL_CASK` | currency / ASK | KPI Fuel Cost % Revenue | #33 `CASM (Fuel) = Total Fuel Cost / ASM` | sourcé |
| `ANCILLARY_PER_PAX` | currency | — | #23 `Revenue per Service = Total Revenue from Service / Total Passengers` | sourcé par l'analyse |
| `CAPACITY_GROWTH` | percent | — | aucune | **choix d'analyste** |

Séparer `CASK` en hors carburant + carburant rend le levier FUEL_EFFICIENCY
simulable indépendamment des autres coûts.

Formules candidates (seulement si tu valides la pile 1) :
```
RPK            = ASK × LOAD_FACTOR
REVENUE        = RPK × YIELD + PAX × ANCILLARY_PER_PAX     ← PAX à ajouter, ou ancillary par ASK
COSTS          = ASK × (CASK_EX_FUEL + FUEL_CASK)
EBITDA         = REVENUE − COSTS                            ← suppose des CASK hors D&A
ASK_EXIT       = ASK × (1 + CAPACITY_GROWTH) ^ HOLD_YEARS
```

Aucune analyse ne parle d'EBITDAR, d'IFRS 16 ou de RASK. Seul le #34
(`Debt/Lease Servicing Ratio`) traite les loyers. Le choix EBITDA vs EBITDAR
reste entièrement le tien.

### Pile 2 proposée — diagnostic benchmarké

| Code candidat | Unité | Source |
|---|---|---|
| `FLEET_UTILIZATION` | ratio (h/jour) | #8 `Utilization Rate = Total Flight Hours / Total Days in Operation` |
| `AIRCRAFT_DOWNTIME` | percent | #8 `Downtime Percentage`, #11, #14 |
| `ON_TIME_PERFORMANCE` | percent | KPI + #15 |
| `TURNAROUND_MINUTES` | count | KPI + #19 (pas d'unité « minutes » dans `UNITS`) |
| `LABOR_COST_PER_FLIGHT` | currency | #17 |
| `MARKET_SHARE` | percent | KPI + #3, #6 |
| `BREAKEVEN_LOAD_FACTOR` | percent | KPI (dérivable de CASK / YIELD) |
| `LOYALTY_BREAKAGE_RATE` | percent | #27 |
| `CARGO_LOAD_FACTOR` | percent | KPI + #24 (si cargo retenu) |

### Pile 3 proposée — hors périmètre v1
Cargo/forwarding (ACTK, RTK, NFD, RCS…) sauf si tu retiens le #24 ;
hôtellerie, croisière, logistique (≈ 40 KPI du fichier Travel & Logistics) ;
métriques de process trop fines (temps d'embarquement #21, coût de dégivrage
#31, simulateurs #12, fraude #37, downtime IT #40) → citées dans le catalogue,
pas dans le vocabulaire.

## 2. Catégories de leviers candidates (9, d'après les « Steps to improve »)

| Catégorie | Cible | Analyses |
|---|---|---|
| `NETWORK_OPTIMIZATION` | LOAD_FACTOR, CAPACITY_GROWTH | #1–6, #13 |
| `REVENUE_MANAGEMENT` | YIELD | #3, #6, #22, #25 (recouvre `PRICING` de la base : à trancher) |
| `ANCILLARY` | ANCILLARY_PER_PAX | #23, #26, #27 |
| `FLEET_PRODUCTIVITY` | CASK_EX_FUEL (via FLEET_UTILIZATION) | #8, #11, #14, #18 |
| `FUEL_EFFICIENCY` | FUEL_CASK | #10, #30, #33, #36 |
| `CREW_PRODUCTIVITY` | CASK_EX_FUEL | #12, #17 |
| `AIRPORT_GROUND_COST` | CASK_EX_FUEL | #16, #19, #20, #21, #35 |
| `FLEET_FINANCING` | NET_DEBT / loyers | #9, #34 |
| `ALLIANCES` | LOAD_FACTOR, YIELD | #38, #39 |

## 3. Catégories de causes candidates

`REGULATORY` (#7 droits de trafic, #30 émissions, #32 sécurité) ·
`FUEL_PRICE` (#10, #33, #36 — exogène, jamais un levier) · `LABOR` (#12, #17).
Météo (#31) → base `OPERATIONAL`. Concurrence (#6) → base `MARKET`.

## 4. Catalogue — mapping proposé par analyse

| # | Partie | quant | levers | causes |
|---|---|---|---|---|
| 01 | A | LOAD_FACTOR | NETWORK_OPTIMIZATION, ALLIANCES | MARKET |
| 02 | A | LOAD_FACTOR | NETWORK_OPTIMIZATION | OPERATIONAL |
| 03 | A | LOAD_FACTOR, YIELD, MARKET_SHARE | NETWORK_OPTIMIZATION, REVENUE_MANAGEMENT | MARKET |
| 04 | A | LOAD_FACTOR | NETWORK_OPTIMIZATION, REVENUE_MANAGEMENT | MARKET |
| 05 | A | — | NETWORK_OPTIMIZATION, AIRPORT_GROUND_COST | MARKET, REGULATORY |
| 06 | A | LOAD_FACTOR, YIELD, MARKET_SHARE | REVENUE_MANAGEMENT, NETWORK_OPTIMIZATION | MARKET |
| 07 | A | — | NETWORK_OPTIMIZATION | REGULATORY |
| 08 | B | FLEET_UTILIZATION, AIRCRAFT_DOWNTIME, CASK_EX_FUEL | FLEET_PRODUCTIVITY, FUEL_EFFICIENCY | OPERATIONAL |
| 09 | B | — | FLEET_FINANCING | FINANCIAL |
| 10 | B | LOAD_FACTOR, FUEL_CASK | FUEL_EFFICIENCY | FUEL_PRICE |
| 11 | B | AIRCRAFT_DOWNTIME | FLEET_PRODUCTIVITY | OPERATIONAL |
| 12 | B | — | CREW_PRODUCTIVITY | LABOR |
| 13 | C | LOAD_FACTOR, ASK | NETWORK_OPTIMIZATION, REVENUE_MANAGEMENT | MARKET |
| 14 | C | AIRCRAFT_DOWNTIME | FLEET_PRODUCTIVITY, COST_PROCUREMENT | OPERATIONAL |
| 15 | C | ON_TIME_PERFORMANCE | AIRPORT_GROUND_COST, CREW_PRODUCTIVITY | OPERATIONAL |
| 16 | C | — | AIRPORT_GROUND_COST | OPERATIONAL |
| 17 | C | LABOR_COST_PER_FLIGHT | CREW_PRODUCTIVITY | LABOR |
| 18 | C | — | FLEET_PRODUCTIVITY, REVENUE_MANAGEMENT | COMMERCIAL |
| 19 | C | TURNAROUND_MINUTES | AIRPORT_GROUND_COST | OPERATIONAL |
| 20 | C | — | AIRPORT_GROUND_COST, COST_PROCUREMENT | OPERATIONAL |
| 21 | C | — | AIRPORT_GROUND_COST | OPERATIONAL |
| 22 | D | LOAD_FACTOR, YIELD | REVENUE_MANAGEMENT | COMMERCIAL |
| 23 | D | ANCILLARY_PER_PAX | ANCILLARY | COMMERCIAL |
| 24 | D | — | — | COMMERCIAL |
| 25 | D | YIELD | REVENUE_MANAGEMENT | COMMERCIAL |
| 26 | D | ANCILLARY_PER_PAX | ANCILLARY | COMMERCIAL |
| 27 | D | LOYALTY_BREAKAGE_RATE | ANCILLARY | FINANCIAL |
| 28 | E | — | ANCILLARY | COMMERCIAL |
| 29 | E | — | ANCILLARY | COMMERCIAL |
| 30 | F | FUEL_CASK | FUEL_EFFICIENCY | REGULATORY |
| 31 | F | — | AIRPORT_GROUND_COST | OPERATIONAL |
| 32 | F | — | — | REGULATORY |
| 33 | G | FUEL_CASK | FUEL_EFFICIENCY | FUEL_PRICE |
| 34 | G | — | FLEET_FINANCING | FINANCIAL |
| 35 | G | CASK_EX_FUEL | AIRPORT_GROUND_COST, NETWORK_OPTIMIZATION | OPERATIONAL |
| 36 | G | FUEL_CASK | FUEL_EFFICIENCY | FUEL_PRICE |
| 37 | G | — | — | FINANCIAL |
| 38 | H | — | ALLIANCES | COMMERCIAL |
| 39 | H | — | ALLIANCES | COMMERCIAL |
| 40 | I | — | COST_OPS | ORGANIZATIONAL |

Libellés des parties : A Network and Route Management · B Fleet and Asset
Optimization · C Operational Efficiency · D Revenue and Yield Maximization ·
E Customer Experience and Loyalty · F Regulatory and Environmental Compliance ·
G Cost Management and Financial Strategy · H Alliance and Partnership Strategy ·
I Technology and Digital Transformation.

## Arbitrages retenus

1. Pile 1 validée : CASK séparé en `CASK_EX_FUEL` + `FUEL_CASK`, `ANCILLARY_PER_PAX`
   retenu ; les passagers sont dérivés de `RPK / AVG_TRIP_KM` (KPI Average Length of Haul).
2. `CAPACITY_GROWTH` : choix d'analyste (aucune source Umbrex).
3. Bridge EBITDA (pas EBITDAR), CASK hors D&A ; `EBITDA_ENTRY` = donnée historique.
4. Cargo hors périmètre v1 : `CARGO_LOAD_FACTOR` non ajouté, #24 sans quant ni levier.
5. `REVENUE_MANAGEMENT` : catégorie propre à Airline.
6. Mapping §4 appliqué tel quel.
