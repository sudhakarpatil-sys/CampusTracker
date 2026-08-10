# CampusTracker — Academic Event Bus Architecture

**Document Version**: `1.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Component**: Decoupled Event-Driven Messaging Core  

---

## 1. Executive Summary & Event-Driven Paradigm Shift

The **Academic Event Bus** decouples CampusTracker's data ingestion connectors from target consumption surfaces (Widgets, Smart Stack, Push Notifications, Web Dashboard Realtime, and AI Analytics).

Instead of requiring Smart Stack, Widgets, or AI models to execute direct polling queries against Supabase Postgres tables, every successful synchronization job or academic modification publishes a strongly typed **Domain Event** to the Academic Event Bus. Subscribers consume these event payloads to update local caches, compute smart stack priorities, render widgets, and trigger push notifications asynchronously.

---

## 2. Event Bus Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ACADEMIC EVENT BUS PIPELINE                            │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. EVENT PRODUCERS (Sync Orchestrator / Admin Actions / Faculty Actions)           │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │ Domain Event Payload                         │
│                                         ▼                                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 2. ACADEMIC EVENT BUS ENGINE                                                       │ │
│ │    Type Validation ──► In-Memory Emitter ──► Supabase Realtime Broadcast           │ │
│ └───────────────────────────────────────┬────────────────────────────────────────────┘ │
│                                         │                                              │
│         ┌───────────────────────────────┼───────────────────────────────┐              │
│         │                               │                               │              │
│         ▼                               ▼                               ▼              │
│ ┌──────────────┐                ┌──────────────┐                ┌──────────────┐       │
│ │ Smart Stack  │                │ Native OS    │                │ AI Analytics │       │
│ │ State Engine │                │ Widgets      │                │ Engine       │       │
│ └──────────────┘                └──────────────┘                └──────────────┘       │
│         │                               │                               │              │
│         ▼                               ▼                               ▼              │
│ ┌──────────────┐                ┌──────────────┐                ┌──────────────┐       │
│ │ Realtime Web │                │ Push Notifications            │ Study & Safe │       │
│ │ Dashboard    │                │ (Expo FCM/APNS)               │ Leave Planner│       │
│ └──────────────┘                └──────────────┘                └──────────────┘       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Domain Event Taxonomy

The Event Bus supports 13 core domain events across academic boundaries:

```typescript
export type AcademicEventType =
  | 'AttendanceUpdated'
  | 'ResultsPublished'
  | 'MarksUpdated'
  | 'TimetableChanged'
  | 'AssignmentCreated'
  | 'NotesUploaded'
  | 'AnnouncementPublished'
  | 'StudentAdded'
  | 'StudentGraduated'
  | 'FacultyAssigned'
  | 'DepartmentChanged'
  | 'AcademicCalendarUpdated'
  | 'SyncJobCompleted';

export interface AcademicEventEnvelope<T = any> {
  eventId: string;
  eventType: AcademicEventType;
  institutionId: string;
  timestamp: string;
  triggeredBy: string;
  payload: T;
}
```

### Event Payload Definitions:

1. **`AttendanceUpdated`**: Emitted when official attendance records are updated.
   - Payload: `{ studentMasterId: string; subjectId: string; newPercentage: number; totalClasses: number; attendedClasses: number }`
2. **`ResultsPublished`**: Emitted when semester SGPA/CGPA or final grades are published.
   - Payload: `{ studentMasterId: string; semester: number; sgpa: number; cgpa: number; resultStatus: 'PASS' | 'FAIL' | 'ATKT' }`
3. **`MarksUpdated`**: Emitted when internal assessment test scores are ingested.
   - Payload: `{ studentMasterId: string; subjectId: string; testName: string; maxMarks: number; marksObtained: number }`
4. **`TimetableChanged`**: Emitted when class slots, room numbers, or substitute instructors change.
   - Payload: `{ classId: string; subjectId: string; dayOfWeek: number; startTime: string; classroom: string }`
5. **`AnnouncementPublished`**: Emitted when faculty or department posts official notices.
   - Payload: `{ announcementId: string; departmentId?: string; title: string; priority: 'low' | 'medium' | 'high' }`

---

## 4. Multi-Tenant Event Isolation & Delivery Guarantees

- **Tenant Scoping**: All event envelopes carry `institutionId`. Subscribers filter event streams to process only events matching their authenticated tenant scope.
- **Supabase Realtime Channel Integration**: Published events are dispatched to Supabase Realtime broadcast channels (`academic_events:{institution_id}`) enabling zero-latency UI updates on Web and Mobile clients.
- **At-Least-Once Delivery**: Critical events (e.g. `ResultsPublished`, `AttendanceUpdated`) are persisted to `event_store` table before broadcast to guarantee recovery after network disconnects.
