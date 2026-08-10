# CampusTracker — Updated Connector Framework V2 Specification

**Document Version**: `4.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Platform**: Dataset-Agnostic Multi-Source Academic Operating System  

---

## 1. Executive Summary & V2 Architecture Enhancements

The **Connector Framework V2** expands the architecture from a single-dataset connector model into a **Dataset-Agnostic, Multi-Source Synchronization System**.

A single institution can run multiple live connectors concurrently across different data sources and academic datasets (e.g. Attendance from Google Sheets, Timetable from ERP, Marks from Cloud Excel, Results from SQL DB) without schema conflicts or pipeline coupling.

---

## 2. Dynamic Config & Polling Interval Matrix

Connector polling schedules are configured per connector instance:

| Schedule Mode | Interval Setting | Typical Use Case |
| :--- | :--- | :--- |
| `Manual` | `0` (On-demand trigger) | Admin-triggered manual sync / Emergency import fallback. |
| `5 Minutes` | `300` | Real-time classroom room change or announcement connector. |
| `15 Minutes` | `900` | High-frequency daily attendance sync. |
| `30 Minutes` | `1800` | Standard attendance & timetable sync. |
| `1 Hour` | `3600` | Standard internal marks & resources sync. |
| `Daily` | `86400` | End-of-day exam schedule or semester result sync. |
| `Custom Cron` | Standard 5-field cron | Scheduled off-peak night sync (e.g. `0 2 * * *`). |

---

## 3. V2 Connector Lifecycle & Execution Pipeline

```typescript
export interface IAcademicConnectorV2 {
  readonly connectorType: string;

  connect(config: Record<string, any>): Promise<boolean>;
  authenticate(config: Record<string, any>): Promise<boolean>;
  healthCheck(config: Record<string, any>): Promise<HealthCheckResult>;
  fetchRawData(config: Record<string, any>): Promise<RawSyncRecord[]>;
  disconnect(): Promise<void>;
}
```

The Connector fetches raw records and hands them to the target **Dataset Adapter** (`IDatasetAdapter`) for validation, normalization, SHA-256 delta comparison, atomic upserting, and **Academic Event Bus** event broadcasting.
