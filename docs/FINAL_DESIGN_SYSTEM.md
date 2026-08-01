# CampusTracker Mobile — Final Approved Design System

**Document Identifier**: `DOC-MST-003`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Author**: Lead UI/UX Designer & Product Architect  

---

## 1. Locked Visual Foundations

CampusTracker Mobile's visual design combines an **Artisanal Midnight Canvas**, **Continuous Squircle Geometry**, **Soft Ambient Lighting Fills**, and **Tactile Motion Physics**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOCKED DESIGN SYSTEM TOKENS                     │
│                                                                        │
│ • Primary Canvas      ──► Obsidian Midnight #0B0F17                        │
│ • Elevated Surfaces   ──► Surface-1 #141923  |  Surface-2 #181F2E       │
│ • Brand Accent        ──► Electric Violet #8B5CF6  | Lavender #E9D5FF   │
│ • Locked Radii        ──► Cards: 16px  |  Sheets & Modals: 24px         │
│ • Glow Policy         ──► Max 1 Ambient Radial Glow per Screen          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Color Palette Dictionary

```typescript
// Shared Theme Palette (packages/config/src/colors.ts)
export const Colors = {
  dark: {
    canvas: '#0B0F17',
    surface0: '#111622',
    surface1: '#181F2E',
    surface2: '#222B3D',
    glass: 'rgba(24, 31, 46, 0.75)',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderFocus: '#8B5CF6',
    
    // Brand Accents
    primary: '#8B5CF6',
    primaryLight: '#C084FC',
    lavender: '#E9D5FF',
    
    // Status Accents
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    
    // Text Hierarchy
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },
};
```

---

## 3. Squircle Radius Standards
- **`radius-card` ($16\text{px}$)**: All content cards, subject slots, inputs, search bars.
- **`radius-overlay` ($24\text{px}$)**: Bottom sheet overlays, full-screen modals, and Smart Stack hero card.
- **`radius-pill` (`9999px`)**: Interactive filter chips, status badges, avatars, FAB button.

---

## 4. Typography Scale Matrix

| Size Token | Font Family | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | `Outfit` | `32pt` / `40pt` | Bold (700) | `-0.6px` | Hero percentages, splash logo |
| `h1` | `Outfit` | `24pt` / `32pt` | Bold (700) | `-0.5px` | Screen primary section titles |
| `h2` | `Outfit` | `20pt` / `28pt` | SemiBold (600)| `-0.3px` | Card primary titles, modal headers |
| `body-lg` | `Inter` | `16pt` / `24pt` | Regular (400)| `0.0px` | Primary list items, note text |
| `body-md` | `Inter` | `14pt` / `21pt` | Regular (400)| `0.0px` | Standard body descriptions |
| `caption` | `Inter` | `12pt` / `16pt` | Medium (500) | `+0.2px` | Timestamps, metadata chips |
| `micro` | `Inter` | `10pt` / `12pt` | SemiBold (600)| `+0.4px` | Badge text, status tags |
