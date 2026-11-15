# 07 · Copilote Claude — contrat & pipeline

## Périmètre autorisé
Le copilote propose **des causes racines et des leviers**, dans le vocabulaire
actif de l'archétype. Il ne retourne JAMAIS : résultats chiffrés, hypothèses
de scénario, multiples, deltas "réalisés". Le moteur et l'analyste possèdent
les chiffres.

## Pipeline

```
prompt système (vocabulaire actif + catalogue d'analyses injectés, JSON-only)
  → appel API (clé côté serveur, src/server/proxy.ts)
  → sanitizeProposal(raw, vocab)     zod .strict(), strip scenarioResults/assumptions,
                                     rejet hors-vocabulaire, confidenceBasis requis
  → ingestProposal(clean)            tag source='claude', status='hypothesis'
  → revue analyste                   passage manuel à status='validated'
  → (seulement alors) éligible à la simulation — invariant 4
```

## Prompt système (construit par archétype)
Injecté dynamiquement depuis le registry :
- catégories de leviers et de causes actives ;
- cibles de leviers en deux listes : inputs du modèle (chiffrés par le moteur) et métriques de
  diagnostic (levier qualitatif) ; les métriques calculées ne sont jamais des cibles (docs/06) ;
- exigences : JSON pur, `deltaKind` obligatoire, `confidenceBasis` non vide ;
- interdictions : chiffres calculés, multiples, résultats de scénario ;
- **catalogue d'analyses de l'archétype** (ids + titres + liens) : le copilote
  est encouragé à citer un id d'analyse dans `evidence` (ex. `'cf. aero-08 —
  exposition sanctions'`) pour rendre chaque cause traçable vers un protocole.

## Schéma de sortie attendu

```json
{
  "rootCauses": [{ "nodeId": "...", "description": "...", "category": "GEOPOLITICAL",
                   "severity": "high", "evidence": "cf. aero-02 — 40% du carnet en zone à risque" }],
  "levers":     [{ "nodeId": "...", "label": "...", "mechanism": "...",
                   "category": "PROGRAM_EXECUTION", "impactMetricCode": "COST_OVERRUN_RATE",
                   "expectedDelta": -0.015, "deltaKind": "absolute",
                   "timeToImpactDays": 120, "effort": "medium",
                   "confidence": 0.55, "confidenceBasis": "2 cas portefeuille + benchmark EVM",
                   "causeId": null }]
}
```

Tout champ supplémentaire est supprimé ou rejeté (`.strict()`). Une réponse
malformée ⇒ 422, jamais de retour partiel au client.


## Appel réel et données de l'entreprise (étape 4)

- `src/server/anthropic.ts` : appel par le SDK officiel au modèle `claude-opus-5-5`, en streaming,
  effort `high`, prompt système mis en cache, bascule côté serveur en cas de refus de sécurité.
  Un refus, une réponse tronquée ou vide donne une erreur explicite, jamais une proposition
  partielle.
- La clé reste sur le serveur : `ANTHROPIC_API_KEY` dans l'environnement de `npm run server`.
  Sans clé, le serveur démarre en mode hors ligne et le panneau garde la saisie manuelle.
- La question part avec l'entreprise (`src/copilot/brief.ts`) : le client envoie le cas au format
  dossier, le serveur le **revalide** (`parseDossier`) et **recalcule** les sorties avec le
  moteur. Le bloc transmis contient la thèse, les inputs, les sorties de base, les incohérences
  d'entrée, les observations de l'atelier et les leviers déjà présents. Il est marqué comme
  donnée, pas comme instruction.
- Rien ne change en aval : la réponse passe par `sanitizeProposal`, arrive en hypothèse et
  attend la validation de l'analyste.

```
export ANTHROPIC_API_KEY="sk-ant-…"   # dans le terminal du serveur, jamais dans le dépôt
npm run server
```

L'appel réel n'a pas été exécuté dans l'environnement de développement (pas de clé) : il est
couvert par des tests avec un client simulé.
