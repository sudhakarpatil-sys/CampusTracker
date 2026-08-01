# CampusTracker Mobile — Engineering Implementation Handbook

**Document Identifier**: `DOC-MST-002`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Author**: Staff Software Engineer & Mobile Architect  

---

## 1. Development Sequence & Environment Setup Order

To ensure a deterministic, error-free implementation during Phase 4B, engineers MUST execute implementation in the following 6 sequential steps:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     STEP-BY-STEP IMPLEMENTATION FLOW                   │
│                                                                        │
│ Step 1 ──► Monorepo Setup & Turborepo Configuration                    │
│ Step 2 ──► Build Core Workspace Packages (types, shared, config, api)  │
│ Step 3 ──► Initialize apps/mobile with Expo Dev Client SDK 51+         │
│ Step 4 ──► Configure NativeWind v4 & DESIGN_TOKENS.md                  │
│ Step 5 ──► Wire Supabase Client, MMKV Storage & SecureStore Keychains  │
│ Step 6 ──► Implement Screens, Smart Stack Engine & Native Widgets      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout Standards (`apps/mobile/src/`)

```
apps/mobile/src/
├── app/                         # Expo Router screens & layout stacks
├── presentation/                # UI Layer
│   ├── components/              # Atomic reusable UI components
│   ├── features/                # Feature-specific modules (Timetable, QR, Notes)
│   ├── hooks/                   # Custom UI & animation hooks
│   └── theme/                   # NativeWind theme tokens & styling
│
├── domain/                      # Business Logic Layer
│   ├── smart-stack/             # Context evaluator engine & state machine
│   └── attendance/              # Threshold math & safety calculators
│
├── data/                        # Caching & Storage Layer
│   ├── storage/                 # MMKV key-value stores & Expo SQLite setup
│   └── sync/                    # Background sync queue & DLQ manager
│
└── infrastructure/              # Native Platform Layer
    ├── biometrics/              # Expo LocalAuthentication wrapper
    ├── camera/                  # Expo Camera QR scanner overlay
    ├── location/                # Expo Location geofence provider
    ├── push/                    # Expo Notifications token & background task
    └── widget/                  # Native Widget bridge (WidgetKit / Glance)
```

---

## 3. Strict Coding Standards & Conventions

1. **TypeScript Strict Mode**: No `any` or `as never` casts permitted in application code. All API payloads must be validated using Zod schemas from `packages/shared`.
2. **Zero Direct Fetch Calls**: React components MUST NOT invoke `fetch` or `supabase.from()` directly. All data access occurs via repository classes in `packages/api` consumed through TanStack Query hooks.
3. **Styling Rules**: All components must use NativeWind utility classes (`className="bg-surface-1 rounded-card p-4"`). Raw inline styles are forbidden unless calculating dynamic Reanimated interpolations.
4. **Error Handling**: Network operations must be wrapped with `ApiError` handlers and mapped to standardized user toasts.

---

## 4. State Management Guidelines

- **Use Zustand (`useAuthStore`, `useUIStore`) for**:
  - Auth session state (access token, user role, onboarding completion).
  - Active UI preferences (dark/light theme, active tab index, modal visibilities).
  - Smart Stack active temporal mode index.
- **Use TanStack Query (`useQuery`, `useMutation`) for**:
  - Database reads (`subjects`, `timetable_slots`, `attendance_records`, `notes`, `assignments`).
  - Optimistic offline mutations queued into MMKV.

---

## 5. Automated Testing & Deployment Pipelines

### 5.1 Unit & Component Testing
- **Framework**: Jest + `@testing-library/react-native`.
- **Target Coverage**: $\ge 85\%$ line coverage on `domain/*` math, `packages/utils`, and `packages/api` repositories.

### 5.2 End-to-End Automated Testing (Maestro)
- **Framework**: Maestro E2E UI testing tool.
- **Automated Test Flows**:
  - `01_auth_onboarding.yaml`: Login -> Select Department -> Navigate to Dashboard.
  - `02_qr_attendance_scan.yaml`: Tap FAB -> Launch Scanner -> Mock QR Scan -> Verify Success Sheet.
  - `03_offline_note_creation.yaml`: Enable Airplane Mode -> Create Note -> Disable Airplane Mode -> Verify Sync.

### 5.3 EAS Build & Release Strategy
- **Development**: `eas build --profile development --platform all` (generates Expo Dev Client binary).
- **Staging**: `eas build --profile staging` (internal TestFlight & Google Play Internal Testing).
- **Production**: `eas build --profile production` (Store submission).
- **OTA Updates**: `eas update` configured with matching `runtimeVersion` policies to prevent native crash loops.
