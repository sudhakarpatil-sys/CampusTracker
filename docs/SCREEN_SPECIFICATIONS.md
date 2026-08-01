# CampusTracker Mobile — High-Fidelity Screen Specifications

**Document Identifier**: `DOC-DES-004`  
**Phase**: 4A-2 — Mobile Design Language & Specifications  
**Status**: APPROVED  
**Author**: Principal UI/UX Designer & Product Architect  

---

## 1. Student Screen Layout Specifications

---

### 1.1 Splash Screen (`app/index.tsx`)
- **Visual Baseline**: Minimal Midnight Obsidian canvas `#0B0F17`.
- **Center**: Animated CampusTracker Logo Mark (Electric Violet glow emblem with subtle pulse scale effect) + bold typography `"CampusTracker"`.
- **Bottom**: Version string `v1.0.0` + subtle loading line indicator.

---

### 1.2 Onboarding Screen (`app/(auth)/onboarding.tsx`)
- **Visual Baseline**: 3-step clean carousel inspired by `[IMAGE_0]` onboarding references.
- **Step 1**: Vector Illustration: *"Your Schedule Simplified"* (Track classes, assignments, and never miss a lecture).
- **Step 2**: Vector Illustration: *"Smart QR Attendance"* (Scan QR, mark attendance in seconds with GPS verification).
- **Step 3**: Department & Semester Selector Wizard (Clean dropdown inputs for College, Branch, Semester, Roll Number).
- **Bottom Controls**: `"Skip"` text button on left, `"Next"` / `"Get Started"` primary violet pill button on right.

---

### 1.3 Login Screen (`app/(auth)/login.tsx`)
- **Header**: CampusTracker Brand Mark + Headline `"Welcome Back"` + Subtitle `"Log in to continue your academic journey"`.
- **Form Fields**:
  - Email / Roll Number Input with Mail/User icon prefix.
  - Password Input with eye toggle icon suffix.
  - `"Forgot Password?"` link right-aligned.
- **Actions**:
  - Primary `"Log In"` Violet Gradient Button ($52\text{px}$ height).
  - Divider: `"OR"`
  - Secondary Glass `"Sign in with Google"` Button (Google G logo prefix).
  - Biometric Quick Unlock Icon Button (FaceID / Fingerprint emblem).

---

### 1.4 Student Dashboard Screen (`app/(app)/(tabs)/index.tsx`)
- **Visual Baseline**: Direct alignment with `[IMAGE_1]` high-fidelity reference screen.
- **Top App Bar**:
  - Left: User Avatar image ($44\times44\text{px}$) with status ring + Greeting text `"Good Morning,"` + Bold Name `"Sudhakar Patil"` + Badge `"CSE • Sem 3"`.
  - Right: Notification Bell icon button (with unread purple dot) + Search glass icon button.
- **Hero Title**: `"Your Progress Today"` (Outfit 24pt Bold).
- **Hero Card**: `<AttendanceHeroCard />` (88% Attendance, Lavender Glass background, radial SVG ring, Presents: 22, Total: 25, Absences: 3).
- **Quick Action Bar**: 4 circular glass icon pills:
  1. `Scan QR` (Camera icon)
  2. `Today's Schedule` (Calendar icon)
  3. `My Notes` (File Text icon)
  4. `Announcements` (Megaphone icon)
- **Section 1**: `"Your Classes Today"` (Header with `"View All >"` link).
  - Card 1: `09:00 AM` `Data Structures`, Prof. A. K. Sharma, `Room 402` [`Ongoing` badge].
  - Card 2: `11:00 AM` `Database Systems`, Prof. P. R. Mehta, `Room 305` [`Upcoming` badge].
- **Section 2**: `"Pending Assignments"` (Sage Green Glass Card):
  - `DBMS Mini Project`, `Due Tomorrow, 11:59 PM` [`Due Soon` badge].
- **Bottom Bar**: Floating animated Glass Tab Bar with centered (+) FAB.

---

### 1.5 Timetable Screen (`app/(app)/(tabs)/timetable.tsx`)
- **Top Header**: `"Timetable"` title + Week View Toggle icon button.
- **Day Selector Row**: Horizontal scrollable pill row (`Mon`, `Tue`, `Wed` [Active Violet Pill], `Thu`, `Fri`, `Sat`).
- **Date Indicator**: `"Today, 12 Oct"` caption.
- **Schedule Timeline**: Chronological vertical list of class cards with start/end time, subject color accent, professor name, classroom location, and direct note attachment link.

---

### 1.6 QR Scanner Screen (`app/modals/qr-scanner.tsx`)
- **Visual Baseline**: Full-screen dark camera viewfinder inspired by `[IMAGE_0]` QR Scanner reference.
- **Overlay**: Darkened camera backdrop with centered square target scanner frame ($260\times260\text{px}$) with rounded neon violet corner ticks.
- **Animated Scanner Line**: Vertical laser sweep line moving smoothly up and down inside target frame.
- **Instructions**: `"Point your camera at the QR code displayed by faculty"`.
- **Bottom Bar**: Flashlight toggle button, Gallery upload button.
- **Success Transition**: Immediate bottom sheet pop-up showing green checkmark badge, `"Attendance Marked Successfully!"`, Class name (`"Data Structures"`), Timestamp (`"09:05 AM"`), and `"View Attendance"` primary button.

---

### 1.7 Assignments Screen (`app/(app)/(tabs)/assignments.tsx`)
- **Top Header**: Title `"Assignments"` + Search bar.
- **Filter Tabs**: Segmented pills (`All`, `Pending`, `Submitted`, `Graded`).
- **Assignment Cards List**: Grouped by priority (High, Medium, Low) with due date clock indicators, subject tags, and interactive completion checkboxes.

---

### 1.8 Profile & Settings Screens (`app/(app)/(tabs)/profile.tsx`)
- **Profile Header**: Centered large avatar with glow border, Name, Roll Number, Department tag.
- **Settings Group List**:
  - `Personal Information`
  - `Academic Information`
  - `Notification Preferences` (Detailed toggle list: Class Reminders, Assignment Reminders, Announcement Alerts, AI Updates)
  - `Theme` (`Dark` / `Light` / `System`)
  - `Help & Support`
  - `Logout` (Red destructive button).

---

## 2. Faculty Screen Specifications (Phase 4 Preview)

- **Faculty Dashboard**: Active class overview, real-time student attendance counter, quick announcement trigger.
- **Dynamic QR Generator Screen**: Large full-screen dynamic QR code presenter rotating TOTP keys every 5 seconds, displaying real-time scanned student roster count.
