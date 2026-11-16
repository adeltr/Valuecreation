# 16 · Familles de bridge et interactions (phase 3)

> Statut : **appliqué** selon les choix de l'analyste : P/BV pour les assureurs et les banques,
> rNPV pour la biotech, règles d'élasticité pour les interactions. Les valeurs par défaut restent
> des choix d'analyste, à calibrer dans chaque dossier. Telecommunications est écarté pour l'instant.

## Trois familles

| Famille | Archétypes | Ancre (formule du secteur) | Equity |
|---|---|---|---|
| `ebitda` | 21 types, dont health payor | `EBITDA_EXIT` | EBITDA × EV/EBITDA − dette nette |
| `book_value` | auto, life, P&C insurance ; commercial, retail bank | `NET_INCOME_EXIT` | fonds propres × P/BV |
| `rnpv` | biotech (pré-revenu) | `RNPV_EXIT` | rNPV × multiple + trésorerie |

`ENTRY_MULTIPLE` / `EXIT_MULTIPLE` désignent toujours le multiple de l'ancre de la famille.
L'UI l'affiche : « Multiple de sortie (P/BV, hypothèse analyste) ».

Ontologie (`src/ontology/families.ts`) : chaque famille ajoute ses termes de bridge, disjoints
de la base. Les familles `book_value` et `rnpv` retirent les termes réservés à l'EBITDA :
EBITDA, dette nette, FCF, BFR (DSO, DIO, DPO) et les leviers `WC_*`. Les faits d'entrée et la
politique de distribution ne sont jamais des cibles de levier : `BOOK_VALUE_ENTRY`,
`NET_INCOME_ENTRY`, `PAYOUT_RATIO`, `TAX_RATE`, `RNPV_ENTRY`, `CASH_ENTRY`.

Formules (`FAMILY_BRIDGE`, `src/templates/build.ts`) :

```
book_value
  CUMULATIVE_NET_INCOME = HOLD_YEARS × (NET_INCOME_ENTRY + NET_INCOME_EXIT) / 2
  BOOK_VALUE_EXIT       = BOOK_VALUE_ENTRY + CUMULATIVE_NET_INCOME × (1 − PAYOUT_RATIO)
  DIVIDENDS_CUMULATIVE  = CUMULATIVE_NET_INCOME × PAYOUT_RATIO
  EQUITY_ENTRY = BOOK_VALUE_ENTRY × ENTRY_MULTIPLE ; EQUITY_EXIT = BOOK_VALUE_EXIT × EXIT_MULTIPLE
  MOIC = (EQUITY_EXIT + DIVIDENDS_CUMULATIVE) / EQUITY_ENTRY ; ROE_EXIT = NET_INCOME_EXIT / BOOK_VALUE_EXIT

rnpv
  CASH_EXIT = CASH_ENTRY − ANNUAL_BURN × HOLD_YEARS ; RUNWAY_YEARS = CASH_ENTRY / ANNUAL_BURN
  EQUITY_ENTRY = RNPV_ENTRY × ENTRY_MULTIPLE + CASH_ENTRY ; EQUITY_EXIT = RNPV_EXIT × EXIT_MULTIPLE + CASH_EXIT
  MOIC = EQUITY_EXIT / EQUITY_ENTRY
```

**Approximations :**
- Le résultat net cumulé suit une rampe linéaire de l'entrée à la sortie.
- Le capital réglementaire (CET1, solvabilité, RBC) est un diagnostic et ne plafonne pas le dividende.
- Une trésorerie négative en sortie correspond à un besoin de financement ; la dilution n'est pas modélisée.

## Les 7 nouveaux secteurs (fiches `src/sectors/`, voir chaque `_level2.md`)

| Archétype | Famille | Arbre de valeur |
|---|---|---|
| `health-payor` | ebitda | membres × prime PMPM × 12 × (1 − MLR − frais) |
| `pc-insurance` | book_value | primes × (1 − ratio combiné) + primes × float × rendement, après impôt |
| `auto-insurance` | book_value | polices × prime moyenne ; ratio de sinistres = fréquence × sévérité / prime |
| `life-insurance` | book_value | provisions × spread + primes × (1 − prestations − frais) |
| `commercial-bank` | book_value | prêts × NIM / (1 − part des commissions) × (1 − coefficient d'exploitation) − coût du risque |
| `retail-bank` | book_value | clients × (revenu − coût de service) − prêts × coût du risque |
| `biotech` | rnpv | ventes au pic × multiple × probabilité de succès / (1 + taux)^(années jusqu'au lancement − durée) |

Les tables de curation de ces 7 types sont pré-remplies par mots-clés et appliquées telles
quelles, comme pour les autres types. En biotech, le mot « regulatory » apparaît dans 36 analyses
sur 43 : la cause `REGULATORY` y est probablement trop large, à revoir dans `_curation.md`.

## Interactions entre leviers (`src/engine/scenario.ts`, docs/06)

- Plusieurs deltas sur une même métrique se composent, quel que soit l'ordre des leviers :
  (base + Σ absolus) × Π(1 + relatifs).
- Les règles d'interaction sont déclarées par le template, jamais proposées par le copilote :
  cible += coefficient × Δ source (Δ dû aux leviers), en une seule passe et sans chaîne.
  Une hypothèse de scénario ne déclenche jamais de règle.
- Règle livrée : prix → volume via `PRICE_ELASTICITY` (estimation de l'analyste, jamais cible de
  levier) pour cpg, cosmetics, wine-spirits (−0,8), chemical, manufacturing, 3PL (−0,5) et
  waste-management (−0,3). Ces valeurs par défaut sont modifiables dans le panneau Entreprise.
  Le panneau Simulation liste les règles appliquées.
