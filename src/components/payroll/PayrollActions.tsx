"use client";

import { utils, writeFile } from "xlsx";

interface PayrollActionsProps {
  onSearch?: (term: string) => void;
  onDepartmentChange?: (department: string) => void;
  employeeData?: Array<{
    id: number;
    name: string;
    department: string;
    position: string;
  }>;
  payrollData?: Array<{
    employeeId: number;
    month: string;
    basicWage: number;
    overtime: { hours: number; amount: number };
    allowances: { food: number; travel: number };
    deductions: { advances: number; other: number };
  }>;
}

export function PayrollActions({
  onSearch,
  onDepartmentChange,
  employeeData = [],
  payrollData = [],
}: PayrollActionsProps) {
  const handleExportReport = () => {
    try {
      const exportData = employeeData.map((emp) => {
        const payroll = payrollData.find((p) => p.employeeId === emp.id) || {
          basicWage: 0,
          overtime: { hours: 0, amount: 0 },
          allowances: { food: 0, travel: 0 },
          deductions: { advances: 0, other: 0 },
          month: "-",
        };

        const netPayable =
          payroll.basicWage +
          payroll.overtime.amount +
          payroll.allowances.food +
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
    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-accent-main text-white rounded-xl hover:bg-accent-light transition-colors duration-300">
          Generate Payslips
        </button>
        <button
          onClick={() => {
            console.log("Button clicked");
            handleExportReport();
          }}
          className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors duration-300"
        >
          Export Report
        </button>
      </div>

      <div className="flex gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <input
            type="text"
            placeholder="Search employees..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main placeholder:text-white/50"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          onChange={(e) => onDepartmentChange?.(e.target.value)}
          className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-main"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>
    </div>
  );
}
