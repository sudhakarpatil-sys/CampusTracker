# CampusTracker Mobile — Comprehensive Risk Analysis & Mitigation Matrix

**Document Identifier**: `DOC-MOB-011`  
**Phase**: 4B — Architectural Blueprint  
**Status**: APPROVED  
**Author**: Site Reliability Engineer & Mobile Security Lead  

---

## 1. Risk Evaluation Overview

Deploying an offline-capable, security-sensitive mobile platform for thousands of students and faculty involves technical, operational, security, and performance risks. This document identifies all primary risks, rates their severity and probability, and defines concrete architectural mitigations and contingency protocols.

---

## 2. Risk Matrix & Heatmap

```
                 SEVERITY
             Low        Medium       High
          ┌──────────┬───────────┬───────────┐
     High │          │  R-04     │  R-01     │
PROBABILITY          │           │  R-07     │
   Medium │  R-06    │  R-03     │  R-02     │
      Low │          │           │  R-05     │
          └──────────┴───────────┴───────────┘
```

---

## 3. Risk Detailed Register & Mitigations

### R-01: GPS Geolocation Spoofing & Proxy Attendance
- **Category**: Security / Fraud
- **Probability**: High | **Severity**: High
- **Description**: Students install mock location developer apps or VPN location changers on Android/iOS to fake classroom GPS coordinates while remaining in their dorm room.
- **Architectural Mitigation**:
  1. The mobile app queries native OS location APIs for `isMocked` (Android) and location source accuracy flags.
  2. Verification requires matching **Dynamic Rotating QR Code** (visible ONLY on classroom projector/teacher phone screen) simultaneously with GPS. GPS alone cannot grant attendance.
  3. Confidence engine assigns `Low` confidence to suspicious coordinates and flags for teacher review.
- **Contingency Plan**: Teacher toggles BLE beacon or NFC tap requirement for suspicious classes.

---

### R-02: Offline QR Scan Replay & Timestamp Manipulation Attacks
- **Category**: Security / Cryptography
- **Probability**: Medium | **Severity**: High
- **Description**: A student records/scans a valid QR code offline, alters their phone system clock, and attempts to submit the scan hours later.
- **Architectural Mitigation**:
  1. The Edge Function verifies the TOTP timestamp embedded in the dynamic QR code against server atomic clock (NTP time), completely independent of client device clock time.
  2. Scanned payloads expire after **15 seconds** ($t_{current} - t_{qr} > 15\text{s} \implies \text{REJECT}$).
- **Contingency Plan**: Offline scans require signed cryptographic proof from local hardware keystore.

---

### R-03: iOS Widget Memory Limit Crashes (`30 MB` RAM Cap)
- **Category**: Performance / OS Constraints
- **Probability**: Medium | **Severity**: High
- **Description**: iOS WidgetKit extensions enforce a strict **30 MB RAM memory limit**. If a widget attempts to load heavy JavaScript runtimes or large JSON payloads, iOS terminates the widget process silently.
- **Architectural Mitigation**:
  1. Widgets DO NOT run React Native JS. They are 100% native Swift / SwiftUI components.
  2. Main app computes a lightweight compressed **24-Hour Timeline JSON** ($< 15\text{ KB}$) and writes it to the shared `App Group` container.
  3. WidgetKit reads static JSON entries natively with under **4 MB** memory usage.
- **Contingency Plan**: Fallback to static system small widget layout if timeline rendering fails.

---

### R-04: Excessive Battery Drain from Background Context Tracking
- **Category**: Performance / User Experience
- **Probability**: High | **Severity**: Medium
- **Description**: Background timers or continuous GPS tracking drain student device battery, resulting in negative app store reviews and app uninstalls.
- **Architectural Mitigation**:
  1. **Zero Continuous GPS Tracking**: Location services are requested strictly on-demand during active QR scan.
  2. Foreground JS timer suspends instantly when app is backgrounded.
  3. Native OS background jobs (WorkManager / BackgroundFetch) enforce a strict minimum interval of **15 minutes**.
- **Contingency Plan**: OS automatically throttles background fetch triggers if battery saver mode is active.

---

### R-05: React Native New Architecture Native Library Incompatibility
- **Category**: Engineering / Dependency
- **Probability**: Low | **Severity**: High
- **Description**: Certain legacy React Native third-party native libraries fail to compile when Fabric and TurboModules (New Architecture) are enabled by default in RN 0.76+.
- **Architectural Mitigation**:
  1. Strict architectural requirement: Only native libraries maintained in the Expo SDK 51+ ecosystem or verified for New Architecture support are permitted in `apps/mobile`.
  2. All native bridges use Expo Modules API (`expo-module-scripts`).
- **Contingency Plan**: Use `expo-dev-client` patch-package fallback or wrap legacy libraries in compatibility layer.

---

### R-06: Transient API Rate Limit Data Reset on Cold Starts
- **Category**: Infrastructure / Backend
- **Probability**: Medium | **Severity**: Low
- **Description**: Web platform in-memory rate limiting resets on server cold starts (noted in `PRODUCTION_READINESS_REPORT.md`). High mobile scan spikes during 9:00 AM classes could exceed in-memory limits.
- **Architectural Mitigation**:
  1. Mobile client implements client-side sliding-window throttling.
  2. Production deployment integrates Upstash Redis for distributed persistent rate limiting on Supabase Edge Functions.
- **Contingency Plan**: Exponential backoff retry interceptor in `packages/api` retries throttled requests gracefully.

---

### R-07: Multi-Device Proxy Attendance (One Phone, Multiple Student Logins)
- **Category**: Security / Abuse
- **Probability**: High | **Severity**: High
- **Description**: A student brings 3 phones to class, logs into 3 different student accounts on each phone, or repeatedly logs in and out on one phone to scan for absent friends.
- **Architectural Mitigation**:
  1. Hardware Device Fingerprint stored in `Expo SecureStore` is registered to `student_device_registrations`.
  2. **Rule**: A physical device ID can submit attendance for at most **ONE student profile per lecture slot**. Secondary logins on the same device within the same class slot are flagged and blocked.
- **Contingency Plan**: Require biometric confirmation bound to student primary device ID.
