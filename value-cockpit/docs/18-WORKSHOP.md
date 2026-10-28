# 18 · Atelier d'analyse

L'atelier exécute les protocoles Umbrex sur les données de l'entreprise. Les résultats deviennent
des **observations** typées par l'ontologie : ce sont des preuves pour les causes et les leviers,
et éventuellement des inputs du modèle.

## Des formules en langage naturel aux calculatrices (`src/workshop/formulas.ts`)

Les analyses écrivent leurs formules en anglais : « Load Factor = (RPK / ASK) x 100 ».
`extractFormulas` lit la section « Step-by-step » : les formules entre backticks et les formules
en ligne après un titre en gras. Chaque nom en langage naturel devient une variable. Une
abréviation entre parenthèses fait partie du nom : « Revenue Passenger Kilometers (RPK) ».
`×`, `x`, `÷` et `−` sont normalisés, et l'expression est évaluée par le moteur.

Rien n'est deviné. Une formule n'est pas calculable si :
- elle contient une somme (Σ) ;
- elle décrit une fonction en mots (« average of… ») ;
- elle ne comporte aucun opérateur ;
- de la prose s'est glissée dans un nom ;
- elle compte plusieurs signes `=`.

Elle reste alors du texte. Couverture actuelle : **971 formules calculables dans 507 analyses**
sur 1 105. Les autres protocoles s'appliquent étape par étape, et l'analyste saisit les KPI
obtenus dans Entreprise.

Le catalogue embarque la structure de ces formules (`AnalysisRef.formulas`), jamais de valeurs.

## Observations (`src/workshop/observations.ts`, dossier v3)

- Une observation contient l'analyse, la formule, **les données saisies par l'analyste**, la
  métrique de l'ontologie mesurée (ou aucune, pour un diagnostic), la date et une note de source.
- Sa valeur n'est jamais stockée : le moteur la recalcule à chaque affichage (invariant 1).
- Une métrique n'est suggérée que si son nom correspond à la sortie de la formule ; sinon, le
  défaut est « diagnostic non relié ».
- **Appliquer à l'entreprise** reporte la valeur dans l'input du modèle. Un pourcentage de
  protocole (× 100) devient une fraction pour une métrique en %. Une métrique qui n'est pas un
  input reste un diagnostic.
- Au chargement d'un dossier, chaque observation est revalidée : analyse et formule existantes,
  variables complètes, résultat fini, métrique dans le vocabulaire.

## Liens

- La fiche levier ouvre ses analyses dans l'atelier et affiche les mesures faites sur sa
  métrique cible.
- Le panneau Atelier liste toutes les analyses du type d'entreprise (« protocole sans formule »
  quand aucune n'est calculable).
