# CampusTracker — Complete Project Migration & File Categorization Report

**Document Version**: `1.0.0`  
**Status**: APPROVED ARCHITECTURE  

---

## 1. Executive Migration Summary

To transform CampusTracker from an attendance logging application into an **AI-powered Academic Companion Platform** while preserving maximum engineering work, every component, service, page, and documentation file across the repository is categorized into 4 actionable buckets:

1. **SAFE TO KEEP**: Existing core infrastructure, UI components, authentication shell, theme systems, and production security utilities that remain 100% relevant.
2. **MODIFY**: Core pages, navigation components, database schemas, and API handlers that require minor to moderate updates to align with official institution sync data and Student ID authentication.
3. **MOVE TO FUTURE**: Code paths, schemas, and mobile modals associated with student self-attendance marking and QR session generation. These are preserved and rebranded as **CampusTracker Smart Attendance™** for Phase 8.
4. **REMOVE**: Redundant sample mock data or outdated single-tenant assumption files that are superseded by the new multi-tenant academic platform architecture.

---

## 2. Complete File Categorization Directory

### 2.1 Core Architectural & Documentation Files (`docs/`, root)

| File Path | Categorization | Strategic Rationale & Update Instructions |
| :--- | :--- | :--- |
| `docs/PRODUCT_VISION.md` | **MODIFY** | Updated by `UPDATED_PRODUCT_VISION.md`. Recasts CampusTracker as Academic Operating System. |
| `docs/ROADMAP.md` | **MODIFY** | Updated by `UPDATED_ROADMAP.md`. Inserts Phase 4B-0 Sync Engine through Phase 9 SaaS. |
| `docs/QR_ATTENDANCE_ARCHITECTURE.md` | **MOVE TO FUTURE** | Move to `Phase 8: CampusTracker Smart Attendance™`. Do not delete. |
| `docs/MOBILE_MASTER_SPEC.md` | **MODIFY** | Updated by `UPDATED_MOBILE_MASTER_SPEC.md`. Replaces QR screens with Official Attendance & Safe Leave. |
| `docs/DATABASE_IMPACT.md` | **MODIFY** | Updated by `UPDATED_DATABASE_PLAN.md`. Incorporates multi-tenant `student_master`, `sync_jobs`, `internal_marks`. |
| `docs/SMART_STACK_DESIGN.md` | **MODIFY** | Updated by `UPDATED_SMART_STACK.md`. Replaces QR states with 8 academic context modes. |
| `docs/WIDGET_SYSTEM.md` | **MODIFY** | Updated by `UPDATED_WIDGET_SYSTEM.md`. Replaces QR widgets with 7 academic companion widgets. |
| `docs/AUTHENTICATION_ARCHITECTURE.md` | **MODIFY** | Updated by `UPDATED_AUTHENTICATION.md`. Introduces Student ID auth and 4 activation flows. |
| `docs/API_ARCHITECTURE.md` | **MODIFY** | Updated by `UPDATED_API_ARCHITECTURE.md`. Adds Sync Engine and Academic Platform routes. |
| `docs/IMPLEMENTATION_ROADMAP.md` | **MODIFY** | Updated by `UPDATED_IMPLEMENTATION_ROADMAP.md`. Aligns milestone execution pipeline. |
| `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE` | **SAFE TO KEEP** | Repository hygiene and open-source compliance files remain 100% valid. |

---

### 2.2 Next.js App Router Pages (`src/app/`)

| File Path | Categorization | Strategic Rationale & Update Instructions |
| :--- | :--- | :--- |
| `src/app/(marketing)/page.tsx` | **MODIFY** | Update hero messaging to "Official College Data Sync" & "AI Academic Companion". Remove QR scan CTA. |
| `src/app/(app)/dashboard/page.tsx` | **MODIFY** | Redesign hero card to display Official Attendance %, Safe Leave allowance, and Today's Schedule. |
| `src/app/(app)/attendance/page.tsx` | **MODIFY** | Transform from manual logger into Official Attendance & Safe Leave Simulator Hub. |
| `src/app/(app)/subjects/page.tsx` | **MODIFY** | Add "Official Institution Sync" badges to college subjects. |
| `src/app/(app)/timetable/page.tsx` | **SAFE TO KEEP** | Retain timetable viewer and AI Timetable Import wizard (Phase 3A asset). |
| `src/app/(app)/assignments/page.tsx` | **MODIFY** | Display official faculty assignments alongside personal student tasks. |
| `src/app/(app)/notes/page.tsx` | **MODIFY** | Add "Faculty Shared Resources" tab for lecture slides and reference PDFs. |
| `src/app/(app)/exams/page.tsx` | **MODIFY** | Expand to cover Internal Marks, Exam Schedule, and Semester SGPA/CGPA. |
| `src/app/(app)/analytics/page.tsx` | **MODIFY** | Upgrade to AI Academic Analytics (SGPA trajectory, weak subject alerts). |
| `src/app/(app)/settings/page.tsx` | **MODIFY** | Add Student ID verification badge and institution domain details. |

---

### 2.3 Backend Libraries & Database Migrations (`src/lib/`, `supabase/`)

| File Path | Categorization | Strategic Rationale & Update Instructions |
| :--- | :--- | :--- |
| `src/lib/academic.ts` | **MODIFY** | Enhance calculations to compute official attendance percentages and safe leave allowance. |
| `src/lib/api-error.ts` | **SAFE TO KEEP** | Standardized `ApiError` class is 100% reusable across new sync routes. |
| `src/lib/validate-request.ts` | **SAFE TO KEEP** | Zod middleware wrapper is 100% reusable for sync validation. |
| `src/lib/rate-limit.ts` | **SAFE TO KEEP** | Sliding window rate limiter protects sync and academic endpoints. |
| `src/lib/audit-log.ts` | **SAFE TO KEEP** | Audit logger logs sync engine triggers and admin record modifications. |
| `supabase/migrations/0001_init.sql` | **SAFE TO KEEP** | Core profiles and user preferences table structure preserved. |
| `supabase/migrations/0002_academic_system.sql` | **SAFE TO KEEP** | Subjects, timetable slots, and attendance records schema preserved. |
| `supabase/migrations/0003_fix_profile_bootstrap.sql` through `0011_feedback.sql` | **SAFE TO KEEP** | All production patch migrations remain intact. |
| `supabase/migrations/0012_academic_platform_sync.sql` | **[NEW]** | Deployment script for multi-tenant institution, student master, sync engine, marks, and results tables. |

---

### 2.4 Reusable UI Components (`src/components/`)

| File Component Directory | Categorization | Strategic Rationale & Update Instructions |
| :--- | :--- | :--- |
| `src/components/ui/` (button, card, dialog, etc.) | **SAFE TO KEEP** | Artisanal shadcn/ui components form the core visual system. |
| `src/components/layout/app-shell.tsx` | **MODIFY** | Update sidebar navigation links to reflect new Academic Companion pages. |
| `src/components/layout/header.tsx` | **MODIFY** | Add Student ID badge and institution brand selector. |
| `src/components/dashboard/` | **MODIFY** | Replace self-attendance check-in buttons with Official Attendance & Safe Leave cards. |
| `src/components/timetable-import/` | **SAFE TO KEEP** | AI Timetable Import wizard components remain active assets. |
