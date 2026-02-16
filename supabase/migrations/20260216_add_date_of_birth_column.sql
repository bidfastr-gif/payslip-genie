-- Add date_of_birth column to employees if it does not exist
ALTER TABLE IF EXISTS public.employees
  ADD COLUMN IF NOT EXISTS date_of_birth date NULL;

-- Optional: backfill or set default can be added here if needed

