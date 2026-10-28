# P&C Insurance — niveau 2 (spec `src/sectors/pc-insurance.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « P&C Insurance Company »,
> `data/kpi-library/Insurance.md`, analyses #n de ce dossier.

## Formules

```
NET_PREMIUMS_EARNED_EXIT = NET_PREMIUMS_EARNED * (1 + PREMIUM_GROWTH) ^ HOLD_YEARS
COMBINED_RATIO         = LOSS_RATIO + EXPENSE_RATIO
UNDERWRITING_RESULT_EXIT = NET_PREMIUMS_EARNED_EXIT * (1 - COMBINED_RATIO)
INVESTMENT_INCOME_EXIT = NET_PREMIUMS_EARNED_EXIT * FLOAT_RATIO * INVESTMENT_YIELD
NET_INCOME_EXIT        = (UNDERWRITING_RESULT_EXIT + INVESTMENT_INCOME_EXIT) * (1 - TAX_RATE)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Ratios de sinistres et de frais nets de réassurance ; coût de la réassurance porté par le ratio de frais.
- Placements = primes × FLOAT_RATIO (réserves techniques), rendement moyen constant ; plus-values non modélisées.
- Développement des réserves et capital de solvabilité en diagnostics : le dividende n'est pas plafonné par le RBC.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `NET_PREMIUMS_EARNED` | currency | KPI Premiums Written ; #38 (Premiums per Channel) |
| `PREMIUM_GROWTH` | percent | #7 (New Business Growth Rate) ; KPI Direct Premiums Written Growth Rate |
| `LOSS_RATIO` | percent | #1, #3, #11 (Loss Ratio) ; KPI Loss Ratio |
| `EXPENSE_RATIO` | percent | #2, #3 (Expense Ratio) ; KPI Expense Ratio |
| `INVESTMENT_YIELD` | percent | #34 (Portfolio Return) ; KPI Investment Yield |
| `FLOAT_RATIO` | ratio | KPI Unearned Premium Reserve, IBNR ; #15, #33 (réserves) — placements / primes |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `RESERVE_DEVELOPMENT_RATIO` | percent | #15, #33, #36 (Reserve Development Ratio) |
| `POLICY_RETENTION_RATE` | percent | #6, #13, #42 ; KPI Policy Renewal Rate |
| `CATASTROPHE_LOSS_RATIO` | percent | #22, #24, #30 ; KPI Catastrophe Loss Ratio |
| `SOLVENCY_RATIO` | ratio | #28, #45 (RBC Ratio) ; KPI Solvency Ratio |
| `REINSURANCE_CEDED_RATIO` | percent | #25, #32 ; KPI Reinsurance Ratio |
| `CLAIMS_SETTLEMENT_DAYS` | days | #16 (Average Settlement Time) |
| `LITIGATION_RATE` | percent | #19, #31 (Litigation Frequency) |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `UNDERWRITING_DISCIPLINE` | LOSS_RATIO | -0.01 | #4, #11, #12, #27 |
| `CLAIMS_EXCELLENCE` | LOSS_RATIO | -0.005 | #16, #17, #19, #31 |
| `PORTFOLIO_STEERING` | LOSS_RATIO | -0.005 | #8, #9, #37 |
| `REINSURANCE_OPTIMIZATION` | EXPENSE_RATIO | -0.003 | #25, #32 |
| `DISTRIBUTION_EFFICIENCY` | EXPENSE_RATIO | -0.005 | #2, #21, #38 |
| `RETENTION_GROWTH` | PREMIUM_GROWTH | 0.01 | #6, #7, #13, #42 |
| `INVESTMENT_ALLOCATION` | INVESTMENT_YIELD | 0.0025 | #34, #35 |
| `PRICING` (base) | — | — | #4, #27, #40 |

## Causes

- `CATASTROPHE_EXPOSURE` (exogène, jamais un levier) — #24, #26, #30
- `SOCIAL_INFLATION` (exogène, jamais un levier) — #18, #31
- `RESERVE_RISK` — #15, #20, #33, #36

Référence moteur (démo) : EBITDA_EXIT = undefined.
