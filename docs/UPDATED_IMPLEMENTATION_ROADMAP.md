# CampusTracker — Updated Implementation Roadmap & Connector Pipeline

**Document Version**: `3.0.0`  
**Status**: APPROVED MILESTONE ROADMAP  

---

## 1. Roadmap Pipeline & Milestones

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      CONNECTOR FRAMEWORK ROADMAP (16 WEEKS)                            │
│                                                                                        │
│ Phase 4B-0: Academic Connector Framework & Google Sheets MVP ──► 2.5 Weeks             │
│ Phase 4B-1: Smart Delta Sync Engine & Health Monitoring       ──► 2.0 Weeks             │
│ Phase 4C  : Admin Connector Manager UI & Visual Mapper        ──► 2.5 Weeks             │
│ Phase 5   : Excel Cloud Connectors (Google Drive / OneDrive)  ──► 2.5 Weeks             │
│ Phase 6   : SharePoint & CSV Automated Connectors            ──► 2.0 Weeks             │
│ Phase 7   : ERP API & Enterprise SQL Connectors (Oracle/SAP) ──► 2.5 Weeks             │
│ Phase 8   : Custom Connector SDK & University Developer Portal──► 2.0 Weeks             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Milestone Exit Criteria

### Phase 4B-0 (Current Focus): Google Sheets MVP & Connector Lifecycle
- **Deliverables**: `IAcademicConnector` interface, `GoogleSheetsConnector` implementation, Zod schema mapping layer, dynamic connector DB schema (`0014_connector_framework.sql`).
- **Exit Criteria**: Connector successfully connects to sample public or private Google Sheet, fetches rows, validates columns, and executes atomic upserts cleanly.

### Phase 4B-1: Smart Delta Sync & Health Monitoring
- **Deliverables**: SHA-256 record content hash comparison, `sync_history` cache, `retry_queue` exponential backoff, health status state machine.
- **Exit Criteria**: Re-syncing an unchanged Google Sheet results in 0 database updates and execution completes in $< 200\text{ms}$.
