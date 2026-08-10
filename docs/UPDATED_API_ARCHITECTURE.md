# CampusTracker — Updated API Architecture & Connector Endpoints

**Document Version**: `3.0.0`  
**Status**: APPROVED API SPECIFICATION  
**Subsystem**: REST / Next.js Route Handlers (`src/app/api/connectors`)  

---

## 1. Executive Summary

The CampusTracker API architecture is expanded to expose full lifecycle management for the **Academic Connector Framework**, real-time **Connector Health Monitoring**, dynamic **Column Mapping Configuration**, and **Emergency Import Fallbacks**.

Credentials (such as Service Account private keys or ERP API tokens) remain strictly server-side. Students communicate exclusively with normalized Supabase tables, never interacting directly with connector endpoints.

---

## 2. Connector API Directory

### 2.1 Connector Management Domain (`/api/connectors`)

| HTTP Method | Route Endpoint | Target Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/connectors` | Admin | Fetch all configured academic connectors for institution. |
| `POST` | `/api/connectors` | Admin | Create a new connector (Google Sheets, Excel Cloud, ERP). |
| `GET` | `/api/connectors/[id]` | Admin | Fetch connector details, config, and column mappings. |
| `PUT` | `/api/connectors/[id]` | Admin | Update connector configuration or column mappings. |
| `DELETE` | `/api/connectors/[id]` | Admin | Deactivate and remove a connector instance. |
| `POST` | `/api/connectors/[id]/test` | Admin | Execute `healthCheck()` and test source connection. |
| `POST` | `/api/connectors/[id]/sync` | Admin | Trigger manual immediate synchronization run. |

### 2.2 Connector Health & Audit Domain (`/api/connectors/health`)

| HTTP Method | Route Endpoint | Target Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/connectors/health` | Admin | Fetch real-time health status overview for all college connectors. |
| `GET` | `/api/connectors/[id]/logs` | Admin | Fetch historical sync job logs, metrics, and error stack traces. |
| `GET` | `/api/connectors/[id]/quarantine`| Admin | Fetch quarantined rows requiring visual manual resolution. |

### 2.3 Emergency Fallback Domain (`/api/emergency-import`)

| HTTP Method | Route Endpoint | Target Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/emergency-import/file` | Admin | Execute Emergency Manual File Import when live connector is offline. |

---

## 3. Zod Request Schemas & Security Validation

```typescript
import { z } from 'zod';

export const SaveConnectorConfigSchema = z.object({
  institutionId: z.string().uuid(),
  name: z.string().min(1, 'Connector name required'),
  connectorType: z.enum(['google_sheets', 'excel_gdrive', 'excel_onedrive', 'sharepoint', 'csv', 'erp_api', 'sql_db']),
  config: z.object({
    sheetUrl: z.string().url().optional(),
    spreadsheetId: z.string().optional(),
    worksheetName: z.string().default('Sheet1'),
    gid: z.string().default('0'),
    headerRowIndex: z.number().default(1),
    dataStartRowIndex: z.number().default(2),
    pollingInterval: z.number().min(60).default(3600),
    authMethod: z.enum(['public_csv', 'service_account', 'oauth2']).default('public_csv'),
    serviceAccountKey: z.string().optional(),
  }),
  fieldMappings: z.array(
    z.object({
      sourceColumn: z.string().min(1),
      targetField: z.string().min(1),
      isRequired: z.boolean().default(false),
    })
  ),
  syncFrequency: z.enum(['manual', 'hourly', 'daily', 'weekly']).default('hourly'),
});
```
