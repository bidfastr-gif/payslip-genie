-- Create employees table with all fields from the payslip template
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  designation TEXT,
  department TEXT,
  uan_number TEXT,
  work_location TEXT,
  bank_name TEXT,
  bank_account_no TEXT,
  ifsc_code TEXT,
  branch_name TEXT,
  pf_number TEXT,
  esic_number TEXT,
  basic_salary DECIMAL(10,2) DEFAULT 0,
  hra DECIMAL(10,2) DEFAULT 0,
  other_allowances DECIMAL(10,2) DEFAULT 0,
  pf_deduction DECIMAL(10,2) DEFAULT 0,
  esi_deduction DECIMAL(10,2) DEFAULT 0,
  professional_tax DECIMAL(10,2) DEFAULT 0,
  other_deductions DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for payslip generation)
CREATE POLICY "Allow public read access to employees"
ON public.employees
FOR SELECT
USING (true);

-- Create policy for public insert/update (you may want to restrict this later with auth)
CREATE POLICY "Allow public insert to employees"
ON public.employees
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to employees"
ON public.employees
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete to employees"
ON public.employees
FOR DELETE
USING (true);