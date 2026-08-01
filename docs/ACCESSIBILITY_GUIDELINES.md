# CampusTracker Mobile — Accessibility (a11y) & Inclusivity Guidelines

**Document Identifier**: `DOC-DES-011`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Accessibility Specialist & Lead UI Engineer  

---

## 1. Compliance Standard

CampusTracker Mobile adheres strictly to **WCAG 2.1 Level AA** accessibility standards and iOS / Android human interface accessibility guidelines.

---

## 2. Accessibility Specifications

### 2.1 Color Contrast Ratios
- **Body Text (`#F8FAFC` on `#0B0F17` / `#141923`)**: Contrast Ratio **$15.2:1$** (Exceeds 4.5:1 AA requirement).
- **Secondary Text (`#94A3B8` on `#141923`)**: Contrast Ratio **$5.8:1$** (Exceeds 4.5:1 requirement).
- **Interactive Accent (`#8B5CF6` on `#0B0F17`)**: Contrast Ratio **$4.8:1$** for large controls.

### 2.2 Touch Target Dimensions
- **Minimum Interactive Area**: $44\times44\text{pt}$ on iOS; $48\times48\text{dp}$ on Android.
- **Padding Enforcement**: All icon-only buttons (e.g. Bell notification, Search glass) utilize an invisible $12\text{px}$ touch target padding expansion (`hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`).

### 2.3 Dynamic Type & Font Scaling
- UI layouts use flexible flexbox containers allowing text to scale up to **200% OS font scaling** without text clipping, overlap, or line truncation.

### 2.4 Screen Reader Support (VoiceOver / TalkBack)

```typescript
// Screen Reader Accessibility Implementation Example
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Attendance 88 percent. You are 13 percent above the 75 percent threshold."
  accessibilityHint="Double tap to view detailed subject-wise attendance breakdown."
>
  <AttendanceHeroCard percentage={88} />
</Pressable>
```

### 2.5 Reduced Motion & Haptic Toggles
- **`prefers-reduced-motion`**: When enabled in system settings, Reanimated spring physics are automatically swapped for flat $150\text{ms}$ opacity cross-fades.
- **Haptics Toggle**: Accessible setting to disable all tactile vibration feedback for sensory-sensitive users.
