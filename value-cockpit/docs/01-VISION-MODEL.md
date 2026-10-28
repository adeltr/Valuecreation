# 01 · Vision & modèle conceptuel

## Thèse produit
Transformer une analyse PE en **système de raisonnement** — pas un dashboard.
Fil directeur : `contexte → données → causes → leviers → actions → impact`.

Trois modes : **exploration** (pourquoi ce driver sous-performe ?),
**construction** (quels leviers ?), **simulation** (que vaut le MOIC si… ?).

Le moat : (a) la qualité de la décomposition — surtout les drivers
opérationnels propres au secteur, indicateurs avancés qui causent les
financiers ; (b) la rigueur de la quantification — chaque chiffre est calculé,
auditable, reproductible. Pas le graphe joli.

## Modèle 4 couches

```
L0  CONTEXTE & THÈSE     secteur · business model · capital → sélectionne le template
L1  VALUE BRIDGE         equity / MOIC = ΔEBITDA × Δmultiple × deleveraging (2 points)
L2  DRIVERS FINANCIERS   revenue (prix·volume·mix) · coûts · BFR · capex · FCF
L3  DRIVERS OPÉRATIONNELS sectoriels — SaaS: churn, NRR · A&D: book-to-bill, overruns
```
Causalité : L3 → L2 → L1 (remonte). Contexte : L0 → template (descend).

## Bridge deux points (entry → exit)
Un MOIC compare l'entrée et la sortie ; mono-période impossible.

```
EQUITY_ENTRY  = EBITDA_ENTRY × ENTRY_MULTIPLE − NET_DEBT_ENTRY
EBITDA_EXIT   = f(drivers, HOLD_YEARS)                  ← fourni par le template sectoriel
NET_DEBT_EXIT = NET_DEBT_ENTRY − FCF_ANNUAL × HOLD_YEARS   (approx. v1)
EQUITY_EXIT   = EBITDA_EXIT × EXIT_MULTIPLE − NET_DEBT_EXIT
MOIC          = EQUITY_EXIT / EQUITY_ENTRY
```

`EXIT_MULTIPLE` est une **hypothèse de scénario** posée par l'analyste (avec
sensibilité), jamais un levier proposable — l'expansion de multiple est
largement exogène.

## Phasage
- **0 (faite)** — validation logique Obsidian + Claude.
- **1 (faite)** — core headless : ontologie en couches, templates SaaS + A&D,
  moteur, contrat copilote. 100 % testé.
- **2 (en cours)** — UI React (3+1 panneaux : graph · company view · copilote · simulation
  & plan 100 jours). Plan : docs/superpowers/plans/2026-10-27-value-cockpit-ui-phase2.md.
- **3** — autres secteurs, interactions entre leviers, corpus de deals /
  GraphRAG / reasoner OWL si justifié.
