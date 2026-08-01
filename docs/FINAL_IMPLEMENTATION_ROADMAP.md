# CampusTracker Mobile — Final Phase 4B Implementation Roadmap

**Document Identifier**: `DOC-MST-007`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Author**: Principal Mobile Architect & DevOps Lead  

---

## 1. Phase 4B Milestone Execution Pipeline

Phase 4B implementation is executed across **6 sequential milestones**. Each milestone contains explicit features, testing checklists, and strict exit criteria.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PHASE 4B MILESTONE TIMELINE (13 WEEKS)               │
│                                                                        │
│ M1: Monorepo & Packages setup           ──► 2.0 Weeks                  │
│ M2: Auth, Biometrics & Secure Store     ──► 1.5 Weeks                  │
│ M3: Core Features & Offline SQLite DB   ──► 3.0 Weeks                  │
│ M4: Smart Stack Engine & Widgets        ──► 2.5 Weeks                  │
│ M5: Smart QR Attendance & Edge Functions──► 2.0 Weeks                  │
│ M6: Notifications, E2E & EAS Release    ──► 2.0 Weeks                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Milestone Deep-Dives & Exit Criteria

### Milestone 1: Monorepo Foundation & Core Packages Setup
- **Objective**: Establish monorepo structure (`apps/mobile`, `packages/*`), build pipelines via Turborepo, and link shared TypeScript libraries.
- **Features Included**: Monorepo root setup, Turborepo configuration (`turbo.json`), `apps/mobile` Expo SDK 51+ initialization, NativeWind v4 design token linking, shared API & Zod package links.
- **Dependencies**: Monorepo root `package.json`, `packages/config`.
- **Expected Deliverables**: Configured monorepo tree, build scripts, Expo development configuration (`app.json`, `eas.json`).
- **Testing Checklist**:
  - [ ] `npm run check-types` passes across all monorepo packages.
  - [ ] `apps/mobile` boots in Expo Dev Client on iOS Simulator and Android Emulator.
- **Exit Criteria**: `apps/mobile` compiles cleanly without TypeScript errors and imports shared design tokens from `packages/config`.

---

### Milestone 2: Auth System, Biometrics & Secure Storage
- **Objective**: Implement multi-role authentication, Google Native OAuth, local biometrics, and hardware keychain JWT storage.
- **Features Included**: Login/Register screens, Onboarding wizard, Google OAuth token exchange, `Expo SecureStore` manager, `Expo LocalAuthentication` biometric prompt, `useProtectedRoute` role guard.
- **Dependencies**: Milestone 1, Supabase Auth service.
- **Expected Deliverables**: `app/(auth)` route stack, `useAuthStore`, auth repository, SecureStore wrapper.
- **Testing Checklist**:
  - [ ] Student and Faculty login succeed with correct role tab routing.
  - [ ] Refresh token auto-rotates on 401 Unauthorized response.
  - [ ] Biometric unlock authenticates session when app is backgrounded > 5 mins.
- **Exit Criteria**: Auth session tokens persist securely in `Expo SecureStore` and auto-login succeeds on cold boot.

---

### Milestone 3: Core Academic Features & Offline SQLite Engine
- **Objective**: Build daily academic screens (Timetable, Attendance, Assignments, Notes) backed by offline TanStack Query + Expo SQLite storage.
- **Features Included**: Timetable grid, Subject attendance breakdown, Assignment tracker, Notes markdown reader & editor, Expo SQLite schema migrations, MMKV persister.
- **Dependencies**: Milestone 2, `packages/api` repositories.
- **Expected Deliverables**: `app/(app)/(tabs)` screens, SQLite database schema sync, offline mutation queue with DLQ manager.
- **Testing Checklist**:
  - [ ] Timetable schedule loads offline when airplane mode is activated.
  - [ ] Offline note drafts are queued in MMKV and auto-synced on network restoration.
- **Exit Criteria**: 100% of academic read features operate offline without network errors.

---

### Milestone 4: Smart Stack Engine & Native Widget Bridges
- **Objective**: Build the dynamic context evaluation engine and construct iOS WidgetKit / Android Jetpack Glance widgets.
- **Features Included**: Smart Stack context state machine (8 modes), iOS WidgetKit extension plugin, Android Glance AppWidget plugin, Live Activities / Dynamic Island trigger, Android Quick Settings Tile.
- **Dependencies**: Milestone 3, Expo Config Plugins.
- **Expected Deliverables**: `domain/smart-stack` evaluator engine, native widget plugins, 24-hour timeline generator.
- **Testing Checklist**:
  - [ ] Smart Stack transitions smoothly to Mid-Lecture mode at class start time.
  - [ ] Android Quick Settings Tile launches QR Scanner modal in $< 300\text{ms}$.
  - [ ] Widget RAM memory footprint measures $< 4\text{ MB}$ (well below $30\text{ MB}$ iOS cap).
- **Exit Criteria**: Smart Stack card morphs correctly across all 8 temporal modes and native widgets render static pre-computed timeline entries natively.

---

### Milestone 5: Smart Dynamic QR Attendance & Edge Functions
- **Objective**: Deploy dynamic rotating QR session generator for faculty and multi-factor QR scan verification for students.
- **Features Included**: Faculty active session generator, 5-second dynamic TOTP QR presenter, student Expo Camera scanner modal, Supabase Edge Function `verify-qr-attendance`, GPS geofence validator, Wi-Fi BSSID hash checker, device hardware fingerprint validator.
- **Dependencies**: Milestone 2, Milestone 3, Migration `0012_mobile_qr_attendance.sql`.
- **Expected Deliverables**: `app/(faculty)` route stack, `verify-qr-attendance` Edge Function, `modals/qr-scanner.tsx`.
- **Testing Checklist**:
  - [ ] QR code payload older than 15 seconds is rejected with `QR_SESSION_EXPIRED`.
  - [ ] Student outside campus geofence radius receives `GEOFENCE_OUT_OF_RANGE` warning unless valid Wi-Fi BSSID hash is present.
  - [ ] Attempting to scan for 2 different student accounts on the same phone flags low confidence.
- **Exit Criteria**: End-to-end QR scan flow marks attendance in `attendance_records` within $< 2\text{ seconds}$ with verified confidence score.

---

### Milestone 6: Push Notifications, E2E Testing & Release Hardening
- **Objective**: Integrate push notification delivery, execute automated Maestro E2E test suites, and compile production app store release builds.
- **Features Included**: Expo Notifications push token setup, background notification handlers, Maestro E2E automated test suite, Sentry error monitoring, EAS production build pipelines.
- **Dependencies**: Milestones 1–5, Apple Developer & Google Play accounts.
- **Expected Deliverables**: Push notification service, Maestro E2E test scripts, production app store release binaries.
- **Testing Checklist**:
  - [ ] Maestro E2E suite passes 100% of automated user journeys.
  - [ ] Push notifications deliver assignment reminders and class alerts.
  - [ ] EAS production builds compile cleanly for iOS (IPA) and Android (AAB).
- **Exit Criteria**: App passes all production readiness checks and receives final deployment sign-off.
