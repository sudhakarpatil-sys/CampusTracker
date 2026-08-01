# CampusTracker Mobile — Design Tokens Dictionary

**Document Identifier**: `DOC-DES-002`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Lead UI/UX Designer & Staff Engineer  

---

## 1. Color Palette Tokens

### 1.1 Brand & Accent Colors

```json
{
  "color": {
    "brand": {
      "violet-500": "#8B5CF6",
      "violet-600": "#7C3AED",
      "violet-700": "#6D28D9",
      "lavender-100": "#F3E8FF",
      "lavender-200": "#E9D5FF",
      "lavender-300": "#D8B4FE",
      "emerald-500": "#10B981",
      "emerald-600": "#059669",
      "amber-500": "#F59E0B",
      "rose-500": "#EF4444",
      "sapphire-500": "#3B82F6"
    }
  }
}
```

### 1.2 Dark Theme Neutral Tokens (Midnight Canvas)

| Token Name | Hex Value | RGBA Equivalent | Application |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#0B0F17` | `rgb(11, 15, 23)` | Root screen background canvas |
| `bg-surface-0` | `#111622` | `rgb(17, 22, 34)` | Secondary background panels |
| `bg-surface-1` | `#181F2E` | `rgb(24, 31, 46)` | Primary card background |
| `bg-surface-2` | `#222B3D` | `rgb(34, 43, 61)` | Elevated interactive card surface |
| `bg-glass` | `rgba(24, 31, 46, 0.75)` | — | Translucent floating header & tab bar |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | — | $1\text{px}$ card border stroke |
| `border-focus` | `#8B5CF6` | — | Focused input field border |

---

## 2. Typography Tokens

- **Primary Font Family**: `Inter` (Body, Controls, Numbers, Subtitles)
- **Display Font Family**: `Outfit` or `Poppins` (Hero Headings, Large Percentages)

```json
{
  "typography": {
    "display": { "fontSize": 32, "lineHeight": 40, "fontWeight": "700", "letterSpacing": -0.8 },
    "h1": { "fontSize": 24, "lineHeight": 32, "fontWeight": "700", "letterSpacing": -0.5 },
    "h2": { "fontSize": 20, "lineHeight": 28, "fontWeight": "600", "letterSpacing": -0.3 },
    "h3": { "fontSize": 18, "lineHeight": 24, "fontWeight": "600", "letterSpacing": -0.2 },
    "body-large": { "fontSize": 16, "lineHeight": 24, "fontWeight": "400", "letterSpacing": 0 },
    "body-medium": { "fontSize": 14, "lineHeight": 20, "fontWeight": "400", "letterSpacing": 0 },
    "caption": { "fontSize": 12, "lineHeight": 16, "fontWeight": "500", "letterSpacing": 0.2 },
    "micro": { "fontSize": 10, "lineHeight": 12, "fontWeight": "600", "letterSpacing": 0.4 }
  }
}
```

---

## 3. Spacing & Spatial Grid Tokens ($4\text{px}$ Base System)

```json
{
  "spacing": {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64
  }
}
```

- **Screen Padding Horizontal**: `spacing-4` ($16\text{px}$) on compact mobile; `spacing-6` ($24\text{px}$) on large mobile.
- **Card Internal Padding**: `spacing-4` ($16\text{px}$) or `spacing-5` ($20\text{px}$).
- **Item Gap Vertical**: `spacing-3` ($12\text{px}$) between list cards.

---

## 4. Corner Radius Tokens (Squircle Geometry)

| Radius Token | Value | Applied UI Elements |
| :--- | :--- | :--- |
| `radius-xs` | $6\text{px}$ | Status indicator badges, micro tags |
| `radius-sm` | $10\text{px}$ | Buttons, input fields, search bars |
| `radius-md` | $16\text{px}$ | Subject cards, assignment cards, note cards |
| `radius-lg` | $20\text{px}$ | Attendance progress hero cards, Smart Stack widget |
| `radius-xl` | $28\text{px}$ | Bottom sheet overlays, full-screen modals |
| `radius-full` | `9999px` | Circular avatars, rounded filter pills, FAB |

---

## 5. Gradient & Glow Tokens

- **Hero Violet Gradient**: `linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)`
- **Lavender Glass Gradient**: `linear-gradient(135deg, rgba(233, 213, 255, 0.15) 0%, rgba(192, 132, 252, 0.05) 100%)`
- **Emerald Present Glow**: `radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)`
- **Amber Warning Glow**: `radial-gradient(circle, rgba(245, 158, 11, 0.20) 0%, transparent 70%)`
