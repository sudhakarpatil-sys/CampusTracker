# CampusTracker Mobile — Final Approved Component Library

**Document Identifier**: `DOC-MST-004`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Author**: Lead UI Engineer & Staff Architect  

---

## 1. Locked Component Specifications

All UI components are specified for production reuse across `apps/mobile/src/presentation/components/`.

---

## 2. Core UI Components

### 2.1 `<AttendanceHeroCard />`
- **Visual Design**: Inspired by `[IMAGE_1]` top hero card.
- **Surface**: Soft Lavender Glass gradient (`rgba(233, 213, 255, 0.15)` to `rgba(192, 132, 252, 0.05)`), $24\text{px}$ squircle radius (`radius-overlay`), $1\text{px}$ subtle border stroke (`rgba(255, 255, 255, 0.15)`).
- **Left Side**: Calendar icon pill + `"Attendance"` title + `"This Month"` caption + **`88%`** Display Font value + `"You're doing great!"` subtitle + stat chips (`Presents: 22`, `Total: 25`, `Absences: 3`).
- **Right Side**: SVG Radial Progress Ring ($84\times84\text{px}$) with Electric Violet active arc and centered percentage.

---

### 2.2 `<LectureTimelineCard />`
- **Surface**: Elevated card `#181F2E`, $16\text{px}$ squircle radius (`radius-card`).
- **Left Stripe**: $4\text{px}$ vertical color bar indicating subject color tint.
- **Top Row**: Time stamp (e.g. `09:00 AM`) + Status Pill (`Ongoing` emerald pulse badge, `Upcoming` sapphire pill, `Completed` slate pill).
- **Body**: Class Title (`"Data Structures"`), Professor (`"Prof. A. K. Sharma"`), Location (`"Room 402"`).
- **Action**: Right-aligned `"View Details >"` pill button.

---

### 2.3 `<AssignmentCard />`
- **Surface**: Card `#181F2E`, $16\text{px}$ radius.
- **Left Icon**: Clipboard icon in soft green/sage glass pill container.
- **Body**: Assignment Title (`"DBMS Mini Project"`), Due Date (`"Due Tomorrow, 11:59 PM"`).
- **Badges**: Priority tag (`High` [Rose], `Medium` [Amber], `Low` [Sapphire]) + Interactive completion checkbox.

---

### 2.4 `<FAB />` (Floating Action Button)
- **Position**: Anchored in center of floating bottom tab bar ($56\times56\text{px}$ gradient circle).
- **Fill**: Gradient Violet (`#8B5CF6` to `#C084FC`) with ambient drop shadow (`0 8px 24px rgba(139, 92, 246, 0.45)`).
- **Interaction**: Tap rotates `Plus` icon 45 degrees into `X` cancel icon and fans out 3 quick action buttons (`Scan QR`, `Add Note`, `Add Assignment`).

---

### 2.5 `<BottomSheetModal />`
- **Container**: `@gorhom/bottom-sheet` with $24\text{px}$ top squircle radius, translucent surface `#1E2536`, top drag handle, and backdrop dim blur overlay (`rgba(11, 15, 23, 0.65)`).

---

### 2.6 State Placeholders
- **Empty State**: Vector outline graphic + headline + descriptive text + primary CTA button.
- **Loading State**: Centered dual-ring SVG spinner in Electric Violet with smooth 360-degree rotation.
- **Error State**: Coral warning graphic + failure description + `"Try Again"` primary button.
