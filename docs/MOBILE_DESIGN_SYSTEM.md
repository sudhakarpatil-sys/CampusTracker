# CampusTracker Mobile — Core Design System & Visual Philosophy

**Document Identifier**: `DOC-DES-001`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Principal Product Architect & Lead UI/UX Designer  

---

## 1. Executive Design Vision

CampusTracker Mobile is designed to eliminate the friction, visual clutter, and clinical feel of traditional college management systems (ERPs). Instead of feeling like an administrative form, CampusTracker Mobile feels like a **premium, artisanal productivity companion**—blending the sleek aesthetic of **Linear** and **Vercel**, the atmospheric depth of **Arc Browser**, the fluid tactile motion of **Apple iOS**, and the calm clarity of **Headspace**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DESIGN IDENTITY TRIAD                           │
│                                                                        │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ ATMOSPHERIC DEPTH   │ │ SQUIRCLE GEOMETRY    │ │ TACTILE MOTION   │ │
│ │ Midnight Dark Canvas │ │ Continuous Curvature │ │ Reanimated v3    │ │
│ │ Soft Glassmorphism   │ │ Apple-Style Squircles│ │ Haptic Springs   │ │
│ │ Ambient Glow Tints   │ │ 16px - 28px Radii    │ │ 60/120fps Fluid  │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Visual Principles

### 2.1 Artisanal Midnight Canvas (Dark Theme First)
- **Background Layer**: Pure `#0B0F17` (Deep Obsidian Midnight) instead of flat neutral grey.
- **Card Surface**: High-contrast dark elevated cards (`#141923` to `#1E2536`) with $1\text{px}$ subtle border strokes (`rgba(255, 255, 255, 0.08)`).
- **Ambient Lighting**: Soft radial background glows in Electric Violet (`#8B5CF6`) and Emerald Teal (`#10B981`) that subtly highlight active states and hero cards.

### 2.2 Glassmorphism & Soft Translucency
- **Header & Navigation Bar**: Backdrop blur filters (`backdrop-filter: blur(20px)`) over 75% opacity dark surfaces (`rgba(11, 15, 23, 0.75)`).
- **Hero Progress Cards**: Soft frosted glass cards with gradient fills (e.g. Lavender `#E9D5FF` tint to Purple `#C084FC` with 12% opacity).

### 2.3 Squircle Geometry & Ergonomics
- **Continuous Curvature**: All card corners and container containers utilize Apple-style squircle radii ($16\text{px}$, $20\text{px}$, $24\text{px}$, $28\text{px}$).
- **Thumb Zone Design**: Primary interactive elements (Floating Action Buttons, Quick Scan triggers, Tab bar navigation) are anchored within the bottom 45% of the screen for effortless one-handed smartphone operation.

---

## 3. Visual Depth & Elevation System

CampusTracker Mobile uses a 5-layer depth elevation model:

| Depth Layer | Visual Surface | Token / Color | Usage in UI |
| :--- | :--- | :--- | :--- |
| **Layer 0 (Canvas)** | Background Base | `#0B0F17` | Screen background canvas. |
| **Layer 1 (Card Base)**| Surface Card | `#141923` | Default content cards, timetable slots, note cards. |
| **Layer 2 (Elevated)** | Elevated Surface | `#1E2536` | Active selection cards, search inputs, dropdown containers. |
| **Layer 3 (Glass Over)**| Translucent Glass | `rgba(30, 37, 54, 0.75)` | Sticky header bar, floating bottom navigation bar. |
| **Layer 4 (Overlay)** | Full Modal / Sheet | `#262F45` + Blur overlay | Full screen modal dialogs, QR scanner camera container, bottom sheets. |

---

## 4. Theme Modes: Dark vs Light

### 4.1 V3 Dark Theme (Primary Default)
Designed for low-light classroom environments and battery saving on OLED displays:
- Canvas: `#0B0F17`
- Primary Text: `#F8FAFC` (Slate 50)
- Secondary Text: `#94A3B8` (Slate 400)
- Accent Glow: `#8B5CF6` (Electric Violet)

### 4.2 V3 Light Theme (Optional Day Mode)
Designed for bright outdoor sunlit campus environments:
- Canvas: `#F8FAFC` (Slate 50)
- Surface Card: `#FFFFFF` with $1\text{px}$ stroke (`#E2E8F0`) and soft drop shadow (`0 4px 20px rgba(0,0,0,0.05)`).
- Primary Text: `#0F172A` (Slate 900)
- Secondary Text: `#64748B` (Slate 500)
- Accent Glow: `#7C3AED` (Deep Violet)
