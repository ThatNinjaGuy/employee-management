"use client";

import { useState } from "react";
import { payrollConfig } from "@/data/payrollConfig";
import { employeePayrolls } from "@/data/dummy";
import { useEmployees } from "@/context/EmployeeContext";
import { PayrollCard } from "./PayrollCard";
import { PayrollHeader } from "./PayrollHeader";
import { PayrollActions } from "./PayrollActions";
import { EmployeePayroll } from "@/types";

export function PayrollManagement() {
  const { employees } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format
  const [payrollData, setPayrollData] = useState(employeePayrolls);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Add console.log to debug
  console.log({
    selectedMonth,
    payrollData,
    filteredPayroll: payrollData.filter((p) => p.month === selectedMonth),
  });

  const handlePayrollUpdate = (
    employeeId: number,
    updatedPayroll: EmployeePayroll
  ) => {
    setPayrollData((prev) =>
      prev.map((payroll) =>
        payroll.employeeId === employeeId ? updatedPayroll : payroll
      )
    );
  };

  const filteredPayroll = payrollData.filter((p) => p.month === selectedMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <PayrollHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <PayrollActions />

        <div className="mt-8 overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/70">Employee</th>
                <th className="text-right py-4 px-4 text-white/70">
                  Basic Wage
                </th>
                <th className="text-right py-4 px-4 text-white/70">Overtime</th>
                <th className="text-right py-4 px-4 text-white/70">
                  Allowances
                </th>
                <th className="text-right py-4 px-4 text-white/70">
                  Deductions
                </th>
                <th className="text-right py-4 px-4 text-white/70">
                  Net Payable
                </th>
                <th className="text-right py-4 px-4 text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const payroll = filteredPayroll.find(
                  (p) => p.employeeId === employee.id
                );
                return (
                  <PayrollCard
                    key={employee.id}
                    employee={employee}
                    payroll={payroll}
                    payrollConfig={payrollConfig}
                    isEditing={editingId === employee.id}
                    onEditClick={() => setEditingId(employee.id)}
                    onSave={(updatedPayroll) => {
                      handlePayrollUpdate(employee.id, updatedPayroll);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
