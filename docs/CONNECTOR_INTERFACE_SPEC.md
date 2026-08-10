# CampusTracker — Academic Connector Interface Contract Specification

**Document Version**: `2.0.0`  
**Status**: APPROVED SDK CONTRACT  
**Target Specification**: Standardized TypeScript Interface & SDK Contract  

---

## 1. Interface Lifecycle Definition

Every academic data source connector (Google Sheets, Cloud Excel, SharePoint, ERP APIs, SQL Databases, Custom SDK) must implement the `IAcademicConnector` interface contract.

```typescript
export interface HealthCheckResult {
  isHealthy: boolean;
  status: 'CONNECTED' | 'DISCONNECTED' | 'AUTH_FAILED' | 'SHEET_NOT_FOUND' | 'PERMISSION_DENIED' | 'RATE_LIMITED' | 'NETWORK_ERROR';
  latencyMs?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface DeltaPayload {
  insertedRecords: NormalizedEntity[];
  updatedRecords: NormalizedEntity[];
  unchangedCount: number;
  deletedKeys?: string[];
}

export interface SyncMetrics {
  processedCount: number;
  insertedCount: number;
  updatedCount: number;
  quarantinedCount: number;
  executionTimeMs: number;
}

export interface IAcademicConnector {
  readonly connectorType: string;

  /** Stage 1: Initialize connection socket or validate URL string */
  connect(config: Record<string, any>): Promise<boolean>;

  /** Stage 2: Verify API credentials, OAuth tokens, or Service Account keys */
  authenticate(config: Record<string, any>): Promise<boolean>;

  /** Stage 3: Perform lightweight health check ping to verify source availability */
  healthCheck(config: Record<string, any>): Promise<HealthCheckResult>;

  /** Stage 4: Extract raw dataset rows according to header and data row offset settings */
  fetchData(config: Record<string, any>): Promise<RawSyncRecord[]>;

  /** Stage 5: Apply column mapping and validate record schemas using Zod */
  validate(records: RawSyncRecord[], config: Record<string, any>): Promise<ValidationResult>;

  /** Stage 6: Transform validated raw records into canonical CampusTracker entities */
  normalize(validRecords: ParsedSyncRecord[], config: Record<string, any>): Promise<NormalizedPayload>;

  /** Stage 7: Compare content hashes (SHA-256) against last sync state to filter deltas */
  compareChanges(newPayload: NormalizedPayload, connectorId: string): Promise<DeltaPayload>;

  /** Stage 8: Execute atomic batch upsert transaction into Supabase Postgres */
  sync(deltaPayload: DeltaPayload, connectorId: string): Promise<SyncMetrics>;

  /** Stage 9: Terminate network sockets, clean up memory buffers, and flush logs */
  disconnect(): Promise<void>;
}
```
