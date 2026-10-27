# Prompt de kickoff — à coller en premier message dans Claude Code

---

Tu vas construire le **core headless** d'un "value creation cockpit" pour le
private equity. Le projet est entièrement spécifié dans `docs/` — ta première
action est de lire, pas de coder.

**Lecture initiale (et uniquement celle-là) :**
1. `docs/00-README.md` — la carte du projet et la discipline de lecture par
   tâche. Tu la respecteras STRICTEMENT : ne charge pour chaque tâche que les
   docs listés dans son tableau, jamais tout le dossier.
2. `.claude/skills/value-cockpit/SKILL.md` — les 4 invariants. Ils
   s'appliquent à chaque tâche ; toute violation = échec de tâche même si les
   tests passent.
3. `docs/superpowers/plans/2026-06-11-value-cockpit-core-v2.md` — le plan
   phase 1 (format writing-plans : TDD strict, un commit par tâche).

**Périmètre :** le plan couvre les tâches 0–13 (ontologie en couches base +
SaaS, bridge deux points, moteur déterministe, contrat copilote). Ensuite :
- **Tâche 14** — extension + template Aerospace & Defense : spec complète dans
  `docs/05`, même pattern que les tâches 2 et 9 (extension + template + tests
  miroirs, y compris le test end-to-end overruns −1.5 pts → MOIC).
- **Tâche 15** — catalogue d'analyses A&D : pipeline dans `docs/08`
  (frontmatters, `scripts/build-catalog.ts`, `aero.catalog.json`, test
  d'intégrité référentielle). La curation des fichiers sources se fait dans
  des sessions séparées par lots de 5–6 fichiers, avec ma validation entre
  chaque lot — ne la lance jamais en masse.

**Stack imposée :** Vite + React + TypeScript, Vitest, zod, mathjs, Express.
Pas de Neo4j, pas de triplestore OWL (justification : docs/03).

**Rappel des 4 invariants (détail dans le SKILL) :**
1. Aucun chiffre généré par un LLM n'atteint un livrable —
   `ScenarioResult.computedBy = 'engine'`, union à une seule valeur.
2. Aucun `confidence` sans `confidenceBasis` non vide.
3. L'ontologie contraint la génération — tout terme hors vocabulaire actif est
   rejeté ; `EXIT_MULTIPLE` est une hypothèse d'analyste, jamais un levier.
4. Gate analyste — un scénario ne référence que des leviers
   `status='validated'` ; l'ingestion copilote produit toujours `hypothesis`.

**Déroulé :** confirme que tu as lu les trois documents, liste les tâches du
plan, puis exécute la tâche 0. À chaque tâche : annonce les docs que tu
charges (selon le tableau du README), écris le test qui échoue, montre
l'échec, implémente le minimum, montre le pass, commite. Ne saute jamais
l'étape "montrer l'échec".
