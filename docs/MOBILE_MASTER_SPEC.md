# CampusTracker Mobile — Master Technical Specification (Single Source of Truth)

**Document Identifier**: `DOC-MST-001`  
**Phase**: 4A-Final — Design & Architecture Freeze  
**Status**: APPROVED & LOCKED  
**Authors**: Principal Mobile Architect, Lead UI/UX Designer, Senior Security Engineer, Staff SRE  

---

## 1. Executive Master Summary

This document serves as the **SINGLE SOURCE OF TRUTH** for CampusTracker Mobile. It consolidates all product vision, monorepo architecture, design systems, navigation trees, authentication protocols, dynamic QR attendance cryptography, offline synchronization models, Smart Stack context engines, native widget bridges, accessibility standards, and performance budgets established across Phase 4A-1, Phase 4A-2, Phase 4B, and Phase 4A-3.

All architectural and visual decisions documented herein are **OFFICIALLY LOCKED**. No further redesign or architectural restructuring is permitted during Phase 4B implementation.

---

## 2. Platform Vision & Monorepo Architecture

CampusTracker is an AI-powered College Management Ecosystem. The web application (`apps/web`) remains the administrative control center, while `apps/mobile` acts as the primary day-to-day productivity companion for students and faculty.

```
CampusTracker Monorepo Architecture
├── apps/
│   ├── web/                     # Production Next.js 14 Control Center (Untouched)
│   └── mobile/                  # Expo / React Native Production App (Phase 4B)
│
├── packages/
│   ├── shared/                  # Zod validation schemas & domain constants
│   ├── api/                     # Supabase client, repositories, offline DLQ queue
│   ├── types/                   # Database interface types & domain models
│   ├── utils/                   # ISO date math, Haversine GPS, TOTP crypto
│   └── config/                  # Shared Tailwind/NativeWind theme tokens, TSConfig
│
├── docs/                        # Locked Architecture & Design Specifications
├── supabase/                    # PostgreSQL migrations (0001 - 0012) & Edge Functions
├── turbo.json                   # Turborepo task pipeline & build caching
└── package.json                 # Monorepo workspace configuration
```

---

## 3. Technology Stack (Locked Matrix)

- **App Framework**: Expo Managed Workflow with Custom Dev Client (`expo-dev-client`).
- **Core Engine**: React Native 0.76+ with New Architecture (Fabric Renderer, TurboModules, Bridgeless mode enabled).
- **Navigation**: Expo Router v3+ (File-based routing with typed routes and nested layouts).
- **Client State**: Zustand v4 (`zustand/vanilla` with MMKV persistence middleware).
- **Server State & Cache**: TanStack Query v5 with `@tanstack/react-query-persist-client`.
- **Styling**: NativeWind v4 (Tailwind CSS v3 compiled to native styles).
- **Local Storage**: `react-native-mmkv` (Synchronous C++ storage) + `expo-sqlite` (Relational database).
- **Encrypted Storage**: `expo-secure-store` (Hardware Keychain / Keystore).
- **Hardware Native Modules**: `expo-camera`, `expo-location`, `expo-notifications`, `expo-local-authentication`.
- **Animations & Gestures**: React Native Reanimated v3 + Gesture Handler v2.

---

## 4. Master Design System Specifications

### 4.1 Color Palette & Theme Engine
- **Canvas Base**: Midnight Obsidian `#0B0F17` (Dark Theme First).
- **Surface Levels**: `#141923` (Card Base), `#181F2E` (Elevated Card), `#222B3D` (Interactive Card).
- **Brand Accents**: Electric Violet `#8B5CF6`, Soft Lavender `#E9D5FF`, Emerald Teal `#10B981`, Amber `#F59E0B`, Rose `#EF4444`, Sapphire `#3B82F6`.
- **Ambient Glow Restraint Rule**: Maximum **ONE** active ambient radial background glow per screen, reserved for hero card states.

### 4.2 Locked Squircle Geometry
- **`radius-card` ($16\text{px}$)**: All content cards, subject slots, input fields, search bars.
- **`radius-overlay` ($24\text{px}$)**: Bottom sheet overlays, full-screen modals, and Smart Stack hero card.
- **`radius-pill` (`9999px`)**: Interactive filter chips, status badges, avatars, and FAB.

### 4.3 Typography Scale
- Fonts: `Outfit` (Headings) + `Inter` (Body, Controls, Metadata).
- Display Titles: `32pt` / `24pt` with `-0.6px` tracking.
- Body Text: `14pt` / `16pt` with `0.0px` tracking and $1.5\times$ line height.

---

## 5. Navigation & Auth Architecture

### 5.1 Route Tree
- `app/_layout.tsx`: Root Provider & Splash Guard.
- `app/(auth)/*`: Login, Register, Onboarding Wizard, Password Reset.
- `app/(app)/(tabs)/*`: Authenticated Student Tabs (`index`, `timetable`, `attendance`, `assignments`, `profile`).
- `app/(faculty)/(tabs)/*`: Authenticated Faculty Tabs (`index`, `qr-generator`, `class-reports`).
- `app/modals/*`: Overlay Modals (`qr-scanner`, `note-editor`, `timetable-import`).

### 5.2 Auth & Session Security
- **OAuth Exchange**: Native Google Sign-In SDK `idToken` exchanged via `supabase.auth.signInWithIdToken()`.
- **Biometrics**: `expo-local-authentication` unlocks local session key stored in `Expo SecureStore`.
- **Token Rotation**: Refresh tokens stored in SecureStore; 401 response triggers auto-refresh.

---

## 6. CampusTracker Smart Stack™ Engine

The Smart Stack is the flagship dynamic companion. It evaluates 7 contextual vectors (System Time, Timetable Schedule, Attendance Thresholds, Assignments, Academic Calendar, Location Geofence, Unread Announcements) across 8 temporal modes:

1. **Morning Mode** (06:00–08:30): Daily Schedule Overview & Weather/Campus status.
2. **Pre-Lecture Mode** (15–30m before class): Countdown, Classroom, Faculty name.
3. **Mid-Lecture Mode** (Active Class): **`⚡ MARK ATTENDANCE (SCAN QR)`** Hero Button + Class Progress.
4. **Post-Lecture Mode** (0–45m post class): Lecture Notes & Assignment prompts.
5. **Afternoon Mode** (13:00–17:00): Remaining classes & Overall Attendance Summary ($88\%$).
6. **Evening Mode** (17:00–23:00): Tomorrow's Timetable & Upcoming Assignment Reminders.
7. **Weekend Mode** (Sat–Sun): Weekly Insights, Semester Progress ($65\%$).
8. **Exam Mode** (Exam Active): Countdown, Hall Venue, Syllabus Coverage, Revision Notes.

---

## 7. Cryptographic Smart QR Attendance System

- **Dynamic QR Generator (Faculty)**: Rotates AES-256 encrypted TOTP payload every 5 seconds.
- **Verification Edge Function**: `verify-qr-attendance` validates TOTP timestamp ($\le 15\text{s}$ drift), Haversine GPS geofence distance ($\le 30\text{m}$ radius) OR Wi-Fi access point BSSID SHA-256 hash match, and enforces 1-device-per-student hardware fingerprinting stored in `student_device_registrations`.
- **Confidence Scoring**: High (Auto-present), Medium (Flagged present), Low (Rejected / Manual Override Request).

---

## 8. Offline-First Storage & Data Model

- **Multi-Tiered Storage**: RAM (TanStack Query) -> Synchronous Disk (MMKV) -> Relational Disk (Expo SQLite).
- **Mutation Queue & DLQ**: Offline writes serialized into MMKV `offline_mutations_queue`. Permanently failing 4xx mutations moved to `offline_mutations_dlq`.
- **Conflict Resolution**: Last-Write-Wins (LWW) with client-generated `idempotency_key` UUIDs.

---

## 9. Native Widget System

- **Primary Widget**: Smart Stack Widget ($4\times2$ Medium & $4\times4$ Large) rendering pre-computed 24-hour timeline JSON written to native App Group / SharedPreferences container.
- **iOS Features**: Lock Screen widgets (`accessoryCircular`, `accessoryRectangular`), ActivityKit Live Activities & Dynamic Island banners.
- **Android Features**: Jetpack Glance AppWidgets & Quick Settings Tile (**"Scan Attendance"** status bar tile opening camera in $< 300\text{ms}$).
