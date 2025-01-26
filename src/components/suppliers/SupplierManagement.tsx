"use client";

import { useState, useEffect } from "react";
import { usePayroll } from "@/context/PayrollContext";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useEmployees } from "@/context/EmployeeContext";
import { SupplierPayablesHeader } from "./SupplierPayablesHeader";
import { SupplierPayablesGrid } from "./SupplierPayablesGrid";
import { useToast } from "@/context/ToastContext";

export function SupplierManagement() {
  const { payrollData, loading, error, fetchPayrollByMonth } = usePayroll();
  const { suppliers } = useSuppliers();
  const { employees, fetchEmployees } = useEmployees();
  const { showToast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees if not loaded
  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees.length, fetchEmployees]);

  // Fetch payroll data when month changes
  useEffect(() => {
    fetchPayrollByMonth(selectedMonth);
  }, [selectedMonth, fetchPayrollByMonth]);

  // Calculate supplier payables from payroll data
  const supplierPayables = suppliers.map((supplier) => {
    // Get all employees for this supplier
    const supplierEmployees = employees.filter(
      (emp) => emp.supplierId === supplier.id
    );

    // Calculate unique active sites
    const activeSitesCount = new Set(supplierEmployees.map((emp) => emp.siteId))
      .size;

    // Calculate total payable from payroll data
    const totalPayable = payrollData
      .filter((p) => {
        const employee = employees.find((e) => e.id === p.employeeId);
        return (
          employee?.supplierId === supplier.id && p.month === selectedMonth
        );
      })
      .reduce((total, payroll) => {
        const netPayable =
          payroll.basicWage +
          payroll.overtime.amount +
          payroll.allowances.food +
          payroll.allowances.travel -
          payroll.deductions.advances -
          payroll.deductions.other;

        return total + netPayable;
      }, 0);

    return {
      supplierId: supplier.id,
      supplierName: supplier.name,
      employeeCount: supplierEmployees.length,
      activeSitesCount,
      totalPayable,
      month: selectedMonth,
    };
  });

  const handleExportReport = async () => {
    try {
      // Implement export functionality here
      showToast("Report exported successfully", "success");
    } catch (error) {
      console.log("error", error);
      showToast("Failed to export report", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main flex justify-center items-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <SupplierPayablesHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          handleExportReport={handleExportReport}
        />

        <div className="mt-8 pb-24">
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <SupplierPayablesGrid
              payables={supplierPayables}
              searchTerm={searchTerm}
            />
          )}
        </div>
      </div>
    </div>
  );
}
