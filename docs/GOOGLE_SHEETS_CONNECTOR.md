# CampusTracker — Google Sheets Production Connector Specification (MVP)

**Document Version**: `2.0.0`  
**Status**: APPROVED CONNECTOR SPECIFICATION  
**Target Module**: Production Connector Plugin (MVP)  

---

## 1. Executive Summary

The **Google Sheets Connector** is the first production connector implementation for CampusTracker. 

Instead of hardcoding sheet URLs or column names in code, the connector is completely dynamic and configured via the Admin Portal UI. College administrators can update sheet links, tab names, authentication credentials, polling frequencies, and column mappings in real time without requiring code modifications or server redeployments.

---

## 2. Dynamic Connector Configuration Parameters

Stored in `connector_configuration` table under `config` (JSONB):

| Parameter Name | Data Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `sheetUrl` | `string` | — | Public view-only share link or Google Workspace sheet URL. |
| `spreadsheetId` | `string` | — | Extracted 44-character Google Sheet unique ID. |
| `worksheetName` | `string` | `'Sheet1'` | Specific worksheet/tab name containing academic data. |
| `gid` | `string` | `'0'` | Tab identifier parameter. |
| `headerRowIndex` | `number` | `1` | Row number containing column titles (1-indexed). |
| `dataStartRowIndex`| `number` | `2` | Row number where data records begin. |
| `pollingInterval` | `number` | `3600` | Sync frequency in seconds (e.g. 3600s = 1 hour). |
| `authMethod` | `enum` | `'public_csv'` | `'public_csv'` (View-Only) or `'service_account'` (Private Sheets). |
| `serviceAccountKey`| `string` | `null` | Encrypted Service Account JSON key for private sheets. |
| `conflictPolicy` | `enum` | `'source_wins'` | Conflict resolution rule (`'source_wins'`, `'latest_timestamp'`). |

---

## 3. Dynamic Column Mapping Engine

Every college structures its spreadsheets differently. The Google Sheets Connector maps arbitrary spreadsheet headers to canonical CampusTracker fields via `field_mappings` JSONB array:

```json
[
  { "sourceColumn": "Enrollment No", "targetField": "student_id", "isRequired": true },
  { "sourceColumn": "Roll Number", "targetField": "roll_number", "isRequired": true },
  { "sourceColumn": "Student Name", "targetField": "full_name", "isRequired": true },
  { "sourceColumn": "DBMS Attendance", "targetField": "attendance_dbms", "isRequired": false },
  { "sourceColumn": "Java Attendance", "targetField": "attendance_java", "isRequired": false },
  { "sourceColumn": "OS Attendance", "targetField": "attendance_os", "isRequired": false }
]
```

---

## 4. Lifecycle Execution Pipeline

```typescript
export class GoogleSheetsConnector extends BaseConnector {
  readonly connectorType = 'google_sheets';

  async connect(config: ConnectorConfig): Promise<boolean> {
    // Validates sheet URL, extracts spreadsheetId and gid
  }

  async authenticate(config: ConnectorConfig): Promise<boolean> {
    // Validates public CSV access or initializes Google Auth Service Account client
  }

  async healthCheck(config: ConnectorConfig): Promise<HealthCheckResult> {
    // Tests HTTP HEAD request to verify sheet availability and permissions
  }

  async fetchData(config: ConnectorConfig): Promise<RawSyncRecord[]> {
    // Streams CSV text or API rows, parses header offset, returns indexed raw records
  }

  async validate(records: RawSyncRecord[], config: ConnectorConfig): Promise<ValidationResult> {
    // Applies column mappings and validates records against Zod schemas
  }

  async normalize(validRecords: ParsedSyncRecord[], config: ConnectorConfig): Promise<NormalizedPayload> {
    // Transforms mapped raw records into standardized entity structures
  }

  async compareChanges(newPayload: NormalizedPayload, lastStateHash: string): Promise<DeltaPayload> {
    // Computes MD5/SHA-256 row hashes to extract modified and new rows only
  }

  async sync(deltaPayload: DeltaPayload, config: ConnectorConfig): Promise<SyncMetrics> {
    // Executes atomic batch upsert to Supabase Postgres
  }

  async disconnect(): Promise<void> {
    // Cleans up memory buffers and HTTP connection sockets
  }
}
```
