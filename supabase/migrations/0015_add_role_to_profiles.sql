-- CampusTracker — Phase 4C Add role and designation to profiles
-- Adds role ('student', 'faculty', 'admin') and designation columns to public.profiles table.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation text;

-- Add index on role for fast RBAC lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
