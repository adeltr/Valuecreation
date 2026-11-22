# Media & Entertainment — niveau 2 (spec `src/sectors/media.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Media & Entertainment Company »,
> `data/kpi-library/Media & Entertainment.md`, analyses #n de ce dossier.

## Formules

```
CONTENT_COST_EXIT      = CONTENT_INVESTMENT * (1 + CONTENT_INVESTMENT_GROWTH) ^ HOLD_YEARS
REVENUE_EXIT           = CONTENT_COST_EXIT * REVENUE_PER_CONTENT_DOLLAR * (1 + LICENSING_ANCILLARY_RATIO)
EBITDA_EXIT            = REVENUE_EXIT * (1 - DISTRIBUTION_MARKETING_RATE - OVERHEAD_RATE) - CONTENT_COST_EXIT
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Rendement moyen par dollar de contenu : pas de distribution de hits/flops (HIT_RATE en diagnostic).
- Coût du contenu = dépense de l'année (≈ amortissement en régime de croisière).
- OVERHEAD_RATE est un choix d'analyste.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `CONTENT_INVESTMENT` | currency | #1 Content Portfolio & ROI, #27 talent deals, #28 co-production |
| `CONTENT_INVESTMENT_GROWTH` | percent | #1, #7, #17 FAST, #21 gaming, #22 sports rights |
| `REVENUE_PER_CONTENT_DOLLAR` | ratio | #1 (content ROI), #2 windowing, #10, #19 |
| `LICENSING_ANCILLARY_RATIO` | ratio | #8, #11, #13, #14, #25, #32 (licensing, syndication, merch) |
| `DISTRIBUTION_MARKETING_RATE` | percent | #5 award campaigns, #34 brand integration, #35 audience analytics |
| `OVERHEAD_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `CONTENT_LIBRARY_SIZE` | count | #3, #25 ; KPI Content Library Size |
| `HIT_RATE` | percent | #1 (titres au-dessus du seuil de ROI) |
| `FRANCHISE_REVENUE_SHARE` | percent | #3, #4, #6 |
| `PIRACY_LOSS_RATE` | percent | #12 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `SLATE_DISCIPLINE` | REVENUE_PER_CONTENT_DOLLAR | 0.1 | #1, #5, #7 |
| `WINDOWING_OPTIMIZATION` | REVENUE_PER_CONTENT_DOLLAR | 0.05 | #2, #10, #19 |
| `IP_LICENSING` | LICENSING_ANCILLARY_RATIO | 0.05 | #8, #9, #11, #13, #14, #25 |
| `FRANCHISE_MERCH` | LICENSING_ANCILLARY_RATIO | 0.05 | #3, #4, #6, #32 |
| `AUDIENCE_TARGETING` | DISTRIBUTION_MARKETING_RATE | -0.01 | #33, #34, #35 |
| `CONTENT_SCALE` | CONTENT_INVESTMENT_GROWTH | 0.01 | #17, #18, #21, #22 |

## Causes

- `PIRACY` — #12
- `TALENT_COSTS` — #27, #30

Référence moteur (démo) : EBITDA_EXIT = 199.97477781674996.
