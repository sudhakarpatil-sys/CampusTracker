# CampusTracker — Updated Product Vision

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Platform**: Multi-College Academic Operating System  

---

## 1. Mission Statement

CampusTracker is an **AI-Powered Academic Companion Platform** that seamlessly integrates with official college academic data. 

Rather than expecting students or faculty to manually log daily attendance or generate QR codes, CampusTracker connects directly to official institution data sources—such as Excel sheets, Google Sheets, ERP exports, and Student Information Systems (SIS). It transforms raw administrative records into actionable insights, real-time widgets, predictive analytics, and personalized academic guidance.

---

## 2. Core Vision & Product Evolution

CampusTracker is no longer an attendance tracking application. It is the **Academic Operating System (AOS)** for higher education institutions.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             OLD VISION (V1.0)                                    │
│  Student Self-Attendance App ──► Scan QR Code ──► Manual Attendance Logger       │
└──────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼ EVOLUTION
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             NEW VISION (V2.0)                                    │
│  Official Academic Data ──► Generic Sync Engine ──► AI Academic Companion        │
│  (Excel / Google Sheets / ERP) (Validation & Normalization) (Single Academic Truth) │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Core Strategic Pillars:
1. **Single Source of Truth**: Integrates official records (attendance, internal marks, semester results, SGPA/CGPA, exam schedules, timetables, and academic calendars) into one unified student portal.
2. **Workflow Enhancement, Not Replacement**: Integrates directly with existing college ERPs, spreadsheets, or department exports without forcing staff to learn complex new software.
3. **Proactive AI Academic Companion**: Provides students with intelligent guidance, including safe leave calculations, weak subject alerts, SGPA/CGPA prediction, study recommendations, and exam readiness scores.
4. **Multi-College SaaS Scalability**: Built from the ground up to support hundreds of colleges with isolated multi-tenancy, custom institutional branding, and role-based access control.

---

## 3. Academic Data Platform Scope

CampusTracker centralizes 14 core academic datasets into a single synchronized graph:

| Dataset | Scope & Description |
| :--- | :--- |
| **Student Master List** | Official student registry (Student ID, Roll No, Branch, Semester, Section, Enrolled Electives). |
| **Official Attendance** | Institutionally verified daily/weekly attendance percentages, class counts, and status logs. |
| **Subjects & Credits** | Enrolled subjects, course codes, credit distribution, syllabus outlines, and passing criteria. |
| **Faculty Directory** | Subject instructors, office hours, contact channels, and department affiliations. |
| **Timetable & Venues** | Weekly lecture slots, lab sessions, dynamic room changes, and substitute teacher updates. |
| **Departments & Classes** | Academic hierarchy mapping sections, streams, branches, and semester cohorts. |
| **Notes & Resources** | Faculty-uploaded study materials, lecture slides, reference links, and previous year papers. |
| **Assignments & Tasks** | Homework assignments, project submissions, due dates, and grading feedback. |
| **Announcements** | Official institutional notices, department alerts, and holiday notifications. |
| **Internal Assessment Marks** | Mid-term test scores, lab internal evaluations, assignment marks, and practical scores. |
| **Semester Results** | Final semester grades, subject-wise letter grades, grade points, and backlogs. |
| **SGPA & CGPA Tracking** | Historical and current Grade Point Averages with trend analysis and target calculator. |
| **Exam Schedule** | Internal test and final end-semester exam dates, shift timings, seating numbers, and venues. |
| **Academic Calendar** | University calendar, exam windows, sports days, mid-term breaks, and official holidays. |

---

## 4. Strategic Removal of Self-Attendance

### Rationale:
- **Data Integrity**: Student self-marked or QR-scanned attendance in classrooms introduces friction, proxy attendance attempts, network latency issues, and administrative distrust.
- **Institutional Alignment**: Colleges already maintain attendance in official Excel files, ERP systems, or Google Sheets. CampusTracker delivers maximum value by acting as the **consumer and visual intelligence layer** of official data.

### Repositioning QR Attendance:
- QR Attendance code paths, database schema, and mobile scanner logic are **NOT deleted**.
- Rebranded as **CampusTracker Smart Attendance™**.
- Moved to **Phase 8 (Future Roadmap)** as an optional enterprise premium add-on for institutions desiring automated physical attendance capture.

---

## 5. Core User Persona Value Propositions

### 🎓 Students
- **Zero Friction Access**: Log in via Student ID and view official attendance, internal marks, and exam timetables immediately.
- **Safe Leave Calculator**: Instant calculation of exactly how many classes can be safely missed while maintaining required threshold percentages (e.g. 75%).
- **Smart Stack & Widgets**: Dynamic home screen widgets prioritizing next class, low attendance warnings, assignment due dates, and exam countdowns.
- **AI Academic Companion**: Automated predictions on SGPA goals, weak subject detection, and study planning.

### 👩‍🏫 Faculty
- **Streamlined Resource Sharing**: Upload lecture notes, reference PDFs, and assignment briefs in seconds.
- **Zero Attendance Admin Overhead**: Faculty do not manage daily attendance input in CampusTracker MVP; attendance is ingested automatically via institution sync.
- **Academic Communication**: Broadcast announcements and assignment deadlines directly to enrolled class cohorts.

### 🏛️ Administrators
- **Generic Data Sync Engine**: Plug-and-play Excel/Google Sheets upload or automated ERP API sync.
- **Data Integrity & Quarantining**: Automated validation flags invalid roll numbers or missing entries before publishing.
- **Sync Logs & Audit Trails**: Complete visibility into data synchronization jobs and operational health.
