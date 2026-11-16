# 23 · Fiabilité des données : provenance et sources

La thèse du produit (docs/01) repose sur un point : chaque chiffre doit être calculé, auditable
et reproductible. Le moteur garantit le calcul. Ce document traite de l'autre moitié : **d'où
viennent les données saisies**.

## Provenance de chaque input (dossier v5)

| Source | Comment elle arrive | Ce qui est enregistré |
|---|---|---|
| *(aucune)* : valeur de démo | valeur illustrative du modèle | rien : l'input est signalé « démo » |
| `manual` | saisie ou confirmation par l'analyste | analyste, date, référence libre (document, page) |
| `observation` | mesure de l'atelier appliquée au modèle (docs/18) | analyse et formule, date |
| `import` | fichier CSV | nom du fichier, analyste, date |
| `filing` | comptes publics déposés à la SEC | exercice et URL du dépôt, analyste, date |

Règles :
- Un input sans source garde la valeur de démo du modèle. L'app compte les inputs sourcés et
  affiche « Résultat indicatif » dans la simulation tant qu'il reste des valeurs de démo. Le slide
  de restitution porte la même mention.
- Le copilote reçoit la source de chaque input. Il a pour consigne de ne pas fonder une cause ou
  un levier sur une valeur illustrative seule.
- La provenance ne prouve pas l'exactitude d'une valeur : elle dit qui répond de quoi, et où
  vérifier.

## Sources disponibles dans l'app

- **Comptes publics SEC** (`/api/filings`, bouton « Chercher les comptes publics ») : pour une
  société cotée aux États-Unis ou un émetteur étranger déposant à la SEC. L'app lit le dernier
  exercice annuel : chiffre d'affaires, EBITDA (résultat opérationnel + D&A), capex, part du coût
  des ventes, DSO, DIO, DPO, BFR. Ce que le dépôt ne donne pas est listé, jamais estimé. La dette
  nette reste à saisir. Les montants sont convertis à l'échelle du dossier ; un écart de devise
  est signalé, pas converti. Le serveur doit avoir `SEC_USER_AGENT` ; les réponses sont gardées
  en cache une semaine.
- **Fichier CSV** (« Télécharger le modèle » puis « Importer des données ») : pour une société
  non cotée, à partir des comptes audités, des comptes de gestion ou de la data room. Excel
  exporte ce format. Les lignes inutilisables sont listées, jamais devinées.
- **Atelier d'analyse** : les KPI opérationnels mesurés sur les données de l'entreprise.
- **Repères empiriques** (docs/19) : ils servent à juger un plan, pas à remplir un dossier.

## Où trouver des données fiables (non branché, à vérifier avant usage)

| Besoin | Source | Remarque |
|---|---|---|
| Sociétés cotées en Europe | dépôts ESEF (filings.xbrl.org) | format XBRL comme la SEC ; branchement possible sur le même modèle |
| Sociétés françaises non cotées | comptes annuels déposés au greffe, diffusés par l'INPI (Registre national des entreprises) | gratuit avec un compte ; les petites sociétés peuvent déposer des comptes confidentiels |
| Sociétés britanniques | Companies House | API gratuite avec clé ; comptes en iXBRL |
| Historique de transactions PE | PitchBook, Preqin, Capital IQ, Mergermarket | payant : aucun équivalent gratuit fiable |
| KPI opérationnels sectoriels | régulateurs et organismes professionnels du secteur, rapports annuels des comparables | à saisir avec la référence |
| Données internes de la cible | comptes audités, liasse fiscale, balance âgée, comptes de gestion | source la plus fiable pour un deal : import CSV avec le nom du fichier |

Ordre de confiance recommandé : comptes audités ou dépôts réglementaires, puis comptes de
gestion, puis mesures de l'atelier sur données brutes, puis déclarations du management, puis
benchmarks. Une valeur de démo n'a aucune valeur probante.

## Limites

- La lecture des comptes SEC n'a pas été exécutée sur des données réelles dans l'environnement de
  développement : elle est couverte par des tests sur des extraits au format de l'API.
- L'EBITDA lu dans un dépôt n'est pas retraité (éléments non récurrents, IFRS 16).
- Pas d'import .xlsx direct : il faut passer par un export CSV.
