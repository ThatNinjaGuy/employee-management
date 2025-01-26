"use client";

import { useState, useEffect } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { usePayroll } from "@/context/PayrollContext";
import { EmployeePayroll } from "@/types";

interface ChartData {
  employeeCountData: { month: string; count: number }[];
  payablesData: EmployeePayroll[];
}

export function useReportData() {
  const { employees, fetchEmployees } = useEmployees();
  const { payrollData, fetchPayrollForMonths } = usePayroll();
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        if (employees.length === 0) {
          await fetchEmployees();
        }

        if (payrollData.length === 0) {
          const months = [];
          for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toISOString().slice(0, 7)); // Format: YYYY-MM
          }

          await fetchPayrollForMonths(months);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch initial data")
        );
      }
    }

    loadInitialData();
  }, []); // Run once on mount

  useEffect(() => {
    try {
      console.log("employees", employees);
      console.log("payrollData", payrollData);
      // Group employees by join date month
      const employeesByMonth = employees.reduce((acc, emp) => {
        const month = new Date(emp.joinDate).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sum payroll amounts by month
      const payablesByMonth = payrollData.reduce((acc, payroll) => {
        const month = new Date(payroll.month).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + payroll.netPayable;
        return acc;
      }, {} as Record<string, number>);

      // Convert to chart format
      const months = [
        ...new Set([
          ...Object.keys(employeesByMonth),
          ...Object.keys(payablesByMonth),
        ]),
      ].sort();

      setData({
        employeeCountData: months.map((month) => ({
          month,
          count: employeesByMonth[month] || 0,
        })),
        payablesData: payrollData.filter((payroll) =>
          months.includes(payroll.month)
        ),
      });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to process report data")
      );
    } finally {
      setLoading(false);
    }
  }, [employees, payrollData]);

  return { data, loading, error };
}
