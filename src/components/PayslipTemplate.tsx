import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import CompanyLogo from "@/components/CompanyLogo";

interface Employee {
  id: string;
  name: string;
  code: string | null;
  designation: string | null;
  department: string | null;
  date_of_birth?: string | null;
  uan_number: string | null;
  company: string | null;
  work_location: string | null;
  bank_name: string | null;
  bank_account_no: string | null;
  ifsc_code: string | null;
  branch_name: string | null;
  pf_number: string | null;
  esic_number: string | null;
  basic_salary: number;
  hra: number;
  other_allowances: number;
  pf_deduction: number;
  esi_deduction: number;
  professional_tax: number;
  other_deductions: number;
}

interface SalaryDetails {
  basic_salary: number;
  hra: number;
  other_allowances: number;
  pf_deduction: number;
  esi_deduction: number;
  professional_tax: number;
  other_deductions: number;
}

interface PayslipTemplateProps {
  employee: Employee;
  month: string;
  year: string;
  workedFullDays: number;
  workedHalfDays: number;
  weeklyOff: number;
  holiday: number;
  paidLeaves: number;
  salaryDetails?: SalaryDetails;
  onSalaryDetailsChange?: (details: SalaryDetails) => void;
  isEditing?: boolean;
}

const PayslipTemplate = forwardRef<HTMLDivElement, PayslipTemplateProps>(
  ({ employee, month, year, workedFullDays, workedHalfDays, weeklyOff, holiday, paidLeaves, salaryDetails, onSalaryDetailsChange, isEditing }, ref) => {
    // Use salaryDetails if provided, otherwise fallback to employee data
    const currentSalary = salaryDetails || {
      basic_salary: employee.basic_salary,
      hra: employee.hra,
      other_allowances: employee.other_allowances,
      pf_deduction: employee.pf_deduction,
      esi_deduction: employee.esi_deduction,
      professional_tax: employee.professional_tax,
      other_deductions: employee.other_deductions,
    };

    const handleSalaryChange = (field: keyof SalaryDetails, value: string) => {
      if (onSalaryDetailsChange) {
        onSalaryDetailsChange({
          ...currentSalary,
          [field]: Number(value) || 0,
        });
      }
    };

    const formatDMY = (value?: string | null) => {
      if (!value) return "-";
      const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) return `${m[3]}-${m[2]}-${m[1]}`;
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = d.getFullYear();
      return `${dd}-${mm}-${yy}`;
    };

    const totalEarnings = 
      Number(currentSalary.basic_salary || 0) + 
      Number(currentSalary.hra || 0) + 
      Number(currentSalary.other_allowances || 0);
    
    const totalDeductions = 
      Number(currentSalary.pf_deduction || 0) + 
      Number(currentSalary.esi_deduction || 0) + 
      Number(currentSalary.professional_tax || 0) + 
      Number(currentSalary.other_deductions || 0);
    
    const netPayable = totalEarnings - totalDeductions;

    const workedPayableDays = workedFullDays + workedHalfDays * 0.5;
    const workedPayableDaysLabel = Number.isInteger(workedPayableDays)
      ? workedPayableDays.toString()
      : workedPayableDays.toFixed(1);

    const inputClass = "h-6 p-0 text-right border-0 bg-transparent focus-visible:ring-0 w-full";

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}


        {/* Company Header */}
        <div className="border border-border rounded-lg p-6 mb-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <CompanyLogo company={employee.company} />
              <p className="text-sm text-muted-foreground">38, 1st floor, 4th main road, Besant Nagar, Chennai</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Payslip from - {month} {year}</p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="mb-6">
            <h2 className="font-bold mb-4 text-lg">Employee Details</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-muted-foreground">Name</span>
                <span className="mx-2">:</span>
                <span className="font-medium">{employee.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Bank Name</span>
                <span className="mx-2">:</span>
                <span>{employee.bank_name || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Code</span>
                <span className="mx-2">:</span>
                <span>{employee.code || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Bank A/C No.</span>
                <span className="mx-2">:</span>
                <span>{employee.bank_account_no || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Designation</span>
                <span className="mx-2">:</span>
                <span>{employee.designation || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">IFSC Code</span>
                <span className="mx-2">:</span>
                <span>{employee.ifsc_code || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Department</span>
                <span className="mx-2">:</span>
                <span>{employee.department || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Branch Name</span>
                <span className="mx-2">:</span>
                <span>{employee.branch_name || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Date of Joining</span>
                <span className="mx-2">:</span>
                <span>{employee.uan_number || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Date of Birth</span>
                <span className="mx-2">:</span>
                <span>{formatDMY(employee.date_of_birth)}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">PF Number</span>
                <span className="mx-2">:</span>
                <span>{employee.pf_number || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Work Location</span>
                <span className="mx-2">:</span>
                <span>{employee.work_location || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">ESIC Number</span>
                <span className="mx-2">:</span>
                <span>{employee.esic_number || '-'}</span>
              </div>
            </div>
          </div>

          {/* Earnings and Deductions Table */}
          <div className="mb-6">
            <div className="grid grid-cols-4 bg-primary text-primary-foreground text-sm font-semibold">
              <div className="p-3 border-r border-primary-foreground/20">Earnings</div>
              <div className="p-3 border-r border-primary-foreground/20 text-right">Amount (Rs.)</div>
              <div className="p-3 border-r border-primary-foreground/20">Deductions</div>
              <div className="p-3 text-right">Amount (Rs.)</div>
            </div>
            <div className="border border-t-0 border-border">
              <div className="grid grid-cols-4 text-sm border-b border-border">
                <div className="p-3 border-r border-border">Basic Salary</div>
                <div className="p-3 border-r border-border text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.basic_salary}
                      onChange={(e) => handleSalaryChange('basic_salary', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.basic_salary || 0).toFixed(2)
                  )}
                </div>
                <div className="p-3 border-r border-border">PF</div>
                <div className="p-3 text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.pf_deduction}
                      onChange={(e) => handleSalaryChange('pf_deduction', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.pf_deduction || 0).toFixed(2)
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 text-sm border-b border-border">
                <div className="p-3 border-r border-border">HRA</div>
                <div className="p-3 border-r border-border text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.hra}
                      onChange={(e) => handleSalaryChange('hra', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.hra || 0).toFixed(2)
                  )}
                </div>
                <div className="p-3 border-r border-border">ESI</div>
                <div className="p-3 text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.esi_deduction}
                      onChange={(e) => handleSalaryChange('esi_deduction', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.esi_deduction || 0).toFixed(2)
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 text-sm border-b border-border">
                <div className="p-3 border-r border-border">Other Allowances</div>
                <div className="p-3 border-r border-border text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.other_allowances}
                      onChange={(e) => handleSalaryChange('other_allowances', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.other_allowances || 0).toFixed(2)
                  )}
                </div>
                <div className="p-3 border-r border-border">Professional Tax</div>
                <div className="p-3 text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.professional_tax}
                      onChange={(e) => handleSalaryChange('professional_tax', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.professional_tax || 0).toFixed(2)
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 text-sm border-b border-border">
                <div className="p-3 border-r border-border"></div>
                <div className="p-3 border-r border-border text-right"></div>
                <div className="p-3 border-r border-border">Other Deductions</div>
                <div className="p-3 text-right">
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={currentSalary.other_deductions}
                      onChange={(e) => handleSalaryChange('other_deductions', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    Number(currentSalary.other_deductions || 0).toFixed(2)
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 text-sm font-semibold bg-muted">
                <div className="p-3 border-r border-border">Total Gross Earnings</div>
                <div className="p-3 border-r border-border text-right">{totalEarnings.toFixed(2)}</div>
                <div className="p-3 border-r border-border">Total Deductions</div>
                <div className="p-3 text-right">{totalDeductions.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Total Payable Days */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center">
                <span className="font-semibold w-40">Total Payable Days</span>
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm mt-2">
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Worked Full Day</span>
                  <span className="mx-2">:</span>
                  <span className="font-medium">{workedFullDays}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Worked Half Day</span>
                  <span className="mx-2">:</span>
                  <span className="font-medium">{workedHalfDays}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Worked Days</span>
                  <span className="mx-2">:</span>
                  <span className="font-medium">{workedPayableDaysLabel}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Holiday</span>
                  <span className="mx-2">:</span>
                  <span>{holiday}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Paid Leaves</span>
                  <span className="mx-2">:</span>
                  <span>{paidLeaves}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Weekly Off</span>
                  <span className="mx-2">:</span>
                  <span className="font-medium">{weeklyOff}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Payable */}
          <div className="bg-emerald-100 p-4 rounded mb-4">
            <h3 className="font-bold text-lg text-emerald-800">
              Total Net Payable : ₹ {netPayable.toFixed(2)}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Total Net Payable = Gross Earnings - Total Deductions
          </p>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            This PDF is system-generated, no signature required
          </div>
        </div>
      </div>
    );
  }
);

PayslipTemplate.displayName = "PayslipTemplate";

export default PayslipTemplate;
