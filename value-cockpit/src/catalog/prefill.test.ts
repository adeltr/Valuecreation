import { describe, it, expect } from 'vitest';
import { parseAnalysis, suggestMapping } from './prefill';
import { getActiveVocabulary } from '../ontology/registry';

const doc = `---
tags:
  - cpg
  - part/E
---
# 12 · Trade Promotion Effectiveness and Pricing Analysis

> **Part:** [[E - Finance]]  ·  **Index:** [[How to Analyze a Consumer Packaged Goods Company]]

## 🎯 Goal
Assess whether trade promotions and list prices protect gross margin while growing market share.

## 📊 Data required
- Promotion calendar

## 🪜 Step-by-step
1. **Collect:** data.

## 📤 Output format
- table

## 🔍 How to interpret the results
- read

## 🚀 Steps to improve
- **Reduce unprofitable promotions:** cut deals with negative ROI.
- **Renegotiate supplier contracts:** lower input costs.
- **Strengthen FDA labeling compliance:** avoid recalls.
`;

describe('parseAnalysis', () => {
  it('extracts number, title, part, goal and improvement titles', () => {
    expect(parseAnalysis(doc)).toEqual({
      num: '12', title: 'Trade Promotion Effectiveness and Pricing Analysis', part: 'E', partLabel: 'Finance',
      goal: 'Assess whether trade promotions and list prices protect gross margin while growing market share.',
      improve: ['Reduce unprofitable promotions', 'Renegotiate supplier contracts', 'Strengthen FDA labeling compliance'],
    });
  });
});

describe('suggestMapping (base vocabulary)', () => {
  const m = suggestMapping(parseAnalysis(doc), getActiveVocabulary('cpg'));

  it('maps metrics from title + goal, levers from improvement titles, causes from title + goal', () => {
    expect(m.quant).toEqual(['EBITDA_MARGIN', 'REVENUE_GROWTH']);
    expect(m.levers).toEqual(['PRICING', 'COST_PROCUREMENT']);
    expect(m.causes).toEqual(['COMMERCIAL', 'FINANCIAL', 'MARKET']);
  });

  it('keeps the matched keyword as evidence for the analyst', () => {
    expect(m.evidence).toContain('PRICING←promotions');
  });

  it('flags regulatory content the base vocabulary cannot express', () => {
    expect(m.regulatory).toBe(true);
  });

  it('never emits a term outside the active vocabulary', () => {
    const v = getActiveVocabulary('cpg');
    for (const c of m.quant) expect(v.isMetricCode(c)).toBe(true);
    for (const c of m.levers) expect(v.isLeverCategory(c)).toBe(true);
    for (const c of m.causes) expect(v.isCauseCategory(c)).toBe(true);
  });

  it('uses the saas extension rules for the saas archetype', () => {
    const saas = suggestMapping({ ...parseAnalysis(doc), title: 'Churn and Net Revenue Retention', goal: '', improve: ['Improve onboarding'] },
      getActiveVocabulary('saas'));
    expect(saas.quant).toContain('GROSS_CHURN');
    expect(saas.levers).toContain('RETENTION');
  });
});
