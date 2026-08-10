# CampusTracker — Updated Authentication & Student Activation Architecture

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Subsystem**: Auth & Identity Management (Phase 4B-1)  

---

## 1. Executive Summary & Identity Model Shift

The CampusTracker Authentication System evolves from self-registration with arbitrary emails to **Student ID & Institutional Identity Verification**.

In an official academic platform, every student profile must link to an official row in `student_master`. CampusTracker supports 4 institutional activation methods and enforces multi-tenant identity scoping (`institution_id`) across both web and mobile environments.

---

## 2. Authentication Identifier & Metadata

### Primary Identifier:
Students log in using their **Student ID / Roll Number** or verified **Official Institutional Email**.

### JWT Custom Claims (`auth.users` Metadata):
Upon successful login or token refresh, Supabase Auth issues JWT tokens augmented with institution context:

```json
{
  "sub": "u-9842104-uuid",
  "email": "rahul.sharma@mit.edu",
  "user_metadata": {
    "student_id": "PRN-2023-04921",
    "roll_number": "23-CS-104",
    "institution_id": "inst-mit-cs-uuid",
    "institution_code": "MIT-CS",
    "department_id": "dept-cse-uuid",
    "class_id": "class-ty-cse-a-uuid",
    "role": "student"
  }
}
```

---

## 3. Account Activation Workflows

```
                               Unactivated Student
                                        │
                         ┌──────────────┴──────────────┐
                         │ Activation Method Selection │
                         └──────────────┬──────────────┘
                                        │
      ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
      │                  │                             │                  │
      ▼                  ▼                             ▼                  ▼
  [Option A]         [Option B]                    [Option C]         [Option D]
 College Email     Personal Email +             Temporary Password  Admin Activation
   OTP Auth         Student ID Verification      First-Time Login        Link
```

### Option A: College Email OTP Verification
1. Student enters official college email (`student@college.edu`).
2. CampusTracker matches email against `student_master.official_email`.
3. System dispatches 6-digit OTP code to the college inbox.
4. Upon OTP validation, Supabase Auth creates/links user and flags `student_master.is_activated = true`.

### Option B: Personal Email + Student ID & Verification
1. Used when college does not issue individual email addresses.
2. Student enters: (1) Select College, (2) Student ID / Roll No, (3) Date of Birth / Verification Key.
3. System verifies credentials against `student_master`.
4. Student registers personal email + password; system binds personal email to official student master record.

### Option C: Temporary Password First-Time Login
1. Institution Admin uploads Excel containing initial temporary passwords.
2. Student logs in with Student ID + Temporary Password.
3. System immediately forces password reset and security question setup.

### Option D: Admin Pre-Activated Token Link
1. Admin generates activation magic links or QR codes.
2. Student clicks link, sets password, and instantly claims verified profile.

---

## 4. Multi-Tenant Role-Based Access Control (RBAC)

CampusTracker defines 4 distinct security roles across the platform:

| Role Name | Authority Scope | Typical Users |
| :--- | :--- | :--- |
| `super_admin` | Global SaaS management, institution provisioning, billing. | CampusTracker Core Engineering Team. |
| `institution_admin` | College-level administrative control, connector config, sync logs, student registry. | College IT Head, Registrar, Dean. |
| `faculty` | Course resources, notes, assignments, class announcements. | Professors, Lecturers, Lab Instructors. |
| `student` | Read-only official academic records, safe leave calculator, personal study tasks. | Enrolled College Students. |

---

## 5. Security & Session Hygiene

- **Hardware Secure Store**: Mobile apps store JWT access tokens in `Expo SecureStore` (iOS Keychain / Android KeyStore).
- **Session Auto-Rotation**: Refresh tokens rotate automatically on 401 Unauthorized responses via Supabase Auth client.
- **Biometric Unlock**: Mobile app requires Face ID / Touch ID unlock if backgrounded for more than 5 minutes.
