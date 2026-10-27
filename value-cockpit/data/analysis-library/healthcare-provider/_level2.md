# Healthcare Provider — niveau 2 (spec `src/sectors/healthcare-provider.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Healthcare Provider »,
> `data/kpi-library/Healthcare.md`, analyses #n de ce dossier.

## Formules

```
VOLUME_INDEX_EXIT      = min((1 + VOLUME_GROWTH) ^ HOLD_YEARS, 1 / BED_OCCUPANCY_RATE)
REVENUE_EXIT           = REVENUE * VOLUME_INDEX_EXIT * (1 + REIMBURSEMENT_GROWTH) ^ HOLD_YEARS * (1 - REVENUE_LEAKAGE_RATE)
EBITDA_MARGIN_EXIT     = 1 - LABOR_COST_RATE - SUPPLY_COST_RATE - OTHER_OPEX_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Volume plafonné par les lits : quand le plafond est atteint, seule la réduction de durée de séjour libère de la croissance.
- Coûts en % du revenu net ; pas de distinction hospitalisation / ambulatoire.
- OTHER_OPEX_RATE est un choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `VOLUME_GROWTH` | percent | #1 (Growth Rate), #38, #39 service lines / outpatient |
| `REIMBURSEMENT_GROWTH` | percent | #10 CDI (Case Mix Index), #16 payer mix, #18, #19 |
| `BED_OCCUPANCY_RATE` | percent | #5, #46 (Bed Occupancy Rate) ; KPI BOR |
| `REVENUE_LEAKAGE_RATE` | percent | #15 (Denial Rate, Write-Off Rate), #17 |
| `LABOR_COST_RATE` | percent | #30, #42 (Revenue per Staff Member), #43 |
| `SUPPLY_COST_RATE` | percent | #13, #14 (Cost per Discharge) |
| `OTHER_OPEX_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `AVERAGE_LENGTH_OF_STAY` | days | #5 ; KPI ALOS |
| `READMISSION_RATE` | percent | #3, #5, #12 |
| `CASE_MIX_INDEX` | ratio | #10 (CMI) |
| `DAYS_IN_AR` | days | #15 |
| `OR_UTILIZATION` | percent | #8 |
| `STAFF_TURNOVER_RATE` | percent | #34, #42, #43 |
| `NO_SHOW_RATE` | percent | #21, #25, #36 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `LOS_OPTIMIZATION` | BED_OCCUPANCY_RATE | -0.03 | #5, #6, #12, #46 |
| `REVENUE_CYCLE` | REVENUE_LEAKAGE_RATE | -0.01 | #15, #17 |
| `WORKFORCE_PRODUCTIVITY` | LABOR_COST_RATE | -0.01 | #30, #42, #43 |
| `SUPPLY_STANDARDIZATION` | SUPPLY_COST_RATE | -0.01 | #6, #13, #14 |
| `CDI_PAYER_MIX` | REIMBURSEMENT_GROWTH | 0.005 | #10, #16, #18, #19 |
| `SERVICE_LINE_GROWTH` | — (qualitatif) | — | #1, #22, #38, #39 |
| `WC_DSO` (base) | — | — | #15 |
| `CAPEX_DISCIPLINE` (base) | — | — | #45 |

## Causes

- `REIMBURSEMENT_PRESSURE` (exogène, jamais un levier) — #16, #17, #19
- `LABOR` — #42, #43

Référence moteur (démo) : EBITDA_EXIT = 179.56250615807988.
