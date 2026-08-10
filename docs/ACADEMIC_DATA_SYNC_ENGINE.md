# CampusTracker — Academic Data Sync Engine Architecture

**Document Version**: `1.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Module**: Core Ingestion System (Phase 4B-0)  

---

## 1. System Overview

The **Academic Data Sync Engine** is the core heartbeat of the CampusTracker platform. It decouples CampusTracker from any single administrative tool or proprietary ERP, establishing a plug-and-play ingestion pipeline that consumes raw academic data from colleges, validates and normalizes it, and publishes it into Supabase for consumption by the Website, Mobile App, Smart Stack, Native Widgets, and AI Analytics Engine.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 OFFICIAL DATA SOURCES                                  │
│  [Google Sheets (V1)]   [Excel Workbooks]   [CSV Files]   [ERP APIs (Banner/SIS)]      │
└───────────────────────────┬────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               ACADEMIC DATA SYNC ENGINE                                │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │ 1. CONNECTOR LAYER                                                             │   │
│   │    SheetConnector │ ExcelConnector │ CSVConnector │ ERPConnector           │   │
│   └───────────────────────┬────────────────────────────────────────────────────────┘   │
│                           │ Raw Records                                                │
│                           ▼                                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │ 2. VALIDATION LAYER                                                            │   │
│   │    Zod Schema Validation │ Data Type Checks │ Roll Number Verification         │   │
│   └───────────────────────┬────────────────────────────────────────────────────────┘   │
│                           │ Validated Data (Quarantine Failed Rows)                    │
│                           ▼                                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │ 3. NORMALIZATION LAYER                                                         │   │
│   │    Column Mapping │ Entity Disambiguation │ Canonical Format Translation       │   │
│   └───────────────────────┬────────────────────────────────────────────────────────┘   │
│                           │ Standardized Entities                                      │
│                           ▼                                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │ 4. SUPABASE TRANSACTION & UPSERT LAYER                                         │   │
│   │    Atomic Batch Upserts │ Sync Log Generation │ Audit Trail Recording           │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TARGET CONSUMPTION SURFACES                               │
│     [Supabase Postgres DB] ──► [Web App] ──► [Mobile App] ──► [Widgets & Smart Stack]   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Connector Layer Architecture

The connector layer defines a unified abstract class `BaseConnector` that all data source plugins must implement.

```typescript
export interface SyncOptions {
  connectorId: string;
  institutionId: string;
  triggeredBy: string; // 'scheduled_cron' | 'admin_manual' | 'webhook'
  forceFullResync?: boolean;
}

export interface RawSyncRecord {
  sourceRowNumber: number;
  data: Record<string, any>;
}

export abstract class BaseConnector {
  abstract readonly connectorType: 'google_sheets' | 'excel' | 'csv' | 'erp_api';

  /** Fetch raw records from source */
  abstract fetchRawData(config: Record<string, any>): Promise<RawSyncRecord[]>;

  /** Test credentials or access URL */
  abstract validateConnection(config: Record<string, any>): Promise<{ success: boolean; error?: string }>;
}
```

### Connector Implementations:

1. **`SheetConnector` (Google Sheets View-Only — Version 1)**:
   - Uses Google Sheets v4 API or public CSV export endpoints (`https://docs.google.com/spreadsheets/d/{id}/export?format=csv&gid={gid}`).
   - Requires no OAuth permissions for public view-only sheets, or Service Account JWT for private institutional sheets.
2. **`ExcelConnector` (Excel Workbook Parser)**:
   - Built on `exceljs` / `xlsx` streaming parser.
   - Accepts `.xlsx` or `.xls` file buffers uploaded via Admin Portal or S3/Supabase storage bucket (`official-imports`).
3. **`CSVConnector` (Delimited Files)**:
   - Streaming CSV parser supporting custom delimiters (comma, tab, pipe).
4. **`ERPConnector` (Pluggable ERP/SIS Adapter)**:
   - REST / GraphQL API adapter with support for OAuth2 Client Credentials grant, custom API key headers, and paginated payload ingestion.

---

## 3. Ingestion Pipeline Breakdown

### Stage 1: Extraction & Ingestion Triggering
- **Triggers**: Scheduled Cron (Supabase `pg_cron` or Edge Function timer), Admin manual trigger via Admin Portal UI, or Webhook callback from ERP.
- **Job Creation**: Creates a record in `sync_jobs` with status `pending`.

### Stage 2: Schema Validation Layer
- Evaluates raw record objects against Zod schemas matching target entity schemas (`StudentSchema`, `AttendanceRecordSchema`, `InternalMarksSchema`, `SemesterResultSchema`).
- **Validation Checks**:
  - Roll Number format validity (e.g. alphanumeric match).
  - Attendance date & status check (`present`, `absent`, `excused`).
  - Score bounds check ($0 \le \text{marks\_obtained} \le \text{max\_marks}$).
  - Required field presence.
- **Quarantine Handling**: Rows failing validation are NOT discarded. They are formatted as JSON and written to `sync_quarantine_rows` with detailed failure diagnostics for admin review.

### Stage 3: Normalization Layer
- **Column Mapping**: Uses `connector_field_mappings` configuration table to map institutional header variations (`"Roll No"`, `"Student_ID"`, `"Registration_No"`) to canonical schema keys (`roll_number`).
- **Entity Disambiguation**: Resolves institutional codes to internal UUIDs (e.g. mapping department code `"CS"` to `department_id`).
- **Canonical Type Casting**: Standardizes dates to ISO-8601 (`YYYY-MM-DD`), timestamps to UTC, and numeric values to standard decimals.

### Stage 4: Atomic Database Upsert Layer
- Executes relational upserts inside Postgres transactions to prevent partial updates.
- Uses `ON CONFLICT (institution_id, roll_number, subject_id, class_date) DO UPDATE` for attendance records.
- Updates `updated_at` timestamps and flags sync lineage (`sync_job_id`).

### Stage 5: Logging & Metric Recording
- Completes `sync_jobs` entry with metrics: `processed_rows`, `inserted_rows`, `updated_rows`, `quarantined_rows`, `execution_time_ms`.
- Emits real-time notification to Admin Portal dashboard if quarantine threshold exceeded.

---

## 4. Quarantined Data & Error Recovery Flow

```
                               Raw Sync Row
                                    │
                         ┌──────────┴──────────┐
                         │ Validates Cleanly?  │
                         └────┬───────────┬────┘
                              │           │
                     YES ─────┘           └───── NO
                      │                          │
                      ▼                          ▼
           Execute Supabase Upsert       Insert into `sync_quarantine_rows`
                      │                          │
                      ▼                          ▼
              Update Live Record         Admin Alert & Review UI
                                                 │
                                                 ▼
                                        Admin Corrects Mapping
                                                 │
                                                 ▼
                                        Re-run Quarantined Job
```

---

## 5. Security & Isolation

- **Encryption**: ERP API secret keys, Google Service Account keys, and connection strings are stored encrypted in Postgres using `pgcrypto` (`pgp_sym_encrypt`).
- **Multi-Tenant Isolation**: Every sync job and record is tagged with `institution_id`. Row Level Security (RLS) policies prevent cross-college data leaks.
- **Execution Limits**: Memory streaming limits (max 50,000 rows per batch) to ensure smooth execution inside serverless Edge Functions or background API workers.
