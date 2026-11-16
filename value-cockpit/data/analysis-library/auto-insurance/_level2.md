# Auto Insurance — niveau 2 (spec `src/sectors/auto-insurance.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Auto Insurance Company »,
> `data/kpi-library/Insurance.md`, analyses #n de ce dossier.

## Formules

```
POLICIES_EXIT          = POLICIES_IN_FORCE * (1 + POLICY_GROWTH) ^ HOLD_YEARS
NET_PREMIUMS_EARNED_EXIT = POLICIES_EXIT * AVERAGE_PREMIUM
LOSS_RATIO             = CLAIM_FREQUENCY * CLAIM_SEVERITY / AVERAGE_PREMIUM
UNDERWRITING_RESULT_EXIT = NET_PREMIUMS_EARNED_EXIT * (1 - LOSS_RATIO - EXPENSE_RATIO)
INVESTMENT_INCOME_EXIT = NET_PREMIUMS_EARNED_EXIT * FLOAT_RATIO * INVESTMENT_YIELD
NET_INCOME_EXIT        = (UNDERWRITING_RESULT_EXIT + INVESTMENT_INCOME_EXIT) * (1 - TAX_RATE)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Prime moyenne et coût moyen en termes constants : l'inflation des réparations est une cause exogène, la hausse tarifaire un levier.
- Fréquence × sévérité / prime = ratio de sinistres (#22) ; frais de gestion des sinistres inclus dans la sévérité.
- Réserves et solvabilité en diagnostics ; placements = primes × FLOAT_RATIO à rendement constant.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `POLICIES_IN_FORCE` | count | KPI Policy In-force (millions) |
| `POLICY_GROWTH` | percent | #8 pay-per-mile, #13 telematics, #17 non-standard |
| `AVERAGE_PREMIUM` | currency | #1 rate adequacy, #7 territorial rating ; KPI Average Premium per Policy |
| `CLAIM_FREQUENCY` | percent | #22 ; KPI Claim Frequency (sinistres par police et par an) |
| `CLAIM_SEVERITY` | currency | #22, #25 ; KPI Claim Severity |
| `EXPENSE_RATIO` | percent | KPI Expense Ratio ; #14 premium leakage |
| `INVESTMENT_YIELD` | percent | KPI Investment Yield |
| `FLOAT_RATIO` | ratio | #30 reserves ; KPI Unearned Premium Reserve — placements / primes |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `SUBROGATION_RECOVERY_RATE` | percent | #24 ; KPI Net Subrogation Recoveries |
| `CLAIMS_SETTLEMENT_DAYS` | days | #23 |
| `TELEMATICS_PENETRATION` | percent | #13, #36 |
| `THEFT_RECOVERY_RATE` | percent | #28 |
| `POLICY_RETENTION_RATE` | percent | KPI Policy Renewal Rate ; #12 |
| `DIRECT_REPAIR_SHARE` | percent | #26, #38 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `RATING_SOPHISTICATION` | AVERAGE_PREMIUM | 12 | #1, #7, #11, #19 |
| `LEAKAGE_CONTROL` | AVERAGE_PREMIUM | 10 | #14 |
| `TELEMATICS_UBI` | CLAIM_FREQUENCY | -0.002 | #8, #13, #18, #35 |
| `REPAIR_NETWORK` | CLAIM_SEVERITY | -50 | #25, #26, #27, #37, #38 |
| `RECOVERY_SALVAGE` | CLAIM_SEVERITY | -20 | #24, #28 |
| `CLAIMS_EXCELLENCE` | CLAIM_SEVERITY | -20 | #23, #37 |
| `SEGMENT_GROWTH` | POLICY_GROWTH | 0.01 | #8, #17, #33, #34, #36 |
| `PRICING` (base) | — | — | #1, #6, #11, #12 |

## Causes

- `REPAIR_COST_INFLATION` (exogène, jamais un levier) — #25, #27, #32
- `RESERVE_RISK` — #30

Référence moteur (démo) : EBITDA_EXIT = undefined.
