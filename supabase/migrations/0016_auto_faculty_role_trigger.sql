-- CampusTracker — Phase 5C Automatic Faculty & Role Assignment Trigger
-- Automatically detects faculty email patterns (@faculty.*, prof.*, faculty.*, staff.*) on signup
-- and sets profiles.role = 'faculty' in Supabase PostgreSQL.

CREATE OR REPLACE FUNCTION public.handle_auto_role_assignment()
RETURNS trigger AS $$
DECLARE
  user_email text;
  assigned_role text := 'student';
BEGIN
  user_email := LOWER(NEW.email);

  -- Admin pattern matching
  IF user_email LIKE '%admin%' THEN
    assigned_role := 'admin';
  -- Faculty pattern matching (e.g., faculty@, prof@, @faculty., @staff., HOD, instructor)
  ELSIF user_email LIKE '%faculty%' 
     OR user_email LIKE '%prof%' 
     OR user_email LIKE '%teacher%' 
     OR user_email LIKE '%staff%' 
     OR user_email LIKE '%hod%' 
     OR user_email LIKE '%instructor%' THEN
    assigned_role := 'faculty';
  END IF;

  -- Create or update profile row with detected role
  INSERT INTO public.profiles (id, full_name, role, onboarding_completed, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    assigned_role,
    false,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role,
      updated_at = NOW()
  WHERE public.profiles.role = 'student' AND EXCLUDED.role = 'faculty';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute automatically on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created_auto_role ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auto_role_assignment();
