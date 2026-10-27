# Hospitality — niveau 2 (spec `src/sectors/hospitality.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Hospitality Company »,
> `data/kpi-library/Restaurant.md`, analyses #n de ce dossier.

## Formules

```
ROOMS_REVENUE_EXIT     = ROOMS * (1 + ROOM_GROWTH) ^ HOLD_YEARS * 365 * OCCUPANCY_RATE * ADR * (1 + ADR_GROWTH) ^ HOLD_YEARS / 1000000
REVENUE_EXIT           = ROOMS_REVENUE_EXIT * (1 + ANCILLARY_REVENUE_RATIO)
EBITDA_MARGIN_EXIT     = 1 - DEPARTMENTAL_COST_RATE - UNDISTRIBUTED_COST_RATE
EBITDA_EXIT            = REVENUE_EXIT * EBITDA_MARGIN_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- EBITDA ≈ GOP de l'USALI (#27) : frais de gestion / redevances de franchise inclus dans les coûts non distribués.
- Revenus annexes proportionnels au revenu chambres ; pas de saisonnalité infra-annuelle (#13 = cause).
- ROOM_GROWTH et ADR_GROWTH sont des choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `ROOMS` | count | #1 (Occupancy Rate, ADR) — clés en exploitation |
| `ROOM_GROWTH` | percent | #26 franchise vs management contracts, #28 — pipeline = choix d'analyste |
| `OCCUPANCY_RATE` | percent | #1, #2 (RevPAR), #4, #6, #15 |
| `ADR` | currency | #1, #2, #5, #13 (Average Daily Rate) |
| `ADR_GROWTH` | percent | #2 RevPAR trend, #13 — choix d'analyste |
| `ANCILLARY_REVENUE_RATIO` | ratio | #8, #12, #19, #22, #29–#31 (F&B, spa, MICE) en multiple du revenu chambres |
| `DEPARTMENTAL_COST_RATE` | percent | #17 housekeeping, #20 menu engineering, #23 (F&B Cost %, Labor Cost %), #27 USALI |
| `UNDISTRIBUTED_COST_RATE` | percent | #27 USALI, #3 distribution (commissions), #24 marketing |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `GUEST_SATISFACTION_SCORE` | ratio | #14 ; KPI Customer Satisfaction |
| `DIRECT_BOOKING_SHARE` | percent | #3, #7 |
| `GROUP_MIX_SHARE` | percent | #4, #30 |
| `MEETING_SPACE_UTILIZATION` | percent | #29 (Utilization Rate) |
| `AVERAGE_LENGTH_OF_STAY` | days | #5, #11, #18 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `REVENUE_MANAGEMENT` | ADR | 5 | #2, #5, #6, #13 |
| `OCCUPANCY_DRIVE` | OCCUPANCY_RATE | 0.02 | #4, #11, #15, #24 |
| `CHANNEL_MIX` | UNDISTRIBUTED_COST_RATE | -0.01 | #3, #7 |
| `ANCILLARY_UPSELL` | ANCILLARY_REVENUE_RATIO | 0.02 | #8, #12, #18, #19, #22, #31 |
| `DEPARTMENTAL_EFFICIENCY` | DEPARTMENTAL_COST_RATE | -0.01 | #17, #20, #23, #27, #32 |
| `PORTFOLIO_GROWTH` | ROOM_GROWTH | 0.01 | #26, #28 |
| `COST_PROCUREMENT` (base) | — | — | #20, #21 |

## Causes

- `ALTERNATIVE_ACCOMMODATION` — #25
- `SEASONALITY` (exogène, jamais un levier) — #13

Référence moteur (démo) : EBITDA_EXIT = 92.18115589989677.
