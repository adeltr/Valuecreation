# Biotechnology (pré-revenu) — niveau 2 (spec `src/sectors/biotech.ts`)

> Statut : **appliqué** avec les choix par défaut de l'analyste. Généré depuis la spec par
> `scripts/apply-level2.ts` — modifier la spec, pas ce fichier. Sources : Umbrex « Biotechnology Company »,
> `data/kpi-library/Biotechnology.md`, analyses #n de ce dossier.

## Formules

```
RNPV_EXIT              = PEAK_SALES * PEAK_SALES_MULTIPLE * PROBABILITY_OF_SUCCESS / (1 + DISCOUNT_RATE) ^ max(YEARS_TO_LAUNCH - HOLD_YEARS, 0)
```
Puis bridge deux points (EQUITY_ENTRY, NET_DEBT_EXIT, EQUITY_EXIT, MOIC).

**Approximations :**
- Un actif principal (ou un agrégat du pipeline) : probabilité cumulée de succès vue depuis la sortie, valeur au lancement = multiple des ventes au pic.
- Trésorerie à la sortie = trésorerie − burn × durée ; une trésorerie négative est un besoin de financement, sans dilution modélisée.
- Le prix d'entrée repose sur RNPV_ENTRY (donnée historique) : un levier ne change jamais le prix payé.

## Inputs liés par formule

| Code | Unité | Sources |
|---|---|---|
| `PEAK_SALES` | currency | #30 market size & commercial viability, #34 market access |
| `PEAK_SALES_MULTIPLE` | ratio | choix d'analyste (valeur au lancement / ventes au pic) ; #40 comparables de licences |
| `PROBABILITY_OF_SUCCESS` | percent | #1 pipeline, #2 clinical progress ; KPI Drug Pipeline Strength and Stage |
| `YEARS_TO_LAUNCH` | years | #1, #19 regulatory pathways, #28 adaptive design |
| `DISCOUNT_RATE` | percent | choix d'analyste |

## Diagnostics benchmarkés

| Code | Unité | Sources |
|---|---|---|
| `TRIAL_ENROLLMENT_RATE` | percent | #24 |
| `PATENT_LIFE_YEARS` | years | #22, #38 ; KPI Patent Portfolio Strength |
| `ORPHAN_DESIGNATIONS` | count | #21 ; KPI Number of Orphan Drug Designations |
| `PIPELINE_ASSETS` | count | #1 ; KPI Number of New Molecular Entities in Development |
| `PARTNERED_ASSET_SHARE` | percent | #40, #42, #43 |

## Leviers

| Catégorie | Cible | Test (delta absolu) | Analyses |
|---|---|---|---|
| `TRIAL_DESIGN` | PROBABILITY_OF_SUCCESS | 0.02 | #2, #24, #27, #28 |
| `BIOMARKER_SELECTION` | PROBABILITY_OF_SUCCESS | 0.02 | #7, #10, #18 |
| `REGULATORY_STRATEGY` | YEARS_TO_LAUNCH | -0.5 | #19, #21 |
| `MARKET_ACCESS` | PEAK_SALES | 20 | #30, #31, #34 |
| `LICENSING_BD` | ANNUAL_BURN | -5 | #40, #42, #43 |
| `CASH_DISCIPLINE` | ANNUAL_BURN | -5 | #39 |
| `COST_PROCUREMENT` (base) | — | — | #20, #23 |

## Causes

- `CLINICAL_FAILURE` — #2, #8, #9
- `FUNDING_MARKET` (exogène, jamais un levier) — #39
- `BIOSIMILAR_COMPETITION` — #29, #32

Référence moteur (démo) : EBITDA_EXIT = undefined.
