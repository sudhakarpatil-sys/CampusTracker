# CampusTracker — AI Analytics Engine Architecture

**Document Version**: `1.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Subsystem**: Predictive Analytics & Personalized Academic Insights  

---

## 1. Executive Summary & AI Data Pipeline

The **AI Analytics Engine** provides intelligent, predictive guidance to students and administrative insights to institutions.

The AI Layer consumes **strictly normalized academic entities** and event streams emitted by the **Academic Event Bus**. It never parses raw spreadsheets or unvalidated payloads directly.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              AI ANALYTICS ENGINE PIPELINE                              │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. NORMALIZED DATA LAYER & EVENT BUS                                               │ │
│ │    Normalized Postgres Tables + Domain Events (AttendanceUpdated, MarksUpdated)    │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Clean Data Stream                            │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 2. AI FEATURE EXTRACTION & INSIGHT CALCULATORS                                     │ │
│ │    • Safe Leave Engine    • Weak Subject Detector   • SGPA / CGPA Target Predictor │ │
│ │    • Exam Readiness Model • Attendance Forecaster   • Revision Schedule Generator│ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Extracted Insights & Predictions             │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 3. PERSONALIZED ACADEMIC COMPANION SURFACES                                        │ │
│ │    [Smart Stack Priority Cards] ──► [Mobile App Insights] ──► [Web AI Assistant]    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core AI Models & Analytics Modules

### 2.1 Safe Leave Engine™
- **Objective**: Calculates exactly how many lectures a student can miss (or must attend) across enrolled subjects to maintain target threshold (e.g. 75%).
- **Mathematical Model**:
  $$\text{Safe Leaves} = \left\lfloor \frac{\text{Attended} - (\text{Target} \times \text{Total})}{1 - \text{Target}} \right\rfloor$$
- **Event Trigger**: Listens for `AttendanceUpdated` domain events.

### 2.2 Weak Subject Detection & Alert System
- **Objective**: Identifies subjects where a student's internal assessment marks or attendance fall below class standard deviations or target thresholds.
- **Alert Trigger**: Generates high-priority Smart Stack card (`MODE_1_CRITICAL_ALERT`) and dispatches notification.

### 2.3 SGPA / CGPA Target Predictor
- **Objective**: Interactive target calculator projecting required marks in upcoming internal tests and end-semester exams to reach desired cumulative grade point averages.
- **Model Inputs**: Historical semester results, current course credits, internal test weightages.

### 2.4 Exam Readiness Score & Study Revision Planner
- **Objective**: Computes an exam readiness score ($0 - 100\%$) based on syllabus coverage, attendance %, internal test scores, and days remaining until exam date.
- **Output**: Generates a personalized daily study schedule prioritized by weakest subjects.

---

## 3. Privacy & Model Isolation

- **Zero PII Exposure**: AI inference models consume anonymized student IDs and normalized metrics. Student names, phone numbers, and emails are stripped prior to AI context building.
- **Multi-Tenant Isolation**: Analytical metrics are computed strictly within `institution_id` boundaries.
