# Life Insurance — niveau 2 (spec `src/sectors/life-insurance.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Life Insurance Company »,
> `data/kpi-library/Insurance.md`, analyses #n de ce dossier.

## Formules

```
RESERVES_EXIT          = RESERVES * (1 + RESERVE_GROWTH) ^ HOLD_YEARS
GROSS_PREMIUMS_EXIT    = GROSS_PREMIUMS * (1 + PREMIUM_GROWTH) ^ HOLD_YEARS
SPREAD_INCOME_EXIT     = RESERVES_EXIT * INVESTMENT_SPREAD
UNDERWRITING_MARGIN_EXIT = GROSS_PREMIUMS_EXIT * (1 - BENEFITS_RATIO - EXPENSE_RATIO)
NET_INCOME_EXIT        = (SPREAD_INCOME_EXIT + UNDERWRITING_MARGIN_EXIT) * (1 - TAX_RATE)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Résultat = marge financière (provisions × spread) + marge technique (primes × (1 − prestations − frais)) : pas d'embedded value ni d'IFRS 17 (CSM).
- Les prestations incluent la variation des provisions ; mortalité et longévité tenues à leur niveau d'expérience.
- Solvabilité, VNB et duration gap en diagnostics ; le dividende n'est pas plafonné par le capital requis.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `RESERVES` | currency | KPI Life Insurance In-Force, Change in Insurance Reserves ; #7 |
| `RESERVE_GROWTH` | percent | #22 (Premium Growth, New Business Growth) ; KPI Annuity Net Flows |
| `INVESTMENT_SPREAD` | percent | #29 (Investment Return) moins taux crédité ; KPI Investment Yield |
| `GROSS_PREMIUMS` | currency | KPI Premiums Written ; #22 |
| `PREMIUM_GROWTH` | percent | #22, #33 (Premium Growth) |
| `BENEFITS_RATIO` | percent | KPI Benefits Ratio ; #8, #13 (mortalité), #18, #20 (Claim/Loss Ratio) |
| `EXPENSE_RATIO` | percent | #42 (Expense Ratio), #31 (Cost Ratio) |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `LAPSE_RATE` | percent | #1, #4, #42 (Lapse Rate) ; KPI Policy Lapse Ratio |
| `PERSISTENCY_RATE` | percent | #2, #5 ; KPI Persistency Ratio |
| `SOLVENCY_RATIO` | ratio | #23, #24, #25 ; KPI Solvency Ratio |
| `VNB_MARGIN` | percent | #14 (VNB) |
| `MORTALITY_EXPERIENCE_RATIO` | ratio | #8, #12, #13 (actual / expected) |
| `DURATION_GAP` | years | #29 ; KPI Asset-Liability Duration Gap |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `PERSISTENCY_PROGRAM` | RESERVE_GROWTH | 0.005 | #1, #2, #3, #4, #39 |
| `ALM_OPTIMIZATION` | INVESTMENT_SPREAD | 0.001 | #29, #30 |
| `PRODUCT_MIX_OPTIMIZATION` | BENEFITS_RATIO | -0.01 | #15, #16, #17, #18 |
| `MORTALITY_UNDERWRITING` | BENEFITS_RATIO | -0.005 | #8, #12, #13, #41 |
| `REINSURANCE_OPTIMIZATION` | BENEFITS_RATIO | -0.003 | #28, #34 |
| `DISTRIBUTION_EFFICIENCY` | EXPENSE_RATIO | -0.005 | #31, #32, #42 |
| `ADMIN_AUTOMATION` | EXPENSE_RATIO | -0.005 | #38, #40 |
| `PRICING` (base) | — | — | #6, #21 |

## Causes

- `INTEREST_RATES` (exogène, jamais un levier) — #25, #29, #30
- `LONGEVITY_RISK` — #28, #35

Référence moteur (démo) : EBITDA_EXIT = undefined.
