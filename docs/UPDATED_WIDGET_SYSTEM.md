# CampusTracker — Updated Live Widget System Architecture

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Platforms**: Web Dashboard Components & Native Mobile Widgets (WidgetKit iOS / Jetpack Glance Android)  

---

## 1. Executive Summary & Widget System Shift

The CampusTracker Live Widget System is upgraded to render real-time, official academic data directly on web app dashboards, mobile home screens, lock screens, and Dynamic Islands.

All QR-scanning widgets and manual check-in widgets are retired. They are replaced by 7 dynamic academic widgets driven by official college synchronization data.

---

## 2. Updated Widget Inventory

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CAMPUS TRACKER WIDGET SUITE                            │
│                                                                                        │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐   │
│   │ 1. TODAY'S SCHEDULE │   │ 2. OFFICIAL ATTEND. │   │ 3. SAFE LEAVE CALC. │   │
│   │ Next Class & Room   │   │ % Gauge & Status    │   │ Remaining Allowance │   │
│   └─────────────────────┘   └─────────────────────┘   └─────────────────────┘   │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐   │
│   │ 4. INTERNAL MARKS   │   │ 5. EXAM COUNTDOWN   │   │ 6. SEMESTER RESULTS │   │
│   │ Recent Score Alerts │   │ Date, Time & Venue  │   │ SGPA / CGPA Meter   │   │
│   └─────────────────────┘   └─────────────────────┘   └─────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ 7. LIVE ACADEMIC UPDATES                                                │   │
│   │ Class Cancellations, Substitute Notices & Official Announcements        │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Widget Breakdown:

#### 1. Today's Schedule Widget (`WidgetKind: Schedule`)
- **Sizes**: Small (1x2), Medium (2x2), Large (4x2).
- **Data Display**: Current ongoing lecture or next upcoming lecture slot, subject code, room/lab number, faculty name, and start/end time countdown.
- **Action**: Tapping launches full Timetable screen.

#### 2. Official Attendance Gauge Widget (`WidgetKind: Attendance`)
- **Sizes**: Small (1x2), Medium (2x2).
- **Data Display**: Overall official attendance percentage, total classes held vs. attended, color-coded health ring (Green $\ge 75\%$, Amber $70-74\%$, Red $< 70\%$).

#### 3. Safe Leave Calculator Widget (`WidgetKind: SafeLeave`)
- **Sizes**: Medium (2x2).
- **Data Display**: Breakdown of subjects near danger zone and exact number of remaining lectures that can be missed safely.
- **Guidance Text**: *"2 Safe Leaves available in Applied Mathematics."*

#### 4. Internal Assessment Marks Widget (`WidgetKind: InternalMarks`)
- **Sizes**: Medium (2x2), Large (4x2).
- **Data Display**: Latest published mid-term test scores, grade indicators, and class percentile range.

#### 5. Exam Countdown & Venue Widget (`WidgetKind: ExamCountdown`)
- **Sizes**: Small (1x2), Medium (2x2).
- **Data Display**: Countdown timer to nearest end-semester exam, subject name, exam hall location, and seating block number.

#### 6. Semester SGPA / CGPA Progress Widget (`WidgetKind: SemesterProgress`)
- **Sizes**: Medium (2x2).
- **Data Display**: Latest semester SGPA badge, cumulative CGPA metric, earned credits progress bar.

#### 7. Live Academic Updates & Notices Widget (`WidgetKind: AcademicNotices`)
- **Sizes**: Large (4x2).
- **Data Display**: Real-time push notifications for room changes, substitute faculty assignments, and department notices.

---

## 3. Data Synchronization & Shared State Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ WEB & MOBILE SYNC DATA FLOW                                                            │
│                                                                                        │
│  Supabase Realtime API ──► React Query Cache ──► MMKV Storage / App Group Container    │
│                                                       │                                │
│                                                       ▼                                │
│                                         ┌───────────────────────────┐                  │
│                                         │ iOS WidgetKit / Android   │                  │
│                                         │ Glance Native Renderers   │                  │
│                                         └───────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Update Frequency**: Web widgets re-render instantly on Supabase Realtime event payload arrival. Mobile native widgets update via `Expo TaskManager` background sync every 15 minutes or upon silent push notification broadcast.
- **Power Optimization**: Native widgets render static timelines generated 24 hours in advance to maintain iOS memory consumption under $4\text{ MB}$.
