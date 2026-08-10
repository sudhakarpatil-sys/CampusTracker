# CampusTracker — Updated Storage Architecture Plan

**Document Version**: `2.0.0`  
**Status**: APPROVED ARCHITECTURE  
**Target Provider**: Supabase Storage Buckets  

---

## 1. Executive Summary & Bucket Organization

The CampusTracker Storage Architecture is re-organized into 6 isolated Supabase Storage buckets. Storage policy enforces multi-tenant isolation, MIME-type validation, and strict file size limits to handle institutional imports, study resources, assignments, and academic documents safely.

---

## 2. Storage Bucket Architecture & Specifications

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               SUPABASE STORAGE BUCKET LAYOUT                           │
│                                                                                        │
│   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐   │
│   │ 1. official-imports   │   │ 2. notes-resources    │   │ 3. assignments        │   │
│   │ Excel/CSV Imports     │   │ Faculty Slides & PDFs │   │ Briefs & Submissions  │   │
│   │ (Private / Restricted)│   │ (Authenticated Read)  │   │ (Authenticated)       │   │
│   └───────────────────────┘   └───────────────────────┘   └───────────────────────┘   │
│   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐   │
│   │ 4. academic-documents │   │ 5. avatars            │   │ 6. institution-assets │   │
│   │ Syllabus & PYQs       │   │ User Profile Pictures │   │ Logos & Branding      │   │
│   │ (Public Read)         │   │ (Public Read)         │   │ (Public Read)         │   │
│   └───────────────────────┘   └───────────────────────┘   └───────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Bucket Name | Public Read? | Max File Size | Allowed MIME Types | Folder Hierarchy Structure |
| :--- | :--- | :--- | :--- | :--- |
| `official-imports` | ❌ No | $50\text{ MB}$ | `.xlsx`, `.xls`, `.csv` | `{institution_id}/raw/{year}/{month}/{job_id}.xlsx` |
| `notes-resources` | ❌ No (Auth) | $100\text{ MB}$ | `.pdf`, `.pptx`, `.docx`, `.zip` | `{institution_id}/{subject_id}/{faculty_id}/{file_id}.pdf` |
| `assignments` | ❌ No (Auth) | $50\text{ MB}$ | `.pdf`, `.zip`, `.docx`, `.png` | `{institution_id}/{assignment_id}/{user_id}/{submission_id}.pdf` |
| `academic-documents`| ✅ Yes | $100\text{ MB}$ | `.pdf` | `{institution_id}/syllabi/{subject_id}_syllabus.pdf` |
| `avatars` | ✅ Yes | $5\text{ MB}$ | `.jpg`, `.png`, `.webp` | `{user_id}/avatar.png` |
| `institution-assets`| ✅ Yes | $10\text{ MB}$ | `.svg`, `.png` | `{institution_id}/logo.svg` |

---

## 3. Storage Security & RLS Policies

All storage objects enforce path-based security checks using Supabase Storage policies:

```sql
-- Official Imports: Restricted to Institution Admins only
create policy "Only Admins can upload official imports"
  on storage.objects for insert
  with check (
    bucket_id = 'official-imports' 
    and 
    auth.jwt() ->> 'role' = 'admin'
    and
    (storage.foldername(name))[1] = auth.jwt() ->> 'institution_id'
  );

-- Notes & Resources: Uploadable by Faculty, Readable by Enrolled Students
create policy "Faculty can upload notes"
  on storage.objects for insert
  with check (
    bucket_id = 'notes-resources'
    and
    (auth.jwt() ->> 'role' = 'faculty' or auth.jwt() ->> 'role' = 'admin')
  );

create policy "Authenticated students read enrolled notes"
  on storage.objects for select
  using (
    bucket_id = 'notes-resources'
    and
    auth.role() = 'authenticated'
    and
    (storage.foldername(name))[1] = auth.jwt() ->> 'institution_id'
  );
```
