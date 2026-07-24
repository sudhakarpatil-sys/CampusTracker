# AI Timetable Import

## Goal

Allow students to upload one timetable.

CampusTracker should automatically configure the entire semester.

---

## Pipeline

Upload

↓

Extract Text

↓

OCR (if required)

↓

AI Understanding

↓

Subject Detection

↓

Timetable Detection

↓

Review

↓

Import

↓

Attendance Ready

---

## Supported Files

PDF

PNG

JPEG

JPG

Scanned PDF

Camera Images

---

## AI Responsibilities

Detect

- Branch
- Semester
- Division
- Academic Year
- Subjects
- Faculty
- Lecture Times
- Rooms

Automatically

- Create Subjects
- Create Timetable
- Link Subjects
- Store Upload

---

## Future

The same AI pipeline should support

- Assignment Import

- Exam Timetable Import

- Syllabus Import

- Notice Import

without changing the architecture.