# CampusTracker Database Overview

## Authentication

Supabase Authentication

---

## Core Tables

profiles

subjects

timetable_slots

attendance

attendance_records

assignments

assignment_submissions

notes

notifications

settings

---

## AI Import Tables

timetable_imports

Stores

- uploaded file
- OCR results
- extracted JSON
- import status
- checksum
- version
- confidence scores

---

## Future Faculty Tables

faculty_profiles

faculty_classes

announcements

reports

---

## Future Admin Tables

institutions

departments

academic_years

semesters

permissions

---

# Relationships

Profile

↓

Subjects

↓

Timetable

↓

Attendance

↓

Analytics

AI Import

↓

Subjects

↓

Timetable

↓

Attendance