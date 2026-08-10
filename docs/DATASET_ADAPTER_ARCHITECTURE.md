# CampusTracker — Dataset Adapter Architecture Specification

**Document Version**: `1.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Module**: Dataset-Agnostic Ingestion & Schema Normalization  

---

## 1. Executive Summary & Dataset-Agnostic Design

CampusTracker's ingestion engine is completely decoupled from any single domain such as attendance. Attendance is positioned as only ONE of 18 supported academic datasets.

The **Dataset Adapter Layer** introduces specialized adapter plugins implementing a standardized contract (`IDatasetAdapter`). The Academic Connector Framework extracts raw tabular data from Google Sheets, Excel, ERP APIs, or SQL databases and delegates validation, entity disambiguation, and target schema normalization to the designated Dataset Adapter.

---

## 2. Supported Academic Datasets & Adapters

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               DATASET ADAPTER MATRIX                                   │
│                                                                                        │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 1. Student Master    │  │ 2. Official Attendance│  │ 3. Timetable Slots   │          │
│ │ StudentAdapter       │  │ AttendanceAdapter    │  │ TimetableAdapter     │          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 4. Subjects & Credits│  │ 5. Faculty Directory │  │ 6. Departments       │          │
│ │ SubjectAdapter       │  │ FacultyAdapter       │  │ DepartmentAdapter    │          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 7. Classes/Cohorts   │  │ 8. Academic Calendar │  │ 9. Assignments       │          │
│ │ ClassAdapter         │  │ CalendarAdapter      │  │ AssignmentAdapter    │          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 10. Notes Metadata   │  │ 11. Internal Marks   │  │ 12. Practical Marks  │          │
│ │ NotesAdapter         │  │ InternalMarksAdapter │  │ PracticalMarksAdapter│          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 13. Semester Results │  │ 14. SGPA / CGPA      │  │ 15. Exam Schedule    │          │
│ │ SemesterResultAdapter│  │ GradeAdapter         │  │ ExamScheduleAdapter  │          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│ │ 16. Placements       │  │ 17. Student Profile  │  │ 18. Announcements    │          │
│ │ PlacementAdapter     │  │ ProfileAdapter       │  │ AnnouncementAdapter  │          │
│ └──────────────────────┘  └──────────────────────┘  └──────────────────────┘          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dataset Adapter Contract Specification

```typescript
export interface DatasetAdapterContext {
  institutionId: string;
  connectorId: string;
  fieldMappings: Record<string, string>;
  syncJobId: string;
}

export interface AdapterValidationResult {
  validEntities: any[];
  quarantineRows: Array<{
    sourceRowNumber: number;
    rawData: Record<string, any>;
    failureReason: string;
  }>;
}

export interface IDatasetAdapter<T = any> {
  readonly datasetType: string;
  readonly targetTable: string;

  /** Validates raw records against Zod dataset schema applying field mappings */
  validateRawRecords(records: RawSyncRecord[], ctx: DatasetAdapterContext): Promise<AdapterValidationResult>;

  /** Transforms validated records into canonical database entity structures */
  normalizeEntities(records: any[], ctx: DatasetAdapterContext): Promise<T[]>;

  /** Computes record hash for change detection */
  computeRecordHash(entity: T): string;

  /** Executes atomic upsert into Supabase Postgres table */
  upsertEntities(entities: T[], ctx: DatasetAdapterContext): Promise<{ inserted: number; updated: number }>;

  /** Generates domain event envelope for Academic Event Bus */
  createDomainEvent(entities: T[], ctx: DatasetAdapterContext): AcademicEventEnvelope | null;
}
```

---

## 4. Concurrent Multi-Source Dataset Ingestion

One college can run multiple connectors simultaneously for different datasets:

```
COLLEGE A CONCURRENT CONNECTORS
├── Connector 1 (Google Sheets)  ──► AttendanceAdapter  ──► attendance_records
├── Connector 2 (ERP API)         ──► TimetableAdapter   ──► timetable_slots
├── Connector 3 (Cloud Excel)     ──► InternalMarksAdapter──► internal_marks
├── Connector 4 (SQL Database)   ──► SemesterResultAdapter─► semester_results
└── Connector 5 (CSV Export)     ──► SubjectAdapter     ──► subjects
```

All 5 connectors operate concurrently using their respective `IDatasetAdapter` without schema conflicts.
