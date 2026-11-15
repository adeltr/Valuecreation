import kpiDefinitions from './kpi-definitions.json';

export interface MetricDescription {
  label: string;
  definition: string | null;
  /** 'cockpit': written for the model's backbone; 'umbrex': the sector glossary, verbatim. */
  source: 'cockpit' | 'umbrex' | null;
}

/** "LOAD_FACTOR" → "Load factor": a readable name when nothing better is known. */
export function humanize(code: string): string {
  const s = code.toLowerCase().replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Base, bridge and family codes: the backbone every analyst reads (docs/21).
const CORE: Record<string, [label: string, definition: string]> = {
  REVENUE: ['Chiffre d\'affaires (entrée)', 'Chiffre d\'affaires de la dernière année connue, à l\'entrée.'],
  COGS: ['Coût des ventes', 'Coût des ventes de l\'année d\'entrée.'],
  GROSS_PROFIT: ['Marge brute', 'Chiffre d\'affaires moins coût des ventes, à l\'entrée.'],
  OPEX: ['Charges d\'exploitation', 'Charges d\'exploitation hors coût des ventes, à l\'entrée.'],
  EBITDA_ENTRY: ['EBITDA d\'entrée', 'EBITDA historique sur lequel le prix d\'entrée est calculé. Un levier ne le modifie jamais.'],
  EBITDA_MARGIN: ['Marge d\'EBITDA', 'EBITDA rapporté au chiffre d\'affaires.'],
  REVENUE_GROWTH: ['Croissance du chiffre d\'affaires', 'Croissance annuelle du chiffre d\'affaires jusqu\'à la sortie.'],
  REVENUE_EXIT: ['Chiffre d\'affaires de sortie', 'Chiffre d\'affaires de l\'année de sortie, calculé à partir des drivers.'],
  EBITDA_MARGIN_EXIT: ['Marge d\'EBITDA de sortie', 'Marge d\'EBITDA de l\'année de sortie, calculée à partir des drivers.'],
  DSO: ['Délai clients (DSO)', 'Créances clients en jours de chiffre d\'affaires.'],
  DIO: ['Rotation des stocks (DIO)', 'Stocks en jours de coût des ventes.'],
  DPO: ['Délai fournisseurs (DPO)', 'Dettes fournisseurs en jours de coût des ventes.'],
  COGS_RATIO: ['Part du coût des ventes', 'Coût des ventes rapporté au chiffre d\'affaires. Sert à convertir DIO et DPO en jours de chiffre d\'affaires.'],
  WORKING_CAPITAL: ['BFR d\'entrée', 'Besoin en fonds de roulement à l\'entrée (créances + stocks − fournisseurs).'],
  WORKING_CAPITAL_EXIT: ['BFR de sortie', 'BFR de l\'année de sortie : chiffre d\'affaires de sortie × jours de BFR / 365.'],
  CAPEX: ['Capex annuel', 'Investissements annuels moyens sur la durée de détention.'],
  CASH_CONVERSION: ['Conversion de l\'EBITDA en cash', 'Part de l\'EBITDA qui reste en trésorerie après impôt, intérêts et autres décaissements, avant capex et variation de BFR.'],
  CUMULATIVE_FCF: ['Cash généré sur la période', 'Flux de trésorerie disponible cumulé de l\'entrée à la sortie ; il réduit la dette nette.'],
  FCF_ANNUAL: ['FCF annuel moyen', 'Cash généré sur la période divisé par la durée de détention.'],
  PRICE_ELASTICITY: ['Élasticité prix → volume', 'Variation de la croissance en volume pour un point de croissance en prix. Estimation de l\'analyste.'],
  ENTRY_MULTIPLE: ['Multiple d\'entrée', 'Multiple payé à l\'entrée sur l\'ancre de valorisation (EBITDA, fonds propres ou rNPV).'],
  EXIT_MULTIPLE: ['Multiple de sortie', 'Multiple retenu à la sortie. Hypothèse de scénario de l\'analyste, jamais un levier.'],
  HOLD_YEARS: ['Durée de détention', 'Nombre d\'années entre l\'entrée et la sortie.'],
  NET_DEBT_ENTRY: ['Dette nette d\'entrée', 'Dette financière nette à l\'entrée.'],
  NET_DEBT_EXIT: ['Dette nette de sortie', 'Dette nette d\'entrée moins le cash généré sur la période.'],
  EBITDA_EXIT: ['EBITDA de sortie', 'EBITDA de l\'année de sortie, calculé à partir des drivers du secteur.'],
  EQUITY_ENTRY: ['Valeur des fonds propres à l\'entrée', 'Prix payé pour les fonds propres à l\'entrée.'],
  EQUITY_EXIT: ['Valeur des fonds propres à la sortie', 'Valeur des fonds propres à la sortie.'],
  MOIC: ['MOIC', 'Multiple du capital investi : valeur de sortie (et dividendes) rapportée au prix d\'entrée.'],
  IRR: ['TRI', 'Taux de rendement interne annuel, calculé sur deux flux : entrée et sortie.'],
  PLAN_ONE_OFF_COSTS: ['Coûts exceptionnels du plan', 'Coûts non récurrents du plan. Le moteur y ajoute le coût de mise en œuvre des leviers du scénario.'],
  BOOK_VALUE_ENTRY: ['Fonds propres comptables d\'entrée', 'Fonds propres comptables à l\'entrée ; le prix d\'entrée est un multiple de ce montant (P/BV).'],
  NET_INCOME_ENTRY: ['Résultat net d\'entrée', 'Résultat net de la dernière année connue.'],
  PAYOUT_RATIO: ['Taux de distribution', 'Part du résultat net versée en dividendes.'],
  TAX_RATE: ['Taux d\'impôt', 'Taux d\'impôt sur les sociétés appliqué au résultat.'],
  NET_INCOME_EXIT: ['Résultat net de sortie', 'Résultat net de l\'année de sortie, calculé à partir des drivers.'],
  CUMULATIVE_NET_INCOME: ['Résultat net cumulé', 'Résultat net cumulé de l\'entrée à la sortie (progression linéaire).'],
  BOOK_VALUE_EXIT: ['Fonds propres comptables de sortie', 'Fonds propres d\'entrée plus le résultat mis en réserve, moins les coûts du plan.'],
  DIVIDENDS_CUMULATIVE: ['Dividendes cumulés', 'Dividendes versés de l\'entrée à la sortie ; ils comptent dans le MOIC.'],
  ROE_EXIT: ['ROE de sortie', 'Résultat net de sortie rapporté aux fonds propres de sortie.'],
  RNPV_ENTRY: ['rNPV d\'entrée', 'Valeur actuelle nette du pipeline ajustée du risque, à l\'entrée.'],
  CASH_ENTRY: ['Trésorerie d\'entrée', 'Trésorerie disponible à l\'entrée.'],
  ANNUAL_BURN: ['Burn annuel', 'Consommation annuelle de trésorerie.'],
  RNPV_EXIT: ['rNPV de sortie', 'rNPV du pipeline à la date de sortie, calculée à partir des drivers.'],
  CASH_EXIT: ['Trésorerie de sortie', 'Trésorerie d\'entrée moins le burn cumulé et les coûts du plan ; négative = besoin de financement.'],
  RUNWAY_YEARS: ['Runway', 'Nombre d\'années de trésorerie au rythme de burn actuel.'],
};

const KPI = kpiDefinitions as Record<string, Record<string, { label: string; definition: string }>>;

/** Label and definition of a metric code; `archetype` selects the sector glossary. */
export function describeMetric(code: string, archetype?: string): MetricDescription {
  const core = CORE[code];
  if (core) return { label: core[0], definition: core[1], source: 'cockpit' };
  const kpi = archetype ? KPI[archetype]?.[code] : undefined;
  if (kpi) return { label: kpi.label, definition: kpi.definition, source: 'umbrex' };
  return { label: humanize(code), definition: null, source: null };
}
