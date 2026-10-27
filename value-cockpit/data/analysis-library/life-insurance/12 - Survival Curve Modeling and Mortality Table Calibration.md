---
tags:
  - life-insurance
  - part/B
---
# 12 · Survival Curve Modeling and Mortality Table Calibration

> **Part:** [[B - Actuarial and Reserve Management]]  ·  **Index:** [[How to Analyze a Life Insurance Company]]

## 🎯 Goal
To construct survival curves and calibrate mortality tables for life insurance policyholders. This ensures accurate mortality assumptions for product pricing, liability reserving, and risk management.


## 📊 Data required
1. **Policyholder data:** date of birth, policy start date, status (active, deceased, lapsed), and demographics (age, gender, location).
2. **Mortality experience data:** number of deaths, exposure periods.
3. **Actuarial assumptions:** lapse rates, mortality tables, discount rates.
4. Standard mortality tables (e.g., SOA, AM92, country-specific).
5. Population-level survival and life expectancy data.


## 🪜 Step-by-step
1. Clean and prepare data by grouping policyholders into cohorts based on age, gender, and policy type. Identify exposure periods (e.g., years at risk).
2. Construct survival curves using the Kaplan-Meier estimator:
`Survival Probability (S_t) = S_(t-1) * (1 - d_t / n_t)`
where d_t = number of deaths at time t and n_t = number of individuals at risk just before t.
3. Calculate mortality rates for each age group:
`Mortality Rate (q_x) = Number of Deaths in Age Group / Number of Lives`
Exposed in Age Group.
4. Compare observed mortality rates to a baseline mortality table. Apply adjustment factors where deviations occur. For example:
`Adjusted Mortality Rate = Standard Mortality Rate * Scaling Factor.`
5. Perform goodness-of-fit tests to validate the adjusted mortality table. Use methods like Chi-squared tests to confirm alignment between observed and expected mortality rates.
6. Perform sensitivity testing to assess the impact of changes in mortality assumptions (e.g., +/- 10% mortality rates) on liabilities and pricing.
7. Benchmark results against standard mortality tables and population-level life expectancy data to identify anomalies or trends.
8. **Visualize results by generating:** ○ Survival curve graphs for key cohorts (e.g., age, gender). ○ Tables showing calibrated mortality rates by age group.
35


## 📤 Output format
- Tables displaying observed and adjusted mortality rates by age group
- Survival curves segmented by demographic cohorts
- Sensitivity testing results showing the impact of assumption changes
- Goodness-of-fit validation results


## 🔍 How to interpret the results
1. Survival curves deviating from standard tables highlight portfolio-specific mortality trends requiring updated assumptions.
2. Higher mortality rates than expected suggest potential underpricing or inadequate reserves for certain cohorts.
3. Lower mortality rates indicate conservative assumptions and opportunities to optimize pricing.
4. Poor goodness-of-fit results signal a need to refine mortality assumptions or calibrate models more accurately.


## 🚀 Steps to improve
1. Update mortality assumptions regularly based on recent experience and emerging trends.
2. Enhance underwriting practices to improve risk selection and align mortality experience with assumptions.
3. Incorporate longevity improvements to account for advancements in healthcare and changing demographics.
4. Implement predictive analytics to model survival probabilities more accurately across cohorts.
5. Use reinsurance to transfer excess mortality or longevity risk for specific high-risk segments.
6. Monitor population trends and external shocks (e.g., pandemics) to adjust assumptions proactively.
36

