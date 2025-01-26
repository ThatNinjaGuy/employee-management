"use client";

import { useState, useEffect, useRef } from "react";
import { PayrollHeader } from "./PayrollHeader";
import { PayrollGrid } from "./PayrollGrid";
import { exportPayrollToExcel } from "@/utils/excelExport";
import { useEmployees } from "@/context/EmployeeContext";
import { usePayroll } from "@/context/PayrollContext";
import { useToast } from "@/context/ToastContext";
import { EmployeePayroll } from "@/types";

export function PayrollManagement() {
  const { employees, fetchEmployees } = useEmployees();
  const { payrollData, loading, error, fetchPayrollByMonth, updatePayroll } =
    usePayroll();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const prevMonthRef = useRef<string | null>(null);

  const { showToast } = useToast();

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Fetch payroll data when month changes
  useEffect(() => {
    if (prevMonthRef.current !== selectedMonth) {
      fetchPayrollByMonth(selectedMonth);
      prevMonthRef.current = selectedMonth;
    }
  }, [selectedMonth, fetchPayrollByMonth]);

  const handleSavePayroll = async (payrollsToUpdate: EmployeePayroll[]) => {
    try {
      setIsSaving(true);
      // Wait for all payroll updates to complete
      await Promise.all(
        payrollsToUpdate.map((payroll) => updatePayroll(payroll))
      );

      // Refresh data
      await fetchPayrollByMonth(selectedMonth);
      showToast("Payroll updated successfully", "success");
    } catch (error) {
      console.error("Failed to update payroll", error);
      showToast("Failed to update payroll", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleExportReport = () => {
    const config = {
      columnWidths: [
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
      ],
      fileName: `payroll-report-${selectedMonth}${
        selectedDepartment ? `-${selectedDepartment}` : ""
      }-${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`,
    };

    const success = exportPayrollToExcel({ employees, payrollData }, config);

    if (success) {
      showToast("Report exported successfully", "success");
    } else {
      showToast("Failed to export report", "error");
    }
  };

  if (loading || isSaving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-main"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <PayrollHeader
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          onSearch={handleSearch}
          onDepartmentChange={handleDepartmentChange}
          handleExportReport={handleExportReport}
        />

        <div className="mt-8 pb-24">
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <PayrollGrid
              selectedMonth={selectedMonth}
              payrollData={payrollData}
              searchTerm={searchTerm}
              selectedDepartment={selectedDepartment}
              onSavePayroll={handleSavePayroll}
              disabled={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
