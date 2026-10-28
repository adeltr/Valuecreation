# 19 · Repères empiriques (SEC EDGAR)

Ces repères servent à calibrer les leviers et à vérifier le réalisme d'un plan face à des
sociétés comparables. Les chiffres proviennent de **dépôts publics**, jamais du modèle de langage.

## Source et import

- **SEC EDGAR**, API publique et gratuite, sans clé :
  - `www.sec.gov/files/company_tickers.json` : la liste des sociétés ;
  - `data.sec.gov/submissions/CIK….json` : SIC, adresse et pays, dépôts 8-K ;
  - `data.sec.gov/api/xbrl/companyfacts/CIK….json` : les états financiers XBRL.
- La couverture porte sur les sociétés cotées qui déposent à la SEC, y compris les émetteurs
  étrangers (20-F, 40-F).
- La SEC exige qu'un client automatisé s'identifie par un e-mail de contact. Il est fourni par la
  variable d'environnement `SEC_USER_AGENT` et n'est jamais écrit dans le dépôt. Le script
  respecte la limite de 10 requêtes par seconde et met les réponses en cache dans
  `data/empirical/cache/` (ignoré par git).

```
SEC_USER_AGENT="Prénom Nom adresse@e-mail" npm run empirical:import -- --archetype cpg --archetype airline
# toutes les catégories : sans --archetype ; essai rapide : --limit 300
```

Le résultat est écrit dans `data/empirical/sec-windows.json`, puis servi par `npm run server`
sous `/api/empirical`.

## Ce qui est mesuré (`src/empirical/edgar.ts`)

Pour chaque société et chaque fenêtre de 3 ou 5 ans :

| Mesure | Calcul (exercices annuels 10-K / 20-F / 40-F) |
|---|---|
| Δ marge d'EBITDA | (résultat opérationnel + D&A) / CA, de fin de fenêtre moins début |
| Croissance annuelle du CA | (CA fin / CA début)^(1/n) − 1 |
| Δ DSO, DIO, DPO | créances / CA × 365 ; stocks et fournisseurs / coût des ventes × 365 |

Chaque fenêtre est rattachée à :
- son **secteur**, de SIC vers archétype. Auto insurance n'a pas de SIC propre : elle est
  comptée en P&C (6331).
- son **pays**, celui de l'adresse « business » ; une adresse aux États-Unis donne United States.
- sa **taille**, le CA en début de fenêtre : <50M, 50–250M, 250M–1B, 1–5B, >5B USD.
- un **historique de deals** : la fenêtre contient-elle un 8-K item 2.01 (acquisition ou cession
  réalisée) ?

Chaque fenêtre garde l'URL de sa source.

## Dans l'app (panneau « Repères empiriques »)

- Les filtres portent sur le pays, la taille et les deals (toutes les sociétés, avec acquisition,
  sans acquisition).
- Les distributions affichées sont p10, p25, médiane, p75 et p90. Aucune n'est affichée sous
  8 sociétés.
- **Réalisme du plan** : le moteur calcule la variation de marge d'EBITDA et la croissance
  annuelle du CA de l'entrée à la sortie, sans levier puis avec les leviers validés. La fenêtre
  est de 3 ans pour une détention de 4 ans ou moins, sinon de 5 ans. L'app donne le percentile
  du plan dans la distribution filtrée et signale un plan au-delà du p90.
- Ce contrôle n'est pas calculable pour les familles P/BV et rNPV : leur modèle n'a ni CA ni
  EBITDA d'entrée.

## Limites

- Ce sont des sociétés cotées, pas des cibles de LBO : il faut lire les résultats comme un ordre
  de grandeur.
- L'EBITDA est reconstitué à partir des comptes publiés, sans retraitement.
- Les KPI opérationnels propres à un secteur (load factor, CASK…) n'existent pas en XBRL
  standard. Ils viennent des observations de l'atelier (docs/18).
- Il n'y a pas de base de deals PE gratuite. Le filtre « deals » repose sur les acquisitions
  déclarées par les sociétés elles-mêmes (8-K 2.01). Un import de bases payantes (PitchBook,
  Preqin, Capital IQ) est possible si un export est disponible.
