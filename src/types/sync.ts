export type ConnectorType = 'google_sheets' | 'excel' | 'csv' | 'erp_api';
export type SyncFrequency = 'manual' | 'hourly' | 'daily' | 'weekly';
export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'partial_warning';

export interface FieldMapping {
  sourceColumn: string;
  targetField: string;
  isRequired?: boolean;
  transform?: 'trim' | 'uppercase' | 'date_iso' | 'number';
}

export interface SyncConnector {
  id: string;
  institutionId: string;
  name: string;
  connectorType: ConnectorType;
  config: Record<string, any>;
  fieldMappings: FieldMapping[];
  syncFrequency: SyncFrequency;
  isActive: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncJob {
  id: string;
  connectorId: string;
  institutionId: string;
  status: SyncStatus;
  triggeredBy: string;
  processedRows: number;
  insertedRows: number;
  updatedRows: number;
  quarantinedRows: number;
  errorLog?: string;
  executionTimeMs?: number;
  startedAt: string;
  completedAt?: string;
}

export interface SyncQuarantineRow {
  id: string;
  syncJobId: string;
  institutionId: string;
  rawData: Record<string, any>;
  failureReason: string;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface RawSyncRecord {
  sourceRowNumber: number;
  data: Record<string, any>;
}

export interface ParsedSyncRecord {
  rollNumber: string;
  studentId?: string;
  subjectCode?: string;
  classDate?: string;
  attendanceStatus?: 'present' | 'absent' | 'excused';
  testName?: string;
  maxMarks?: number;
  marksObtained?: number;
  semester?: number;
  sgpa?: number;
  cgpa?: number;
  [key: string]: any;
}
