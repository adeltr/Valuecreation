# 09 · Ajouter un secteur — checklist & prompt

Un secteur = une extension d'ontologie + un template de formules + un
catalogue (si fichiers sources). Pattern identique à SaaS (docs/04) et A&D
(docs/05). Durée typique : 1 session Claude Code + tes arbitrages.

## Pré-requis : TES arbitrages avant de coder (30 min de réflexion)

1. **Les 3–6 drivers opérationnels** qui causent vraiment le financier dans ce
   secteur (retail : trafic, panier moyen, taux de conversion, ventes/m² ;
   services : taux d'utilisation, TJM, attrition des consultants…).
2. **Les 2–4 formules de liaison** vers le bridge (comment ces drivers
   produisent REVENUE_EXIT et EBITDA_MARGIN_EXIT). Si tu ne sais pas écrire la
   formule, le driver reste en **diagnostic benchmarké** — ne force jamais.
3. **Les catégories de leviers** propres au secteur (5–9 max).
4. **Ce qui reste qualitatif** → catégories de causes + catalogue, pas de chiffres.

C'est le gate analyste appliqué à la connaissance : Claude Code implémente,
toi tu décides ce qui entre dans l'ontologie.

## Checklist d'implémentation (ordre strict)

- [ ] 1. `registry.ts` : ajouter l'archétype à `SECTOR_ARCHETYPES` + brancher
  l'extension dans `EXTENSIONS`.
- [ ] 2. `src/ontology/sectors/<secteur>.ts` : codes + meta (unités) +
  catégories de leviers + catégories de causes éventuelles.
- [ ] 3. `context.jsonld` : une IRI par nouveau code (FIBO si le concept
  existe, `vcc:` sinon) — même commit que l'étape 2.
- [ ] 4. `src/templates/<secteur>.ts` : inputs + formules de liaison + bridge
  de base. Documenter chaque approximation en commentaire.
- [ ] 5. Tests miroirs : `registry.test.ts` (vocabulaire actif = base ∪
  extension), `templates/<secteur>.test.ts` (end-to-end : un levier validé →
  MOIC recalculé, `computedBy='engine'`).
- [ ] 6. Si fichiers sources : pipeline docs/08 (frontmatters par lots de 5–6,
  curation humaine, `<secteur>.catalog.json` + test d'intégrité).
- [ ] 7. Mettre à jour le tableau de lecture de docs/00-README.

Rien d'autre ne bouge : moteur, schémas, sanitizer et proxy sont déjà
paramétrés par le vocabulaire actif — ils absorbent le nouveau secteur sans
modification.

## Prompt à coller dans Claude Code

> Nouvelle extension sectorielle : **<SECTEUR>**.
> Lis docs/03 (guide d'extension), docs/05 (exemple complet A&D), docs/06
> (§formules), puis implémente la checklist de docs/09 étapes 1–5 en TDD
> strict (un commit par étape).
> Mes arbitrages : drivers opérationnels = <liste> ; formules de liaison =
> <formules> ; catégories de leviers = <liste> ; causes ajoutées = <liste> ;
> reste en diagnostic benchmarké = <liste>.
> Interdits : inventer un driver ou une formule que je n'ai pas listés (si un
> driver te semble manquer, propose-le en COMMENTAIRE de fin de session, ne
> l'implémente pas) ; toucher au moteur ; tout terme sans IRI dans
> context.jsonld.

## Anti-patterns (vus en pratique)

- Copier les métriques SaaS « pour faire vite » dans un secteur qui n'en a pas
  l'économie → l'arbre devient générique, le moat disparaît.
- Une formule par driver coûte que coûte → fausse rigueur ; un driver
  benchmarké honnête vaut mieux qu'une formule inventée.
- Plus de ~10 codes opérationnels en v1 → l'analyste se noie ; commencer
  étroit, élargir par le catalogue.
