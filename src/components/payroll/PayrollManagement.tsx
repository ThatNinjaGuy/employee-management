"use client";

import { useState } from "react";
import { payrollComponents, dummyPayrollData } from "@/data/payrollConfig";
import { PayrollCard } from "@/components/payroll/PayrollCard";
import { PayrollHeader } from "@/components/payroll/PayrollHeader";
import { PayrollActions } from "@/components/payroll/PayrollActions";
import { MonthlyPayroll } from "@/types/payroll";

export function PayrollManagement() {
  const [selectedMonth, setSelectedMonth] = useState<string>("March");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [payrollData, setPayrollData] = useState(dummyPayrollData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handlePayrollUpdate = (
    employeeId: string,
    updatedPayroll: MonthlyPayroll
  ) => {
    setPayrollData((prev) =>
      prev.map((employee) =>
        employee.employeeId === employeeId
          ? { ...employee, monthlyPayroll: updatedPayroll }
          : employee
      )
    );
  };

  return (
    <div className="min-h-screen bg-primary-darker p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PayrollHeader
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
        <PayrollActions />
        <div className="overflow-x-auto bg-primary-dark rounded-xl shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-400">Employee</th>
                <th
                  className="text-gray-400 py-4 px-4 text-center"
                  colSpan={payrollComponents.earnings.length}
                >
                  Earnings
                </th>
                <th
                  className="text-gray-400 py-4 px-4 text-center"
                  colSpan={payrollComponents.deductions.length}
                >
                  Deductions
                </th>
                <th className="text-gray-400 py-4 px-4 text-right">
                  Net Payable
                </th>
                <th className="text-gray-400 py-4 px-4 text-right">Actions</th>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-4 text-gray-400"></th>
                {payrollComponents.earnings.map((component) => (
                  <th
                    key={component.id}
                    className="py-2 px-4 text-gray-400 text-right"
                  >
                    {component.name}
                  </th>
                ))}
                {payrollComponents.deductions.map((component) => (
                  <th
                    key={component.id}
                    className="py-2 px-4 text-gray-400 text-right"
                  >
                    {component.name}
                  </th>
                ))}
                <th className="py-2 px-4"></th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((employee) => (
                <PayrollCard
                  key={employee.employeeId}
                  employee={employee}
                  payrollConfig={payrollComponents}
                  onUpdate={handlePayrollUpdate}
                  isEditing={editingId === employee.employeeId}
                  onEditClick={() => setEditingId(employee.employeeId)}
                  onSave={() => setEditingId(null)}
                  onCancel={() => setEditingId(null)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
