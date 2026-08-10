# CampusTracker — Admin Connector Management Console Specification

**Document Version**: `3.0.0`  
**Status**: APPROVED UI SPECIFICATION  
**Target Console**: Admin Portal (`/admin/connectors`)  

---

## 1. Executive Summary

The Admin Portal is transformed into an enterprise **Connector Management Console**.

College administrators manage multi-source live connectors, configure dataset adapters, map spreadsheet headers to academic attributes, set custom polling intervals, view real-time connector health metrics, inspect quarantine records, and execute Emergency Imports when required.

---

## 2. Console Features & Dashboard Sections

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ADMIN CONNECTOR MANAGEMENT CONSOLE                        │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. CONNECTOR HEALTH OVERVIEW GRID                                                  │ │
│ │ 🟢 Main Attendance (Google Sheets) ── Status: CONNECTED ── Polling: Every 15 mins   │ │
│ │ 🟢 Timetable Sync (ERP API)        ── Status: CONNECTED ── Polling: Every 1 hour    │ │
│ │ 🟡 Internal Marks (Cloud Excel)    ── Status: RETRYING   ── Next Retry: 30 secs     │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 2. DATASET MAPPING & CONNECTOR SETUP WIZARD                                        │ │
│ │ [Select Dataset: Attendance ▼] ──► [Select Source: Google Sheets ▼] ──► [URL & Tab]  │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 3. DYNAMIC VISUAL COLUMN MAPPER                                                        │ │
│ │ Source Column                       Target Schema Field            Status           │ │
│ │ "Enrollment No"         ──►         [ student_id       ▼ ]         [ Required ]     │ │
│ │ "Roll Number"           ──►         [ roll_number      ▼ ]         [ Required ]     │ │
│ │ "DBMS Marks"            ──►         [ marks_dbms       ▼ ]         [ Optional ]     │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 4. SYNC HISTORY & QUARANTINE RESOLVER                                              │ │
│ │ ⚠️ 3 Quarantine Rows Detected (Invalid Roll Numbers) ── [Review & Resolve Rows]    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 5. EMERGENCY IMPORT & OFFLINE RECOVERY                                             │ │
│ │ 🚨 [Execute Emergency File Import] (Used strictly during internet outages/downtime)│ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
