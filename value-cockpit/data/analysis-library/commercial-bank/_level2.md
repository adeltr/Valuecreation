# Commercial Bank — niveau 2 (spec `src/sectors/commercial-bank.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Commercial Bank »,
> `data/kpi-library/Financial Services.md`, analyses #n de ce dossier.

## Formules

```
LOANS_EXIT             = LOANS * (1 + LOAN_GROWTH) ^ HOLD_YEARS
NET_INTEREST_INCOME_EXIT = LOANS_EXIT * NET_INTEREST_MARGIN
REVENUE_EXIT           = NET_INTEREST_INCOME_EXIT / (1 - NON_INTEREST_INCOME_SHARE)
PROVISIONS_EXIT        = LOANS_EXIT * COST_OF_RISK
NET_INCOME_EXIT        = (REVENUE_EXIT * (1 - COST_INCOME_RATIO) - PROVISIONS_EXIT) * (1 - TAX_RATE)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- NIM rapportée aux prêts (pas aux actifs productifs) ; dépôts et titres via la NIM et en diagnostics.
- Commissions = part constante du revenu ; coût du risque constant sur le cycle (le cycle de crédit est une cause exogène).
- Croissance des prêts non plafonnée par le CET1 : la contrainte de capital reste un diagnostic.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `LOANS` | currency | #4 loan portfolio, #14 specialized lending |
| `LOAN_GROWTH` | percent | #5, #9, #14 |
| `NET_INTEREST_MARGIN` | percent | #1, #10, #26, #27 ; KPI Net Interest Margin (NII / prêts) |
| `NON_INTEREST_INCOME_SHARE` | percent | #2, #32, #33, #34, #37 ; KPI Non-interest income to total income |
| `COST_INCOME_RATIO` | percent | #3, #28, #31 ; KPI Cost-to-Income Ratio |
| `COST_OF_RISK` | percent | #4, #8, #15 ; KPI Provision for Loan Losses to Loans |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CET1_RATIO` | percent | #25 ; KPI Basel III Ratios |
| `NPL_RATIO` | percent | #4, #8 ; KPI NPL Ratio |
| `LOAN_TO_DEPOSIT_RATIO` | percent | #23, #24 ; KPI Loan-to-Deposit Ratio |
| `LIQUIDITY_COVERAGE_RATIO` | ratio | #24 ; KPI LCR |
| `COST_OF_FUNDS` | percent | #23 |
| `SECTOR_CONCENTRATION` | percent | #7 |
| `RWA_DENSITY` | percent | #22, #25 ; KPI Risk-Weighted Assets |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `LOAN_PRICING` | NET_INTEREST_MARGIN | 0.001 | #10, #27 |
| `DEPOSIT_FRANCHISE` | NET_INTEREST_MARGIN | 0.001 | #23, #24, #26 |
| `FEE_BUSINESS_GROWTH` | NON_INTEREST_INCOME_SHARE | 0.01 | #2, #32, #33, #34, #37 |
| `COST_TRANSFORMATION` | COST_INCOME_RATIO | -0.01 | #3, #28, #31 |
| `CREDIT_RISK_MANAGEMENT` | COST_OF_RISK | -0.001 | #4, #5, #8, #15, #21 |
| `ORIGINATION_GROWTH` | LOAN_GROWTH | 0.01 | #9, #11, #12, #14, #35 |
| `PRICING` (base) | — | — | #10, #37 |

## Causes

- `INTEREST_RATES` (exogène, jamais un levier) — #1, #16, #26
- `CREDIT_CYCLE` (exogène, jamais un levier) — #4, #15, #16
- `CYBER` — #20

Référence moteur (démo) : EBITDA_EXIT = undefined.
