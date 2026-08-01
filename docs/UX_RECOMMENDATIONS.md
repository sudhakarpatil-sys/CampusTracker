# CampusTracker Mobile — UX Optimization & Workflow Recommendations

**Document Identifier**: `DOC-AUD-003`  
**Phase**: 4A-3 — Independent Executive Design Review Board Audit  
**Status**: APPROVED  
**Author**: Senior UX Researchers & Product Managers  

---

## 1. Tap-Count & Friction Reduction Analysis

The core mission of CampusTracker Mobile is to streamline everyday student and faculty tasks. Every critical workflow was audited to eliminate unnecessary steps.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KEY WORKFLOW SPEED BENCHMARKS                   │
│                                                                        │
│ • Mark QR Attendance     ──► 1 Tap   |  < 2 Seconds Total Flow        │
│ • Check Skip Margin      ──► 1 Tap   |  Instant Local Calculation     │
│ • Launch Faculty Session ──► 2 Taps  |  < 4 Seconds Total Flow        │
│ • Read Subject Notes     ──► 2 Taps  |  Instant Offline Render        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key UX Workflow Optimizations

### 2.1 1-Tap QR Attendance Scanning
- **Optimized Path**:
  - Path A: Tap center **FAB** button on bottom navigation bar.
  - Path B: Tap **`⚡ MARK ATTENDANCE`** hero button on Smart Stack card during Mid-Lecture mode.
  - Path C: Tap Android Quick Settings Tile **"Scan Attendance"** from phone status bar (bypasses home screen completely).
- **Result**: Camera scanner opens instantly without requiring navigation through multiple sub-menus.

### 2.2 Instant Attendance "Bunk / Skip Calculator"
- **User Problem**: Students frequently wonder *"How many classes can I miss without dropping below 75%?"*
- **UX Solution**: Tapping any subject card in the Attendance screen reveals a clear, non-punitive margin indicator:
  - *"Safe to miss: **2 more lectures**"* (Green badge)
  - *"Must attend: **Next 3 lectures** to reach 75% target"* (Amber warning)

### 2.3 2-Tap Faculty Attendance Session Launch
- **Optimized Path**:
  1. Faculty opens app -> Smart Stack shows current scheduled class (`"Data Structures - 10:00 AM"`).
  2. Tap **`"Start Attendance Session"`** button.
- **Result**: System creates `qr_attendance_sessions` row and displays dynamic 5-second rotating QR presenter in $< 4\text{ seconds}$.

### 2.4 Smart Stack Manual Swipe Mode Preview
- While the Smart Stack updates automatically, users can **swipe horizontally on the Smart Stack card** to preview future temporal modes (e.g. previewing Evening assignments during Afternoon classes).
