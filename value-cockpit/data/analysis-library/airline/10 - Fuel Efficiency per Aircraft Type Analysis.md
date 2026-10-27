---
tags:
  - airline
  - part/B
kind: analysis
id: airline-10
part: B
partLabel: Fleet and Asset Optimization
quant: [LOAD_FACTOR, FUEL_CASK]
causes: [FUEL_PRICE]
levers: [FUEL_EFFICIENCY]
---
# 10 · Fuel Efficiency per Aircraft Type Analysis

> **Part:** [[B - Fleet and Asset Optimization]]  ·  **Index:** [[How to Analyze an Airline Company]]

## 🎯 Goal
The goal of the Fuel Efficiency per Aircraft Type Analysis is to evaluate and compare the fuel consumption and efficiency of each aircraft type in the airline’s fleet. This analysis aims to identify which aircraft are most and least fuel-efficient, supporting decisions on fleet utilization, route allocation, and potential fleet renewal for optimal cost savings.


## 📊 Data required
- Fuel consumption data per aircraft type on various routes
- Revenue passenger kilometers (RPK) and available seat kilometers (ASK) per aircraft type
- Average load factors per aircraft type and route
- Operational costs associated with fuel per route
- Route distance and flight duration data
- Fuel price fluctuations and historical data on fuel costs


## 🪜 Step-by-step
1. **Gather Fuel Consumption Data by Aircraft Type:** Collect fuel consumption data for each aircraft type, breaking it down by route if possible. Record fuel used per flight hour, as well as per flight segment, to provide a detailed view of each aircraft’s consumption patterns.
2. **Calculate Fuel Efficiency Metrics:** For each aircraft, calculate fuel efficiency in terms of fuel consumed per RPK and ASK:
- **Fuel per RPK:** Fuel Efficiency (RPK) = Total Fuel Consumed / RPK.
- **Fuel per ASK:** Fuel Efficiency (ASK) = Total Fuel Consumed / ASK.
Lower values indicate better fuel efficiency per passenger carried or seat offered.
3. **Analyze Fuel Efficiency by Route:** Evaluate fuel efficiency on different routes to see how aircraft performance varies with distance. Some aircraft may be more fuel-efficient on long-haul routes, while others perform better on shorter segments.
4. **Assess Impact of Load Factors:** Calculate the load factor for each aircraft type on different routes and determine its influence on fuel efficiency. Use:
`Load Factor = (RPK / ASK) x 100`
Higher load factors generally improve per-passenger fuel efficiency, so consider this when evaluating aircraft utilization on specific routes.
5. **Benchmark Against Industry Standards:** Compare each aircraft type’s fuel efficiency against industry standards and similar models in other airlines’ fleets. This benchmarking provides a reference point for assessing if the airline’s aircraft are underperforming or competitive in fuel efficiency.
6. **Evaluate Financial Impact of Fuel Efficiency:** Multiply the fuel efficiency metrics by current fuel costs to estimate the financial impact. Use:
`Fuel Cost Impact = Fuel Efficiency (ASK or RPK) x Fuel Price`
Identify aircraft types with high fuel costs per ASK or RPK, which may be candidates for replacement or reassignment.
7. **Scenario Testing for Fleet Optimization:** Run scenarios where fuel-intensive aircraft are replaced with more efficient models on specific routes. Calculate the potential savings in fuel costs and evaluate operational feasibility to guide fleet renewal or reallocation.


## 📤 Output format
- **Fuel Efficiency Summary Table:** A table listing fuel efficiency per RPK and ASK for each aircraft type and major route.
- **Load Factor and Efficiency Comparison:** A summary showing how load factors impact fuel efficiency across aircraft types.
- **Benchmarking Report:** A comparison of the airline’s fuel efficiency metrics against industry standards.
- **Scenario Analysis Results:** Charts or tables summarizing projected fuel cost savings and efficiency improvements under different fleet scenarios.


## 🔍 How to interpret the results
- Fuel Efficiency Summary Table shows which aircraft types are most efficient in terms of fuel consumption, guiding future fleet planning and route assignments.
- Load Factor and Efficiency Comparison highlights the influence of load factors on fuel performance, useful for determining optimal aircraft and route combinations.
- Benchmarking Report provides insight into the airline’s fuel efficiency relative to industry norms, indicating potential areas for improvement.
- Scenario Analysis Results forecast potential fuel savings from replacing or reassigning aircraft, supporting decisions on fleet optimization.


## 🚀 Steps to improve
1. **Optimize Fleet Allocation by Route:** Assign more fuel-efficient aircraft to fuel-intensive long-haul routes, maximizing savings on high-consumption segments.
2. **Enhance Load Factors:** Implement strategies to increase load factors on fuel-intensive routes, such as dynamic pricing or targeted marketing.
3. **Invest in Fuel-Efficient Aircraft:** Consider phasing out older, less efficient models and acquiring newer aircraft with better fuel economy for a long-term impact on fuel costs.
4. **Optimize Flight Operations:** Use fuel-saving operational practices such as optimized flight speeds, altitudes, and route planning to reduce fuel consumption.
5. **Monitor Fuel Price Trends:** Adjust fuel-intensive aircraft deployment based on fuel price changes, using more efficient models during periods of high fuel costs.

