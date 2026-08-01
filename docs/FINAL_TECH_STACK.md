# CampusTracker Mobile — Final Approved Technology Stack Matrix

**Document Identifier**: `DOC-MST-006`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Author**: Principal Mobile Architect & DevOps Lead  

---

## 1. Approved Technology Stack Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOCKED MOBILE TECH STACK                        │
│                                                                        │
│ • Framework Engine     ──► Expo Managed Dev Client (React Native 0.76+)│
│ • New Architecture     ──► Fabric Renderer + TurboModules (Bridgeless) │
│ • File Navigation      ──► Expo Router v3+                             │
│ • Client State         ──► Zustand v4                                  │
│ • Server State & Cache ──► TanStack Query v5                           │
│ • Utility Styling      ──► NativeWind v4 (Tailwind CSS v3)             │
│ • Synchronous Storage  ──► MMKV (react-native-mmkv)                    │
│ • Relational DB        ──► Expo SQLite (expo-sqlite)                   │
│ • Hardware Keychain    ──► Expo SecureStore (expo-secure-store)        │
│ • Animation Physics    ──► Reanimated v3 + Gesture Handler v2          │
│ • Monorepo Pipeline    ──► Turborepo (turbo)                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dependency Package Version Table (`apps/mobile/package.json`)

| Package Name | Version | Role in Architecture |
| :--- | :--- | :--- |
| `expo` | `~51.0.0` | Managed framework SDK |
| `react-native` | `0.76.0` | Mobile UI framework (New Architecture enabled) |
| `expo-router` | `~3.5.0` | File-based routing & navigation stack |
| `zustand` | `^4.5.0` | Lightweight atomic client state store |
| `@tanstack/react-query` | `^5.28.0` | Server state management, caching, optimistic UI |
| `@tanstack/react-query-persist-client` | `^5.28.0` | Disk cache persistence wrapper for MMKV |
| `nativewind` | `^4.0.1` | Tailwind CSS compiler for React Native |
| `react-native-mmkv` | `^2.12.0` | High-speed C++ synchronous storage engine |
| `expo-sqlite` | `~14.0.0` | Relational SQLite database engine |
| `expo-secure-store` | `~13.0.0` | Hardware Keychain / Keystore encrypted storage |
| `expo-camera` | `~15.0.0` | Hardware 60fps barcode & QR code scanner |
| `expo-location` | `~17.0.0` | GPS location & geofence distance provider |
| `expo-notifications` | `~0.28.0` | Push token registration & background tasks |
| `expo-local-authentication` | `~14.0.0` | FaceID / TouchID / Android Biometric Prompt |
| `react-native-reanimated` | `~3.10.0` | 60/120fps native thread UI animations |
| `react-native-gesture-handler` | `~2.16.0` | Native gesture tracking |
| `lucide-react-native` | `^0.359.0` | Vector icon library |
| `react-native-svg` | `15.2.0` | Scalable vector graphics renderer |
| `@supabase/supabase-js` | `^2.39.0` | PostgreSQL PostgREST & Auth client SDK |
