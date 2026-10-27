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
- catégories de leviers et de causes actives, codes de métriques actifs ;
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
