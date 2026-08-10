# CampusTracker — Academic Connector Framework Master Specification

**Document Version**: `3.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Platform**: Pluggable Academic Data Operating System  

---

## 1. Executive Summary & Architectural Shift

CampusTracker is evolving from an application expecting manual spreadsheet uploads into an **Automated Academic Operating System (AOS)** powered by a pluggable **Academic Connector Framework**.

Instead of requiring administrative staff to upload Excel/CSV files manually every day, CampusTracker connects directly to live administrative data sources. Whenever data changes at the official college source (Google Sheets, Cloud Excel, ERP APIs, SQL Databases), CampusTracker detects the modification, normalizes the payload, and synchronizes the updates automatically. Manual file uploads are renamed to **Emergency Import / Offline Recovery** and serve strictly as temporary fallback options.

---

## 2. Core Architecture Pipeline

The Academic Data Sync Engine does NOT know where data originates. It interacts exclusively with standardized connector plugins implementing `IAcademicConnector`.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ACADEMIC CONNECTOR FRAMEWORK                              │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. OFFICIAL ACADEMIC DATA SOURCES                                                  │ │
│ │    [Google Sheets (MVP)]   [Excel Cloud]   [SharePoint]   [ERP APIs]   [SQL DBs]   │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │                                              │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 2. ACADEMIC CONNECTOR PLUGIN LAYER (IAcademicConnector)                           │ │
│ │    connect() ──► authenticate() ──► healthCheck() ──► fetchData() ──► disconnect() │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Raw Extracted Payload                        │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 3. VALIDATION & DYNAMICS COLUMN MAPPING LAYER                                      │ │
│ │    validate() ──► Visual Column Mapper ──► Schema Enforcement (Zod)                │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Clean Structured Payload                     │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 4. NORMALIZATION & DELTA EVALUATION LAYER                                          │ │
│ │    normalize() ──► compareChanges() (Hash/Checksum Check) ──► Delta Extraction     │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Modified & New Entities Only                 │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 5. ACADEMIC DATA SYNC ENGINE                                                       │ │
│ │    Atomic Batch Upserts ──► Realtime Broadcast ──► Health & Audit Metrics            │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │                                              │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 6. TARGET SURFACES                                                                 │ │
│ │    [Supabase Postgres] ──► [Web App] ──► [Mobile App] ──► [Widgets & Smart Stack]   │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Product Philosophy & Live Synchronization Rules

1. **Zero Manual Overhead**: Administrators and faculty never log in daily to press "Upload Attendance". Connectors run silently in the background according to institutionally configured polling intervals.
2. **Instant Student Access**: Synchronization happens automatically. Students view official records on their mobile app and web dashboard without waiting for manual batch updates.
3. **Pluggable & Extensible**: Adding new connectors (e.g. SAP ERP, Oracle SIS, custom university SQL DBs) requires implementing the `IAcademicConnector` interface without altering the Sync Engine core.
4. **Emergency Fallback Isolation**: Manual file uploads are renamed to **Emergency Import / Offline Recovery**. They operate through a dedicated bypass pipeline that mimics a live connector payload during internet outages or ERP downtime.

---

## 4. Multi-College Tenant Scoping

- Every college configures its own connectors independently in `connector_configuration`.
- Colleges can maintain completely different sheet URLs, polling frequencies, authentication keys, column names, and header offsets without interfering with other tenant configurations.
- All background workers and sync jobs scope operations by `institution_id` with strict database Row Level Security (RLS) enforcement.
