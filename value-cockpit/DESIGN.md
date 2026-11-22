# Value Creation Cockpit — système visuel

Monde : le **mémo d'investissement**. Papier gris-bleu froid, encre, titres en serif, chiffres alignés comme dans un
tableau de comité. Le fond crème a été écarté : c'est la surface « de bon goût » par défaut, relevée par le détecteur.
Le monde n'apporte que la typographie, la palette, la densité et un geste signature ; la navigation et les contrôles
restent ceux d'une application web standard.

## Structure

- **Rail d'étapes** (colonne sombre à gauche, barre en haut sous 900 px) : marque, type d'entreprise, analyste, puis
  les cinq étapes du travail avec leur état calculé (valeurs sourcées, mesures, leviers validés, MOIC, chantiers).
- **Barre de dossier** en haut de la zone de travail : nom, enregistrer, lieu de stockage, ouvrir, exporter et importer.
- **Une étape à la fois** : titre en serif, une phrase qui dit quoi faire, les panneaux de l'étape, puis le lien vers
  l'étape suivante.

Étapes : 1 Données · 2 Diagnostic · 3 Leviers · 4 Valeur · 5 Plan 100 jours.

## Typographie

- Source Serif 4 (variable) : la marque, les titres d'étape et de panneau. Jamais dans un contrôle ni une donnée.
- Source Sans 3 (variable) : tout le reste. Chiffres tabulaires (`tnum`) dans les tableaux et les montants.
- Échelle fixe en rem (base 16 px), ratio ~1,2 : 0,75 · 0,8125 · 0,875 (corps de l'UI) · 1 · 1,25 · 1,75 ; rien sous 12 px.
- Codes d'ontologie en petites capitales grises, en second plan, jamais en premier.

## Couleur

| Rôle | Token | Valeur |
|---|---|---|
| Fond | `--ground` | #eceff3 |
| Surface | `--surface` | #ffffff |
| Surface 2 (blocs internes, formulaires) | `--surface-2` | #f5f7f9 |
| Encre | `--ink` | #1b1f27 |
| Encre secondaire | `--ink-2` | #545b68 |
| Filet | `--line` | #dbe0e6 |
| Rail | `--rail` | #18202b |
| Action, sélection | `--accent` | #24507a |
| Validé, sourcé | `--ok` | #1d6b48 |
| Démo, attention | `--warn` | #8a5300 |
| Erreur, rejet | `--bad` | #a8261b |

Couches de l'arbre de valeur : L3 opérationnel `#2b7a78`, L2 financier `#24507a`, L1 bridge `#8c6420`.

L'accent ne sert qu'aux actions principales, à la sélection et à l'état courant ; jamais à la décoration.

## Geste signature : la provenance

Chaque chiffre porte sa marque d'origine, avec la même grammaire partout :

- `démo` : contour ambre en tirets, à remplacer ou confirmer ;
- `saisi`, `importé`, `comptes publics`, `mesuré en atelier` : pastille verte pleine, avec l'analyste et la date ;
- `moteur` : libellé encre bleue, pour tout chiffre calculé.

## Composants

- Panneaux : surface claire, filet 1 px, rayon 10 px, pas d'ombre ; jamais de panneau dans un panneau.
- Boutons : primaire plein (accent), secondaire en contour, lien texte pour les actions de ligne.
- Champs : 32 px de haut, filet, focus en anneau accent de 2 px.
- Tableaux : en-têtes en encre secondaire, filets horizontaux seulement, ligne courante teintée.
- Icônes : SVG tracés à la main, trait 1,75 px (`src/ui/components/Icon.tsx`) ; aucun glyphe Unicode comme icône.
- Mouvement : 150–200 ms sur les changements d'état seulement ; rien au chargement ; respect de
  `prefers-reduced-motion`.
