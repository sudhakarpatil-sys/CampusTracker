# CampusTracker — Updated Website Architecture & Page Audit

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Scope**: Next.js App Router (`src/app`) & Marketing Platform  

---

## 1. Executive Summary & Web Positioning Shift

The CampusTracker Web Platform is transformed from a student self-logging interface into the **Official Academic Companion Dashboard**. 

All references to "mark attendance", "scan QR code", "generate lecture session", or "log class" are replaced with **"Official Institution Sync"**, **"Safe Leave Analytics"**, **"Academic Companion Insights"**, and **"Single Source of Academic Truth"**.

---

## 2. Page-by-Page Architectural Audit & Impact Matrix

| Route / Page | Current State | Required Modification | Rationale |
| :--- | :--- | :--- | :--- |
| `src/app/(marketing)/page.tsx` | Hero banner features QR Attendance scan mockups & student self-marking. | Re-architect hero to feature "Official College Data Sync", "Smart Academic Companion", and "Safe Leave Engine". Replace QR graphics with Sync Flow diagram & Academic Insights dashboard preview. | Aligns landing page messaging with institutional SaaS positioning. |
| `src/app/(app)/dashboard/page.tsx` | Displays manual attendance logger, quick check-in buttons, and QR scanner CTA. | Redesign hero card to present Official Attendance %, Today's Official Timetable, Safe Leave Allowance badge, and Internal Marks alerts. Remove manual check-in button. | Reflects official synchronized student state. |
| `src/app/(app)/attendance/page.tsx` | Includes "Mark Attendance" modal, manual status toggle (Present/Absent), and session logging. | Transform into **Official Attendance Analytics & Safe Leave Hub**. Remove manual mark controls. Add Safe Leave Simulator, Official Monthly Heatmap, and Subject-wise Official Percentage Cards. | Students consume official institution attendance without manual edits. |
| `src/app/(app)/subjects/page.tsx` | Allows manual subject creation, credit editing, and teacher input. | Retain manual addition as fallback for personal subjects, but tag official sync subjects with an "Official Institution Synchronized" badge & lock core fields (code, credits). | Clearly demarcates official college subjects from personal custom subjects. |
| `src/app/(app)/timetable/page.tsx` | Features AI Timetable Import wizard and manual slot creator. | Keep AI Timetable Import (Phase 3A asset), but link default display to Official Timetable ingested via Sync Engine. Display room changes and substitute faculty notices. | Blends AI timetable parsing with official college timetable sync. |
| `src/app/(app)/assignments/page.tsx` | Personal student assignment list. | Expand to display both **Official Faculty Assignments** (pushed from Faculty Portal) and **Personal Student Tasks**. | Centralizes official homework with personal study items. |
| `src/app/(app)/notes/page.tsx` | Markdown editor for student notes. | Add **"Faculty Shared Resources"** tab displaying lecture slides, PDF documents, and reference materials pushed by institution faculty. | Expands notes from personal scratchpad to academic resource portal. |
| `src/app/(app)/exams/page.tsx` | Basic exam countdown list. | Evolve into **Official Exam & Results Hub**. Add tabs for: (1) Official Exam Schedule with seating info, (2) Internal Assessment Marks, (3) Semester SGPA/CGPA breakdown. | Covers full exam cycle from schedule to results. |
| `src/app/(app)/analytics/page.tsx` | Basic attendance charts. | Upgrade to **AI Academic Performance Analytics**. Display attendance trends, internal mark performance radar, SGPA trajectory, and weak subject alerts. | Provides predictive academic guidance. |
| `src/app/(app)/settings/page.tsx` | User profile & theme settings. | Add **Student ID Verification** status badge, institution domain details, and notification channels. | Supports Student ID authentication model. |

---

## 3. Navigation & App Shell Redesign

The App Shell navigation structure (`src/components/layout/app-shell.tsx`) is updated to reflect the academic platform scope:

```
NAVIGATION MENU STRUCTURE
├── 📊 Dashboard (Overview, Quick Insights, Today's Timetable)
├── 📈 Official Attendance (Attendance %, Safe Leave Calculator, Monthly Log)
├── 📅 Timetable & Schedule (Weekly Grid, Room Allocations, Substitute Notices)
├── 📚 Subjects & Courses (Course Syllabus, Credits, Faculty Contacts)
├── 📝 Assignments & Homework (Faculty Assignments, Personal Tasks, Submissions)
├── 📖 Academic Resources & Notes (Faculty Slides, PyQs, Student Notes)
├── 🎓 Exams & Grades (Exam Timetable, Seating Info, Internal Marks, SGPA/CGPA)
├── 🤖 AI Companion (Attendance Predictor, Study Planner, CGPA Calculator)
└── ⚙️ Settings (Student ID Info, Theme, Notifications)
```

---

## 4. Marketing Copy & Branding Overhaul

### Headline Replacements:

- **OLD**: *"Never Miss Attendance Again — Scan QR & Track Classes Easily"*
- **NEW**: *"The AI-Powered Academic Operating System for Higher Education"*

- **OLD**: *"Student Attendance Tracker with QR Sessions"*
- **NEW**: *"Seamless Official College Data Sync, Safe Leave Analytics & Academic Companion"*

### Feature Cards Marketing Matrix:
1. **Official Data Sync**: Connects to your college's Excel, Google Sheets, or ERP system automatically.
2. **Safe Leave Engine™**: Smart calculations that tell you exactly how many classes you can safely miss while staying above 75%.
3. **Internal Marks & Results**: Instant access to mid-term grades, lab evaluations, and semester SGPA/CGPA tracking.
4. **Smart Stack & Live Widgets**: Beautiful context-aware cards and native mobile widgets tailored to your academic day.
