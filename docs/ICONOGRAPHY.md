# CampusTracker Mobile — Iconography System Specifications

**Document Identifier**: `DOC-DES-009`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Lead Graphic & Product Designer  

---

## 1. Icon Library & Consistency Standard

CampusTracker Mobile utilizes **`lucide-react-native`** vector icons as its foundational iconography set, supplemented by custom SVG brand emblems.

---

## 2. Icon Specifications

### 2.1 Stroke Weight & Sizing Scale

| Size Token | Pixel Size | Stroke Weight | Applied Context |
| :--- | :--- | :--- | :--- |
| `icon-xs` | $14\times14\text{px}$ | $1.5\text{px}$ | Caption metadata, small status chips |
| `icon-sm` | $16\times16\text{px}$ | $1.75\text{px}$ | Input prefix icons, list item metadata |
| `icon-md` | $20\times20\text{px}$ | $1.75\text{px}$ | Form fields, button prefixes, navigation tab icons |
| `icon-lg` | $24\times24\text{px}$ | $2.0\text{px}$ | Top app bar action buttons, FAB icon |
| `icon-xl` | $32\times32\text{px}$ | $2.0\text{px}$ | Hero attendance cards, empty state graphic heads |

### 2.2 Icon Pill Containers
- Icons are frequently embedded inside **squircle pill containers**:
  - Size: $40\times40\text{px}$ or $44\times44\text{px}$.
  - Background: $15\%$ opacity tint matching icon color (e.g. Lavender `#F3E8FF` tint for Violet icon).
  - Radius: $12\text{px}$ squircle.

### 2.3 Key Icon Mapping

| Feature Domain | Lucide Icon Symbol | Tint Color |
| :--- | :--- | :--- |
| **QR Scan Attendance** | `QrCode` / `Camera` | Electric Violet (`#8B5CF6`) |
| **Timetable / Schedule** | `Calendar` / `Clock` | Sapphire Blue (`#3B82F6`) |
| **Attendance Status** | `CheckCircle2` / `XCircle` | Emerald Green (`#10B981`) / Rose (`#EF4444`) |
| **Assignments** | `FileText` / `ClipboardList` | Amber Yellow (`#F59E0B`) |
| **Notes** | `BookOpen` / `Edit3` | Soft Violet (`#A855F7`) |
| **Announcements** | `Megaphone` / `Bell` | Coral Orange (`#F97316`) |
| **Profile & Settings** | `User` / `Settings` | Slate Neutral (`#94A3B8`) |
