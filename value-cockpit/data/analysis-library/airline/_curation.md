# Curation Airline — KPI (type 2) · table de revue

> Statut : **à arbitrer**. Rien ici n'est dans l'ontologie. Source :
> `data/kpi-library/Travel & Logistics.md` (65 KPI, partagés avec hôtellerie,
> croisière et logistique). Les 40 analyses Airline ne sont pas encore reçues :
> la colonne « analyses » est une hypothèse d'après les titres de l'index.
>
> Piles (docs/08) : **1** = input relié par formule au bridge · **2** = métrique
> de diagnostic benchmarkée · **3** = hors périmètre v1.

## Pile 1 proposée — inputs liés par formule

| KPI vault | Code candidat | Unité | Rôle dans la formule | Analyses (titres) |
|---|---|---|---|---|
| Available Seat Kilometers (ASK) | `ASK` | count | capacité offerte | #8, #13 |
| Load Factor | `LOAD_FACTOR` | percent | `RPK = ASK × LOAD_FACTOR` | #13 |
| Yield | `YIELD` | currency (par RPK) | `PAX_REVENUE = RPK × YIELD` | #22, #25 |
| Cost per Available Seat Kilometer (CASK) | `CASK` | currency (par ASK) | `COSTS = ASK × CASK` | #35 |
| Fuel Cost as Percentage of Revenue | `FUEL_COST_SHARE` | percent | à trancher : sous-composante de CASK, ou diagnostic | #33, #36 |
| *(absent du vault)* | `ANCILLARY_PER_PAX` | currency | revenus annexes | #23, #27 |
| *(absent du vault)* | `CAPACITY_GROWTH` | percent | `ASK_EXIT = ASK × (1+g)^HOLD_YEARS` | #1, #5 |

Formules candidates (seulement si tu valides la pile 1) :
```
RPK          = ASK × LOAD_FACTOR
REVENUE      = RPK × YIELD (+ ancillary si retenu)
EBITDA       = REVENUE − ASK × CASK          ← suppose un CASK hors D&A (à confirmer)
ASK_EXIT     = ASK × (1 + CAPACITY_GROWTH) ^ HOLD_YEARS
EBITDA_EXIT  = ASK_EXIT × (LOAD_FACTOR × YIELD − CASK)
```

## Pile 2 proposée — diagnostic benchmarké

| KPI vault | Code candidat | Unité | Remarque |
|---|---|---|---|
| Breakeven Load Factor | `BREAKEVEN_LOAD_FACTOR` | percent | dérivable de CASK/YIELD : à garder en diagnostic pour ne pas doubler la formule |
| On-Time Performance | `ON_TIME_PERFORMANCE` | percent | #15 |
| Turnaround Time | `TURNAROUND_MINUTES` | count (minutes) | #19, #21 ; il manque une unité « minutes » dans `UNITS` |
| Fuel Efficiency | `FUEL_EFFICIENCY` | ratio | #10 |
| Passenger Revenue per Employee | `PAX_REVENUE_PER_EMPLOYEE` | currency | #17 |
| Baggage Handling Errors | `BAGGAGE_ERROR_RATE` | ratio | #19 |
| Passenger Complaints | `PASSENGER_COMPLAINTS` | count | #28 |
| Cargo Load Factor | `CARGO_LOAD_FACTOR` | percent | seulement si le cargo (#24) est dans le périmètre |

## Pile 3 proposée — hors périmètre v1

- **Cargo / freight forwarding** : ACTK, NFD, RCS, GAR, GP per kg, Loss/Open Files, accruals.
- **Hôtellerie / croisière / restauration** : ADR, RevPAR, RevPOR, RevPASH, occupancy, cruise, overbooking, guests per employee.
- **Logistique** : OTIF, perfect order, fill rate, dwell time, landed cost, warehousing, freight tonnage, length of haul.
- **Redondant avec la base** : Operating Expense Ratio (= 1 − marge d'exploitation), Inventory Turnover (≈ DIO), Employee Turnover (→ cause ORGANIZATIONAL).
- **Contexte/cause, pas une métrique** : Carbon Footprint (→ cause REGULATORY, ETS, #30).

## Tes arbitrages attendus

1. Pile 1 : garder, retirer ou déplacer chaque ligne.
2. `ANCILLARY_PER_PAX` et `CAPACITY_GROWTH` n'existent pas dans le vault : on les ajoute, oui ou non ?
3. CASK hors D&A (EBITDA) ou y compris D&A ? Base EBITDA ou EBITDAR ?
4. Le cargo est-il dans le périmètre v1 ?
