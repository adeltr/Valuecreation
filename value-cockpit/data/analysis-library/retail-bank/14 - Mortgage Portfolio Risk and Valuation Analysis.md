---
tags:
  - retail-bank
  - part/B
kind: analysis
id: retail-bank-14
part: B
partLabel: Product and Portfolio Performance
quant: [LOANS_PER_CUSTOMER]
causes: [MARKET]
levers: [MIX]
---
# 14 · Mortgage Portfolio Risk and Valuation Analysis

> **Part:** [[B - Product and Portfolio Performance]]  ·  **Index:** [[How to Analyze a Retail Bank]]

## 🎯 Goal
To assess the risk and valuation of the bank’s mortgage portfolio by analyzing factors such as loan-to-value (LTV) ratios, delinquency rates, market trends, and overall portfolio composition. This analysis ensures effective risk management and accurate valuation of mortgage assets.


## 📊 Data required
1. Mortgage portfolio details (loan amounts, interest rates, terms, origination dates).
2. Loan-to-value (LTV) ratios at origination and current LTV based on updated property valuations.
3. Delinquency and default rates.
4. Market data for property values and trends in key regions.
5. Loan repayment patterns (e.g., prepayments, late payments).
6. Credit scores and income details of borrowers.
7. Historical performance data of the mortgage portfolio.


## 🪜 Step-by-step
1. Evaluate Portfolio Composition ○ Segment the portfolio by mortgage type (e.g., fixed-rate, adjustable-rate). ○ Analyze distribution by geographic location, borrower demographics, and loan sizes. ○ Calculate the weighted average interest rate and remaining term for the portfolio.
2. Calculate Risk Metrics ○ Determine current LTV ratios:
`Current LTV = (Outstanding Loan Balance / Current Property Value) x 100`
○ Calculate delinquency rate:
`Delinquency Rate = (Number of Delinquent Mortgages / Total Mortgages)`
x 100 ○ Assess default rate:
`Default Rate = (Number of Defaulted Mortgages / Total Mortgages) x 100`
3. **Perform Valuation Analysis:** Calculate net present value (NPV) of the mortgage portfolio using the formula:
`NPV = ∑ (Cash Flow_t / (1 + Discount Rate)^t)`
- Cash Flow_t = expected monthly payment for each loan.
42
- Discount Rate = current market interest rate for similar loans.
Assess the impact of interest rate fluctuations on portfolio value.
4. Assess Market Trends ○ Review property market data to identify regions with declining or appreciating property values. ○ Highlight geographic areas with significant risks, such as high foreclosure rates.
5. Analyze Prepayment and Refinancing Trends ○ Identify patterns of early repayments or refinancing, which affect cash flow projections. ○ Calculate prepayment rate:
`Prepayment Rate = (Number of Prepaid Loans / Total Loans) x 100`
6. Stress Test the Portfolio ○ Simulate the impact of adverse scenarios (e.g., property value declines, interest rate hikes) on LTV ratios and portfolio valuation. ○ Assess changes in default probabilities under stress conditions.
7. Identify Risk Mitigation Opportunities ○ Highlight loans or segments with high LTV ratios, delinquency rates, or geographic risks. ○ Recommend targeted actions, such as restructuring high-risk loans or adjusting underwriting criteria.


## 📤 Output format
- Tables summarizing portfolio composition, risk metrics (LTV, delinquency rates), and valuation metrics.
- Charts showing LTV distribution and trends in property values by region.
- Scenario analysis results demonstrating portfolio performance under stress conditions.
- A summary report with key findings and recommendations.


## 🔍 How to interpret the results
1. High LTV ratios indicate increased risk of loss in case of borrower default.
2. Rising delinquency or default rates highlight areas of credit quality concern.
3. Positive NPV values signal a well-valued portfolio; negative impacts in stress tests indicate potential vulnerabilities.
4. Regional disparities in property values or foreclosure rates suggest location-specific risks.
43


## 🚀 Steps to improve
1. Implement stricter underwriting criteria for high-LTV loans in volatile property markets.
2. Introduce targeted refinancing offers to incentivize borrowers to lower LTV ratios.
3. Conduct regular portfolio reviews to identify and address emerging risks.
4. Diversify the geographic composition of the portfolio to reduce exposure to regional market fluctuations.
5. Leverage predictive analytics to monitor borrower behavior and proactively mitigate delinquency risks.
44

