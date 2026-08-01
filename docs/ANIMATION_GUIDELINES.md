# CampusTracker Mobile — Motion Design & Animation Specifications

**Document Identifier**: `DOC-DES-005`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Principal React Native Engineer & Motion Designer  

---

## 1. Motion Design Principles

CampusTracker Mobile uses **React Native Reanimated v3** to execute 60/120fps native thread animations. Motion is never purely decorative—it communicates spatial hierarchy, provides tactile feedback, and guides user focus.

---

## 2. Reanimated Spring Physics Presets

```typescript
// Shared Motion Configurations (packages/config/src/animations.ts)
export const SpringPresets = {
  // Bouncy micro-interactions (Buttons, FAB rotate, Badge pops)
  bouncy: {
    damping: 12,
    mass: 0.8,
    stiffness: 140,
    overshootClamping: false,
  },
  
  // Smooth structural motion (Tab indicator slide, Card expansions)
  smooth: {
    damping: 22,
    mass: 1,
    stiffness: 180,
    overshootClamping: false,
  },
  
  // Gentle spatial motion (Bottom sheet snaps, Modal transitions)
  gentle: {
    damping: 30,
    mass: 1.2,
    stiffness: 120,
    overshootClamping: true,
  },
};
```

---

## 3. Screen Transitions & Shared Element Animations

### 3.1 Route Navigation Transitions
- **Stack Push / Pop**: Native OS horizontal slide ($250\text{ms}$ duration with cubic-bezier easing `cubic-bezier(0.25, 1, 0.5, 1)`).
- **Modal Overlays**: Slide up from bottom with $28\text{px}$ top squircle radius transition.
- **Tab Switching**: Fade-through transition ($180\text{ms}$) combined with sliding active pill indicator.

### 3.2 Shared Element Transitions (`Reanimated.SharedTransition`)
- **Attendance Card -> Detail View**: The hero attendance progress ring seamlessly resizes and morphs into the top header of the Attendance Analytics screen.
- **Subject Card -> Subject Detail**: Subject title, color stripe, and professor name expand smoothly into the top banner of the Subject page.

---

## 4. Haptic Feedback Specification (`expo-haptics`)

Haptic feedback is bound directly to user touch events to establish physical tactility:

| Trigger Event | Haptic Type (`Expo Haptics`) | Sensory Purpose |
| :--- | :--- | :--- |
| **Standard Button / Chip Tap** | `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` | Subtle crisp click confirmation. |
| **Tab Bar Selection** | `Haptics.selectionAsync()` | Tactile notch feedback as tab switches. |
| **Assignment Checkbox Complete** | `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)` | Satisfying physical tick. |
| **QR Attendance Scan Success** | `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)` | Double-pulse celebratory vibration. |
| **Error / Failed Scan** | `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)` | Warning triple vibration. |
| **FAB Menu Expansion** | `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)` | Firm spring anchor release. |

---

## 5. Skeleton Shimmer & Loading Animations

- **Implementation**: Linear gradient component translated horizontally across skeleton placeholder cards.
- **Gradient Fills**: `#141923` -> `#222B3D` -> `#141923` (Dark theme).
- **Loop Cycle**: 1200 ms linear loop continuous repeat.
