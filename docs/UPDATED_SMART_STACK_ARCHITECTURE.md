# CampusTracker — Event-Driven Smart Stack Architecture

**Document Version**: `3.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Module**: Event-Driven Smart Stack Priority Engine  

---

## 1. Executive Summary & Event-Driven Redesign

The **Smart Stack Engine** is re-architected to become **100% Event-Driven**.

Instead of executing direct database polling queries on Supabase Postgres every time a user opens their dashboard, the Smart Stack engine subscribes to domain events emitted by the **Academic Event Bus** (`AttendanceUpdated`, `ResultsPublished`, `MarksUpdated`, `TimetableChanged`). When an event arrives, the engine evaluates priority rules and updates the student's active card stack state in real time.

---

## 2. Event-Driven Priority Evaluation Rules

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              EVENT-DRIVEN SMART STACK ENGINE                           │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ACADEMIC EVENT BUS STREAM                                                          │ │
│ │ [AttendanceUpdated]  [ResultsPublished]  [MarksUpdated]  [TimetableChanged]        │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Domain Event Broadcast                       │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SMART STACK EVENT EVALUATOR                                                        │ │
│ │ Evaluate Priority Matrix ──► Update Local Context Card ──► Trigger UI Transition   │ │
│ └────────────────────────────────────────┬───────────────────────────────────────────┘ │
│                                          │                                             │
│         ┌────────────────────────────────┼────────────────────────────────┐            │
│         │                                │                                │            │
│         ▼                                ▼                                ▼            │
│  [MODE 1: Critical Alert]        [MODE 4: Marks Published]        [MODE 3: Next Class] │
│  Attendance < 75%                Mid-sem score update             Room countdown       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Event-to-Card Mapping Matrix

| Domain Event Name | Evaluated Condition | Priority Rank | Generated Smart Stack Card UI |
| :--- | :--- | :--- | :--- |
| `AttendanceUpdated` | Subject attendance $< 75\%$ | Priority 1 (Highest) | **Red Critical Card**: *"Attendance dropped to 72% in Applied Math. 2 lectures needed."* |
| `TimetableChanged` | Exam in $< 24$ hours | Priority 2 | **Exam Countdown Card**: *"Data Structures Exam at 10 AM in Hall 302. Seating: B-14."* |
| `TimetableChanged` | Lecture in $< 30$ mins | Priority 3 | **Class Location Card**: *"Computer Networks starting in 15 mins (Lab 4)."* |
| `MarksUpdated` | Test score published $< 24$h | Priority 4 | **Score Banner Card**: *"Mid-Sem Unit Test 1 marks published: 24/30 in Database Systems."* |
| `ResultsPublished` | Semester result published | Priority 5 | **SGPA Celebration Card**: *"Semester 5 Result Published: 8.85 SGPA! Zero Backlogs."* |
| `AnnouncementPublished`| High priority notice | Priority 6 | **Notice Card**: *"Official Notice: Mid-term break scheduled for next week."* |
