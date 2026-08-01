# CampusTracker Mobile — Native Widget & Live Activity UI Specifications

**Document Identifier**: `DOC-DES-008`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Lead Mobile Designer & iOS/Android Specialist  

---

## 1. Native Widget System Overview

CampusTracker Mobile provides native widgets for **iOS (WidgetKit & ActivityKit)** and **Android (Jetpack Glance & AppWidgetProvider)**. The **Smart Stack Widget** is recommended as the primary default widget, rendering identical contextual intelligence directly on the home screen.

---

## 2. iOS Home Screen Widget Specifications

### 2.1 Smart Stack Medium Widget (`systemMedium` — $4\times2$)
- **Visual Design**: Dark Midnight card (`#141923`) with $20\text{px}$ squircle radius.
- **Left Side**: Electric Violet icon + Active Mode Tag (e.g. `"MID-LECTURE"`), Class Title (`"Data Structures"`), Room Number (`"Rm 402"`).
- **Right Side**: Countdown timer (`"35m left"`) + **"Scan Attendance"** interactive quick button.

### 2.2 Standalone Specialized Widgets (Optional)
- **Attendance Gauge Small Widget (`systemSmall` — $2\times2$)**: $88\%$ SVG radial attendance ring + `"Attendance Safe"` label.
- **Timetable Strip Medium Widget (`systemMedium` — $4\times2$)**: Horizontal 3-class timeline preview.

---

## 3. iOS Lock Screen & Live Activity Specifications

### 3.1 Lock Screen Widgets (iOS 16+)
- **`accessoryCircular`**: Circular attendance ring gauge showing current overall percentage ($88\%$).
- **`accessoryRectangular`**: 2-line layout: Line 1: `CS301 • Rm 402`; Line 2: `Starts in 15 mins`.
- **`accessoryInline`**: Single text line: `"Next: Data Structures in Rm 402 @ 09:00 AM"`.

### 3.2 Dynamic Island & Live Activities (ActivityKit)
- **Dynamic Island Compact View**:
  - Left: Book icon in violet circle.
  - Right: Class countdown timer (`"12m"`).
- **Dynamic Island Expanded View**:
  - Top: Subject Code & Faculty Name.
  - Middle: Live class progress bar (45% completed).
  - Right CTA Button: **"⚡ Scan QR"**.
- **Lock Screen Live Activity Banner**: Translucent dark card with live progress bar and class location details.

---

## 4. Android Widget & Quick Settings Tile Specifications

### 4.1 Android Jetpack Glance Widget ($4\times2$)
- Dark squircle surface `#141923`, white text `#F8FAFC`, violet CTA button `#8B5CF6`.
- Direct Jetpack Glance `ActionCallback` launches `app/modals/qr-scanner.tsx` on tap.

### 4.2 Android Quick Settings Tile ("Scan Attendance")
- **Icon**: Camera QR scanner emblem.
- **Label**: `"Scan Attendance"`.
- **Behavior**: Tapping tile from Android top status bar immediately launches camera scanner overlay in $<300\text{ms}$.
