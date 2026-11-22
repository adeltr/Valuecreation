# 14 · Secteurs de niveau 2 issus des fiches sectorielles

> Statut : **appliqué** avec les choix par défaut de l'analyste (« go pour tout le
> reste »). Chaque choix reste corrigeable : on modifie la fiche, puis on relance
> `apply-level2`. Il n'y a plus aucun type d'entreprise EBITDA au niveau 1.
> Telecommunications est écarté pour l'instant ; les types hors EBITDA (assurances,
> banques, health payor, biotech) relèvent de la phase 3 (docs/11 D2).

## Principe : une fiche, une seule source

`src/sectors/<archetype>.ts` (`SectorSpec`, `src/sectors/types.ts`) décrit tout le secteur :

- le vocabulaire, chaque terme avec ses sources (analyses #n, fichier KPI) ;
- les formules de liaison jusqu'à `EBITDA_EXIT` ;
- les leviers, avec leur cible et le sens attendu ;
- les causes ;
- les liens vers le catalogue ;
- des inputs de démo et une référence **calculée à la main**.

Le reste en est dérivé, rien n'est écrit deux fois :

| Dérivé | Où |
|---|---|
| Extension d'ontologie | `src/ontology/registry.ts` (`SPEC_ARCHETYPES` → `EXTENSIONS`) |
| Template | `src/templates/index.ts` : `makeTemplate(formules + BRIDGE_FORMULAS)` |
| IRIs | `npx tsx scripts/sync-context.ts` → `context.jsonld` |
| Catalogue enrichi + `_level2.md` | `npx tsx scripts/apply-level2.ts <archetype…>` |

`data/analysis-library/<archetype>/_level2.md` est la fiche lisible d'un secteur (formules,
approximations, sources). Ce fichier est généré : on ne le modifie jamais à la main.

## Garde-fous (`src/sectors/specs.test.ts`, appliqués à chaque fiche)

- Au plus 8 inputs de formule, 8 diagnostics et 7 leviers.
- Chaque input est lu par au moins une formule ; aucun diagnostic n'entre dans une formule.
- Le moteur retrouve exactement la référence calculée à la main.
- Chaque levier qui a une cible améliore `EBITDA_EXIT` sans toucher `EQUITY_ENTRY`.
  `EBITDA_ENTRY` est une donnée historique : un levier ne joue que sur l'année de sortie.
- Les liens du catalogue pointent vers des analyses existantes.
- Dans tout le registre, un terme désigne un seul concept : un code n'est jamais à la
  fois une métrique et une catégorie de levier ou de cause (exemple :
  `PLANT_UTILIZATION`, à ne pas confondre avec le levier aero `CAPACITY_UTILIZATION`).

## Les 15 secteurs

| Archétype | Type Umbrex | EBITDA_EXIT | Inputs / diag. | Leviers | Causes propres |
|---|---|---|---|---|---|
| `manufacturing` | Manufacturing | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 8 / 5 | LEAN_OEE, QUALITY_YIELD, PREDICTIVE_MAINTENANCE, AUTOMATION, CAPACITY_DEBOTTLENECKING | SUPPLIER_RISK, ENERGY_PRICES |
| `retail` | Retail | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 8 / 7 | MERCHANDISING_ASSORTMENT, MARKDOWN_OPTIMIZATION, LOSS_PREVENTION, LABOR_SCHEDULING, STORE_PORTFOLIO, OMNICHANNEL, CUSTOMER_LOYALTY | ECOMMERCE_SHIFT, SEASONALITY |
| `chemical` | Chemical | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 8 / 5 | YIELD_IMPROVEMENT, ENERGY_EFFICIENCY, FEEDSTOCK_SOURCING, RELIABILITY_MAINTENANCE, SPECIALTY_MIX_SHIFT, CAPACITY_DEBOTTLENECKING | COMMODITY_PRICES, ENERGY_PRICES |
| `agriculture` | Agriculture | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 7 / 5 | PRECISION_AGRONOMY, INPUT_OPTIMIZATION, WATER_ENERGY_EFFICIENCY, MECHANIZATION, PREMIUM_CHANNELS, LAND_EXPANSION | WEATHER_CLIMATE, COMMODITY_PRICES, PESTS_DISEASE |
| `cosmetics` | Cosmetics | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 6 / 4 | FORMULATION_COST, INFLUENCER_DIGITAL, PREMIUMIZATION, LOYALTY_SUBSCRIPTION, CHANNEL_EXPANSION, RD_PRODUCTIVITY | CLEAN_BEAUTY_TRENDS, RETAILER_POWER |
| `electricity-generation` | Electricity Generation | `REVENUE_EXIT - OPERATING_COSTS_EXIT` | 7 / 6 | AVAILABILITY_IMPROVEMENT, HEAT_RATE_IMPROVEMENT, FUEL_PROCUREMENT, COMMERCIAL_OPTIMIZATION, OM_EFFICIENCY, RENEWABLE_BUILDOUT | FUEL_PRICE, POWER_MARKET_PRICES, WEATHER_CLIMATE |
| `healthcare-provider` | Healthcare Provider | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 7 / 7 | LOS_OPTIMIZATION, REVENUE_CYCLE, WORKFORCE_PRODUCTIVITY, SUPPLY_STANDARDIZATION, CDI_PAYER_MIX, SERVICE_LINE_GROWTH | REIMBURSEMENT_PRESSURE, LABOR |
| `hospitality` | Hospitality | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 8 / 5 | REVENUE_MANAGEMENT, OCCUPANCY_DRIVE, CHANNEL_MIX, ANCILLARY_UPSELL, DEPARTMENTAL_EFFICIENCY, PORTFOLIO_GROWTH | ALTERNATIVE_ACCOMMODATION, SEASONALITY |
| `media` | Media & Entertainment | `REVENUE_EXIT * (1 - DISTRIBUTION_MARKETING_RATE - OVERHEAD_RATE) - CONTENT_COST_EXIT` | 6 / 4 | SLATE_DISCIPLINE, WINDOWING_OPTIMIZATION, IP_LICENSING, FRANCHISE_MERCH, AUDIENCE_TARGETING, CONTENT_SCALE | PIRACY, TALENT_COSTS |
| `medical-device` | Medical Device | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 7 / 5 | PHYSICIAN_ADOPTION, MARKET_ACCESS, MANUFACTURING_SCALE, REGULATORY_STRATEGY, PORTFOLIO_LIFECYCLE, COMMERCIAL_EFFICIENCY | REIMBURSEMENT_PRESSURE, PRODUCT_QUALITY_RISK |
| `metals-mining` | Metals & Mining | `REVENUE_EXIT * (1 - ROYALTY_RATE) - OPERATING_COSTS_EXIT` | 8 / 6 | GRADE_CONTROL, RECOVERY_OPTIMIZATION, THROUGHPUT_DEBOTTLENECKING, MINING_COST_EFFICIENCY, PROCESSING_ENERGY_EFFICIENCY, OFFTAKE_ROYALTY | COMMODITY_PRICES, GEOTECHNICAL_RISK, GEOPOLITICAL |
| `pharma` | Pharmaceutical | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 7 / 5 | PIPELINE_PRODUCTIVITY, LICENSING_BD, LIFECYCLE_MANAGEMENT, MARKET_ACCESS, SALES_FORCE_EFFECTIVENESS, RD_PRODUCTIVITY | PATENT_CLIFF, BIOSIMILAR_COMPETITION, DRUG_PRICING_REGULATION |
| `third-party-logistics` | Third Party Logistics | `REVENUE_EXIT - OPERATING_COSTS_EXIT` | 8 / 6 | CARRIER_PROCUREMENT, BACKHAUL_OPTIMIZATION, WAREHOUSE_AUTOMATION, NETWORK_OPTIMIZATION, ACCESSORIAL_PRICING, VALUE_ADDED_SERVICES | FREIGHT_RATES, LABOR |
| `waste-management` | Waste Management | `REVENUE_EXIT - OPERATING_COSTS_EXIT` | 8 / 5 | ROUTE_OPTIMIZATION, FLEET_CONVERSION, PRICING_DISCIPLINE, DISPOSAL_INTERNALIZATION, RECYCLING_VALUE, WASTE_TO_ENERGY, TUCK_IN_ACQUISITIONS | COMMODITY_PRICES, ENVIRONMENTAL_LIABILITY |
| `wine-spirits` | Wine, Beer & Spirits | `REVENUE_EXIT * EBITDA_MARGIN_EXIT` | 7 / 5 | PREMIUMIZATION, ROUTE_TO_MARKET, MARKETING_EFFECTIVENESS, DTC_EXPANSION, INNOVATION_NPD, PRODUCTION_EFFICIENCY, TAX_TARIFF_OPTIMIZATION | WEATHER_CLIMATE, DISTRIBUTOR_POWER |

La cause `REGULATORY` vient de la base pour tous les secteurs. Un levier sans cible
(par exemple `SERVICE_LINE_GROWTH` en healthcare, qui reste sans effet quand les lits
plafonnent) reste qualitatif : il n'a pas de delta moteur et n'existe que comme catégorie.

## Ajouter ou corriger un secteur

1. Écrire ou modifier la fiche, avec sa référence calculée à la main.
2. L'ajouter dans `src/sectors/index.ts` et dans `SPEC_ARCHETYPES`.
3. Lancer `sync-context`, puis `vitest`, `tsc` et `apply-level2 <archetype>`.

saas, aero, airline et cpg gardent leur extension écrite à la main (docs/04, 05, 12, 13).
Le template EBITDA générique (`src/templates/ebitda.ts`) et le mécanisme de niveau 1 sont
conservés pour un futur type (Telecommunications, par exemple), mais aucun archétype ne les
utilise aujourd'hui.
