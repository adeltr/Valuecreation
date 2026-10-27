---
tags:
  - auto-insurance
  - part/A
---
# 7 · Territorial Rating Factor Fine-Tuning

> **Part:** [[A - Pricing & Product Strategy]]  ·  **Index:** [[How to Analyze an Auto Insurance Company]]

## 🎯 Goal
Refine the geographic rating factors used in pricing auto insurance policies so that premiums accurately reflect the risk levels associated with different territories.


## 📊 Data required
- Geographic boundaries or ZIP codes used for rating
- Claims data (frequency, severity, incurred losses, loss adjustment expenses) by territory
- Premium and exposure data (earned premium, number of policies, insured vehicles) by territory
- External data such as crime rates, population density, traffic congestion, and road infrastructure
- Competitor or market benchmark data for territorial rating (if available)


## 🪜 Step-by-step
1. Collect claims and premium data organized by territory over a specific time window (e.g., 3–5 years). Ensure uniform data points, including earned premium, incurred losses, and policy counts for each territory.
2. Calculate key performance metrics such as Claim Frequency = (Number of Claims / Number of Exposures) x 100 and Loss Ratio = (Incurred Losses + LAE) / Earned Premium for each territory. Identify territories with unusually high or low metrics.
3. Incorporate external environmental data like crime rates or road conditions to see if these factors correlate with higher claim frequency or severity. Look for patterns that might justify different rating factors.
4. Compare internal territorial loss experience to any available market or competitor benchmarks, noting significant variances. Identify potential underpriced or overpriced segments that require attention.
5. Cluster or group territories with similar risk profiles. Evaluate whether these clusters align with current territorial definitions or if a re-mapping would more accurately capture risk.
6. Conduct statistical testing or modeling (e.g., GLM or predictive analytics) to validate which territory-related variables best explain loss trends. Pinpoint areas where rating factors could be refined.
18
7. Propose revised territorial rating factors or surcharges/discounts. Ensure adjustments align with regulatory guidelines and that you have documented justifications for each change.
8. Document findings and finalize recommendations for stakeholders, including an implementation timeline. Prepare any necessary filings if regulatory approval is required.


## 📤 Output format
- Tables or maps showing current vs. proposed territorial rating factors and corresponding loss ratios
- Charts illustrating claim frequency and severity by territory
- Written summary highlighting high-risk, moderate-risk, and low-risk areas, as well as recommended rating adjustments


## 🔍 How to interpret the results
- Territories with loss ratios well above the desired range may indicate underpriced regions requiring higher rate adjustments.
- Territories with consistently low claim frequency and severity might merit discounted rates to remain competitive.
- Abrupt risk variations between adjacent territories could signal inadequate segmentation or an oversimplified rating approach.


## 🚀 Steps to improve
1. Regularly review territory definitions and update based on emerging risk patterns, demographic shifts, or infrastructure changes.
2. Use advanced statistical models or machine learning to detect hidden geographic factors influencing claim costs.
3. Collaborate with local authorities or other data providers to track changes in crime rates, traffic patterns, or road improvements.
4. Maintain open communication with regulators to ensure territorial rate changes comply with filing requirements and do not raise unfair discrimination concerns.
19

