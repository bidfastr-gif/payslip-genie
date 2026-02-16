-- Add 'company' column to employees table
alter table public.employees
  add column if not exists company text;

-- Optional: backfill or defaults can be added here if needed

