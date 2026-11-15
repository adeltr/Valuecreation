export const NODE_TYPES = ['kpi', 'driver', 'sub_driver'] as const;
export type NodeType = (typeof NODE_TYPES)[number];

export const UNITS = ['currency', 'days', 'percent', 'ratio', 'count', 'years'] as const;
export type Unit = (typeof UNITS)[number];

export const DELTA_KINDS = ['absolute', 'percent'] as const;
export type DeltaKind = (typeof DELTA_KINDS)[number];

// Exit multiple is a scenario ASSUMPTION, not a lever — hence no MULTIPLE_EXPANSION here.
export const BASE_LEVER_CATEGORIES = [
  'PRICING', 'VOLUME', 'MIX',
  'COST_PROCUREMENT', 'COST_OPS',
  'WC_DSO', 'WC_DIO', 'WC_DPO',
  'CAPEX_DISCIPLINE',
] as const;

export const BASE_CAUSE_CATEGORIES = [
  'COMMERCIAL', 'OPERATIONAL', 'FINANCIAL', 'ORGANIZATIONAL', 'MARKET',
  'REGULATORY', // compliance, licences, export control — shared by every company type
] as const;

// Two-point bridge (layer L1 of the driver tree)
export const BRIDGE_METRIC_CODES = [
  'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS',
  'NET_DEBT_ENTRY', 'NET_DEBT_EXIT',
  'EBITDA_EXIT', 'EQUITY_ENTRY', 'EQUITY_EXIT', 'MOIC', 'IRR',
  // One-off cost of the plan: analyst input, to which the engine adds the cost of the scenario levers
  'PLAN_ONE_OFF_COSTS',
] as const;

export const BASE_METRIC_CODES = [
  // P&L (entry-period)
  'REVENUE', 'COGS', 'GROSS_PROFIT', 'OPEX', 'EBITDA_ENTRY', 'EBITDA_MARGIN',
  // Growth to exit (generic EBITDA template; sector templates compute REVENUE_EXIT their own way)
  'REVENUE_GROWTH', 'REVENUE_EXIT', 'EBITDA_MARGIN_EXIT',
  // Working capital & cash
  // WORKING_CAPITAL and CAPEX are entry-period facts / run-rates; FCF_ANNUAL is the average over the hold
  'DSO', 'DIO', 'DPO', 'COGS_RATIO', 'WORKING_CAPITAL', 'WORKING_CAPITAL_EXIT', 'CAPEX',
  'CASH_CONVERSION', 'CUMULATIVE_FCF', 'FCF_ANNUAL',
  // Analyst-set interaction coefficient (docs/06): Δ volume growth per point of price growth
  'PRICE_ELASTICITY',
  ...BRIDGE_METRIC_CODES,
] as const;

// Deal-structure codes: set by the analyst (entry facts or scenario assumptions),
// never the target of a lever — multiple expansion is largely exogenous.
// PRICE_ELASTICITY is an analyst estimate that couples two drivers, not something a plan moves.
// CASH_CONVERSION and COGS_RATIO are analyst estimates of the cash bridge; WORKING_CAPITAL is the
// entry balance; PLAN_ONE_OFF_COSTS is fed by the levers' own cost, not targeted by them.
export const NON_LEVER_CODES = [
  'ENTRY_MULTIPLE', 'EXIT_MULTIPLE', 'HOLD_YEARS', 'NET_DEBT_ENTRY', 'PRICE_ELASTICITY',
  'CASH_CONVERSION', 'COGS_RATIO', 'WORKING_CAPITAL', 'PLAN_ONE_OFF_COSTS',
] as const;

// The only inputs an analyst may override as a scenario assumption (docs/06).
export const SCENARIO_ASSUMPTION_CODES = ['EXIT_MULTIPLE', 'HOLD_YEARS'] as const;

export interface MetricMeta { unit: Unit; fiboRef?: string }

export const BASE_METRIC_META: Record<(typeof BASE_METRIC_CODES)[number], MetricMeta> = {
  REVENUE: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:Revenue' },
  COGS: { unit: 'currency' },
  GROSS_PROFIT: { unit: 'currency' },
  OPEX: { unit: 'currency' },
  EBITDA_ENTRY: { unit: 'currency', fiboRef: 'fibo-fnd-acc-aeq:EBITDA' },
  EBITDA_MARGIN: { unit: 'percent' },
  REVENUE_GROWTH: { unit: 'percent' },
  REVENUE_EXIT: { unit: 'currency' },
  EBITDA_MARGIN_EXIT: { unit: 'percent' },
  DSO: { unit: 'days' },
  DIO: { unit: 'days' },
  DPO: { unit: 'days' },
  WORKING_CAPITAL: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:WorkingCapital' },
  CAPEX: { unit: 'currency' },
  FCF_ANNUAL: { unit: 'currency' },
  COGS_RATIO: { unit: 'percent' },
  WORKING_CAPITAL_EXIT: { unit: 'currency' },
  CASH_CONVERSION: { unit: 'percent' },
  CUMULATIVE_FCF: { unit: 'currency' },
  IRR: { unit: 'percent' },
  PLAN_ONE_OFF_COSTS: { unit: 'currency' },
  PRICE_ELASTICITY: { unit: 'ratio' },
  ENTRY_MULTIPLE: { unit: 'ratio' },
  EXIT_MULTIPLE: { unit: 'ratio' },
  HOLD_YEARS: { unit: 'years' },
  NET_DEBT_ENTRY: { unit: 'currency', fiboRef: 'fibo-fnd-acc-cur:NetDebt' },
  NET_DEBT_EXIT: { unit: 'currency' },
  EBITDA_EXIT: { unit: 'currency' },
  EQUITY_ENTRY: { unit: 'currency' },
  EQUITY_EXIT: { unit: 'currency' },
  MOIC: { unit: 'ratio' },
};
