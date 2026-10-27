---
tags:
  - manufacturing
  - part/A
kind: analysis
id: manufacturing-02
part: A
partLabel: Operations
quant: [CONVERSION_COST_RATE, OEE]
causes: [OPERATIONAL]
levers: [LEAN_OEE]
---
# 2 · Operational Efficiency (OEE) Analysis

> **Part:** [[A - Operations]]  ·  **Index:** [[How to Analyze a Manufacturing Company]]

## 🎯 Goal
The goal of an Operational Efficiency (OEE) Analysis is to measure the overall performance of a manufacturing process. OEE combines three key factors—availability, performance, and quality—into a single percentage to evaluate how effectively equipment and processes are being utilized in production.


## 📊 Data required
- **Planned Production Time:** Total time that production is planned to be running.
- **Downtime:** Time during which production was stopped (e.g., equipment failures, changeovers).
- **Ideal Cycle Time:** The fastest time to produce one unit under optimal conditions.
- **Actual Cycle Time:** The actual time it takes to produce one unit.
- **Total Units Produced:** Total number of units produced during the analyzed period.
- **Defective Units:** Number of units produced that do not meet quality standards.


## 🪜 Step-by-step
1. **Calculate Availability:** Availability = (Planned Production Time - Downtime) / Planned Production Time x 100 For example, if the planned production time is 8 hours (480 minutes) and the downtime is 60 minutes: Availability = (480 - 60) / 480 x 100 = 87.5%
2. **Calculate Performance:** Performance = (Ideal Cycle Time x Total Units Produced) / Actual Production Time x 100 Actual Production Time = Planned Production Time - Downtime For example, if the ideal cycle time is 1 minute per unit, 400 units are produced, and actual production time is 420 minutes: Performance = (1 x 400) / 420 x 100 = 95.24%
3. **Calculate Quality:** Quality = (Good Units Produced / Total Units Produced) x 100 For example, if 390 of the 400 units produced meet quality standards: Quality = (390 / 400) x 100 = 97.5%
4. **Calculate Overall OEE:** OEE = Availability x Performance x Quality / 100 Using the earlier examples: OEE = (87.5 x 95.24 x 97.5) / 100 = 81.3%


## 📤 Output format
- Availability, Performance, and Quality percentages should be shown in a table.
9
- OEE percentage should be highlighted as the key metric.
- A graph (e.g., bar or pie chart) showing the contribution of each factor (availability, performance, and quality) to the overall OEE can be helpful.


## 🔍 How to interpret the results
- **85% to 100% OEE:** Considered world-class manufacturing. The process is operating very efficiently.
- **60% to 85% OEE:** Typical for most manufacturing facilities. There is room for improvement in one or more areas (availability, performance, or quality).
- **Below 60% OEE:** Indicates significant inefficiencies. There may be frequent downtime, slow production rates, or quality issues that need to be addressed.


## 🚀 Steps to improve
1. **Improve Availability:** ○ Reduce equipment downtime by implementing better preventive maintenance schedules. ○ Streamline changeover processes to reduce time spent between production runs.
2. **Enhance Performance:** ○ Identify and eliminate production bottlenecks that slow down cycle times. ○ Optimize machine settings and ensure that equipment operates at its ideal speed.
3. **Increase Quality:** ○ Implement better quality control processes to reduce defects during production. ○ Provide additional training for operators to ensure correct procedures are followed.
4. **Continuous Monitoring:** ○ Use real-time monitoring tools to track OEE and react quickly to any issues in availability, performance, or quality.
10

