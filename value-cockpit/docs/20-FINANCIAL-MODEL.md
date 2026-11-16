# 20 · Modèle financier : cash, TRI, horizon et coût des leviers

Complète docs/01 (bridge deux points) et docs/16 (familles). Formules dans
`src/templates/build.ts`, options du moteur dans `src/engine/scenario.ts`.

## Cash de la famille EBITDA

```
WORKING_CAPITAL_EXIT = REVENUE_EXIT × (DSO + (DIO − DPO) × COGS_RATIO) / 365
CUMULATIVE_FCF       = HOLD_YEARS × ((EBITDA_ENTRY + EBITDA_EXIT) / 2 × CASH_CONVERSION − CAPEX)
                       − (WORKING_CAPITAL_EXIT − WORKING_CAPITAL) − PLAN_ONE_OFF_COSTS
FCF_ANNUAL           = CUMULATIVE_FCF / HOLD_YEARS            (moyenne, calculée)
NET_DEBT_EXIT        = NET_DEBT_ENTRY − CUMULATIVE_FCF
```

| Input | Rôle | Cible de levier ? |
|---|---|---|
| `CASH_CONVERSION` | part de l'EBITDA convertie en cash avant capex et BFR (après impôt, intérêts, autres) | non : estimation de l'analyste |
| `CAPEX` | capex annuel | oui (`CAPEX_DISCIPLINE`) |
| `DSO`, `DIO`, `DPO` | jours de créances (sur le CA), de stocks et de fournisseurs (sur le coût des ventes) | oui (`WC_DSO`, `WC_DIO`, `WC_DPO`) |
| `COGS_RATIO` | coût des ventes / CA : convertit DIO et DPO en jours de CA | non |
| `WORKING_CAPITAL` | BFR d'entrée, donnée historique | non |
| `PLAN_ONE_OFF_COSTS` | coûts exceptionnels du plan saisis par l'analyste ; le moteur y ajoute le coût des leviers du scénario | non |

Conséquences :
- un levier de BFR ou de capex vaut du cash, donc du désendettement et du MOIC ;
- une hausse d'EBITDA accélère le désendettement ;
- la croissance consomme du BFR.

`FCF_ANNUAL` n'est plus un input. Les dossiers EBITDA enregistrés avant ce changement sont refusés
à l'ouverture, avec la liste des inputs manquants.

**Approximations :**
- l'EBITDA suit une ligne droite de l'entrée à la sortie ;
- capex et taux de conversion sont constants ;
- les jours de BFR de sortie s'appliquent au CA de sortie ;
- il n'y a ni échéancier de dette ni cash sweep.

SaaS et A&D prennent désormais `EBITDA_ENTRY` en input historique, comme les autres templates :
un levier ne change jamais le prix d'entrée. SaaS expose `REVENUE_EXIT = ARR_EXIT`.

Les valeurs de démo des inputs de cash (jours de BFR, part du coût des ventes, capex) sont
illustratives. Elles sont calées pour que le FCF moyen de chaque démo reste proche de l'ancien.

## TRI (toutes les familles)

`IRR = max(MOIC, 0) ^ (1 / HOLD_YEARS) − 1`. Les flux sont à deux points : entrée et sortie. En
famille P/BV, les dividendes sont comptés à la sortie (approximation prudente). Si l'equity de
sortie est négative ou nulle, le TRI vaut −100 %.

## Horizon et coût des leviers (options du moteur)

Tous les scénarios du cockpit passent `SCENARIO_OPTIONS` :

- **Horizon** (`horizonYearsCode = HOLD_YEARS`) : un levier dont le premier impact
  (`timeToImpactDays`) arrive après la durée de détention ne modifie pas la sortie. Une
  hypothèse de scénario sur `HOLD_YEARS` déplace l'horizon.
- **Coût** (`costCode = PLAN_ONE_OFF_COSTS`) : `Lever.implementationCost`, saisi par l'analyste
  et jamais proposé par le copilote, s'ajoute à l'input de coûts. Il est dû même si l'impact
  arrive après la sortie. Selon la famille, il réduit le cash cumulé (EBITDA), les fonds propres
  de sortie (P/BV) ou la trésorerie de sortie (rNPV).

L'UI signale un levier « après la sortie » dans la simulation, le plan et la fiche levier.

## Scénarios nommés et sensibilité (`src/ui/state/scenarios.ts`, dossier v6)

- Le scénario en cours s'enregistre sous un nom (base, prudent, ambitieux…). Un tableau compare
  les scénarios enregistrés au cas de base sans levier : nombre de leviers, multiple, MOIC, TRI.
  « Charger » remet un scénario en cours d'édition.
- Un scénario enregistré suit les mêmes règles que le scénario en cours. Un levier rejeté ou
  devenu qualitatif en sort automatiquement.
- La table de sensibilité donne le MOIC du scénario en cours pour le multiple de sortie ± 2 et
  la durée de détention ± 1 an. Chaque case est un calcul du moteur. La durée déplace aussi
  l'horizon des leviers.

## Ce qui reste hors modèle

- Le profil de montée en charge d'un levier : seul le premier impact est connu.
- La pondération par la confiance.
- Le bridge année par année.
