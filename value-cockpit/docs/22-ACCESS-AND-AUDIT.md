# 22 · Accès et traçabilité

Le cockpit est prévu pour un analyste seul ou une petite équipe sur un réseau interne. Il n'y a
pas de comptes individuels. La protection repose sur un **mot de passe partagé**, et la
traçabilité sur un **nom d'analyste** déclaré.

## Mot de passe partagé (`src/server/auth.ts`)

```
export VCC_PASSWORD="une-phrase-de-passe-longue"   # au moins 12 caractères
HOST=0.0.0.0 npm run server                        # ouvre le serveur au réseau interne
```

- Sans `VCC_PASSWORD`, le serveur n'écoute que sur la machine locale. Il **refuse de démarrer**
  avec un `HOST` exposé au réseau.
- Avec `VCC_PASSWORD`, tout appel `/api` doit porter l'en-tête `X-VCC-Password`, sinon il reçoit
  un 401. La comparaison se fait en temps constant. Seul `/api/session` reste ouvert : il indique
  uniquement si un mot de passe est requis.
- Dans l'app, un bandeau « Serveur verrouillé » demande le mot de passe. Il est gardé pour
  l'onglet (`sessionStorage`) et n'est jamais écrit dans un dossier. Un serveur verrouillé
  n'entraîne jamais de repli silencieux sur le navigateur.
- Le mot de passe circule en clair sur le réseau interne tant que le serveur n'est pas servi en
  HTTPS. Pour un accès hors du réseau interne, il faut un reverse proxy TLS devant.

## Nom d'analyste et piste d'audit

Le champ « Analyste » en haut de l'écran est mémorisé sur le navigateur. C'est une
**identification déclarée, pas une authentification** : toute personne qui a le mot de passe
peut saisir n'importe quel nom.

| Événement | Trace |
|---|---|
| Valider ou rejeter un levier | `Lever.decision = { by, at }`, affiché sur le levier. Une décision sans nom est refusée (invariant 4). |
| Écrire un levier à la main | `Lever.createdBy` |
| Enregistrer un dossier | `savedBy` sur la révision, visible dans la liste des dossiers. Le serveur le lit dans la requête, pas dans le fichier. |
| Enregistrer ou supprimer sur le serveur | une ligne dans `data/dossiers/audit.log` (JSON par ligne : date, analyste, action, dossier, révision), en ajout seul |

Une écriture sur le serveur sans nom d'analyste est refusée (400).

## Limites

- Pas de comptes ni de rôles : tout détenteur du mot de passe peut tout lire et tout écrire.
- Le journal d'audit n'est pas signé : il protège contre l'erreur, pas contre la fraude.
- L'historique des révisions n'est pas conservé : seule la dernière version d'un dossier existe.
