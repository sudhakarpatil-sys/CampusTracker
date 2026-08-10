import { ConnectorType, RawSyncRecord, ParsedSyncRecord } from '@/types/sync';

export interface HealthCheckResult {
  isHealthy: boolean;
  status: 'CONNECTED' | 'DISCONNECTED' | 'AUTH_FAILED' | 'SHEET_NOT_FOUND' | 'PERMISSION_DENIED' | 'RATE_LIMITED' | 'NETWORK_ERROR';
  latencyMs?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface DeltaPayload {
  insertedRecords: any[];
  updatedRecords: any[];
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
  readonly connectorType: ConnectorType;

  /** Stage 1: Connect */
  connect(config: Record<string, any>): Promise<boolean>;

  /** Stage 2: Authenticate */
  authenticate(config: Record<string, any>): Promise<boolean>;

  /** Stage 3: Health Check */
  healthCheck(config: Record<string, any>): Promise<HealthCheckResult>;

  /** Stage 4: Fetch Raw Data */
  fetchData(config: Record<string, any>): Promise<RawSyncRecord[]>;

  /** Stage 5: Validate Records */
  validate(records: RawSyncRecord[], config: Record<string, any>): Promise<{ validRecords: ParsedSyncRecord[]; invalidRecords: any[] }>;

  /** Stage 6: Normalize Payload */
  normalize(validRecords: ParsedSyncRecord[], config: Record<string, any>): Promise<any[]>;

  /** Stage 7: Compare Changes (Smart Delta Detection) */
  compareChanges(newPayload: any[], connectorId: string): Promise<DeltaPayload>;

  /** Stage 8: Execute Atomic Batch Sync */
  sync(deltaPayload: DeltaPayload, connectorId: string): Promise<SyncMetrics>;

  /** Stage 9: Disconnect & Cleanup */
  disconnect(): Promise<void>;
}

export abstract class BaseConnector implements IAcademicConnector {
  abstract readonly connectorType: ConnectorType;

  async connect(config: Record<string, any>): Promise<boolean> {
    const res = await this.healthCheck(config);
    return res.isHealthy;
  }

  async authenticate(config: Record<string, any>): Promise<boolean> {
    return true;
  }

  abstract healthCheck(config: Record<string, any>): Promise<HealthCheckResult>;
  abstract fetchData(config: Record<string, any>): Promise<RawSyncRecord[]>;

  async validate(records: RawSyncRecord[], config: Record<string, any>): Promise<{ validRecords: ParsedSyncRecord[]; invalidRecords: any[] }> {
    return { validRecords: records as any, invalidRecords: [] };
  }

  async normalize(validRecords: ParsedSyncRecord[], config: Record<string, any>): Promise<any[]> {
    return validRecords;
  }

  async compareChanges(newPayload: any[], connectorId: string): Promise<DeltaPayload> {
    return {
      insertedRecords: newPayload,
      updatedRecords: [],
      unchangedCount: 0,
    };
  }

  async sync(deltaPayload: DeltaPayload, connectorId: string): Promise<SyncMetrics> {
    return {
      processedCount: deltaPayload.insertedRecords.length + deltaPayload.updatedRecords.length,
      insertedCount: deltaPayload.insertedRecords.length,
      updatedCount: deltaPayload.updatedRecords.length,
      quarantinedCount: 0,
      executionTimeMs: 0,
    };
  }

  async disconnect(): Promise<void> {
    // Default no-op socket cleanup
  }
}
