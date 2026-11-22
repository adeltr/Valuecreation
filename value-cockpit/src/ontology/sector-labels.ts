/**
 * French label and definition of the sector drivers the Umbrex glossaries do not define,
 * written for the cockpit's own formulas (src/sectors, src/templates). The exact formula of
 * a calculated figure is shown next to the definition, from the template itself.
 */
export const SECTOR_LABELS: Record<string, [label: string, definition: string]> = {
  // Croissance et volumes (plusieurs secteurs)
  VOLUME_GROWTH: ['Croissance des volumes', 'Croissance annuelle des volumes vendus jusqu\'à la sortie, hors effet prix.'],
  PRICE_GROWTH: ['Croissance des prix', 'Hausse annuelle moyenne des prix de vente jusqu\'à la sortie.'],
  PRICE_MIX_GROWTH: ['Croissance prix-mix', 'Hausse annuelle du chiffre d\'affaires par unité vendue : prix et montée en gamme du mix.'],
  CAPACITY_GROWTH: ['Croissance de la capacité', 'Croissance annuelle de la capacité installée (sièges-km offerts, capacité de production) jusqu\'à la sortie.'],
  VOLUME_INDEX_EXIT: ['Indice de volume à la sortie', 'Volume de l\'année de sortie rapporté à celui de l\'entrée (1 = inchangé). Plafonné par la capacité installée quand il y en a une.'],

  // Taux de coûts en % du chiffre d'affaires
  SGA_RATE: ['Frais commerciaux et généraux', 'Frais commerciaux, généraux et administratifs (SG&A) en part du chiffre d\'affaires.'],
  GROSS_MARGIN: ['Marge brute', 'Chiffre d\'affaires moins coût des ventes, en part du chiffre d\'affaires.'],
  OVERHEAD_RATE: ['Frais de structure', 'Frais généraux et de structure en part du chiffre d\'affaires.'],
  RD_RATE: ['Dépenses de R&D', 'Dépenses de recherche et développement en part du chiffre d\'affaires.'],
  AP_RATE: ['Publicité et promotion (A&P)', 'Dépenses de publicité et de promotion en part du chiffre d\'affaires.'],
  MAINTENANCE_COST_RATE: ['Coûts de maintenance', 'Coûts de maintenance des équipements en part du chiffre d\'affaires.'],

  // Industrie et chimie
  PLANT_UTILIZATION: ['Taux d\'utilisation des capacités', 'Production rapportée à la capacité installée. Plus il est haut, moins le volume peut croître sans investissement.'],
  MATERIAL_COST_RATE: ['Coût matières', 'Coût des matières premières et composants en part du chiffre d\'affaires, sans rebut.'],
  CONVERSION_COST_RATE: ['Coûts de transformation', 'Main-d\'œuvre directe et frais d\'usine pour transformer les matières, en part du chiffre d\'affaires.'],
  FEEDSTOCK_COST_RATE: ['Coût des matières premières (feedstock)', 'Coût des matières premières chimiques en part du chiffre d\'affaires, pour un rendement de 100 %.'],
  PRODUCT_YIELD: ['Rendement matière', 'Part des matières premières transformée en produit vendable. Un rendement plus bas renchérit la matière par unité vendue.'],
  ENERGY_COST_RATE: ['Coût de l\'énergie', 'Coût de l\'énergie consommée par les procédés en part du chiffre d\'affaires.'],

  // Distribution
  LFL_GROWTH: ['Croissance à périmètre constant', 'Croissance annuelle des ventes des magasins ouverts depuis plus d\'un an (like-for-like).'],
  NET_STORE_GROWTH: ['Croissance nette du parc', 'Croissance annuelle du nombre de magasins, ouvertures moins fermetures.'],
  MARKDOWN_RATE: ['Démarque', 'Remises, soldes et démarque inconnue en part du chiffre d\'affaires.'],
  STORE_LABOR_RATE: ['Masse salariale magasins', 'Coût du personnel des magasins en part du chiffre d\'affaires.'],
  OCCUPANCY_COST_RATE: ['Coûts d\'occupation', 'Loyers et charges des magasins en part du chiffre d\'affaires.'],

  // Agriculture
  AREA_GROWTH: ['Croissance des surfaces', 'Croissance annuelle des surfaces cultivées.'],
  CROP_YIELD_GROWTH: ['Croissance des rendements', 'Croissance annuelle de la production par hectare.'],
  INPUT_COST_RATE: ['Coût des intrants', 'Semences, engrais et produits phytosanitaires en part du chiffre d\'affaires.'],
  WATER_ENERGY_COST_RATE: ['Coût de l\'eau et de l\'énergie', 'Irrigation et énergie en part du chiffre d\'affaires.'],
  LABOR_MACHINERY_COST_RATE: ['Main-d\'œuvre et machinisme', 'Main-d\'œuvre et coûts des machines agricoles en part du chiffre d\'affaires.'],

  // Électricité
  INSTALLED_CAPACITY_GW: ['Capacité installée (GW)', 'Puissance installée du parc de production, en gigawatts.'],
  REALIZED_POWER_PRICE: ['Prix de l\'électricité réalisé', 'Prix moyen obtenu par mégawattheure vendu, couvertures comprises.'],
  FUEL_COST_PER_GJ: ['Coût du combustible par GJ', 'Coût du combustible par gigajoule d\'énergie consommée.'],
  OM_COST_PER_MWH: ['Coût d\'exploitation-maintenance par MWh', 'Coûts d\'exploitation et de maintenance des centrales par mégawattheure produit.'],
  GENERATION_TWH_EXIT: ['Production à la sortie (TWh)', 'Électricité produite l\'année de sortie : capacité × facteur de charge × 8 760 heures.'],
  OPERATING_COSTS_EXIT: ['Coûts d\'exploitation de sortie', 'Coûts d\'exploitation de l\'année de sortie, calculés à partir des drivers de coût du secteur (voir la formule).'],

  // Santé (prestataires)
  REIMBURSEMENT_GROWTH: ['Croissance des tarifs de remboursement', 'Hausse annuelle des tarifs payés par les assureurs et l\'assurance maladie.'],
  REVENUE_LEAKAGE_RATE: ['Fuite de revenus', 'Part du chiffre d\'affaires facturable perdue : actes non codés, refus, impayés.'],
  LABOR_COST_RATE: ['Masse salariale', 'Coût du personnel en part du chiffre d\'affaires.'],
  SUPPLY_COST_RATE: ['Coût des fournitures', 'Fournitures médicales et pharmacie en part du chiffre d\'affaires.'],
  OTHER_OPEX_RATE: ['Autres charges d\'exploitation', 'Autres charges d\'exploitation en part du chiffre d\'affaires.'],

  // Hôtellerie
  ROOMS: ['Nombre de chambres', 'Nombre de chambres du parc à l\'entrée.'],
  ROOM_GROWTH: ['Croissance du parc de chambres', 'Croissance annuelle du nombre de chambres.'],
  OCCUPANCY_RATE: ['Taux d\'occupation', 'Nuitées vendues rapportées aux nuitées disponibles.'],
  ADR: ['Prix moyen par chambre (ADR)', 'Revenu hébergement moyen par chambre vendue et par nuit, en unités monétaires.'],
  ADR_GROWTH: ['Croissance de l\'ADR', 'Hausse annuelle du prix moyen par chambre.'],
  ANCILLARY_REVENUE_RATIO: ['Revenus annexes', 'Restauration, spa et autres revenus rapportés au revenu hébergement.'],
  DEPARTMENTAL_COST_RATE: ['Coûts départementaux', 'Coûts directs des départements (hébergement, restauration) en part du chiffre d\'affaires.'],
  UNDISTRIBUTED_COST_RATE: ['Coûts non distribués', 'Frais généraux, commercial, maintenance et énergie non affectés aux départements, en part du chiffre d\'affaires.'],
  ROOMS_REVENUE_EXIT: ['Revenu hébergement de sortie', 'Revenu des chambres l\'année de sortie : chambres × 365 × occupation × ADR, en millions.'],

  // Médias
  CONTENT_INVESTMENT: ['Investissement en contenus', 'Dépenses annuelles de production et d\'acquisition de contenus.'],
  CONTENT_INVESTMENT_GROWTH: ['Croissance de l\'investissement en contenus', 'Hausse annuelle des dépenses de contenus.'],
  REVENUE_PER_CONTENT_DOLLAR: ['Revenu par unité investie en contenus', 'Chiffre d\'affaires généré par unité monétaire investie en contenus.'],
  LICENSING_ANCILLARY_RATIO: ['Revenus de licences et annexes', 'Licences, droits dérivés et autres revenus rapportés aux revenus principaux.'],
  DISTRIBUTION_MARKETING_RATE: ['Distribution et marketing', 'Coûts de distribution et de marketing en part du chiffre d\'affaires.'],
  CONTENT_COST_EXIT: ['Coût des contenus de sortie', 'Investissement en contenus de l\'année de sortie.'],

  // Dispositifs médicaux
  PROCEDURE_VOLUME_GROWTH: ['Croissance du nombre d\'actes', 'Croissance annuelle du nombre de procédures utilisant les dispositifs.'],
  ASP_GROWTH: ['Évolution du prix de vente moyen', 'Variation annuelle du prix de vente moyen (ASP) ; souvent négative sous la pression des acheteurs.'],
  SALES_MARKETING_RATE: ['Ventes et marketing', 'Force de vente et marketing en part du chiffre d\'affaires.'],
  QUALITY_REGULATORY_COST_RATE: ['Qualité et réglementaire', 'Coûts de qualité, de conformité et d\'affaires réglementaires en part du chiffre d\'affaires.'],

  // Mines et métaux
  ORE_THROUGHPUT_MT: ['Minerai traité (Mt)', 'Tonnage de minerai traité par an à l\'entrée, en millions de tonnes.'],
  THROUGHPUT_GROWTH: ['Croissance du débit', 'Croissance annuelle du tonnage traité.'],
  HEAD_GRADE: ['Teneur du minerai', 'Part de métal contenue dans le minerai alimenté à l\'usine.'],
  METAL_PRICE: ['Prix du métal', 'Prix de vente par tonne de métal.'],
  MINING_COST_PER_TONNE: ['Coût d\'extraction par tonne', 'Coût d\'extraction par tonne de minerai.'],
  PROCESSING_COST_PER_TONNE: ['Coût de traitement par tonne', 'Coût de traitement par tonne de minerai.'],
  ORE_MILLED_EXIT: ['Minerai traité à la sortie (Mt)', 'Tonnage de minerai traité l\'année de sortie.'],
  METAL_PRODUCED_EXIT: ['Métal produit à la sortie', 'Métal produit l\'année de sortie : minerai traité × teneur × taux de récupération.'],

  // Pharmacie
  BASE_PORTFOLIO_GROWTH: ['Croissance du portefeuille existant', 'Croissance annuelle des ventes des produits déjà commercialisés, hors pertes de brevet.'],
  LOE_REVENUE_AT_RISK: ['Revenus exposés à une perte de brevet', 'Part du chiffre d\'affaires dont le brevet expire avant la sortie (LOE).'],
  GENERIC_EROSION_RATE: ['Érosion par les génériques', 'Part des ventes perdue sur un produit après l\'arrivée des génériques.'],
  LAUNCH_REVENUE_RATIO: ['Revenus des lancements', 'Ventes des nouveaux produits à la sortie, rapportées au chiffre d\'affaires d\'entrée.'],

  // Logistique
  ACCESSORIAL_REVENUE_RATIO: ['Revenus accessoires', 'Prestations facturées en plus du transport (attente, manutention, stockage) rapportées aux revenus principaux.'],
  PURCHASED_TRANSPORT_RATE: ['Transport sous-traité', 'Coût du transport acheté à des transporteurs en part du chiffre d\'affaires.'],
  EMPTY_MILES_RATE: ['Kilomètres à vide', 'Part des kilomètres parcourus sans chargement ; elle renchérit le transport.'],
  WAREHOUSE_LABOR_RATE: ['Main-d\'œuvre entrepôt', 'Coût du personnel des entrepôts en part du chiffre d\'affaires.'],
  FACILITY_COST_RATE: ['Coûts immobiliers', 'Loyers et charges des entrepôts en part du chiffre d\'affaires.'],
  CORE_REVENUE_EXIT: ['Revenus principaux de sortie', 'Revenus de transport et de logistique de l\'année de sortie, hors prestations accessoires.'],

  // Déchets
  TONS_COLLECTED_MT: ['Tonnage collecté (Mt)', 'Déchets collectés par an à l\'entrée, en millions de tonnes.'],
  PRICE_PER_TON: ['Prix par tonne collectée', 'Prix facturé aux clients par tonne collectée.'],
  COMMODITY_PRICE_PER_TON: ['Prix des matières recyclées', 'Prix de revente par tonne de matières recyclées.'],
  COLLECTION_COST_PER_TON: ['Coût de collecte par tonne', 'Coût de collecte (camions, personnel, carburant) par tonne.'],
  DISPOSAL_COST_PER_TON: ['Coût de traitement par tonne', 'Coût de mise en décharge ou de traitement par tonne.'],
  TONS_COLLECTED_EXIT: ['Tonnage collecté à la sortie', 'Déchets collectés l\'année de sortie.'],

  // Vins et spiritueux, grande consommation
  EXCISE_TAX_RATE: ['Droits d\'accise', 'Droits d\'accise sur l\'alcool en part du chiffre d\'affaires brut.'],
  DISTRIBUTION_COST_RATE: ['Coûts de distribution', 'Logistique et distribution en part du chiffre d\'affaires.'],
  TRADE_SPEND_RATE: ['Dépenses commerciales enseignes', 'Remises, promotions et contrats avec les distributeurs en part du chiffre d\'affaires brut.'],

  // Assurance santé
  MEMBERS: ['Nombre d\'adhérents', 'Adhérents couverts à l\'entrée, en millions.'],
  MEMBER_GROWTH: ['Croissance des adhérents', 'Croissance annuelle du nombre d\'adhérents.'],
  PREMIUM_PMPM: ['Prime par adhérent et par mois', 'Prime moyenne encaissée par adhérent et par mois (PMPM).'],
  PREMIUM_TREND: ['Évolution des primes', 'Hausse annuelle de la prime moyenne.'],
  MEDICAL_LOSS_RATIO: ['Ratio de sinistralité médicale', 'Prestations médicales payées rapportées aux primes (MLR).'],
  ADMIN_EXPENSE_RATIO: ['Ratio de frais administratifs', 'Frais de gestion rapportés aux primes.'],
  MEMBERS_EXIT: ['Adhérents à la sortie', 'Nombre d\'adhérents l\'année de sortie.'],

  // Assurance dommages et auto
  NET_PREMIUMS_EARNED: ['Primes nettes acquises', 'Primes acquises nettes de réassurance à l\'entrée.'],
  PREMIUM_GROWTH: ['Croissance des primes', 'Croissance annuelle des primes.'],
  FLOAT_RATIO: ['Ratio de float', 'Placements adossés aux réserves techniques, rapportés aux primes nettes.'],
  NET_PREMIUMS_EARNED_EXIT: ['Primes nettes acquises de sortie', 'Primes nettes acquises l\'année de sortie.'],
  UNDERWRITING_RESULT_EXIT: ['Résultat technique de sortie', 'Primes nettes de sortie × (1 − ratio combiné) : ce que la souscription rapporte avant placements.'],
  INVESTMENT_INCOME_EXIT: ['Produits financiers de sortie', 'Revenus des placements l\'année de sortie : primes × ratio de float × rendement des placements.'],
  POLICIES_IN_FORCE: ['Contrats en portefeuille', 'Nombre de contrats en vigueur à l\'entrée, en millions.'],
  POLICY_GROWTH: ['Croissance du portefeuille', 'Croissance annuelle du nombre de contrats.'],
  AVERAGE_PREMIUM: ['Prime moyenne', 'Prime annuelle moyenne par contrat.'],
  POLICIES_EXIT: ['Contrats à la sortie', 'Nombre de contrats en vigueur l\'année de sortie.'],

  // Assurance vie
  RESERVES: ['Provisions techniques', 'Encours des provisions des contrats d\'assurance vie à l\'entrée.'],
  RESERVE_GROWTH: ['Croissance des provisions', 'Croissance annuelle des provisions techniques.'],
  INVESTMENT_SPREAD: ['Marge financière', 'Rendement des placements moins le taux servi aux assurés.'],
  GROSS_PREMIUMS: ['Primes brutes', 'Primes encaissées à l\'entrée, avant réassurance.'],
  RESERVES_EXIT: ['Provisions techniques de sortie', 'Encours des provisions l\'année de sortie.'],
  GROSS_PREMIUMS_EXIT: ['Primes brutes de sortie', 'Primes encaissées l\'année de sortie.'],
  SPREAD_INCOME_EXIT: ['Résultat financier de sortie', 'Provisions de sortie × marge financière.'],
  UNDERWRITING_MARGIN_EXIT: ['Marge technique de sortie', 'Primes de sortie moins les prestations et les frais.'],

  // Banque
  LOANS: ['Encours de crédits', 'Encours de crédits à la clientèle à l\'entrée.'],
  LOAN_GROWTH: ['Croissance des crédits', 'Croissance annuelle de l\'encours de crédits.'],
  NON_INTEREST_INCOME_SHARE: ['Part des commissions', 'Commissions et autres revenus hors intérêts en part du produit net bancaire.'],
  COST_INCOME_RATIO: ['Coefficient d\'exploitation', 'Charges d\'exploitation rapportées au produit net bancaire.'],
  COST_OF_RISK: ['Coût du risque', 'Dotations aux provisions pour pertes sur crédits, rapportées à l\'encours.'],
  LOANS_EXIT: ['Encours de crédits de sortie', 'Encours de crédits l\'année de sortie.'],
  NET_INTEREST_INCOME_EXIT: ['Marge nette d\'intérêts de sortie', 'Encours de sortie × marge nette d\'intérêts.'],
  PROVISIONS_EXIT: ['Provisions de sortie', 'Encours de sortie × coût du risque.'],
  CUSTOMERS: ['Nombre de clients', 'Clients actifs à l\'entrée, en millions.'],
  CUSTOMER_GROWTH: ['Croissance des clients', 'Croissance annuelle du nombre de clients.'],
  REVENUE_PER_CUSTOMER: ['Revenu par client', 'Produit net bancaire annuel moyen par client.'],
  COST_TO_SERVE: ['Coût de service par client', 'Charges d\'exploitation annuelles moyennes par client.'],
  LOANS_PER_CUSTOMER: ['Encours de crédit par client', 'Encours de crédits moyen par client.'],
  CUSTOMERS_EXIT: ['Clients à la sortie', 'Nombre de clients l\'année de sortie.'],

  // Biotech
  PEAK_SALES: ['Ventes au pic', 'Ventes annuelles attendues au pic du produit phare, s\'il est approuvé.'],
  PEAK_SALES_MULTIPLE: ['Multiple des ventes au pic', 'Valeur d\'un produit commercialisé, en multiple de ses ventes au pic.'],
  PROBABILITY_OF_SUCCESS: ['Probabilité de succès', 'Probabilité que le produit atteigne le marché, selon sa phase de développement.'],
  YEARS_TO_LAUNCH: ['Années avant lancement', 'Nombre d\'années avant la mise sur le marché.'],
  DISCOUNT_RATE: ['Taux d\'actualisation', 'Taux utilisé pour actualiser la valeur future du pipeline.'],

  // SaaS
  ARR: ['Revenu récurrent annuel (ARR)', 'Revenu des abonnements en cours, annualisé, à l\'entrée.'],
  GROSS_CHURN: ['Attrition brute', 'Part de l\'ARR perdue chaque année par résiliation ou réduction.'],
  EXPANSION_RATE: ['Expansion', 'Part de l\'ARR gagnée chaque année auprès des clients existants (montée en gamme, sièges).'],
  NRR: ['Rétention nette du revenu (NRR)', '1 + expansion − attrition : ce que l\'ARR d\'une année devient l\'année suivante, sans nouveaux clients.'],
  ARR_EXIT: ['ARR de sortie', 'Revenu récurrent annuel de l\'année de sortie.'],

  // Aéronautique et défense
  BOOK_TO_BILL: ['Book-to-bill', 'Prises de commandes rapportées au chiffre d\'affaires facturé ; au-dessus de 1, le carnet grossit.'],
  FIXED_PRICE_SHARE: ['Part des contrats à prix fixe', 'Part du chiffre d\'affaires réalisée en contrats à prix ferme, où les dépassements de coûts restent à la charge de l\'entreprise.'],
  COST_OVERRUN_RATE: ['Taux de dépassement de coûts', 'Dépassements de coûts sur les contrats à prix fixe, en part de leur chiffre d\'affaires.'],

  // Aérien
  ASK: ['Sièges-km offerts (ASK)', 'Capacité offerte à l\'entrée : nombre de sièges × kilomètres parcourus, en millions.'],
  ANCILLARY_PER_PAX: ['Revenus annexes par passager', 'Bagages, sièges, services à bord : revenu moyen par passager, en plus du billet.'],
  AVG_TRIP_KM: ['Distance moyenne par passager', 'Distance moyenne parcourue par passager, en kilomètres.'],
  CASK_EX_FUEL: ['Coût par siège-km hors carburant', 'Coûts d\'exploitation hors carburant par siège-km offert (CASK ex-fuel), hors amortissements.'],
  FUEL_CASK: ['Coût carburant par siège-km', 'Coût du carburant par siège-km offert.'],
  ASK_EXIT: ['Sièges-km offerts à la sortie', 'Capacité offerte l\'année de sortie.'],
  RPK_EXIT: ['Passagers-km à la sortie (RPK)', 'Sièges-km vendus l\'année de sortie : capacité × coefficient de remplissage.'],
  PASSENGERS_EXIT: ['Passagers à la sortie', 'Passagers transportés l\'année de sortie : passagers-km / distance moyenne.'],
};
