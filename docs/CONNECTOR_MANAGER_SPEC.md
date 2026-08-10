# CampusTracker — Connector Manager Specification & Admin Portal UI

**Document Version**: `2.0.0`  
**Status**: APPROVED UI & WORKFLOW SPECIFICATION  
**Target Surface**: Admin Portal (`/admin/connectors`)  

---

## 1. Executive Summary & Interface Shift

The Admin Portal is updated to remove all legacy "Upload Attendance PDF / Excel" workflows as primary tasks. Instead, administrators navigate to the **Connector Manager** dashboard (`/admin/connectors`).

Here, administrators configure live connectors (Google Sheets MVP), manage polling intervals, perform dynamic visual column mapping, monitor health metrics, and trigger manual syncs or Emergency Imports when needed.

---

## 2. Admin Connector Manager UI Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ADMIN CONNECTOR MANAGER DASHBOARD                         │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ CONNECTOR HEALTH OVERVIEW                                                          │ │
│ │ 🟢 Google Sheets (Main Attendance) ── Status: CONNECTED ── Last Sync: 2 mins ago    │ │
│ │ 🟡 Google Sheets (Internal Marks)  ── Status: RATE_LIMITED ── Retry in 45 seconds  │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ CONNECTOR CONFIGURATION WIZARD                                                     │ │
│ │ [1. Select Connector Type] ──► [2. Source URL & Tab] ──► [3. Visual Column Mapper] │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ DYNAMIC VISUAL COLUMN MAPPER                                                        │ │
│ │ Source Sheet Header               CampusTracker Field            Action             │ │
│ │ "Enrollment No"         ──►       [ student_id       ▼ ]         [ Required ]       │ │
│ │ "Roll Number"           ──►       [ roll_number      ▼ ]         [ Required ]       │ │
│ │ "DBMS Attendance"       ──►       [ attendance_dbms  ▼ ]         [ Optional ]       │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ EMERGENCY OVERRIDE & FALLBACK                                                      │ │
│ │ 🚨 [Trigger Emergency File Import] (For offline recovery / temporary downtime)     │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dynamic Visual Column Mapping Workflow

1. **Step 1: Fetch Headers**: Administrator enters Google Sheet URL and tab name. Clicking *"Fetch Headers"* triggers `SheetConnector.fetchRawData()` with `limit: 1`.
2. **Step 2: Interactive Select Grid**: The UI displays a two-column dropdown mapping grid matching source spreadsheet headers to target CampusTracker schema attributes (`student_id`, `roll_number`, `full_name`, `attendance_subject_code`, `internal_marks_test`).
3. **Step 3: Save Mappings**: System validates that required key fields (`roll_number`, `full_name`) are assigned, serializes mapping to JSONB, and saves to `connector_configuration`.
