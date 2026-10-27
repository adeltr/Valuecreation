# 15 · Dossiers d'entreprise (persistance)

Un **dossier** est un cas d'entreprise sauvegardé. Il contient le nom, le type
d'entreprise, les inputs de l'analyste, les leviers avec leur statut, les causes, et les
choix de scénario : leviers retenus, deltas appliqués, hypothèses `EXIT_MULTIPLE` et
`HOLD_YEARS`. Il ne contient **aucun résultat du moteur** : à l'ouverture, tous les
chiffres sont recalculés (invariant 1).

## Où il vit

| Action (barre « Dossier ») | Effet |
|---|---|
| Enregistrer | sauvegarde dans ce navigateur (`localStorage`, clé `value-cockpit.dossiers`) ; un même nom remplace le dossier existant |
| Ouvrir / Supprimer | dossiers enregistrés dans ce navigateur, du plus récent au plus ancien ; la suppression demande confirmation |
| Exporter | fichier `<nom>.json` à partager ou à archiver |
| Importer (.json) | charge un fichier exporté |

Avant d'ouvrir ou d'importer un dossier, ou de changer de type d'entreprise, l'app demande
confirmation si le cas en cours a des modifications non enregistrées (`src/ui/state/unsaved.ts`).
Si la bibliothèque du navigateur est illisible, l'app ne l'écrase jamais.

## Validation à l'ouverture (`src/ui/state/dossier.ts`)

Un fichier est une donnée externe. `parseDossier` refuse le dossier entier, avec un message,
plutôt que de deviner :

- format ou version inconnus ;
- type d'entreprise inconnu ;
- inputs différents de ceux du template actuel (input manquant ou inconnu ; jamais de valeur par défaut) ;
- levier ou cause hors du vocabulaire actif, ou `confidenceBasis` vide (invariants 2 et 3) ;
- levier du scénario non validé, ou deltas appliqués qui ne correspondent pas aux leviers retenus (invariant 4) ;
- hypothèse autre que `EXIT_MULTIPLE` ou `HOLD_YEARS`.

Les ids des nouveaux leviers reprennent toujours après le plus grand id du fichier.

## Limites v1

- Le stockage est local à un navigateur et à un poste. Pour partager ou sauvegarder ailleurs,
  passer par l'export. Il n'y a pas encore de stockage serveur ni multi-utilisateur.
- Un fichier exporté puis modifié à la main peut marquer un levier comme `validated`. Importer
  un fichier est un acte de l'analyste, qui en répond ; le copilote, lui, ne peut toujours
  produire que des `hypothesis`.
- Il n'y a pas de migration : si le template d'un secteur change d'inputs, un ancien dossier
  est refusé, avec la liste des inputs manquants ou inconnus.
