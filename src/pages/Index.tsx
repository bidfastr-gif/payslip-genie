import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmployeeForm from "@/components/EmployeeForm";
import PayslipGenerator from "@/components/PayslipGenerator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, LogOut, Pen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type EmployeeRow = Tables<"employees">;
type EmployeeInsert = TablesInsert<"employees">;
type EmployeeUpdate = TablesUpdate<"employees">;

const sanitizeEmployeeInsertData = (data: EmployeeInsert): EmployeeInsert => ({
  ...data,
  code: data.code === "" ? null : data.code,
  designation: data.designation === "" ? null : data.designation,
  department: data.department === "" ? null : data.department,
  company: data.company === "" ? null : data.company ?? null,
  uan_number: data.uan_number === "" ? null : data.uan_number,
  work_location: data.work_location === "" ? null : data.work_location,
  bank_name: data.bank_name === "" ? null : data.bank_name,
  bank_account_no: data.bank_account_no === "" ? null : data.bank_account_no,
  ifsc_code: data.ifsc_code === "" ? null : data.ifsc_code,
  branch_name: data.branch_name === "" ? null : data.branch_name,
  pf_number: data.pf_number === "" ? null : data.pf_number,
  esic_number: data.esic_number === "" ? null : data.esic_number,
  basic_salary: isNaN(Number(data.basic_salary)) ? 0 : Number(data.basic_salary),
  hra: isNaN(Number(data.hra)) ? 0 : Number(data.hra),
  other_allowances: isNaN(Number(data.other_allowances)) ? 0 : Number(data.other_allowances),
  pf_deduction: isNaN(Number(data.pf_deduction)) ? 0 : Number(data.pf_deduction),
  esi_deduction: isNaN(Number(data.esi_deduction)) ? 0 : Number(data.esi_deduction),
  professional_tax: isNaN(Number(data.professional_tax)) ? 0 : Number(data.professional_tax),
  other_deductions: isNaN(Number(data.other_deductions)) ? 0 : Number(data.other_deductions),
});

const sanitizeEmployeeUpdateData = (data: EmployeeUpdate): EmployeeUpdate => ({
  ...data,
  code: data.code === "" ? null : data.code,
  designation: data.designation === "" ? null : data.designation,
  department: data.department === "" ? null : data.department,
  company: data.company === "" ? null : data.company ?? null,
  uan_number: data.uan_number === "" ? null : data.uan_number,
  work_location: data.work_location === "" ? null : data.work_location,
  bank_name: data.bank_name === "" ? null : data.bank_name,
  bank_account_no: data.bank_account_no === "" ? null : data.bank_account_no,
  ifsc_code: data.ifsc_code === "" ? null : data.ifsc_code,
  branch_name: data.branch_name === "" ? null : data.branch_name,
  pf_number: data.pf_number === "" ? null : data.pf_number,
  esic_number: data.esic_number === "" ? null : data.esic_number,
  basic_salary: isNaN(Number(data.basic_salary ?? 0)) ? 0 : Number(data.basic_salary),
  hra: isNaN(Number(data.hra ?? 0)) ? 0 : Number(data.hra),
  other_allowances: isNaN(Number(data.other_allowances ?? 0)) ? 0 : Number(data.other_allowances),
  pf_deduction: isNaN(Number(data.pf_deduction ?? 0)) ? 0 : Number(data.pf_deduction),
  esi_deduction: isNaN(Number(data.esi_deduction ?? 0)) ? 0 : Number(data.esi_deduction),
  professional_tax: isNaN(Number(data.professional_tax ?? 0)) ? 0 : Number(data.professional_tax),
  other_deductions: isNaN(Number(data.other_deductions ?? 0)) ? 0 : Number(data.other_deductions),
});

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("generate");
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const { data: employees = [], isLoading } = useQuery<EmployeeRow[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const departments = Array.from(
    new Set((employees || []).map((e) => e.department).filter((d): d is string => !!d))
  );

  const filteredEmployees = (employees || []).filter((e) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term.length === 0 ||
      e.name.toLowerCase().includes(term) ||
      (e.code || "").toLowerCase().includes(term) ||
      (e.designation || "").toLowerCase().includes(term) ||
      (e.department || "").toLowerCase().includes(term);
    const matchesDept = departmentFilter === "all" || (e.department || "") === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const exportEmployeesCSV = () => {
    const rows: Record<string, string>[] = filteredEmployees.map((e) => ({
      Name: e.name,
      Code: e.code ?? "",
      Designation: e.designation ?? "",
      Department: e.department ?? "",
      "Basic Salary": Number(e.basic_salary ?? 0).toFixed(2),
      HRA: Number(e.hra ?? 0).toFixed(2),
      "Other Allowances": Number(e.other_allowances ?? 0).toFixed(2),
      "PF Deduction": Number(e.pf_deduction ?? 0).toFixed(2),
      "ESI Deduction": Number(e.esi_deduction ?? 0).toFixed(2),
      "Professional Tax": Number(e.professional_tax ?? 0).toFixed(2),
      "Other Deductions": Number(e.other_deductions ?? 0).toFixed(2),
      "Bank Name": e.bank_name ?? "",
      "Bank A/C No.": e.bank_account_no ?? "",
      "IFSC Code": e.ifsc_code ?? "",
      "Branch Name": e.branch_name ?? "",
      "UAN Number": e.uan_number ?? "",
      "PF Number": e.pf_number ?? "",
      "ESIC Number": e.esic_number ?? "",
      "Work Location": e.work_location ?? "",
    }));

    const headers = Object.keys(rows[0] || { Name: "", Code: "" });
    const escape = (val: string) =>
      `"${String(val).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((row) => headers.map((h) => escape(row[h])).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    link.href = url;
    link.download = `employees_${y}${m}${d}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateEmployee = useMutation<EmployeeRow, Error, EmployeeUpdate>({
    mutationFn: async (employeeData) => {
      // Sanitize fields
      const sanitizedData = sanitizeEmployeeUpdateData(employeeData);

      const { data, error } = await supabase
        .from("employees")
        .update(sanitizedData)
        .eq("id", editingEmployee!.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee updated successfully!",
      });
      setEditingEmployee(null);
      setActiveTab("employees");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating employee:", error);
    },
  });

  const addEmployee = useMutation<EmployeeRow, Error, EmployeeInsert>({
    mutationFn: async (employeeData) => {
      // Sanitize fields
      const sanitizedData = sanitizeEmployeeInsertData(employeeData);

      const { data, error } = await supabase
        .from("employees")
        .insert([sanitizedData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
      setActiveTab("employees");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding employee:", error);
    },
  });

  const handleEditEmployee = (employee: EmployeeRow) => {
    setEditingEmployee(employee);
    setActiveTab("add");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== "add") {
      setEditingEmployee(null);
    }
  };

  const handleSubmit = (data: EmployeeInsert) => {
    if (editingEmployee) {
      updateEmployee.mutate(data as EmployeeUpdate);
    } else {
      addEmployee.mutate(data);
    }
  };


  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting employee:", error);
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payslip Generator</h1>
            <p className="text-muted-foreground mt-2">
              Manage employees and generate payslips
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="generate">Generate Payslip</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="add">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            {isLoading ? (
              <div className="text-center py-8">Loading employees...</div>
            ) : employees.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No employees found. Please add employees first.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <PayslipGenerator employees={employees} />
            )}
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Search by name, code, designation, dept"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-2 flex justify-end">
                    <Button variant="outline" onClick={exportEmployeesCSV}>
                      Export CSV
                    </Button>
                  </div>
                </div>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No employees added yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Designation</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Basic Salary</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{employee.code || '-'}</TableCell>
                            <TableCell>{employee.designation || '-'}</TableCell>
                            <TableCell>{employee.department || '-'}</TableCell>
                            <TableCell>₹{Number(employee.basic_salary || 0).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditEmployee(employee)}
                                >
                                  <Pen className="h-4 w-4 text-primary" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteEmployee.mutate(employee.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <EmployeeForm 
              onSubmit={handleSubmit} 
              isLoading={addEmployee.isPending || updateEmployee.isPending}
              initialData={editingEmployee}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
