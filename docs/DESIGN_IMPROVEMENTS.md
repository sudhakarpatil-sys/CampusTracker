# CampusTracker Mobile — Design System Refinements & Enhancements

**Document Identifier**: `DOC-AUD-002`  
**Phase**: 4A-3 — Independent Executive Design Review Board Audit  
**Status**: APPROVED  
**Author**: Executive Design Review Board  

---

## 1. Concrete Design System Modifications

To elevate CampusTracker Mobile from a great design to an industry-defining mobile product, the board specifies the following concrete refinements:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     DESIGN SYSTEM REFINEMENT SUMMARY                   │
│                                                                        │
│ 1. SQUIRCLE STANDARDIZATION  ──► 16px Cards  |  24px Sheets & Modals   │
│ 2. AMBIENT GLOW RESTRAINT    ──► Max 1 Radial Glow per Screen          │
│ 3. UNIFORM ICON STROKES      ──► 1.75px Consistent Vector Stroke       │
│ 4. TYPOGRAPHY LETTER SPACING ──► Tight -0.5px Titles | Clean 0px Body  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Specific Modifications

### 2.1 Squircle Radius Standardization
- **Previous Rule**: Varied between $6\text{px}$, $10\text{px}$, $16\text{px}$, $20\text{px}$, $24\text{px}$, $28\text{px}$.
- **Refined Standard**:
  - **`radius-card` ($16\text{px}$)**: All content cards, subject slots, input fields, and search bars.
  - **`radius-overlay` ($24\text{px}$)**: Bottom sheet overlays, full-screen modals, and Smart Stack hero card.
  - **`radius-pill` (`9999px`)**: Interactive filter chips, status badges, avatars, and FAB.

### 2.2 Ambient Glow Restraint Policy
- **Rule**: No screen may contain more than **ONE active ambient radial glow**.
- **Placement**: Reserved strictly for the Smart Stack hero card (`Mid-Lecture` state) or active attendance scan modal. All secondary list cards use flat surface colors (`#181F2E`) with subtle $1\text{px}$ stroke borders (`rgba(255, 255, 255, 0.08)`).

### 2.3 Typography & Hierarchy Fine-Tuning
- **Display Headings (`32pt` / `24pt`)**: Applied letter-spacing `-0.6px` for a modern tight editorial feel matching Linear.
- **Body Text (`14pt`)**: Neutral `0.0px` letter-spacing with $1.5\times$ line height (`21pt`) for optimal readability.
- **Captions (`12pt`)**: Uppercase metadata labels receive `+0.4px` tracking.

### 2.4 Iconography Uniformity
- All `lucide-react-native` icons are locked to a uniform **$1.75\text{px}$ stroke width**. Thicker $2.0\text{px}$ strokes are reserved strictly for the center floating FAB and primary bottom tab bar active icons.
