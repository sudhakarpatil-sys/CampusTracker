# CampusTracker — Complete Project Impact & File Categorization Report

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  

---

## 1. Executive Impact Overview

Evolving CampusTracker into a **Connector-Based Academic Operating System** preserves existing frontend components, themes, mobile navigation, and security libraries. Changes are concentrated in the data ingestion engine, connector configuration tables, admin management UI, and background health workers.

---

## 2. File Categorization Directory

### 2.1 Backend Libraries & Sync Engine (`src/lib/sync-engine/`)

| File Path | Categorization | Update Action |
| :--- | :--- | :--- |
| `src/lib/sync-engine/base-connector.ts` | **MODIFY** | Upgrade to export `IAcademicConnector` 9-stage lifecycle interface. |
| `src/lib/sync-engine/sheet-connector.ts` | **MODIFY** | Implement `IAcademicConnector` contract for Google Sheets MVP with dynamic mapping support. |
| `src/lib/sync-engine/excel-connector.ts` | **MODIFY** | Adapt to consume generic connector configuration objects. |
| `src/lib/sync-engine/validation-layer.ts` | **SAFE TO KEEP** | Zod schema validation layer is 100% reusable. |
| `src/lib/sync-engine/normalization-layer.ts` | **SAFE TO KEEP** | Normalization transformer layer is 100% reusable. |
| `src/lib/sync-engine/quarantine-manager.ts` | **SAFE TO KEEP** | Quarantined row error logger is 100% reusable. |
| `src/lib/sync-engine/sync-orchestrator.ts` | **MODIFY** | Integrate SHA-256 content hashing for smart delta change detection. |

---

### 2.2 Database Migrations (`supabase/migrations/`)

| Migration File | Categorization | Update Action |
| :--- | :--- | :--- |
| `0001_init.sql` – `0011_feedback.sql` | **SAFE TO KEEP** | Core schema preserved without breaking changes. |
| `0012_academic_platform_sync.sql` | **SAFE TO KEEP** | Multi-tenant institutions, student master, internal marks schema intact. |
| `0013_cleanup_legacy_data.sql` | **SAFE TO KEEP** | Database cleanup migration intact. |
| `0014_connector_framework.sql` | **[NEW]** | Deployment script for `connectors`, `connector_configuration`, `sync_history`, and `retry_queue`. |

---

### 2.3 API Routes (`src/app/api/`)

| Route Endpoint | Categorization | Update Action |
| :--- | :--- | :--- |
| `src/app/api/sync/connectors/route.ts` | **MODIFY** | Expand to support full connector CRUD and dynamic mapping validation. |
| `src/app/api/sync/jobs/trigger/route.ts` | **MODIFY** | Adapt trigger handler to execute connector lifecycle sync. |
| `src/app/api/academic/attendance/route.ts` | **SAFE TO KEEP** | Serves official attendance & safe leave calculations to web & mobile. |
| `src/app/api/academic/marks/route.ts` | **SAFE TO KEEP** | Serves internal marks & SGPA/CGPA history to web & mobile. |
