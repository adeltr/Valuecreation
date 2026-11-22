# Health Payor — niveau 2 (spec `src/sectors/health-payor.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Health Payor Company »,
> `data/kpi-library/Healthcare.md`, analyses #n de ce dossier.

## Formules

```
MEMBERS_EXIT           = MEMBERS * (1 + MEMBER_GROWTH) ^ HOLD_YEARS
REVENUE_EXIT           = MEMBERS_EXIT * PREMIUM_PMPM * 12 * (1 + PREMIUM_TREND) ^ HOLD_YEARS
EBITDA_EXIT            = REVENUE_EXIT * (1 - MEDICAL_LOSS_RATIO - ADMIN_EXPENSE_RATIO)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- MLR et ratio de frais tenus constants à la sortie : la tendance des primes compense celle des coûts médicaux.
- Membres en millions, prime par membre et par mois ; revenus de services (PBM, care delivery) non séparés.
- Capital réglementaire (RBC) non modélisé : bridge EBITDA, comme les payors cotés valorisés sur résultat.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `MEMBERS` | count | #11 onboarding & retention, #40 MA / Medicaid, #41 enrollment (millions) |
| `MEMBER_GROWTH` | percent | #11, #40, #41 |
| `PREMIUM_PMPM` | currency | #2 premium rate setting (per member per month) |
| `PREMIUM_TREND` | percent | #2 ; choix d'analyste pour la tendance |
| `MEDICAL_LOSS_RATIO` | percent | #1 (MLR) |
| `ADMIN_EXPENSE_RATIO` | percent | #30 claims processing, #41 enrollment efficiency |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CLAIMS_DENIAL_RATE` | percent | #31 |
| `READMISSION_RATE` | percent | #21 |
| `CUSTOMER_RETENTION_RATE` | percent | #11 (member retention) |
| `IN_NETWORK_UTILIZATION_RATE` | percent | #37 |
| `STAR_RATING` | ratio | #33, #40 (quality, Medicare Advantage stars) |
| `NET_PROMOTER_SCORE` | ratio | #12 (NPS) |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `CARE_MANAGEMENT` | MEDICAL_LOSS_RATIO | -0.005 | #3, #16, #17, #18, #21, #22 |
| `PHARMACY_MANAGEMENT` | MEDICAL_LOSS_RATIO | -0.005 | #6, #7 |
| `VALUE_BASED_CONTRACTING` | MEDICAL_LOSS_RATIO | -0.005 | #9, #24, #25, #26 |
| `PAYMENT_INTEGRITY` | MEDICAL_LOSS_RATIO | -0.003 | #31, #32 |
| `ADMIN_AUTOMATION` | ADMIN_EXPENSE_RATIO | -0.005 | #30, #38, #41 |
| `MEMBER_ENGAGEMENT` | MEMBER_GROWTH | 0.01 | #11, #12, #13, #40 |
| `RATE_ADEQUACY` | PREMIUM_TREND | 0.005 | #2 |
| `COST_OPS` (base) | — | — | #30, #39 |

## Causes

- `MEDICAL_COST_TREND` (exogène, jamais un levier) — #7 specialty drugs, #8 high-cost claimants
- `RISK_POOL_SELECTION` — #5, #27

Référence moteur (démo) : EBITDA_EXIT = 190.40861256851278.
