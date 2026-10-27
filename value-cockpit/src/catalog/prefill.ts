import type { ActiveVocabulary } from '../ontology/registry';
import { section, improveTitles } from './markdown';

/**
 * Keyword pre-fill of curation tables (docs/11 D4). It only PROPOSES mappings onto the
 * active vocabulary, with the matched keyword as evidence; the analyst validates the
 * table before any frontmatter is written. It never adds a term to the vocabulary.
 */

export interface ParsedAnalysis {
  num: string; title: string; part: string; partLabel: string; goal: string; improve: string[];
}

export interface SuggestedMapping {
  quant: string[]; levers: string[]; causes: string[]; evidence: string[]; regulatory: boolean;
}

type Rule = [code: string, pattern: RegExp];

// Order matters: it is the order of the suggestions in the table.
const METRIC_RULES: Rule[] = [
  ['EBITDA_MARGIN', /\b(margins?|profitab\w*)\b/i],
  ['REVENUE_GROWTH', /\b(grow\w*|market share|expansion|new markets?|customer acquisition|demand)\b/i],
  ['COGS', /\b(cost of goods|cogs|raw materials?|production costs?|unit costs?|input costs?)\b/i],
  ['OPEX', /\b(operating (expenses?|costs?)|overhead|sg&a|opex)\b/i],
  ['DIO', /\b(inventor\w*|stock[- ]?outs?)\b/i],
  ['DSO', /\b(receivables?|days sales outstanding|collections?)\b/i],
  ['DPO', /\b(payables?|supplier payment terms)\b/i],
  ['CAPEX', /\b(capital expenditures?|capex|capital investments?)\b/i],
  // saas extension (only applied when the archetype vocabulary has the code)
  ['GROSS_CHURN', /\bchurn\b/i],
  ['NRR', /\b(net revenue retention|net retention|nrr)\b/i],
  ['EXPANSION_RATE', /\b(expansion revenue|upsell\w*|up-sell\w*)\b/i],
  ['CAC', /\b(acquisition costs?|cac)\b/i],
  ['LTV', /\b(lifetime value|ltv|clv)\b/i],
  ['ARR', /\b(arr|mrr|recurring revenue)\b/i],
];

const LEVER_RULES: Rule[] = [
  ['PRICING', /\b(pric\w*|discounts?|promotions?|promotional|rate setting|yield management)\b/i],
  ['VOLUME', /\b(market share|customer acquisition|new markets?|expand\w*|sales growth|cross-sell\w*|channels?|distribution|retention|loyalty)\b/i],
  ['MIX', /\b(mix|portfolio|assortment|skus?|product lines?)\b/i],
  ['COST_PROCUREMENT', /\b(procure\w*|suppliers?|sourcing|purchas\w*|raw materials?|vendors?)\b/i],
  ['COST_OPS', /\b(efficien\w*|productiv\w*|automat\w*|lean|energy|labou?r|staff\w*|maintenance|downtime|throughput|scrap)\b/i],
  ['WC_DSO', /\b(receivables?|collections?|billing)\b/i],
  ['WC_DIO', /\b(inventor\w*|stock levels?)\b/i],
  ['WC_DPO', /\b(payables?|payment terms)\b/i],
  ['CAPEX_DISCIPLINE', /\b(capital expenditures?|capex|capital investments?|asset utili[sz]ation)\b/i],
  ['RETENTION', /\b(churn|retention|onboarding|customer success|renewals?)\b/i],
  ['EXPANSION', /\b(upsell\w*|up-sell\w*|cross-sell\w*|expansion)\b/i],
  ['SALES_EFFICIENCY', /\b(sales efficiency|cac|pipeline|conversion|sales cycles?)\b/i],
];

const CAUSE_RULES: Rule[] = [
  ['COMMERCIAL', /\b(customers?|sales|marketing|brands?|pric\w*|promotions?|channels?|consumers?)\b/i],
  ['OPERATIONAL', /\b(operations?|operational|production|manufactur\w*|supply chain|quality|maintenance|logistics?|capacity|process\w*)\b/i],
  ['FINANCIAL', /\b(costs?|financ\w*|capital|cash|margins?|profitab\w*|debt|investments?)\b/i],
  ['ORGANIZATIONAL', /\b(workforce|talent|employees?|training|culture|leadership|organi[sz]ation\w*|staff\w*)\b/i],
  ['MARKET', /\b(markets?|competit\w*|trends?|demand|industry)\b/i],
];

const REGULATORY = /\b(regulat\w*|compliance|fda|epa|licens\w*|permits?|certification\w*)\b/i;
CAUSE_RULES.push(['REGULATORY', REGULATORY]);

export function parseAnalysis(content: string): ParsedAnalysis {
  const h1 = content.match(/^#\s+(\d+)\s*·\s*(.+)$/m);
  const part = content.match(/\*\*Part:\*\* \[\[([A-Z]) - (.+?)\]\]/);
  if (!h1 || !part) throw new Error('Not an analysis file (missing title or Part line)');
  const improve = improveTitles(content);
  return {
    num: h1[1].padStart(2, '0'), title: h1[2].trim(), part: part[1], partLabel: part[2],
    goal: section(content, '🎯').join(' ').trim(), improve,
  };
}

function apply(rules: Rule[], text: string, allowed: (c: string) => boolean, evidence: string[]): string[] {
  const out: string[] = [];
  for (const [code, re] of rules) {
    if (!allowed(code)) continue;
    const m = text.match(re);
    if (m) { out.push(code); evidence.push(`${code}←${m[0].toLowerCase()}`); }
  }
  return out;
}

export function suggestMapping(a: ParsedAnalysis, vocab: ActiveVocabulary): SuggestedMapping {
  const evidence: string[] = [];
  const about = `${a.title} ${a.goal}`;
  const quant = apply(METRIC_RULES, about, (c) => vocab.isMetricCode(c), evidence);
  const levers = apply(LEVER_RULES, a.improve.join(' | '), (c) => vocab.isLeverCategory(c), evidence);
  const causes = apply(CAUSE_RULES, about, (c) => vocab.isCauseCategory(c), evidence);
  return { quant, levers, causes, evidence, regulatory: REGULATORY.test(`${about} ${a.improve.join(' ')}`) };
}
