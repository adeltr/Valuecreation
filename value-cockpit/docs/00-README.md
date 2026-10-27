# Value Creation Cockpit — index du projet

> Point d'entrée. Chaque doc est autonome et court, par design : Claude Code ne
> doit charger que les fichiers utiles à la tâche en cours, pas tout le dossier.

## Arborescence

```
docs/
  00-README.md                      ← ce fichier
  01-VISION-MODEL.md                ← thèse produit, modèle 4 couches, bridge 2 points, phasage
  02-INVARIANTS.md                  ← les 4 invariants + conventions d'ingénierie
  03-ONTOLOGY.md                    ← ontologie en couches, registry, guide d'extension sectorielle
  04-SECTOR-SAAS.md                 ← extension SaaS (template câblé en phase 1)
  05-SECTOR-AEROSPACE-DEFENSE.md    ← extension A&D + catalogue des 44 analyses
  06-ENGINE.md                      ← moteur déterministe (formules, résolveur, scénarios)
  07-COPILOT.md                     ← contrat copilote Claude, pipeline, prompt
  08-ANALYSIS-LIBRARY.md            ← ingestion des fichiers d'industrie (2 types) → catalogue
  superpowers/plans/
    2026-06-11-value-cockpit-core-v2.md   ← plan d'implémentation phase 1 (format writing-plans)
data/analysis-library/<secteur>/    ← fichiers sources des frameworks sectoriels (.md)
.claude/skills/value-cockpit/SKILL.md     ← invariants chargés sur CHAQUE tâche
```

## Discipline de lecture par tâche (économie de contexte)

| Tâche du plan | Fichiers à charger |
|---|---|
| Toutes | `.claude/skills/value-cockpit/SKILL.md` (auto) |
| 0 (scaffold) | aucun doc |
| 1–3 (ontologie base + registry + JSON-LD) | 03 |
| 4–5 (types + schémas) | 02, 03 |
| 6–8 (formula, graph, resolver) | 06 |
| 9 (template SaaS) | 04, 06 §formules |
| 10 (scenario engine) | 06, 02 §invariant 4 |
| 11–13 (copilot + proxy) | 07, 03 §registry |
| 14 (extension + template A&D) | 05, 03, 06 |
| 15 (catalogue d'analyses A&D) | 08, 05 §catalogue |

Règle : ne JAMAIS charger 01 (vision) pendant l'implémentation — c'est du
contexte de cadrage, pas de spec exécutable. Le relire seulement si une
décision d'architecture est ambiguë.

## Ordre d'exécution

1. Suivre le plan `docs/superpowers/plans/2026-06-11-value-cockpit-core-v2.md`
   tâche par tâche (TDD strict, un commit par tâche).
2. Tâche 14 (A&D) après la 13 : même pattern que les tâches 2 et 9, spec
   complète dans docs/05.
3. Tâche 15 (catalogue) : pipeline d'ingestion docs/08 — curation par lots de
   5–6 fichiers, validation humaine de chaque lot, génération + test
   d'intégrité référentielle.
