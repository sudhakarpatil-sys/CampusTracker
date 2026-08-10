# CampusTracker Mobile — Updated Master Specification

**Document Identifier**: `DOC-MST-008`  
**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Framework**: React Native / Expo SDK 51+ (Monorepo `apps/mobile`)  

---

## 1. Executive Summary & Mobile Architecture Shift

The CampusTracker Mobile Specification (`apps/mobile`) is re-architected to deliver a high-performance **Academic Companion App**. 

All QR attendance scanning modals, faculty QR session generation buttons, and manual check-in flows are removed from the primary MVP navigation stack. Instead, the mobile experience is centered around **Instant Academic Status**, **Safe Leave Calculation**, **Smart Stack Context Evaluation**, and **Native iOS/Android Widgets**.

---

## 2. Updated Mobile Screen Hierarchy & Navigation Stack

```
MOBILE NAVIGATION STACK (Expo Router / React Navigation)
├── (auth)
│   ├── login.tsx              ──► Student ID / Email Login
│   ├── activate-account.tsx   ──► OTP / DOB / Verification Flow
│   └── onboarding.tsx         ──► Institution Selection & Profile Setup
└── (app) / (tabs)
    ├── index.tsx (Dashboard)   ──► Smart Stack, Quick Cards, Next Class Hero
    ├── attendance.tsx          ──► Official Attendance, Safe Leave Simulator
    ├── timetable.tsx           ──► Daily/Weekly Grid, Class Locations
    ├── academics.tsx           ──► Internal Marks, Exam Schedule, SGPA/CGPA
    └── profile.tsx             ──► Student ID Badge, Institution Config
```

---

## 3. Screen Specifications & Features

### 3.1 Dashboard Screen (`app/(tabs)/index.tsx`)
- **Hero Banner**: Next upcoming class card with dynamic room countdown and faculty name.
- **Smart Stack Engine Container**: Renders current top-priority academic insight card (e.g. "Attendance Updated", "Low Attendance Alert", "Assignment Due").
- **Quick Metric Bar**: Official Total Attendance %, Safe Leave Allowance count, Next Exam countdown.
- **Recent Announcements**: Horizonally scrollable cards for official institution notices.

### 3.2 Attendance & Safe Leave Screen (`app/(tabs)/attendance.tsx`)
- **Official Attendance Overview**: Overall percentage gauge ring with status badge (`On Track` / `Warning` / `Critical`).
- **Safe Leave Calculator Modal / Widget**:
  - Interactive slider simulating future missed lectures.
  - Calculation formula:
    $$\text{Safe Leaves} = \left\lfloor \frac{\text{Attended} - (\text{Target} \times \text{Total})}{1 - \text{Target}} \right\rfloor$$
  - Guidance text: *"You can safely skip 3 more Physics lectures while staying above 75%."*
- **Subject Attendance List**: Subject-wise percentage cards, total lectures held vs. attended, and official sync timestamp.

### 3.3 Timetable & Schedule Screen (`app/(tabs)/timetable.tsx`)
- **Day Selector Ribbon**: Monday to Saturday toggle with current day auto-selected.
- **Class Timeline Cards**: Chronological time slots displaying subject name, course code, room/lab number, and instructor.
- **Notice Banner**: Displays substitute teacher or cancelled lecture alerts pushed via official sync engine.

### 3.4 Academics & Results Hub (`app/(tabs)/academics.tsx`)
- **Tab Segmented Control**: `Internal Marks` | `Exam Schedule` | `Semester Results (SGPA/CGPA)`
- **Internal Marks View**: Subject-wise mid-term test scores, lab internals, and weightage breakdown.
- **Exam Schedule View**: Calendar layout showing upcoming end-semester exam dates, shift times, seating roll ranges, and hall numbers.
- **Semester Results View**: Historical SGPA bar chart, cumulative CGPA meter, and credit completion progress.

---

## 4. Native Widget Integration

The mobile application exposes dynamic data to native mobile operating system widget surfaces via shared memory (`Expo MMKV` / `App Groups` for iOS, `SharedPreferences` for Android):

1. **iOS WidgetKit Extension**: Pre-compiled timeline entries for Today's Schedule and Safe Leave Status.
2. **Android Jetpack Glance Widget**: Native Android home screen widgets displaying attendance %, exam countdowns, and upcoming lectures.
3. **Lock Screen Widgets / Dynamic Island**: Real-time display of current lecture room and remaining class minutes.

---

## 5. Offline Capabilities & Caching Strategy

- **TanStack Query + Expo SQLite Engine**: All official academic records (attendance, timetable, marks, exams) are cached locally in Expo SQLite.
- **Zero-Network Usability**: Students can access their entire timetable, past attendance logs, internal marks, and exam schedules offline without internet connectivity.
- **Background Refresh**: Expo BackgroundFetch / WorkManager automatically triggers sync checks when network connection is restored.
