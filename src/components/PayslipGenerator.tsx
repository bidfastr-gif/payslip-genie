import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PayslipTemplate from "./PayslipTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

interface PayslipGeneratorProps {
  employees: Employee[];
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => (currentYear - 10 + i).toString());
const days = Array.from({ length: 32 }, (_, i) => i.toString());

const PayslipGenerator = ({ employees }: PayslipGeneratorProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear.toString());
  const [workedDays, setWorkedDays] = useState(0);
  const [weeklyOff, setWeeklyOff] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const [paidLeaves, setPaidLeaves] = useState(0);
  const [showPayslip, setShowPayslip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState({
    basic_salary: 0,
    hra: 0,
    other_allowances: 0,
    pf_deduction: 0,
    esi_deduction: 0,
    professional_tax: 0,
    other_deductions: 0,
  });
  const [pfDeductionInput, setPfDeductionInput] = useState(0);
  const [esiDeductionInput, setEsiDeductionInput] = useState(0);
  const [professionalTaxInput, setProfessionalTaxInput] = useState(0);
  const [otherDeductionsInput, setOtherDeductionsInput] = useState(0);
  
  const payslipRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (payslipRef.current) {
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Payslip_${selectedEmployee?.name}_${month}_${year}.pdf`);
    }
  };

  const handleGeneratePayslip = () => {
    if (selectedEmployee) {
      setSalaryDetails({
        basic_salary: selectedEmployee.basic_salary,
        hra: selectedEmployee.hra,
        other_allowances: selectedEmployee.other_allowances,
        pf_deduction: pfDeductionInput,
        esi_deduction: esiDeductionInput,
        professional_tax: professionalTaxInput,
        other_deductions: otherDeductionsInput,
      });
      setShowPayslip(true);
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setSelectedEmployee(employee || null);
    setPfDeductionInput(Number(employee?.pf_deduction || 0));
    setEsiDeductionInput(Number(employee?.esi_deduction || 0));
    setProfessionalTaxInput(Number(employee?.professional_tax || 0));
    setOtherDeductionsInput(Number(employee?.other_deductions || 0));
    setShowPayslip(false);
  };

  const getDaysInMonth = (yearStr: string, monthName: string) => {
    const idx = months.indexOf(monthName);
    const y = Number(yearStr);
    if (idx < 0 || Number.isNaN(y)) return 30;
    return new Date(y, idx + 1, 0).getDate();
  };

  useEffect(() => {
    if (!selectedEmployee) return;
    const totalDays = getDaysInMonth(year, month);
    const accounted = Math.min(workedDays + weeklyOff + holiday + paidLeaves, totalDays);
    const missing = Math.max(totalDays - accounted, 0);
    const monthlyGross = selectedEmployee.basic_salary + selectedEmployee.hra + selectedEmployee.other_allowances;
    const perDay = totalDays > 0 ? monthlyGross / totalDays : 0;
    const deduction = Number((missing * perDay).toFixed(2));
    setOtherDeductionsInput(deduction);
  }, [selectedEmployee, workedDays, weeklyOff, holiday, paidLeaves, month, year]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Payslip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Employee</Label>
              <Select onValueChange={handleEmployeeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} {employee.code ? `(${employee.code})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Total Working Days</Label>
              <Input
                type="number"
                value={getDaysInMonth(year, month)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Worked Days</Label>
              <Select value={workedDays.toString()} onValueChange={(v) => setWorkedDays(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Weekly Off</Label>
              <Select value={weeklyOff.toString()} onValueChange={(v) => setWeeklyOff(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Holiday</Label>
              <Select value={holiday.toString()} onValueChange={(v) => setHoliday(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paid Leaves</Label>
              <Select value={paidLeaves.toString()} onValueChange={(v) => setPaidLeaves(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <h3 className="font-semibold text-lg mt-2">Deduction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PF Deduction (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={pfDeductionInput}
                onChange={(e) => setPfDeductionInput(Number(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>ESI Deduction (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={esiDeductionInput}
                onChange={(e) => setEsiDeductionInput(Number(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Professional Tax (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={professionalTaxInput}
                onChange={(e) => setProfessionalTaxInput(Number(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Other Deductions (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={otherDeductionsInput}
                onChange={(e) => setOtherDeductionsInput(Number(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleGeneratePayslip} disabled={!selectedEmployee}>
              Generate Payslip
            </Button>
            {showPayslip && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Save Changes" : "Edit Payslip"}
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF}>
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {showPayslip && selectedEmployee && (
        <PayslipTemplate
          ref={payslipRef}
          employee={selectedEmployee}
          month={month}
          year={year}
          workedDays={workedDays}
          weeklyOff={weeklyOff}
          holiday={holiday}
          paidLeaves={paidLeaves}
          salaryDetails={salaryDetails}
          onSalaryDetailsChange={setSalaryDetails}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default PayslipGenerator;
