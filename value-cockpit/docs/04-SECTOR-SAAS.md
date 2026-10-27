# 04 · Extension sectorielle — SaaS

Premier template câblé (phase 1, tâches 2 et 9 du plan). Le banc d'essai du
moteur : la chaîne opérationnel → financier y est la plus formalisable.

## Métriques

| Code | Unité | Type | Rôle |
|---|---|---|---|
| ARR | currency | input | base de revenu récurrent |
| GROSS_CHURN | percent | input | attrition brute annuelle |
| EXPANSION_RATE | percent | input | upsell/cross-sell annuel |
| NRR | ratio | calculée | rétention nette |
| ARR_EXIT | currency | calculée | ARR projeté à la sortie |
| CAC | currency | input | diagnostic (benchmark), pas de formule v1 |
| LTV | currency | input | diagnostic (benchmark), pas de formule v1 |
| EBITDA_MARGIN | percent | input | partagé avec la base |

## Formules de liaison (template `src/templates/saas.ts`)

```
NRR          = 1 + EXPANSION_RATE − GROSS_CHURN
ARR_EXIT     = ARR × NRR ^ HOLD_YEARS
REVENUE      = ARR                                  (approx. : récurrent ≈ total)
EBITDA_ENTRY = ARR × EBITDA_MARGIN
EBITDA_EXIT  = ARR_EXIT × EBITDA_MARGIN             (marge constante, approx. v1)
+ bridge de base (EQUITY_ENTRY/EXIT, NET_DEBT_EXIT, MOIC — voir 01)
```

Approximations documentées : revenu = ARR ; marge constante sur la période de
détention ; pas de new business (NRR seul pilote la croissance — prudent).

## Catégories de leviers
`RETENTION` (churn ↓) · `EXPANSION` (expansion rate ↑) · `SALES_EFFICIENCY`
(CAC ↓, diagnostic v1).

## Cas de test end-to-end (référence du plan, tâches 9–10)
Inputs : ARR 100, churn 10 %, expansion 12 %, marge 20 %, multiples 8x/8x,
hold 4 ans, dette nette 60, FCF 8/an.
Levier validé : churn −2 pts (absolu) ⇒ NRR 1.02 → 1.04 ⇒ ARR_EXIT
100×1.04⁴ ⇒ MOIC recalculé par le moteur. Sensibilité EXIT_MULTIPLE 7/8/9 ⇒
trois MOIC strictement croissants.
