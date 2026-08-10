# CampusTracker — Updated Sync Engine & Smart Change Detection Specification

**Document Version**: `3.0.0`  
**Status**: APPROVED ENGINE SPECIFICATION  
**Module**: Core Ingestion & Incremental Delta Synchronization  

---

## 1. Executive Summary & Change Detection Engine

The **Updated Sync Engine** is optimized for high performance, incremental delta updates, and intelligent change detection.

Instead of performing expensive full table overwrites every time a connector polls a spreadsheet or ERP API, the Sync Engine computes record-level content hashes (SHA-256 / MD5). It identifies exactly which rows were **added**, **modified**, or **unchanged**, executing database writes strictly for modified entities.

---

## 2. Smart Change Detection Algorithm (Delta Sync)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SMART CHANGE DETECTION PIPELINE                           │
│                                                                                        │
│  Fetched Source Row ──► Canonical JSON String ──► Hash Generator (SHA-256)              │
│                                                         │                              │
│                                                         ▼                              │
│                                         ┌───────────────────────────────┐              │
│                                         │ Compare against `record_hash` │              │
│                                         │ in `sync_history` Cache       │              │
│                                         └───────────────┬───────────────┘              │
│                                                         │                              │
│                   ┌─────────────────────────────────────┼───────────────────────────┐  │
│                   │                                     │                           │  │
│                   ▼                                     ▼                           ▼  │
│           [Hash Unmatched]                      [Hash Unmatched]             [Hash Match]│
│         (Existing Primary Key)                (New Primary Key)                  │     │
│                   │                                     │                        │     │
│                   ▼                                     ▼                        ▼     │
│           Flag for UPDATE                       Flag for INSERT             IGNORE ROW │
│        (Increment Updated Count)            (Increment Inserted Count)     (Zero DB Write)│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Hash Formula:
$$\text{Record Hash} = \text{SHA256}(\text{roll\_number} \parallel \text{subject\_code} \parallel \text{status} \parallel \text{class\_date})$$

---

## 3. Connector Health & Auto-Recovery Monitor

The Sync Engine continuously tracks health indicators for every active connector:

| Health State | Trigger Condition | Automated System Action |
| :--- | :--- | :--- |
| `CONNECTED` | Connector sync completed successfully. | Updates `last_successful_sync`, resets error counters. |
| `DISCONNECTED` | Connector disabled by Admin. | Pauses background polling worker. |
| `AUTH_FAILED` | HTTP 401 / Invalid Service Account key. | Flags admin notification, sets status `auth_failed`. |
| `SHEET_NOT_FOUND` | HTTP 404 / Invalid Sheet URL. | Pauses worker, logs `sheet_not_found` error. |
| `RATE_LIMITED` | HTTP 429 / Google Sheets API quota hit. | Triggers exponential backoff delay ($2^n \times 5\text{s}$). |
| `NETWORK_ERROR` | DNS lookup failure / Connection timeout. | Schedules retry job in `retry_queue`. |

---

## 4. Auto-Reconnection & Server Restart Safety

- **State Persistence**: All connector states, last sync hashes, and polling schedules are stored in Postgres (`connector_configuration` and `sync_history`).
- **Server Restart Recovery**: On background worker restart, the system queries `connector_configuration` where `is_active = true`, re-instantiates connector plugins, runs `healthCheck()`, and resumes background polling seamlessly.
