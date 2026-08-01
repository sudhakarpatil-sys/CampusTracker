# CampusTracker Mobile — API & Data Access Architecture

**Document Identifier**: `DOC-MOB-005`  
**Phase**: 4B — Architectural Blueprint  
**Status**: APPROVED  
**Author**: Senior Backend Architect & Staff Software Engineer  

---

## 1. API Architecture Overview

The mobile application communicates with the existing production Supabase backend (`PostgREST API`, `Supabase Storage`, and `Supabase Edge Functions`). All API data access logic is encapsulated inside `packages/api` using the **Repository Pattern**. This guarantees that `apps/mobile` never constructs raw SQL queries or unvalidated fetch calls directly inside React components.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│                 React Native Screens & Feature Hooks                   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TANSTACK QUERY V5 LAYER                         │
│           Query Keys, Cache Invalidations, Optimistic Updates          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       REPOSITORY LAYER (packages/api)                   │
│  TimetableRepository │ AttendanceRepository │ QRRepository             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│     ONLINE TRANSPORT LAYER      │ │    OFFLINE MUTATION QUEUE       │
│  Supabase Client / Axios SDK    │ │  MMKV Persistent Action Storage │
└────────────────┬────────────────┘ └────────────────┬────────────────┘
                 │                                   │
                 ▼                                   ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│    SUPABASE BACKEND CLOUD       │ │     LOCAL OFFLINE CACHE         │
│  PostgREST / Edge Functions     │ │  Expo SQLite / MMKV Persistence │
└─────────────────────────────────┘ └─────────────────────────────────┘
```

---

## 2. Supabase Mobile Client Configuration

The Supabase client in `packages/api/src/client.ts` is configured specifically for React Native:

```typescript
// Shared Supabase Initialization Specification
import { createClient } from '@supabase/supabase-js';
import { MMKVStorageAdapter } from './storage-adapter';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: MMKVStorageAdapter, // High-speed MMKV storage adapter for session persistence
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disabled for React Native native environment
    },
    global: {
      headers: {
        'x-client-info': 'campustracker-mobile-v1.0.0',
      },
    },
  }
);
```

---

## 3. Repository Pattern Design

All database interactions are defined through domain repository classes in `packages/api/src/repositories/`.

### 3.1 Base Repository Interface (`IBaseRepository<T>`)
Defines standardized CRUD signatures for all entities:
- `findById(id: string): Promise<T | null>`
- `findAll(userId: string): Promise<T[]>`
- `create(item: Omit<T, 'id' | 'createdAt'>): Promise<T>`
- `update(id: string, item: Partial<T>): Promise<T>`
- `delete(id: string): Promise<void>`

### 3.2 Specific Repository Implementations

| Repository Class | Primary Responsibilities & Methods |
| :--- | :--- |
| **`TimetableRepository`** | `getWeeklySchedule(userId)`: Joins `timetable_slots` with `subjects`. `importScheduleFromAI(payload)`: Posts file payload to Edge Function. |
| **`AttendanceRepository`** | `markAttendance(slotId, date, status)`: Upserts `attendance_records`. `getSubjectSummary(userId)`: Calculates total present, absent, cancelled stats. |
| **`AssignmentRepository`** | `getUpcoming(userId)`: Queries `assignments` where `status != 'completed'`. `submitAssignment(id, fileUrl)`: Updates submission details. |
| **`NotesRepository`** | `getNotesBySubject(subjectId)`: Queries `notes`. `syncLocalDrafts(drafts)`: Bulk upserts created offline notes. |
| **`QRRepository`** | `createQRSession(classId, geoParams)`: Edge Function trigger for faculty session. `verifyStudentScan(payload, studentGeo)`: Validates TOTP + GPS geofence on server. |

---

## 4. Network Layer Resilience & Offline Mutation Queue

### 4.1 Exponential Backoff & Retry Policy
All network requests are wrapped with a resilient retry strategy:
- **Max Retry Count**: 3 retries.
- **Backoff Interval**: $t_{retry} = 2^n \times 1000\text{ ms} + \text{jitter}$ (1s, 2s, 4s with random jitter).
- **Retry Conditions**: Network dropouts, HTTP 502/503/504 status codes. HTTP 400/401/403/404 are failed immediately without retry.

### 4.2 Offline Mutation Queueing & Dead Letter Queue (DLQ) Strategy
When an API write operation (e.g. marking attendance or creating a note) occurs while the device is offline:

1. **Interception**: The repository catches the offline network failure (`NetInfo.isConnected === false`).
2. **Queueing**: The mutation (target endpoint, payload, action type, client timestamp, idempotency key) is serialized and stored in the MMKV key `offline_mutations_queue`.
3. **Optimistic UI**: The local UI cache (TanStack Query / SQLite) is immediately updated optimistically.
4. **Queue Drainage**: When `NetInfo` broadcasts network restoration:
   - Queue manager reads items sequentially.
   - Submits queued actions to the server with `X-Idempotency-Key` headers.
   - Removes successfully processed items from MMKV queue.
5. **Dead Letter Queue (DLQ)**: If a queued item fails with a permanent 4xx error (e.g., 400 Bad Request or 409 Conflict that cannot be auto-resolved), it is moved to `offline_mutations_dlq` rather than blocking the rest of the queue. The user is notified via UI toast with an option to retry or discard the failed mutation draft.


---

## 5. Error Taxonomy & Standardized Handling

Mobile API errors extend the web platform's standard `ApiError` class:

```typescript
export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Mobile Error Code Mapping

| Error Code | HTTP Status | User-Facing Mobile Behavior |
| :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 | Triggers silent token refresh; if failed, redirects user to login. |
| `FORBIDDEN` | 403 | Displays toast: "You do not have permission to access this resource." |
| `GEOFENCE_OUT_OF_RANGE` | 422 | QR Scan failure dialog: "You must be inside the classroom to mark attendance." |
| `QR_SESSION_EXPIRED` | 410 | QR Scan failure dialog: "This QR code has expired. Ask your teacher to refresh." |
| `RATE_LIMITED` | 429 | Displays toast: "Too many requests. Please wait a moment." |
| `NETWORK_OFFLINE` | 0 | Action added to offline queue; displays non-intrusive offline toast. |
