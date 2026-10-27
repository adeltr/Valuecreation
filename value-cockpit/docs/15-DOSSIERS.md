# 15 · Dossiers d'entreprise (persistance)

Un **dossier** est un cas d'entreprise sauvegardé. Il contient le nom, le type
d'entreprise, les inputs de l'analyste, les leviers avec leur statut, les causes, et les
choix de scénario : leviers retenus, deltas appliqués, hypothèses `EXIT_MULTIPLE` et
`HOLD_YEARS`. Il ne contient **aucun résultat du moteur** : à l'ouverture, tous les
chiffres sont recalculés (invariant 1).

## Où il vit

Deux emplacements, avec les mêmes règles :

| Emplacement | Quand | Détail |
|---|---|---|
| **Serveur partagé** (badge vert) | `npm run server` tourne (Vite relaie `/api`) | `src/server/fileRepository.ts` : un fichier JSON par dossier dans `data/dossiers/` (ou `VCC_DOSSIER_DIR`), nommé par le SHA-256 du nom ; écriture atomique |
| **Ce navigateur** (badge orange) | le serveur ne répond pas | `localStorage`, clé `value-cockpit.dossiers` ; les dossiers de la première version sont relus en révision 1 |

Le choix se fait au chargement de la page (`connectRepository`). Le badge indique toujours où
l'enregistrement va partir.

```
npm run server   # API dossiers + proxy copilote sur 127.0.0.1:8787
npm run dev      # UI sur :5173, /api relayé vers :8787
```

| Action (barre « Dossier ») | Effet |
|---|---|
| Enregistrer | crée le dossier ou passe à la révision suivante |
| Ouvrir / Supprimer / ↻ | dossiers de l'emplacement courant, du plus récent au plus ancien ; la suppression demande confirmation |
| Exporter / Importer (.json) | fichier à partager ou à archiver ; un fichier importé devient un nouveau cas |

### Révisions et conflits (plusieurs analystes, plusieurs onglets)

Chaque dossier a une révision. Un enregistrement précise la révision dont il part : celle du
dossier ouvert, ou « aucune » pour un nouveau cas. Si le dossier stocké a changé entre-temps,
l'enregistrement est refusé (`RevisionConflict`, HTTP 409). L'app demande alors confirmation
avant d'écraser la version de l'autre personne. Sur un refus, rien n'est enregistré. Le même
mécanisme protège un nouveau cas qui reprendrait le nom d'un dossier existant, ainsi que la
suppression.

API : `GET /api/dossiers`, `GET|PUT|DELETE /api/dossiers/:nom`. `PUT` prend `{ file, baseRevision }`
et répond 409 avec `current`, ou 422 si le dossier est invalide. `DELETE` prend `?revision=n`.

Avant d'ouvrir ou d'importer un dossier, ou de changer de type d'entreprise, l'app demande
confirmation si le cas en cours a des modifications non enregistrées (`src/ui/state/unsaved.ts`).
Si la bibliothèque du navigateur est illisible, l'app ne l'écrase jamais.

## Validation (`src/dossier/format.ts`) — à l'ouverture ET à l'écriture, serveur compris

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

- **Pas d'authentification** : le serveur n'écoute que sur `127.0.0.1`. Pour l'ouvrir à une équipe,
  il faut le placer derrière un reverse proxy qui authentifie. Les révisions ne disent pas encore
  qui a enregistré.
- Le verrou de révision vaut pour un seul processus serveur : pas de multi-instance.
- Le serveur et le navigateur ne se synchronisent pas entre eux. Pour passer de l'un à l'autre,
  exporter puis importer.
- Un fichier exporté puis modifié à la main peut marquer un levier comme `validated`. Importer
  un fichier est un acte de l'analyste, qui en répond ; le copilote, lui, ne peut toujours
  produire que des `hypothesis`.
- Il n'y a pas de migration : si le template d'un secteur change d'inputs, un ancien dossier
  est refusé, avec la liste des inputs manquants ou inconnus.
