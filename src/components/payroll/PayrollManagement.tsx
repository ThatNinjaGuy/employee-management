"use client";

import { useState } from "react";
import { payrollComponents, dummyPayrollData } from "@/data/payrollConfig";
import { PayrollCard } from "@/components/payroll/PayrollCard";
import { PayrollHeader } from "@/components/payroll/PayrollHeader";
import { PayrollActions } from "@/components/payroll/PayrollActions";

export function PayrollManagement() {
  const [selectedMonth, setSelectedMonth] = useState<string>("March");
  const [selectedYear, setSelectedYear] = useState<number>(2024);

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

        <div className="grid grid-cols-1 gap-6">
          {dummyPayrollData.map((employee) => (
            <PayrollCard
              key={employee.employeeId}
              employee={employee}
              payrollConfig={payrollComponents}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
