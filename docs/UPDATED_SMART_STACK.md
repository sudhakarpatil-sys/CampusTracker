# CampusTracker — Updated Smart Stack Architecture

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Engine Location**: `src/lib/smart-stack/` & `apps/mobile/domain/smart-stack/`  

---

## 1. Executive Summary & Smart Stack Context Engine Shift

The **Smart Stack** is CampusTracker's intelligent, context-aware cards engine that dynamically evaluates the student's temporal schedule, attendance state, academic deadlines, and official institution notifications to surface the single most relevant piece of information at any given moment.

All QR-session states ("Scan Active QR Code", "Faculty QR Broadcasting", "Dynamic TOTP Token") are removed. The engine is re-engineered around **8 Official Academic Context Modes**.

---

## 2. Smart Stack Evaluation Priority Matrix

The engine evaluates student state against 8 prioritized rules in real-time:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SMART STACK PRIORITY ENGINE                               │
│                                                                                        │
│  Priority 1: Emergency & Critical Attendance Alerts (< 70% Attendance Warning)         │
│  Priority 2: Exam Day / Immediate Exam Countdown (< 2 Hours to Exam Slot)              │
│  Priority 3: Active / Upcoming Lecture (Class in < 30 Minutes or Ongoing)              │
│  Priority 4: Internal Marks / Result Published Notification (Published in last 24h)   │
│  Priority 5: Assignment Deadline Warning (Due in < 12 Hours)                           │
│  Priority 6: New Faculty Note / Resource Upload Alert                                 │
│  Priority 7: Morning Academic Briefing (Today's Timetable Summary)                     │
│  Priority 8: End-of-Day Performance & Weekly Progress Summary                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Context Mode Specifications

| Mode ID | Mode Name | Trigger Conditions | Surfaced Card UI & Content |
| :--- | :--- | :--- | :--- |
| `MODE_1_CRITICAL_ALERT` | Low Attendance Warning | Subject attendance $< 75\%$ or 1 missed class away from shortfall. | **Red Alert Banner**: *"Applied Mathematics is at 72%. Attending today's 2 PM lecture will restore it to 75%."* |
| `MODE_2_EXAM_NOW` | Upcoming Exam Briefing | Exam scheduled within 24 hours. | **Exam Venue Card**: *"Data Structures Exam at 10:00 AM in Hall 302. Seating Row B-14."* Includes syllabus checklist button. |
| `MODE_3_UPCOMING_CLASS` | Next Class Countdown | Lecture starts in $< 30$ mins or currently ongoing. | **Class Location Card**: *"Computer Networks with Prof. Sharma starting in 15 mins (Lab 4)."* |
| `MODE_4_MARKS_PUBLISHED` | Internal Marks Published | Ingested internal test marks within past 24 hours. | **Score Banner**: *"Mid-Sem Unit Test 1 marks published: 24/30 in Database Systems."* |
| `MODE_5_ASSIGNMENT_DUE` | Pending Assignment | Unsubmitted assignment due in $< 12$ hours. | **Deadline Card**: *"Operating Systems Assignment 2 due at 11:59 PM tonight."* |
| `MODE_6_NOTES_UPLOADED` | New Resource Alert | Faculty shared new lecture notes or PYQs. | **Resource Card**: *"Prof. Verma uploaded 'Unit 3 Graph Theory Slides.pdf'."* |
| `MODE_7_MORNING_BRIEFING` | Today's Timetable Summary | 6:00 AM – 9:00 AM on scheduled lecture days. | **Daily Overview**: *"Good morning, Rahul! You have 4 lectures today starting at 9:30 AM."* |
| `MODE_8_EVENING_SUMMARY` | Daily Academic Digest | 6:00 PM – 10:00 PM. | **Progress Digest**: *"4 lectures held today. Official attendance updated: 88% overall."* |

---

## 4. State Machine Implementation Logic

```typescript
export interface StudentAcademicState {
  userId: string;
  institutionId: string;
  upcomingClass: TimetableSlot | null;
  lowAttendanceSubjects: SubjectAttendance[];
  upcomingExam: ExamSchedule | null;
  recentlyPublishedMark: InternalMark | null;
  pendingAssignment: Assignment | null;
  currentTime: Date;
}

export function evaluateSmartStackState(state: StudentAcademicState): SmartStackCard {
  // 1. Check for Critical Attendance Shortfall
  if (state.lowAttendanceSubjects.length > 0) {
    return createLowAttendanceCard(state.lowAttendanceSubjects[0]);
  }

  // 2. Check for Immediate Exam
  if (state.upcomingExam && isWithinHours(state.upcomingExam.examDate, 24)) {
    return createExamCountdownCard(state.upcomingExam);
  }

  // 3. Check for Active / Upcoming Class
  if (state.upcomingClass && isClassSoonOrOngoing(state.upcomingClass, state.currentTime)) {
    return createUpcomingClassCard(state.upcomingClass);
  }

  // 4. Check for Recently Published Marks
  if (state.recentlyPublishedMark && isWithinHours(state.recentlyPublishedMark.createdAt, 24)) {
    return createMarksPublishedCard(state.recentlyPublishedMark);
  }

  // 5. Default Fallback: Morning / Evening Briefing
  return createAcademicBriefingCard(state);
}
```
