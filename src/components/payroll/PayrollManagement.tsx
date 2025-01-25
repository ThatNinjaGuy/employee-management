"use client";

import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ValueSetterParams,
  ICellRendererParams,
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  NumberEditorModule,
  ValidationModule,
  RenderApiModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// import { payrollConfig } from "@/types/payroll";
import { employeePayrolls } from "@/data/dummy";
import { useEmployees } from "@/context/EmployeeContext";
import { PayrollHeader } from "./PayrollHeader";
import { EmployeePayroll } from "@/types";
import { utils, writeFile } from "xlsx";

// Register all required modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  NumberEditorModule,
  ValidationModule,
  RenderApiModule,
]);

export function PayrollManagement() {
  const { employees } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [payrollData, setPayrollData] = useState(employeePayrolls);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const calculateNetPayable = (payroll: EmployeePayroll) => {
    return (
      payroll.basicWage +
      payroll.overtime.amount -
      payroll.allowances.food -
      payroll.allowances.travel -
      payroll.deductions.advances -
      payroll.deductions.other
    );
  };

  // Prepare row data
  const rowData = useMemo(() => {
    return employees
      .filter((employee) => {
        const matchesSearch = employee.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDepartment =
          !selectedDepartment || employee.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
      })
      .map((employee) => {
        const payroll = payrollData.find(
          (p) => p.employeeId === employee.id && p.month === selectedMonth
        ) || {
          employeeId: employee.id,
          month: selectedMonth,
          basicWage: 0,
          overtime: { hours: 0, amount: 0 },
          allowances: { food: 0, travel: 0 },
          deductions: { advances: 0, other: 0 },
        };

        return {
          id: employee.id,
          name: employee.name,
          position: employee.position,
          basicWage: payroll.basicWage,
          overtimeHours: payroll.overtime.hours,
          overtimeAmount: payroll.overtime.amount,
          foodAllowance: payroll.allowances.food,
          travelAllowance: payroll.allowances.travel,
          advanceDeductions: payroll.deductions.advances,
          otherDeductions: payroll.deductions.other,
          netPayable: calculateNetPayable(payroll as EmployeePayroll),
        };
      });
  }, [employees, payrollData, selectedMonth, searchTerm, selectedDepartment]);

  // Column Definitions
  const columnDefs: ColDef[] = [
    {
      field: "name",
      headerName: "Employee",
      editable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div>
          <div className="font-medium">{params.data.name}</div>
          <div className="text-sm opacity-70">{params.data.position}</div>
        </div>
      ),
    },
    {
      field: "basicWage",
      headerName: "Basic Wage",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "basicWage"),
    },
    {
      field: "overtimeHours",
      headerName: "Overtime Hours",
      editable: true,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "overtimeHours"),
    },
    {
      field: "overtimeAmount",
      headerName: "Overtime Amount",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "overtimeAmount"),
    },
    {
      field: "foodAllowance",
      headerName: "Food Allowance",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "foodAllowance"),
    },
    {
      field: "travelAllowance",
      headerName: "Travel Allowance",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "travelAllowance"),
    },
    {
      field: "advanceDeductions",
      headerName: "Advances",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "advanceDeductions"),
    },
    {
      field: "otherDeductions",
      headerName: "Other Deductions",
      editable: true,
      valueFormatter: (params) => `₹${params.value}`,
      valueSetter: (params: ValueSetterParams) =>
        handleValueSetter(params, "otherDeductions"),
    },
    {
      field: "netPayable",
      headerName: "Net Payable",
      editable: false,
      valueFormatter: (params) => `₹${params.value}`,
      cellClass: "font-medium text-accent-main",
    },
  ];

  const handleValueSetter = (params: ValueSetterParams, field: string) => {
    const newValue = Number(params.newValue);
    if (isNaN(newValue)) return false;

    const updatedData = { ...params.data, [field]: newValue };

    // Calculate overtime amount if hours changed
    if (field === "overtimeHours") {
      const employee = employees.find((emp) => emp.id === updatedData.id);
      if (employee) {
        updatedData.overtimeAmount = newValue * employee.hourlyRate;
      }
    }

    // Create a temporary payroll object for net payable calculation
    const tempPayroll: EmployeePayroll = {
      employeeId: updatedData.id,
      month: selectedMonth,
      basicWage: updatedData.basicWage || 0,
      overtime: {
        hours: updatedData.overtimeHours || 0,
        amount: updatedData.overtimeAmount || 0,
      },
      allowances: {
        food: updatedData.foodAllowance || 0,
        travel: updatedData.travelAllowance || 0,
      },
      deductions: {
        advances: updatedData.advanceDeductions || 0,
        other: updatedData.otherDeductions || 0,
      },
      netPayable: 0,
      advances: updatedData.advanceDeductions || 0,
    };

    // Calculate net payable
    tempPayroll.netPayable = calculateNetPayable(tempPayroll);

    // Update payroll data
    setPayrollData((prev) => {
      const index = prev.findIndex(
        (p) =>
          p.employeeId === tempPayroll.employeeId && p.month === selectedMonth
      );
      if (index === -1) {
        return [...prev, tempPayroll];
      }
      const newData = [...prev];
      newData[index] = tempPayroll;
      return newData;
    });

    // Update all values in the row data
    params.data[field] = newValue;
    params.data.netPayable = tempPayroll.netPayable;

    // Force refresh the entire row
    if (params.node) {
      params.api.refreshCells({
        rowNodes: [params.node],
        force: true,
      });
    }

    return true;
  };

  // AG Grid default configuration
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleExportReport = () => {
    try {
      const exportData = employees.map((emp) => {
        const payroll = payrollData.find((p) => p.employeeId === emp.id) || {
          basicWage: 0,
          overtime: { hours: 0, amount: 0 },
          allowances: { food: 0, travel: 0 },
          deductions: { advances: 0, other: 0 },
          month: "-",
        };

        const netPayable =
          payroll.basicWage +
          payroll.overtime.amount -
          payroll.allowances.food -
          payroll.allowances.travel -
          payroll.deductions.advances -
          payroll.deductions.other;

        return {
          "Employee Name": emp.name,
          Department: emp.department,
          Position: emp.position,
          Month: payroll.month || "-",
          "Basic Wage": payroll.basicWage || 0,
          "Overtime Hours": payroll.overtime?.hours || 0,
          "Overtime Amount": payroll.overtime?.amount || 0,
          "Food Allowance": payroll.allowances?.food || 0,
          "Travel Allowance": payroll.allowances?.travel || 0,
          "Advances Deduction": payroll.deductions?.advances || 0,
          "Other Deductions": payroll.deductions?.other || 0,
          "Net Payable": netPayable || 0,
        };
      });

      // Configure column widths
      const ws = utils.json_to_sheet(exportData);
      const colWidths = [
        { wch: 20 }, // Employee Name
        { wch: 15 }, // Department
        { wch: 20 }, // Position
        { wch: 10 }, // Month
        { wch: 12 }, // Basic Wage
        { wch: 12 }, // Overtime Hours
        { wch: 12 }, // Overtime Amount
        { wch: 12 }, // Food Allowance
        { wch: 12 }, // Travel Allowance
        { wch: 12 }, // Advances Deduction
        { wch: 12 }, // Other Deductions
        { wch: 12 }, // Net Payable
      ];
      ws["!cols"] = colWidths;

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Payroll Report");

      writeFile(
        wb,
        `payroll-report-${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <PayrollHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onSearch={handleSearch}
          onDepartmentChange={handleDepartmentChange}
          handleExportReport={handleExportReport}
        />

        <div
          className="mt-8 ag-theme-alpine-dark"
          style={{ height: "600px", width: "100%" }}
        >
          <AgGridReact
            theme="legacy"
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            suppressClickEdit={false}
          />
        </div>
      </div>
    </div>
  );
}
