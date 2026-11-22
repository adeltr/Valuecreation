# Value Creation Cockpit — produit

## Pour qui

Les analystes et operating partners d'un fonds de private equity : une personne seule ou une petite équipe sur un
réseau interne. Ils préparent une due diligence ou un comité d'investissement, puis animent le plan de création de
valeur avec le management. Usage au bureau, à la lumière du jour, sur un portable ou un grand écran, parfois projeté
en atelier.

## Ce que le produit doit faire

Bâtir un plan de création de valeur **auditable** pour une entreprise :

1. saisir les données de l'entreprise, chacune avec sa source (saisie, import CSV, comptes SEC, mesure d'atelier) ;
2. diagnostiquer : comprendre comment chaque driver opérationnel remonte jusqu'au MOIC, mesurer avec les analyses ;
3. décider des leviers : le copilote propose, l'analyste valide ou rejette ;
4. chiffrer la valeur : bridge, MOIC, TRI, scénarios et sensibilités, confrontés aux sociétés comparables ;
5. restituer le plan 100 jours (Gantt, KPI, slide .pptx).

## Invariants qui contraignent l'interface

- Aucun chiffre ne vient du LLM : tout chiffre affiché est calculé par le moteur, et l'interface le dit.
- Chaque valeur montre sa provenance ; une valeur de démo est signalée tant qu'elle n'est ni remplacée ni confirmée.
- Seuls les leviers validés par un analyste sont simulés ; une décision montre qui l'a prise et quand.
- Le vocabulaire est celui du métier (MOIC, TRI, bridge, BFR, DSO…), en français ; les codes de l'ontologie restent
  visibles en second plan pour la traçabilité.

## Ton

Précis, sobre, factuel : celui d'un mémo d'investissement. Pas de promesse, pas d'enthousiasme : des faits, leur
source, et la prochaine action.

## Mode

Operate : la personne vient accomplir une tâche. Lisibilité, constance et densité maîtrisée passent avant
l'expression.
