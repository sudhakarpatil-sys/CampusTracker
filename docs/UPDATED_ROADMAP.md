# CampusTracker — Updated Strategic Roadmap

**Document Version**: `2.0.0`  
**Status**: APPROVED ROADMAP  

---

## Roadmap Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 1-3C ✅  : Core Auth, Web Portal, AI Timetable & Exam Import, Hardening          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 4B-0 🎯  : Generic Academic Data Sync Engine (Excel / Google Sheets / Connectors)│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 4B-1 🎯  : Backend Integration & Schema Migration (Marks, Results, Calendar)     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 4C 🚀   : Student Mobile App (Official Attendance, Widgets, Smart Stack)         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 5 👩‍🏫   : Faculty Portal (Notes, Assignments, Resources, Announcements)          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 6 🏛️   : Admin Portal (Sync Config, Sheet/Excel Import, Sync Logs)                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 7 🤖   : AI Academic Assistant (Prediction, Safe Leave, Revision Planner)       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 8 ⚡   : CampusTracker Smart Attendance™ (Optional Enterprise Add-on)            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 9 🌍   : Multi-College SaaS Platform (Enterprise Multi-Tenancy & White-labeling)│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Phase Breakdown

### Phase 1: Authentication & Base Platform ✅ (Updated V2)
- Auth via Student ID / Email.
- Student profile setup & onboarding flow.
- Core UI shell and artisanal light/dark design system.

### Phase 2: Student Web Portal ✅ (Updated V2)
- Timetable display, subject management, notes, assignment tracker.
- Analytics dashboard & notification system.
- Transitioned from manual attendance logging to official data display ready.

### Phase 3A / 3B / 3C: AI Import Wizards & Hardening ✅
- PDF/OCR AI Smart Timetable Import & AI Exam Timetable Import.
- Artisanal V3 theme redesign & landing page V4.
- Production hardening: Rate limiting, API error handling, audit logging, Zod validation, feedback system.

---

### Phase 4B-0: Academic Data Sync Engine 🎯 (Immediate Next Phase)
- **Generic Data Sync Engine Core**: Modular ingestion pipeline framework.
- **Connectors**:
  - `SheetConnector`: Google Sheets View-Only connector (V1).
  - `ExcelConnector`: `.xlsx` / `.xls` workbook parser and column mapper.
  - `CSVConnector`: Standard CSV data importer.
  - `ERPConnector Interface`: Pluggable REST/GraphQL adapter interface for future ERPs (Banner, PeopleSoft, custom APIs).
- **Validation Engine**: Schema enforcement, data type checking, missing roll number detection.
- **Normalization Layer**: Mapping raw sheet columns to unified Supabase relational schema.
- **Quarantine & Sync Log System**: Row-level error logging and sync execution metrics.

### Phase 4B-1: Backend Integration & Database Schema Migration 🎯
- Database Migration `0012_academic_platform_sync.sql`:
  - `institutions`, `departments`, `classes`, `academic_terms`.
  - `student_master`: Official student registry.
  - `sync_connectors`, `sync_jobs`, `sync_logs`, `sync_quarantine_rows`.
  - `internal_marks`: Internal assessment scores, test weights, maximum marks.
  - `semester_results`: SGPA, CGPA, grade points, backlogs.
  - `exam_schedules`: Official exam dates, seating numbers, venues.
  - `academic_calendar`: University calendar events and holidays.
- Backend API Integration: REST endpoints for sync triggers, student data fetchers, and background jobs.

### Phase 4C: Student Mobile App 🚀
- React Native / Expo SDK 51+ codebase.
- **Official Attendance Screen**: Subject-wise attendance percentages, total lectures held vs. attended, status indicators.
- **Safe Leave Calculator**: Dynamic simulation showing how many classes a student can miss or must attend to reach target percentage.
- **Performance & Marks Dashboard**: Internal assessment test scores, grade progress bars, semester SGPA/CGPA history.
- **Redesigned Smart Stack**: 8-mode temporal & event-driven context card (No QR states).
- **Native Live Widgets**: WidgetKit (iOS) & Jetpack Glance (Android) for timetable, attendance, exams, and marks.

### Phase 5: Faculty Portal 👩‍🏫
- Faculty authentication & dashboard shell.
- **Notes & Resource Upload**: Upload lecture slides, PDF resources, and external reading links.
- **Assignment Management**: Post assignments, set due dates, specify submission guidelines.
- **Announcements**: Send course or department notifications to enrolled students.
- **Timetable & Schedule View**: View assigned teaching slots and room locations.
- *(Attendance management explicitly excluded from Faculty MVP)*.

### Phase 6: Admin Portal 🏛️
- Admin dashboard shell & permissions engine.
- **Academic Data Import Center**: Drag-and-drop Excel upload & Google Sheets URL configuration.
- **Connector Management**: Configure sync intervals, sheet ranges, and field mappings.
- **Sync Log Monitor**: Real-time sync job execution status, warning counts, and quarantine row resolver.
- **Student Master Registry**: View, search, and manage student enrollment states.
- **Academic Calendar Manager**: Manage college events, exam periods, and official holidays.

### Phase 7: AI Academic Assistant 🤖
- **Attendance Prediction Engine**: ML/Algorithmic simulation of future attendance trends based on timetable schedule.
- **Weak Subject Detection**: Automated detection of subject grade or attendance drops with alert triggers.
- **Study Recommendations & Revision Planner**: Personalized study timetables tailored to upcoming exam dates and internal mark gaps.
- **SGPA / CGPA Target Predictor**: Interactive calculator projecting required upcoming marks to achieve target CGPA.

### Phase 8: CampusTracker Smart Attendance™ ⚡ (Future Premium Addon)
- Automated classroom attendance capture system.
- Re-introduction of QR generation for faculty & dynamic QR scanner for students.
- Supabase Edge Functions with GPS geofencing, Wi-Fi BSSID hash validation, and anti-proxy device fingerprinting.

### Phase 9: Multi-College SaaS Platform 🌍
- Multi-tenant architecture expansion with isolated schema / RLS policies.
- Custom white-labeling (college logo, primary colors, custom subdomains `college.campustracker.edu`).
- Enterprise billing, subscription tiers, SLA monitoring, and institutional analytics.
