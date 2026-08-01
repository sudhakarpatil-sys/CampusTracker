# CampusTracker Mobile — Micro-Interactions & Tactile Feedback

**Document Identifier**: `DOC-DES-006`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Lead Interaction Designer & Staff Engineer  

---

## 1. Micro-Interaction Principles

Micro-interactions transform static app views into an engaging, responsive experience. Every user interaction in CampusTracker Mobile features clear visual feedback, smooth interpolation, and matching haptic pulses.

---

## 2. Micro-Interaction Catalogue

### 2.1 Attendance Progress Ring Animated Draw
- **Trigger**: Dashboard screen mount or tab focus.
- **Visual Action**:
  - The SVG circle stroke `strokeDashoffset` animates from $100\%$ down to target percentage value (e.g. $88\%$) over $800\text{ms}$ using `withTiming` easing `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Number label interpolates from $0\%$ to $88\%$ simultaneously.

### 2.2 QR Scanner Target Pulse & Success Burst
- **Target Frame Pulse**: Neon violet corner brackets pulse in scale ($1.00 \to 1.04 \to 1.00$) over a $1.5\text{s}$ continuous loop.
- **Success Scan Burst**:
  - Camera view freezes and dims with dark blur overlay.
  - Large green checkmark badge scales up from $0 \to 1.2 \to 1.0$ using `SpringPresets.bouncy`.
  - Success haptic notification triggers (`Success` double pulse).
  - Confetti particle burst expands radially for $600\text{ms}$.

### 2.3 Floating Action Button (FAB) Menu Fan-Out
- **Trigger**: Tap on center gradient FAB button.
- **Visual Action**:
  - Primary FAB `Plus` icon rotates 45 degrees into an `X` cancel icon.
  - 3 Quick Action pills (`Scan QR`, `Add Note`, `Add Assignment`) fan out vertically with staggered $40\text{ms}$ spring delays.
  - Backdrop dims with blur overlay (`rgba(11, 15, 23, 0.60)`).

### 2.4 Tab Bar Active Indicator Slide
- **Visual Action**: The active tab pill indicator slides horizontally behind the newly selected tab icon using `SpringPresets.smooth` ($x$-axis position translation with dynamic width stretching).

### 2.5 Assignment Checkbox Completion
- **Trigger**: Tap empty assignment checkbox.
- **Visual Action**:
  - Checkbox container scales down to $0.85$ then snaps to $1.0$ with Emerald green fill.
  - Checkmark vector draws inside box.
  - Assignment title text receives animated strike-through line and fades to $50\%$ opacity.
  - Medium haptic impact fires.
