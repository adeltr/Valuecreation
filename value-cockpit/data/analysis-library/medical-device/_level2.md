# Medical Device — niveau 2 (spec `src/sectors/medical-device.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Medical Device Company »,
> `data/kpi-library/Medical Devices.md`, analyses #n de ce dossier.

## Formules

```
REVENUE_EXIT           = REVENUE * ((1 + PROCEDURE_VOLUME_GROWTH) * (1 + ASP_GROWTH)) ^ HOLD_YEARS
EBITDA_MARGIN_EXIT     = GROSS_MARGIN - RD_RATE - SALES_MARKETING_RATE - QUALITY_REGULATORY_COST_RATE - OVERHEAD_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Un portefeuille agrégé : pas de courbe d'adoption par dispositif ni de pipeline probabilisé (diagnostics).
- Coût qualité-réglementaire en % du chiffre d'affaires ; les ruptures (rappel, refus) sont des causes.
- OVERHEAD_RATE est un choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `PROCEDURE_VOLUME_GROWTH` | percent | #22 market entry, #38 adoption, #39 KOL, #40 training ; KPI Adoption Rate for New Devices |
| `ASP_GROWTH` | percent | #19 reimbursement & coding, #20 HEOR, #23, #24 HTA |
| `GROSS_MARGIN` | percent | #28, #30 scalability, #33, #37 |
| `RD_RATE` | percent | #25 pipeline & R&D portfolio, #29 |
| `SALES_MARKETING_RATE` | percent | #21, #22, #38, #39, #40 |
| `QUALITY_REGULATORY_COST_RATE` | percent | #1–#10 (réglementaire), #12 PMS, #17 recall readiness |
| `OVERHEAD_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CLINICAL_TRIAL_SUCCESS_RATE` | percent | #11, #13, #15 ; KPI Clinical Trial Success Rate |
| `TIME_TO_MARKET` | days | #1, #4, #25 |
| `RECALL_RATE` | percent | #12, #17 |
| `NEW_PRODUCT_REVENUE_SHARE` | percent | #25, #26 |
| `REIMBURSEMENT_COVERAGE` | percent | #19, #24 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `PHYSICIAN_ADOPTION` | PROCEDURE_VOLUME_GROWTH | 0.01 | #38, #39, #40, #43 |
| `MARKET_ACCESS` | ASP_GROWTH | 0.005 | #19, #20, #23, #24 |
| `MANUFACTURING_SCALE` | GROSS_MARGIN | 0.01 | #28, #30, #33, #37 |
| `REGULATORY_STRATEGY` | QUALITY_REGULATORY_COST_RATE | -0.005 | #1, #4, #5, #6, #7 |
| `PORTFOLIO_LIFECYCLE` | RD_RATE | -0.005 | #25, #26, #29, #36 |
| `COMMERCIAL_EFFICIENCY` | SALES_MARKETING_RATE | -0.01 | #21, #22 |
| `COST_PROCUREMENT` (base) | — | — | #31 |

## Causes

- `REIMBURSEMENT_PRESSURE` (exogène, jamais un levier) — #19, #23
- `PRODUCT_QUALITY_RISK` — #12, #17, #34

Référence moteur (démo) : EBITDA_EXIT = 72.54043490269905.
