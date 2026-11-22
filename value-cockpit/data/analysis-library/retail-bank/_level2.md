# Retail Bank — niveau 2 (spec `src/sectors/retail-bank.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Retail Bank »,
> `data/kpi-library/Financial Services.md`, analyses #n de ce dossier.

## Formules

```
CUSTOMERS_EXIT         = CUSTOMERS * (1 + CUSTOMER_GROWTH) ^ HOLD_YEARS
REVENUE_EXIT           = CUSTOMERS_EXIT * REVENUE_PER_CUSTOMER
LOANS_EXIT             = CUSTOMERS_EXIT * LOANS_PER_CUSTOMER
PROVISIONS_EXIT        = LOANS_EXIT * COST_OF_RISK
NET_INCOME_EXIT        = (REVENUE_EXIT - CUSTOMERS_EXIT * COST_TO_SERVE - PROVISIONS_EXIT) * (1 - TAX_RATE)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Économie par client : revenu (marge d'intérêt + commissions) et coût de service par client constants en termes réels.
- Le coût du risque s'applique aux encours de prêts ; la fraude est comptée dans le coût du risque.
- Capital (CET1) et dépôts en diagnostics : la croissance n'est pas plafonnée par le capital.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `CUSTOMERS` | count | #1, #35, #45 (millions) |
| `CUSTOMER_GROWTH` | percent | #35, #45 ; #10, #42 (attrition) |
| `REVENUE_PER_CUSTOMER` | currency | #4 (Annual Revenue per Customer), #9, #41 |
| `COST_TO_SERVE` | currency | #4 (Annual Cost to Serve), #9 ; #24 (Cost-to-Income) |
| `LOANS_PER_CUSTOMER` | currency | #13, #14 |
| `COST_OF_RISK` | percent | #19, #21 ; KPI Provision for Loan Losses to Loans |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CROSS_SELL_RATIO` | ratio | #3, #41 |
| `NET_PROMOTER_SCORE` | ratio | #2 (NPS) |
| `DIGITAL_ADOPTION_RATE` | percent | #7, #30 |
| `CUSTOMER_ATTRITION_RATE` | percent | #10, #42 |
| `NPL_RATIO` | percent | #16, #21 ; KPI NPL Ratio |
| `CET1_RATIO` | percent | #26 ; KPI Basel III Ratios |
| `DEPOSIT_GROWTH` | percent | #13, #36 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `CROSS_SELL` | REVENUE_PER_CUSTOMER | 5 | #1, #3, #37, #41 |
| `DEPOSIT_PRICING` | REVENUE_PER_CUSTOMER | 3 | #33, #34, #36 |
| `DIGITAL_MIGRATION` | COST_TO_SERVE | -5 | #7, #28, #30, #39 |
| `BRANCH_OPTIMIZATION` | COST_TO_SERVE | -5 | #27, #29 |
| `ATTRITION_REDUCTION` | CUSTOMER_GROWTH | 0.005 | #10, #15, #42 |
| `CREDIT_RISK_MANAGEMENT` | COST_OF_RISK | -0.0005 | #19, #21, #23 |
| `FRAUD_PREVENTION` | COST_OF_RISK | -0.0002 | #22 |
| `PRICING` (base) | — | — | #34, #38 |

## Causes

- `INTEREST_RATES` (exogène, jamais un levier) — #33, #43
- `CREDIT_CYCLE` (exogène, jamais un levier) — #16, #19
- `FINTECH_COMPETITION` — #7, #30, #45

Référence moteur (démo) : EBITDA_EXIT = undefined.
