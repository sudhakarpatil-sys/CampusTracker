# CampusTracker Mobile — Final Approved Widget & Live Activity Specifications

**Document Identifier**: `DOC-MST-005`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Author**: Principal Mobile Architect & Native Platform Lead  

---

## 1. Locked Widget System Architecture

The native widget system provides ambient academic intelligence across iOS and Android lock screens, home screens, and system status bars.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOCKED WIDGET SYSTEM MATRIX                     │
│                                                                        │
│ • Primary Widget  ──► Smart Stack Medium (4x2) & Large (4x4) Widget   │
│ • Lock Screen     ──► iOS 16+ WidgetKit Accessory Widgets              │
│ • Live Activities ──► Dynamic Island Banners & Lock Screen Progress    │
│ • Android Quick Tile ─► Status Bar Pulldown "Scan Attendance" Tile     │
│ • Data Pipeline   ──► Pre-Computed 24-Hour Timeline JSON (Shared Container)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Platform Widget Specifications

### 2.1 iOS Home Screen & Lock Screen Widgets (WidgetKit)
- **Smart Stack Medium Widget (`systemMedium` — $4\times2$)**: Dark Midnight card `#141923`, active class name, room number, countdown timer, and interactive **"Scan Attendance"** quick button.
- **Lock Screen Circular Gauge (`accessoryCircular`)**: $88\%$ SVG attendance percentage ring.
- **Lock Screen Rectangular (`accessoryRectangular`)**: `CS301 • Rm 402` | `Starts in 15 mins`.

### 2.2 iOS Live Activities & Dynamic Island (ActivityKit)
- **Trigger**: Automatically activates 15 minutes before scheduled class.
- **Compact View**: Book icon (left) + class countdown timer (right).
- **Expanded View**: Subject title, professor name, live class progress bar (45% completed), and **`⚡ Scan QR`** quick action button.

### 2.3 Android Jetpack Glance & Quick Settings Tile
- **AppWidget Provider**: Jetpack Glance $4\times2$ card surface `#141923` with direct tap action launching `app/modals/qr-scanner.tsx`.
- **Quick Settings Tile ("Scan Attendance")**: Status bar pulldown tile launching camera scanner in $<300\text{ms}$.

---

## 3. Timeline Pre-Generation Engine
- Widgets DO NOT run React Native JS or make background HTTP network requests.
- Main app writes a compressed **24-Hour Timeline JSON** ($< 15\text{ KB}$) to the native shared container (`App Group` on iOS, `SharedPreferences` on Android) whenever the app is opened or a push notification arrives.
- WidgetKit / Glance reads static timeline entries natively with **$< 4\text{ MB}$** memory consumption (well below the $30\text{ MB}$ iOS cap).
