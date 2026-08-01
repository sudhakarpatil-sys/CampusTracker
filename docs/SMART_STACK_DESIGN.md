# CampusTracker Mobile — Smart Stack™ UI/UX Design Specifications

**Document Identifier**: `DOC-DES-007`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Principal Product Architect & Lead UI Designer  

---

## 1. Smart Stack™ Visual Concept

The **CampusTracker Smart Stack™** is the central visual element of CampusTracker Mobile. It consolidates multiple static dashboard widgets into **one dynamic, morphing hero card** that adapts its layout, colors, icons, and primary call-to-action throughout the day based on real-time academic context.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAMPUSTRACKER SMART STACK™                      │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  ⚡ MID-LECTURE MODE (10:15 AM)                         LIVE CARD  │ │
│ │                                                                    │ │
│ │  Data Structures • CS301                      Prof. A. K. Sharma   │ │
│ │  Room 402                                     Remaining: 35 mins   │ │
│ │  [========================-----------------] 45% Completed         │ │
│ │                                                                    │ │
│ │  ┌──────────────────────────────────────────────────────────────┐  │ │
│ │  │ ⚡ MARK ATTENDANCE (SCAN QR CODE)                             │  │ │
│ │  └──────────────────────────────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Temporal & Contextual Mode Design Cards

### 2.1 Morning Mode (06:00 – 08:30)
- **Header**: Sunrise icon + `"Good Morning, Sudhakar"` + Date caption.
- **Main Content**: `"Today: 4 Classes Scheduled"`.
- **Card Fills**: Deep Midnight Indigo with soft Amber morning glow (`rgba(245, 158, 11, 0.12)`).
- **Primary CTA**: `"View Today's Schedule"` pill button.

### 2.2 Pre-Lecture Mode (15–30 mins before class)
- **Header**: Pulsing Sapphire Clock icon + `"Next Class in 18 mins"`.
- **Main Content**:
  - Class Name: **`Data Structures (CS301)`**
  - Location Pin: **`Room 402 (Building B, Floor 4)`**
  - Faculty: **`Prof. A. K. Sharma`**
- **Card Fills**: Sapphire Blue Tint (`rgba(59, 130, 246, 0.15)`).
- **Primary CTA**: `"Campus Navigation / Room Directions"` button.

### 2.3 Mid-Lecture Mode (Active Class Slot) — Signature State
- **Header**: Pulsing Emerald Live Indicator + `"Active Lecture"` + Time progress bar (e.g. 45% elapsed).
- **Main Content**:
  - Class Name & Room: **`Data Structures — Room 402`**
  - Attendance Safety Meter: `"Current Subject Attendance: 82% (Safe)"`
- **Card Fills**: Electric Violet Glass with Emerald accent glow.
- **Primary Hero CTA**: **`⚡ MARK ATTENDANCE (SCAN QR)`** — Large gradient button with glowing camera icon ($54\text{px}$ height).

### 2.4 Post-Lecture Mode (0–45 mins post class)
- **Header**: Green Checkmark Badge + `"Lecture Completed: Data Structures"`.
- **Main Content**: `"Class notes uploaded by Prof. Sharma"` + `"Assignment #3 assigned"`.
- **Card Fills**: Muted Lavender Glass.
- **Primary CTA**: `"Read Lecture Notes"` / `"View Assignment"`.

### 2.5 Afternoon Mode (13:00 – 17:00)
- **Header**: Sun icon + `"Afternoon Summary"`.
- **Main Content**: Remaining classes count + Overall Attendance Gauge ($88\%$).
- **Primary CTA**: `"Attendance Detail Breakdown"`.

### 2.6 Evening Mode (17:00 – 23:00)
- **Header**: Moon icon + `"Evening Study Plan"`.
- **Main Content**: `"Tomorrow: 3 Classes Starting @ 09:00 AM"` + `"2 Assignments Due This Week"`.
- **Primary CTA**: `"Preview Tomorrow's Schedule"`.

### 2.7 Weekend Mode (Saturday – Sunday)
- **Header**: Sparkle Analytics icon + `"Weekly Insights"`.
- **Main Content**: Semester Progress Bar ($65\%$) + Attendance Health Score (`"Excellent — 88% Average"`).
- **Primary CTA**: `"View Semester Progress"`.

### 2.8 Exam Week Mode (Exam Window Active)
- **Header**: Alert Flame icon + `"Next Exam: Database Systems"`.
- **Main Content**: Countdown (`"2 Days, 4 Hours"`), Venue (`"Hall A"`), Syllabus Coverage (`"80% Prepared"`).
- **Card Fills**: Coral Rose Tint (`rgba(239, 68, 68, 0.15)`).
- **Primary CTA**: `"Open Revision Notes"`.

---

## 3. Morphing Card Transitions

When the Smart Stack transitions between modes (e.g., Pre-Lecture to Mid-Lecture):
1. **Container Morphing**: Height and internal layout interpolate smoothly using Reanimated `Layout.springify()`.
2. **Color Glow Cross-Fade**: Background ambient gradient tint cross-fades over $400\text{ms}$.
3. **CTA Button Swap**: Old CTA fades out ($100\text{ms}$), new CTA slides up with bouncy spring.
