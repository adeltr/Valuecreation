# 08 · Bibliothèque d'analyses — ingestion des fichiers d'industrie

Comment intégrer l'ensemble des fichiers sectoriels (les 44 analyses A&D
aujourd'hui, d'autres industries demain) dans le projet. Deux types de
fichiers sources, deux destinations.

## Les deux types de fichiers et leur destination

| Type | Contenu | Devient |
|---|---|---|
| **Type 1 — Analyse** (Goal / Data required / Steps / Output / Interpret / Improve) | protocole de diagnostic | entrée du **catalogue** (`AnalysisRef`) + fichier source conservé tel quel |
| **Type 2 — KPI** (définition, formule éventuelle, benchmark) | métrique candidate | candidat au **vocabulaire** de l'extension (input ou diagnostic) ± formule de template ± benchmark |

## Arborescence cible

```
data/analysis-library/aero/        ← tes .md copiés tels quels (source de vérité lisible)
  01-defense-contracting-portfolio.md
  …
src/catalog/aero.catalog.json      ← catalogue généré/curé (AnalysisRef[])
src/ontology/sectors/aero.ts       ← vocabulaire (enrichi par les fichiers KPI)
src/templates/aero.ts              ← formules (uniquement celles validées par toi)
```

## Convention de frontmatter (à ajouter en tête de chaque fichier source)

Type 1 — analyse :
```yaml
---
kind: analysis
id: aero-01
part: A
quant:  [BOOK_TO_BILL, FIXED_PRICE_SHARE, TOP5_CONTRACT_SHARE, WIN_RATE, ON_TIME_DELIVERY]
causes: [PROGRAM, COMMERCIAL]
levers: [CONTRACT_MIX, COMMERCIAL_PIPELINE, PROGRAM_EXECUTION]
---
```

Type 2 — KPI :
```yaml
---
kind: kpi
code: BOOK_TO_BILL
unit: ratio
benchmark: ">1.0 sain · >1.2 croissance forte"
formula: null            # ou expression sur d'autres codes si dérivé
---
```

Règles : `quant`/`code` ∈ vocabulaire actif de l'archétype (sinon : soit
ajouter le code à l'extension — même commit, IRI comprise — soit retirer la
référence). `causes`/`levers` ∈ catégories actives.

## Workflow d'ingestion avec Claude Code (44 fichiers, contexte maîtrisé)

1. **Copier** le vault dans `data/analysis-library/aero/`.
2. **Curation par lots de 5–6 fichiers** (jamais plus — discipline de
   contexte). Prompt par lot :
   > Lis docs/03 §registry, docs/05 §catalogue, puis les fichiers N à M de
   > data/analysis-library/aero/. Pour chaque fichier : ajoute le frontmatter
   > selon docs/08. Propose les mappings quant/causes/levers en citant la
   > section du fichier qui les justifie. Si une métrique citée n'existe pas
   > dans le vocabulaire, LISTE-LA comme candidate — ne l'invente pas dans le
   > frontmatter. N'écris rien dans src/.
3. **Toi : valider chaque lot** — c'est l'équivalent du gate analyste appliqué
   à la connaissance. Trancher les métriques candidates (entrer au vocabulaire
   ou rester hors périmètre).
4. **Générer le catalogue** : script `scripts/build-catalog.ts` qui parse les
   frontmatters → `aero.catalog.json`, et échoue si une référence est hors
   vocabulaire (intégrité référentielle).
5. **Test** : `catalog.test.ts` — tout `relatedMetricCode`/`cause`/`lever` du
   JSON ∈ vocabulaire actif ; ids uniques ; sourcePath existant.

Pour les fichiers **type 2 (KPI)** : même lot, mais la sortie est une table
de candidats (code, unité, benchmark, formule éventuelle) que tu arbitres en
trois piles : input relié par formule / métrique de diagnostic benchmarkée /
hors périmètre v1. Seule la première pile touche `templates/aero.ts`.

## Catalogue v2 (docs/11 D3)

- `AnalysisRef` porte `archetype` et `partLabel` (les lettres de partie
  changent de sens d'un archétype à l'autre) ; id = `<archetype>-NN`.
- Frontmatter : ajouter `partLabel: <libellé>` aux champs ci-dessus.
- Tables de curation : `data/analysis-library/<archetype>/_curation.md`
  (ignoré par le build), jamais dans les fichiers sources.
- Import d'analyses brutes du vault : `tsx scripts/import-analyses.ts <src>
  <archetype> <tag> "<Index title>"` (reflow sans réécriture). Gère les variantes
  des guides : titre « Detailed step-by-step instruction… » en ligne simple, Goal
  sans titre, fin de titre coupée par l'extraction. Contrôle : comparaison mot à
  mot source ↔ import (0 écart sur les 26 types importés).
- Bibliothèque : 26 types d'entreprise, 1 105 analyses (Telecommunications manquant).
  Correction de source : health-payor #08 contenait aussi l'analyse #9 (« Episode-Based
  Bundled Payments Performance Analysis »), absente de l'index du vault — séparée.
- Génération : `npm run catalog:build -- <archetype>` ; logique testée dans
  `src/catalog/build.ts`.
- Curation à l'échelle (D4) : un archétype entier pré-rempli dans
  `_curation.md`, une revue analyste, puis application.

## Pour une nouvelle industrie
Même pipeline : `data/analysis-library/<secteur>/` → frontmatters → curation
par lots → extension `sectors/<secteur>.ts` + `templates/<secteur>.ts` +
`<secteur>.catalog.json`. Le guide d'extension est dans docs/03.
