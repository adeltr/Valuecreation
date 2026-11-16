# 21 · Travailler sans JSON : leviers, libellés, contexte, contrôles

## Leviers saisis par l'analyste (`LeverForm`, actions `addLever` / `updateLever`)

- Le bouton « Ajouter un levier » ouvre un formulaire : libellé, mécanisme, catégorie, métrique
  cible, variation (absolue ou relative, avec l'unité attendue), délai, effort, confiance et sa
  base, coût de mise en œuvre. La liste des cibles sépare les inputs du modèle (chiffrés) et les
  diagnostics (qualitatifs).
- Les règles sont celles du copilote : vocabulaire actif, jamais une métrique calculée,
  `confidenceBasis` obligatoire. Un levier saisi arrive lui aussi en **hypothèse** ; le valider
  reste un geste distinct (invariant 4).
- « Modifier » rouvre le formulaire. Une modification est revalidée. Si le levier est dans le
  scénario, le delta appliqué suit la nouvelle valeur ; un levier devenu qualitatif en sort.
- Le coût de mise en œuvre ne se saisit que là : le copilote ne peut pas le proposer.

## Libellés et définitions (`src/ontology/labels.ts`)

| Codes | Libellé | Définition |
|---|---|---|
| socle (base, bridge, familles) | français, écrit pour le cockpit | écrite pour le cockpit |
| KPI sectoriel dont le nom correspond exactement à une entrée du glossaire Umbrex **de son secteur** | nom du glossaire | description du glossaire, mot pour mot (`npm run labels:build`) |
| autres | nom lisible dérivé du code | aucune : rien n'est inventé |

L'app affiche toujours le libellé suivi du code. La définition apparaît au survol.

## Contexte de l'entreprise (dossier v4)

Devise (code ISO), échelle (k, M, Md) et thèse d'investissement. Les montants du bloc « Deal et
cash » portent l'unité (« M EUR »). Les drivers sectoriels en devise peuvent être des prix
unitaires (yield, coût par siège-km) : ils gardent l'indication « montant ». L'ontologie ne
distingue pas encore un montant d'un prix unitaire.

## Contrôles de cohérence à l'entrée (`src/ui/model/entryChecks.ts`)

Les données d'entrée (EBITDA, BFR, résultat net, rNPV) sont des inputs : rien ne les force à
s'accorder avec les drivers. L'app lit le modèle à l'année 0 et signale un écart de plus de 5 %.
Elle ne corrige rien. Les 26 cas de démo passent ce contrôle (test).
