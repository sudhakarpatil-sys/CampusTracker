-- CampusTracker — Phase 3A, Milestone 3: Document Extraction

alter table public.timetable_imports
  add column if not exists raw_extracted_text text,
  add column if not exists extraction_method text
    check (extraction_method in ('pdf_text', 'vision', 'pending')) not null default 'pending',
  add column if not exists page_count integer;

comment on column public.timetable_imports.extraction_method is
  'pdf_text: usable text layer found deterministically. vision: no usable text layer (scanned PDF or image upload) — the AI structuring step reads the original file directly instead of trusting OCR output.';
