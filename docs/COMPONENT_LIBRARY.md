# CampusTracker Mobile — UI Component Library Specifications

**Document Identifier**: `DOC-DES-003`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Principal UI Engineer & Lead Product Architect  

---

## 1. Core Component Catalogue

CampusTracker Mobile's component library provides standardized, reusable UI primitives built on top of `DESIGN_TOKENS.md`.

---

## 2. Component Specifications

### 2.1 Attendance Radial Progress Card (`<AttendanceHeroCard />`)
- **Visual Reference**: Inspired by `[IMAGE_1]` top hero card.
- **Background**: Soft Lavender Glass gradient (`rgba(233, 213, 255, 0.15)` to `rgba(192, 132, 252, 0.05)`), $20\text{px}$ squircle radius (`radius-lg`), $1\text{px}$ subtle border (`rgba(255, 255, 255, 0.15)`).
- **Left Column**:
  - Header: Calendar icon pill + `"Attendance"` title + `"This Month"` caption.
  - Value: **`88%`** (Large Display Font 32pt, `#F8FAFC`).
  - Subtitle: `"You're doing great!"` (Emerald green `#10B981` or Violet `#8B5CF6`).
  - Stat Chips: 3 rounded rectangular pills: `Presents: 22`, `Total Classes: 25`, `Absences: 3`.
- **Right Column**: SVG Radial Progress Ring ($84\times84\text{px}$) with Electric Violet active arc, `#88%` bold percentage centered inside ring.
- **Action**: Tap triggers transition to Attendance Detail screen.

---

### 2.2 Lecture Timeline Card (`<LectureTimelineCard />`)
- **Visual Reference**: Inspired by `[IMAGE_0]` & `[IMAGE_1]` class timeline cards.
- **Background**: Elevated card `#181F2E`, $16\text{px}$ radius (`radius-md`).
- **Left Stripe**: $4\text{px}$ vertical color bar indicating subject color tint.
- **Top Row**: Time stamp (e.g. `09:00 AM`) + Status Pill:
  - `Ongoing`: Emerald badge with subtle pulse dot (`#10B981`).
  - `Upcoming`: Slate blue pill (`#3B82F6`).
  - `Completed`: Muted slate pill (`#64748B`).
- **Body**: Class Title (e.g., `"Data Structures"`), Faculty Name (`"Prof. A. K. Sharma"`), Location Pin icon + `"Room 402"`.
- **Action**: Includes right-aligned `"View Details >"` pill button.

---

### 2.3 Assignment Priority Card (`<AssignmentCard />`)
- **Visual Reference**: Inspired by `[IMAGE_0]` Assignments list.
- **Background**: Surface `#181F2E`, $16\text{px}$ radius.
- **Left Icon**: Clipboard icon in soft green/sage glass pill container.
- **Title**: Assignment Name (e.g., `"DBMS Mini Project"`).
- **Due Date**: `"Due Tomorrow, 11:59 PM"` with clock icon.
- **Priority Badge**:
  - `High`: Rose pill (`#EF4444` background 15%, text `#F87171`).
  - `Medium`: Amber pill (`#F59E0B` background 15%, text `#FBBF24`).
  - `Low`: Sapphire pill (`#3B82F6` background 15%, text `#60A5FA`).
- **Status Pill**: `"Due Soon"`, `"Submitted"`, or `"Graded"`.

---

### 2.4 Notes Card (`<NoteCard />`)
- **Background**: Surface `#181F2E`, $16\text{px}$ radius.
- **Header**: Subject tag pill (e.g. `"Data Structures"`), document icon, attachment count chip (`"3 PDFs"`).
- **Title**: Note Title (e.g., `"Linked List Complete Reference"`).
- **Body Snippet**: 2-line truncated preview of markdown body text.
- **Footer**: Timestamp (`"Updated 2h ago"`).

---

### 2.5 Floating Action Button (`<FAB />`)
- **Visual Reference**: `[IMAGE_1]` center bottom tab navigation bar.
- **Dimensions**: $56\times56\text{px}$ circle anchored in center of bottom tab bar.
- **Background**: Gradient Violet fill (`linear-gradient(135deg, #8B5CF6, #C084FC)`) with soft ambient drop glow shadow (`0 8px 24px rgba(139, 92, 246, 0.45)`).
- **Icon**: White `Plus` icon ($24\times24\text{px}$).
- **Micro-Interaction**: Tap triggers 45-degree rotation into an 'X' icon while expanding quick action sheet (Quick Scan QR, Add Note, Add Assignment).

---

### 2.6 Status Badges & Chips

| Badge Type | Background Fill | Text Color | Icon / Indicator |
| :--- | :--- | :--- | :--- |
| `Ongoing` | `rgba(16, 185, 129, 0.15)` | `#10B981` | Pulsing Emerald Circle |
| `Upcoming` | `rgba(59, 130, 246, 0.15)` | `#3B82F6` | Solid Sapphire Circle |
| `Present` | `rgba(16, 185, 129, 0.20)` | `#34D399` | Checkmark Icon |
| `Absent` | `rgba(239, 68, 68, 0.20)` | `#F87171` | Cross Icon |
| `Cancelled` | `rgba(100, 116, 139, 0.20)` | `#94A3B8` | Minus Icon |
| `Due Soon` | `rgba(245, 158, 11, 0.20)` | `#FBBF24` | Alert Clock Icon |

---

### 2.7 State Illustrations (Empty, Loading, Error)

- **Empty State**: Vector outline illustration with soft violet gradient backdrop + bold headline (`"No Notes Yet"`) + descriptive subtitle + primary action button (`"+ Create Note"`).
- **Loading State**: Centered dual-ring SVG spinner in Electric Violet with smooth 360-degree rotation + skeleton shimmer placeholders for cards.
- **Error State**: Soft coral alert illustration + warning headline (`"Something Went Wrong"`) + descriptive failure message + secondary pill button (`"Try Again"`).
