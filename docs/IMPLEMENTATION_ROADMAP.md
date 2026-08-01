# CampusTracker Mobile — Milestone-Based Implementation Roadmap

**Document Identifier**: `DOC-MOB-010`  
**Phase**: 4B — Architectural Blueprint  
**Status**: APPROVED  
**Author**: Principal Mobile Architect & DevOps Lead  

---

## 1. Implementation Roadmap Executive Matrix

The implementation of CampusTracker Mobile is structured into **6 sequential, milestone-driven sprints**. Each milestone includes clear objectives, deliverables, complexity ratings, time estimates, and automated/manual testing checklists.

```
┌────────────────────────────────────────────────────────────────────────┐
│ M1: Monorepo Foundation & Workspace Packages (2 Weeks)                 │
├────────────────────────────────────────────────────────────────────────┤
│ M2: Auth System, Biometrics & Secure Store (1.5 Weeks)                 │
├────────────────────────────────────────────────────────────────────────┤
│ M3: Core Features & Offline SQLite Engine (3 Weeks)                    │
├────────────────────────────────────────────────────────────────────────┤
│ M4: Smart Stack Engine & Native Widget Bridges (2.5 Weeks)             │
├────────────────────────────────────────────────────────────────────────┤
│ M5: Smart QR Attendance & Edge Functions (2 Weeks)                     │
├────────────────────────────────────────────────────────────────────────┤
│ M6: Push Notifications, E2E Testing & Release Hardening (2 Weeks)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Milestone Deep-Dives

### Milestone 1: Monorepo Foundation & Workspace Setup
- **Objective**: Establish monorepo workspace structure (`apps/mobile`, `packages/*`), build configuration pipelines, and set up shared TypeScript dependencies.
- **Features Included**: Monorepo root configuration, Expo Dev Client initialization, NativeWind design system tokens integration, shared API & type packages linking.
- **Dependencies**: Root `package.json`, pnpm/npm workspaces setup, existing `packages/config`.
- **Estimated Complexity**: Medium.
- **Estimated Development Time**: 2 Weeks (10 Dev Days).
- **Testing Checklist**:
  - [ ] `npm run build` succeeds across all workspace packages without type errors.
  - [ ] `apps/mobile` boots successfully in Expo Dev Client on iOS Simulator and Android Emulator.
  - [ ] Shared Zod schemas in `packages/shared` validate correctly in both web and mobile modules.
- **Deliverables**: Configured monorepo tree, build scripts, Expo development configuration (`app.json`, `eas.json`).

---

### Milestone 2: Authentication, Biometrics & Secure Storage
- **Objective**: Implement secure authentication flow, Google Native OAuth, local biometrics, and hardware-backed JWT storage.
- **Features Included**: Login/Register screens, Onboarding wizard, Google OAuth token exchange, `Expo SecureStore` token manager, `Expo LocalAuthentication` biometric prompt, Auth protection hook (`useProtectedRoute`).
- **Dependencies**: Milestone 1, Supabase Auth service, Google Cloud Console OAuth credentials.
- **Estimated Complexity**: High.
- **Estimated Development Time**: 1.5 Weeks (8 Dev Days).
- **Testing Checklist**:
  - [ ] Student and Faculty login succeed with correct role routing.
  - [ ] Refresh token auto-rotates seamlessly on 401 response.
  - [ ] Biometric unlock unlocks app state when backgrounded for over 5 minutes.
  - [ ] Token storage in `Expo SecureStore` is verified hardware-encrypted.
- **Deliverables**: `(auth)` route stack, `useAuthStore`, `auth-repository`, SecureStore integration wrapper.

---

### Milestone 3: Core Academic Features & Offline SQLite Engine
- **Objective**: Deliver daily academic screens (Timetable, Attendance, Assignments, Notes) backed by offline TanStack Query + Expo SQLite storage.
- **Features Included**: Timetable week grid, Subject attendance progress breakdown, Assignment submission tracker, Notes reader & markdown editor, Expo SQLite schema sync, MMKV persister.
- **Dependencies**: Milestone 2, `packages/api` repositories.
- **Estimated Complexity**: Very High.
- **Estimated Development Time**: 3 Weeks (15 Dev Days).
- **Testing Checklist**:
  - [ ] Timetable displays schedule offline when airplane mode is activated.
  - [ ] Notes created offline are queued in MMKV and synced automatically on reconnection.
  - [ ] Attendance calculations accurately match web dashboard metrics.
- **Deliverables**: `(app)/(tabs)` screens, `Expo SQLite` database migrations, offline queue manager.

---

### Milestone 4: Smart Stack Engine & Native Widget Bridges
- **Objective**: Implement the dynamic context evaluation engine and build iOS WidgetKit / Android Jetpack Glance native widgets.
- **Features Included**: Smart Stack context state machine (8 modes), iOS WidgetKit extension plugin, Android Glance AppWidget plugin, Live Activities / Dynamic Island trigger, Android Quick Settings Tile.
- **Dependencies**: Milestone 3, Expo Config Plugins (`plugins/with-ios-widgets`, `plugins/with-android-widgets`).
- **Estimated Complexity**: Very High.
- **Estimated Development Time**: 2.5 Weeks (13 Dev Days).
- **Testing Checklist**:
  - [ ] Smart Stack transitions smoothly from Pre-Lecture to Mid-Lecture mode at exact class time.
  - [ ] iOS Home Screen widget updates timeline without background crash or excessive battery draw.
  - [ ] Android Quick Settings Tile launches QR Scanner modal directly from lock/status bar.
- **Deliverables**: `domain/smart-stack` evaluator, native widget plugins, timeline generator.

---

### Milestone 5: Smart QR Attendance & Edge Functions
- **Objective**: Deploy dynamic rotating QR session generation for faculty and multi-factor QR scan verification for students.
- **Features Included**: Faculty active session generator, 5-second dynamic TOTP QR presenter, student Expo Camera scanner modal, Supabase Edge Function `verify-qr-attendance`, GPS geofence validator, device hardware fingerprint check.
- **Dependencies**: Milestone 2, Milestone 3, Migration `0012_mobile_qr_attendance.sql`.
- **Estimated Complexity**: High.
- **Estimated Development Time**: 2 Weeks (10 Dev Days).
- **Testing Checklist**:
  - [ ] Scanned QR code older than 15 seconds is rejected with `QR_SESSION_EXPIRED`.
  - [ ] Student outside 30m campus radius receives `GEOFENCE_OUT_OF_RANGE` warning.
  - [ ] Attempting to scan for 2 different students on the same physical phone flags low confidence.
- **Deliverables**: `(faculty)` route stack, `verify-qr-attendance` Edge Function, `modals/qr-scanner.tsx`.

---

### Milestone 6: Push Notifications, E2E Testing & Release Hardening
- **Objective**: Integrate push notification delivery, execute comprehensive automated E2E tests, and prepare production app store builds.
- **Features Included**: Expo Notifications token registration, background notification payload handler, Detox / Maestro E2E test suites, Sentry crash reporting, EAS production build configuration.
- **Dependencies**: Milestones 1–5, Apple Developer Account, Google Play Console Account.
- **Estimated Complexity**: Medium.
- **Estimated Development Time**: 2 Weeks (10 Dev Days).
- **Testing Checklist**:
  - [ ] Maestro E2E automated test suite passes 100% of user journeys (Login -> View Schedule -> Scan QR -> Review Notes).
  - [ ] Push notifications deliver successfully for assignment reminders and attendance warnings.
  - [ ] App Store and Google Play store release builds compile cleanly via EAS Build.
- **Deliverables**: Push notification handlers, E2E test scripts, production store submission artifacts.
