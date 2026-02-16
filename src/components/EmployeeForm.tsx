import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TablesInsert } from "@/integrations/supabase/types";
type EmployeeInsert = TablesInsert<"employees">;

interface EmployeeFormData {
  id?: string;
  name: string;
  code: string;
  designation: string;
  department: string;
  uan_number: string;
  work_location: string;
  date_of_birth?: string;
  company?: string;
  bank_name: string;
  bank_account_no: string;
  ifsc_code: string;
  branch_name: string;
  pf_number: string;
  esic_number: string;
  basic_salary: number;
  hra: number;
  other_allowances: number;
  pf_deduction: number;
  esi_deduction: number;
  professional_tax: number;
  other_deductions: number;
}

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
  isLoading?: boolean;
  initialData?: EmployeeFormData | null;
}

const EmployeeForm = ({ onSubmit, isLoading, initialData }: EmployeeFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<EmployeeFormData>({
    defaultValues: {
      name: "",
      code: "",
      designation: "",
      department: "",
      uan_number: "",
      work_location: "",
      date_of_birth: "",
      company: "",
      bank_name: "",
      bank_account_no: "",
      ifsc_code: "",
      branch_name: "",
      pf_number: "",
      esic_number: "",
      basic_salary: 0,
      hra: 0,
      other_allowances: 0,
      pf_deduction: 0,
      esi_deduction: 0,
      professional_tax: 0,
      other_deductions: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        code: initialData.code || "",
        designation: initialData.designation || "",
        department: initialData.department || "",
        uan_number: initialData.uan_number || "",
        work_location: initialData.work_location || "",
        date_of_birth: initialData.date_of_birth || "",
        company: initialData.company || "",
        bank_name: initialData.bank_name || "",
        bank_account_no: initialData.bank_account_no || "",
        ifsc_code: initialData.ifsc_code || "",
        branch_name: initialData.branch_name || "",
        pf_number: initialData.pf_number || "",
        esic_number: initialData.esic_number || "",
      });
    } else {
      reset({
        name: "",
        code: "",
        designation: "",
        department: "",
        uan_number: "",
        work_location: "",
        date_of_birth: "",
        company: "",
        bank_name: "",
        bank_account_no: "",
        ifsc_code: "",
        branch_name: "",
        pf_number: "",
        esic_number: "",
        basic_salary: 0,
        hra: 0,
        other_allowances: 0,
        pf_deduction: 0,
        esi_deduction: 0,
        professional_tax: 0,
        other_deductions: 0,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: EmployeeFormData) => {
    const payload: EmployeeInsert = {
      name: data.name,
      code: data.code,
      designation: data.designation,
      department: data.department,
      uan_number: data.uan_number,
      work_location: data.work_location,
      date_of_birth: data.date_of_birth ? data.date_of_birth : null,
      company: data.company,
      bank_name: data.bank_name,
      bank_account_no: data.bank_account_no,
      ifsc_code: data.ifsc_code,
      branch_name: data.branch_name,
      pf_number: data.pf_number,
      esic_number: data.esic_number,
      basic_salary: data.basic_salary,
      hra: data.hra,
      other_allowances: data.other_allowances,
      pf_deduction: data.pf_deduction,
      esi_deduction: data.esi_deduction,
      professional_tax: data.professional_tax,
      other_deductions: data.other_deductions,
    };
    onSubmit(payload as unknown as EmployeeFormData);
    if (!initialData) {
      reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Employee" : "Add New Employee"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="Employee Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Employee Code</Label>
                <Input id="code" {...register("code")} placeholder="EMP001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" {...register("designation")} placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...register("department")} placeholder="IT" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" type="date" {...register("date_of_birth" as const)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uan_number">Date of Joining</Label>
                <Input id="uan_number" type="date" {...register("uan_number")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_location">Work Location</Label>
                <Input id="work_location" {...register("work_location")} placeholder="Chennai" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  value={watch("company")}
                  onValueChange={(val) => setValue("company", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GAP">GAP</SelectItem>
                    <SelectItem value="Srivaru">Srivaru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input id="bank_name" {...register("bank_name")} placeholder="HDFC Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_account_no">Bank A/C No.</Label>
                <Input id="bank_account_no" {...register("bank_account_no")} placeholder="Account Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc_code">IFSC Code</Label>
                <Input id="ifsc_code" {...register("ifsc_code")} placeholder="HDFC0001234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch_name">Branch Name</Label>
                <Input id="branch_name" {...register("branch_name")} placeholder="Chennai Main" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf_number">PF Number</Label>
                <Input id="pf_number" {...register("pf_number")} placeholder="PF Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="esic_number">ESIC Number</Label>
                <Input id="esic_number" {...register("esic_number")} placeholder="ESIC Number" />
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Salary Details (Earnings)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic_salary">Basic Salary (₹)</Label>
                <Input 
                  id="basic_salary" 
                  type="number" 
                  step="0.01"
                  {...register("basic_salary", { valueAsNumber: true })} 
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hra">HRA (₹)</Label>
                <Input 
                  id="hra" 
                  type="number" 
                  step="0.01"
                  {...register("hra", { valueAsNumber: true })} 
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_allowances">Other Allowances (₹)</Label>
                <Input 
                  id="other_allowances" 
                  type="number" 
                  step="0.01"
                  {...register("other_allowances", { valueAsNumber: true })} 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>

          

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Employee" : "Add Employee")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
