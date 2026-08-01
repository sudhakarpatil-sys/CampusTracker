# CampusTracker Mobile — Technical Stack Architecture & Evaluation

**Document Identifier**: `DOC-MOB-002`  
**Phase**: 4B — Architectural Blueprint  
**Status**: APPROVED  
**Author**: Staff Software Engineer & Mobile Security Lead  

---

## 1. Executive Stack Summary

The CampusTracker Mobile application stack is chosen for maximum performance, minimal maintenance overhead, strong type safety, offline-first capabilities, and seamless integration with the existing Next.js / Supabase backend ecosystem.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                             │
│       React Native 0.76+ (New Architecture)  │  NativeWind v4          │
│       Expo Router v3+ (File-Based Navigation)│  Reanimated v3 / Gesture│
├─────────────────────────────────────────────────────────────────────────┤
│                          APPLICATION STATE                              │
│       Zustand v4 (Client UI State)    │ TanStack Query v5 (Server State)│
│       React Hook Form + Zod           │ MMKV (Synchronous Cache Store) │
├─────────────────────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE & NATIVE BRIDGES                     │
│       Expo Camera (QR Scanning)       │ Expo Location (GPS Geofence)   │
│       Expo SecureStore (Keychain)     │ Expo Notifications (FCM/APNs)  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Recommended Technologies & Deep Rationale

### 2.1 Framework & Runtime: Expo Managed Workflow (Dev Client) + React Native 0.76+

- **Choice**: Expo Managed Workflow with `expo-dev-client` and React Native 0.76+.
- **Rationale**:
  - **New Architecture**: Full support for Fabric Renderer (concurrent UI rendering, zero thread hop overhead for gestures) and TurboModules (lazy-loaded native modules).
  - **Custom Native Code**: `expo-dev-client` allows native C++/Swift/Kotlin code integration without ejecting from the Expo ecosystem.
  - **EAS Build & Updates**: Seamless CI/CD over-the-air (OTA) updates for JS bug fixes while preserving native binary stability.

### 2.2 Navigation: Expo Router v3+

- **Choice**: Expo Router v3+ (built on top of React Navigation v6).
- **Rationale**:
  - **File-Based Routing**: Mirrors the Next.js `app/` directory paradigm used in `apps/web`, creating complete consistency across web and mobile engineering teams.
  - **Typed Routes**: Automatic TypeScript generation for screen params and navigation targets.
  - **Deep Link Unification**: Native deep link mapping (`campustracker://`) shares exact URL paths with web routes (`https://campustracker.app/assignments/123`).

### 2.3 Client State Management: Zustand v4

- **Choice**: Zustand (`zustand/vanilla` + React hooks).
- **Rationale**:
  - **Minimal Footprint**: ~1 KB bundle size vs Redux Toolkit (~15 KB).
  - **Atomic Selectors**: Prevents unnecessary re-renders in heavy UI screens (e.g., live timetable or Smart Stack).
  - **MMKV Integration**: Direct synchronous persistence middleware for storing theme preferences, local UI settings, and offline draft states.

### 2.4 Server State & Caching: TanStack Query v5 (React Query)

- **Choice**: TanStack Query v5 with `@tanstack/react-query-persist-client`.
- **Rationale**:
  - **Declarative Cache**: Automatic background revalidation, stale-while-revalidate, deduplication, and window focus refetching.
  - **Offline Persistence**: Powered by `createAsyncStoragePersister` wrapping MMKV for instant app state hydration when offline.
  - **Optimistic Updates**: Built-in support for rollback on network mutation failure (crucial for marking attendance or submitting assignments offline).

### 2.5 Styling & Design System: NativeWind v4

- **Choice**: NativeWind v4 (Tailwind CSS v3 engine compiled for React Native).
- **Rationale**:
  - **Shared Token System**: Directly imports `tailwind.config.ts` from `packages/config`, sharing identical color variables, typography, and spacing tokens with `apps/web`.
  - **High Performance**: Compiles Tailwind utility classes to native style objects at build time; uses Reanimated under the hood for dynamic theme transitions.

### 2.6 Local Storage Engine: MMKV & Expo SecureStore

- **Choice**: `react-native-mmkv` for high-speed cache + `expo-secure-store` for credentials.
- **Rationale**:
  - **MMKV**: Written in C++, up to **30x faster** than traditional `AsyncStorage`. Reads and writes operate synchronously on the JS thread without async promise overhead.
  - **Expo SecureStore**: Encrypted hardware keychain storage (Keychain on iOS, Keystore with AES-GCM on Android). Used strictly for auth JWT tokens, refresh tokens, biometric keys, and device identity secrets.

### 2.7 Native Hardware Modules

| Module | Native API / Library | Purpose in CampusTracker Mobile |
| :--- | :--- | :--- |
| **QR Scanning** | `expo-camera` | Hardware-accelerated 60fps barcode parsing for teacher dynamic attendance QR codes. |
| **Geofencing / GPS** | `expo-location` | High-accuracy GPS location querying for campus geofence validation during attendance scan. |
| **Notifications** | `expo-notifications` | Push notification token registration (FCM/APNs), background handlers, local scheduled reminders. |
| **Biometrics** | `expo-local-authentication` | FaceID / TouchID / Android Biometric Prompt integration for rapid app unlock. |
| **Animations** | `react-native-reanimated` v3 | 60/120fps UI animations running directly on the native UI thread (Smart Stack cards, sheet modals). |
| **Gestures** | `react-native-gesture-handler` v2 | Native gesture tracking for swipeable timetable lists, drag-to-refresh, and bottom sheets. |
| **Vector Icons/Graphics**| `react-native-svg` + `lucide-react-native` | Pixel-perfect vector icon rendering matching web dashboard icons. |

---

## 3. Technology Comparison & Discarded Alternatives

| Category | Recommended Choice | Evaluated Alternative | Reason for Rejection of Alternative |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo Managed + Dev Client | Bare React Native CLI | Bare CLI requires manual native linking, complex upgrade paths, and lacks EAS OTA update integration. |
| **Navigation** | Expo Router v3 | React Navigation Classic | Boilerplate layout configurations; lacks unified web/mobile URL routing paradigm. |
| **State** | Zustand | Redux Toolkit | Excessive boilerplate, heavy bundle size, complex saga/thunk overhead for mobile use case. |
| **Cache Store** | MMKV | AsyncStorage | AsyncStorage is asynchronous, slow, unencrypted, and deprecated in modern React Native. |
| **Styling** | NativeWind v4 | Styled Components / Emotion | Styled Components introduce significant runtime style calculation overhead on lower-end Android devices. |

---

## 4. Bundle & Performance Impact Budget

- **Target Initial JS Bundle Size**: `< 3.2 MB` (gzipped).
- **Target App Cold Boot Time**: `< 800 ms` on mid-tier Android devices.
- **Target Frame Rate**: Consistent `60 fps` (120 fps on ProMotion displays) for scrolling and gestures.
- **Memory Footprint Budget**: `< 90 MB` RAM in active foreground usage.
