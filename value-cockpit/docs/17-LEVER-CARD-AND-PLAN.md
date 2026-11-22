# 17 · Fiche levier et plan 100 jours

## Fiche levier (`src/ui/model/leverCard.ts`, bouton « Fiche » du copilote)

| Bloc | Contenu | Source |
|---|---|---|
| Ce que c'est | catégorie, métrique cible, mécanisme | levier (copilote ou analyste) |
| Comment il agit | chemin causal le plus court cible → … → MOIC, avec les formules | template (arbre de valeur) |
| Ce que ça vaut | sensibilité du modèle : +1 pt (métrique en %) ou +1 % (autres unités) de la cible ⇒ ΔMOIC | moteur, sonde |
| | impact propre du levier, **seulement une fois validé** (invariant 4) | moteur |
| Interactions | règles déclenchées (ex. prix → volume) | template |
| Diagnostic | analyses liées (catégorie d'abord, puis métrique) : objectif, données à collecter, pistes d'action | catalogue |

La sonde de sensibilité est un levier synthétique d'analyste, de taille fixe. Elle mesure une
propriété du modèle et ne simule jamais une hypothèse du copilote.

Le catalogue porte désormais, pour chaque analyse, la première phrase de l'objectif, les données
requises et les titres des pistes d'amélioration (texte seulement, `src/catalog/markdown.ts`).

## Plan 100 jours (`src/ui/model/plan.ts`, panneau « Plan 100 jours »)

Bonnes pratiques d'un plan de création de valeur PE :

- **Un chantier par levier validé.** Les phases sont diagnostic et mobilisation (J0–30),
  conception (J30–60), puis exécution et suivi (J60–100). Si l'impact arrive avant J60, les trois
  phases sont compressées en tiers. Un levier plus long est signalé « → J+n ».
- **Jalons** : le diagnostic validé (avec les analyses à lancer), le business case et le plan
  détaillé validés, puis le premier impact mesuré sur le KPI, ou l'exécution lancée à J100.
- **KPI** : valeur actuelle (modèle) → cible (actuel + delta validé).
- **Valeur en jeu** : Δ de l'ancre de la famille (EBITDA_EXIT, NET_INCOME_EXIT, RNPV_EXIT) et
  ΔMOIC, calculés par le moteur levier par levier. Le total réunit tous les leviers validés avec les
  interactions du modèle, puis ceux qui ont un impact d'ici J100.
- **Priorisation** : valeur × facilité. Un levier vaut « haute valeur » à partir de ΔMOIC ≥ 0,05x
  (convention de l'analyste). Un quick win doit aussi tomber avant J100.
- **Fondations** : gouvernance et PMO (comité hebdo, revues J30/J60/J100), reporting et baseline
  KPI, management et organisation, communication, et un chantier cash adapté à la famille :
  cash et BFR, capital et liquidité, ou trésorerie et runway.
- **Risques** : les causes racines de sévérité haute.
- Le responsable, le statut et la note sont des décisions de l'analyste, enregistrées dans le
  dossier. Le format passe en v2 ; les dossiers v1 s'ouvrent avec un plan vide.

### Slide de restitution (`src/ui/export/planSlide.ts`)

Le bouton « Exporter le slide de restitution (.pptx) » produit un slide 16:9 au format conseil :

- un titre-action qui porte les chiffres du moteur ;
- le calendrier par phase avec les jalons ;
- le tableau de la valeur en jeu (responsable, KPI cible, ΔMOIC, total) ;
- les encadrés gouvernance et risques ;
- une note de source sur la méthode.

Le slide affiche au plus 7 chantiers ; au-delà, il renvoie au plan détaillé. La librairie
pptxgenjs n'est chargée qu'au moment de l'export.
