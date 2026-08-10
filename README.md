# CampusTracker — Official Academic Platform & Attendance Engine

CampusTracker is an official college academic management engine and smart mobile/web application that tracks **official attendance, timetable, assignments, exam marks, notes, and class announcements** directly from institution ERP systems, CSV data pipelines, and faculty broadcasts.

**Status: Production-Ready (Phase 4C ERP Connector Framework + Phase 5C Mobile App & Event Bus)**

---

## Key Platform Evolution

> **Major Architectural Transition:**
> CampusTracker has evolved from a manual self-attendance logging tool into an **Official College Academic Platform**. It connects directly to institutional ERP databases, CSV feeds, and Google Sheets via the **Academic Sync Engine** to ingest official college attendance records, real-time timetable slots, and internal exam marks with zero manual entry required from students.

---

## Core Features & Modules

### 1. Official Attendance & Safe-Leave Engine™
- **Live Official Attendance Ingestion**: Ingests daily attendance logs directly from college ERPs and faculty marksheets.
- **75% Safe-Leave Calculator**: Automatically computes exact safe leaves remaining before falling below the mandatory 75% institutional threshold.
- **Subject-Wise Analytics**: Interactive attendance gauge rings, weekly trend lines, and absence breakdown.

### 2. Multi-Role Consoles (Student, Faculty, Admin)
- **Student App**: Personal academic hub — Attendance progress, today's lecture timeline, pending assignments, course resources, and real-time class announcements.
- **Faculty App**: Academic management console — Broadcast class announcements, publish lecture notes/PDFs, assign course tasks, and view teaching timetables.
- **Admin Connector Console**: Management suite for institutional ERP connectors, sync job monitoring, data quarantine, retry queues, and CSV emergency data imports.

### 3. Real-Time Announcement Event Bus
- Real-time event bus connecting Faculty broadcasts directly to Student mobile feeds, Smart Stack™ cards, and unread notification alerts.
- Click-to-expand **Announcement Reader Drawer** with full text wrapping and preview line clamping.

### 4. Automatic Faculty Email Verification
- Client-side & Supabase PostgreSQL trigger (`0016_auto_faculty_role_trigger.sql`) that automatically detects official faculty email domains (`@college.edu.in`, `faculty@`, `prof@`, `hod@`) and assigns `role = 'faculty'` upon signup.

### 5. Progressive Web App (PWA) & Smartphone Experience
- Mobile-first dark obsidian shell (`/mobile`) with role switching (`NEW USER`, `STUDENT`, `FACULTY`, `ADMIN`).
- Configured for 1-click home screen installation on iOS and Android devices.

---

## Tech Stack

| Layer | Technology Choice |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Vanilla Tailwind CSS, Glassmorphic Obsidian Tokens, Lucide Icons |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, Storage, Auth Triggers) |
| **Forms & Validation** | React Hook Form + Zod Schema Validation |
| **Sync Engine** | Node.js Academic Connector Framework (API, CSV, Google Sheets, SQL) |
| **Deployment** | Vercel Global Edge Network |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/sudhakarpatil-sys/CampusTracker.git
cd campustracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run local development server
npm run dev
```

Open **`http://localhost:3000`** in your browser, or **`http://localhost:3000/mobile`** for the mobile experience preview.

---

## Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Live Supabase Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon API Key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Service Role Key (for background sync) | Yes |
| `NEXT_PUBLIC_SITE_URL` | Base application URL (`http://localhost:3000`) | Yes |

---

## Database Migrations

Apply the migration scripts in `supabase/migrations/` sequentially in your Supabase SQL Editor:

1. `0001_init.sql` — Core schema & initial tables.
2. `0012_academic_platform_sync.sql` — Academic connector tables & sync logs.
3. `0013_cleanup_legacy_data.sql` — Data cleanup & structure alignment.
4. `0014_connector_framework.sql` — Institutional API & CSV connector schemas.
5. `0015_add_role_to_profiles.sql` — Multi-role RBAC schema (`student`, `faculty`, `admin`).
6. `0016_auto_faculty_role_trigger.sql` — Automatic faculty email role detection trigger.

---

## Production Build & Deploy

```bash
# Verify TypeScript types
npm run typecheck

# Run production build
npm run build

# Start production server
npm run start
```
