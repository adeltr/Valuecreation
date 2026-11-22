# Pharmaceutical — niveau 2 (spec `src/sectors/pharma.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Pharmaceutical Company »,
> `data/kpi-library/Pharmaceuticals.md`, analyses #n de ce dossier.

## Formules

```
REVENUE_EXIT           = REVENUE * (1 + BASE_PORTFOLIO_GROWTH) ^ HOLD_YEARS * (1 - LOE_REVENUE_AT_RISK * GENERIC_EROSION_RATE) + REVENUE * LAUNCH_REVENUE_RATIO
EBITDA_MARGIN_EXIT     = GROSS_MARGIN - RD_RATE - SGA_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Lancements en ratio du chiffre d'affaires d'entrée, déjà ajustés du risque : pas de rNPV par molécule (diagnostics).
- Érosion à la perte d'exclusivité appliquée en une fois sur la part à risque pendant la détention.
- GROSS_MARGIN est un choix d'analyste (aucune analyse de coût de revient).

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `BASE_PORTFOLIO_GROWTH` | percent | #21 pricing & reimbursement, #26, #31 generics share |
| `LOE_REVENUE_AT_RISK` | percent | #34 patent expiry, #35 market exclusivity |
| `GENERIC_EROSION_RATE` | percent | #17 (Market Erosion) biosimilars |
| `LAUNCH_REVENUE_RATIO` | ratio | #1, #2, #5 (pipeline, risk-adjusted), #25 launch sequencing |
| `GROSS_MARGIN` | percent | #12 GMP, #16 supply chain — choix d'analyste |
| `RD_RATE` | percent | #1, #3 (Cost per Candidate), #8 adaptive trials |
| `SGA_RATE` | percent | #28 HCP engagement, #32 sales force, #33 specialty pharmacy |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CLINICAL_TRIAL_SUCCESS_RATE` | percent | #2 (Phase success rates) |
| `PIPELINE_ATTRITION_RATE` | percent | #5 |
| `TIME_TO_MARKET` | days | #6, #9 (time saved with BTD) |
| `COLD_CHAIN_DEVIATION_RATE` | percent | #16 |
| `PATIENT_ADHERENCE_RATE` | percent | #18 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `PIPELINE_PRODUCTIVITY` | LAUNCH_REVENUE_RATIO | 0.02 | #1, #2, #3, #5, #8 |
| `LICENSING_BD` | LAUNCH_REVENUE_RATIO | 0.02 | #29, #30 |
| `LIFECYCLE_MANAGEMENT` | GENERIC_EROSION_RATE | -0.05 | #15, #18, #34, #35 |
| `MARKET_ACCESS` | BASE_PORTFOLIO_GROWTH | 0.005 | #21, #22, #36 |
| `SALES_FORCE_EFFECTIVENESS` | SGA_RATE | -0.01 | #28, #32, #33 |
| `RD_PRODUCTIVITY` | RD_RATE | -0.005 | #3, #8, #23 |

## Causes

- `PATENT_CLIFF` — #34, #35
- `BIOSIMILAR_COMPETITION` — #17, #31
- `DRUG_PRICING_REGULATION` (exogène, jamais un levier) — #14, #21, #27

Référence moteur (démo) : EBITDA_EXIT = 636.5199975840001.
