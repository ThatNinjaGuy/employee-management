"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { EmployeePayroll } from "@/types";
import { payrollService } from "@/services/payrollService";

interface PayrollContextType {
  payrollData: EmployeePayroll[];
  loading: boolean;
  error: string | null;
  updatePayroll: (payroll: EmployeePayroll) => Promise<void>;
  fetchPayrollByMonth: (month: string) => Promise<void>;
  fetchPayrollForMonths: (months: string[]) => Promise<void>;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export function PayrollProvider({ children }: { children: React.ReactNode }) {
  const [payrollData, setPayrollData] = useState<EmployeePayroll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayrollByMonth = useCallback(async (month: string) => {
    try {
      setLoading(true);
      const data = await payrollService.getPayrollByMonth(month);
      setPayrollData((prev) => {
        const filtered = prev.filter((p) => p.month !== month);
        return [...filtered, ...data];
      });
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payroll data";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayrollForMonths = useCallback(async (months: string[]) => {
    try {
      setLoading(true);
      const results = await Promise.all(
        months.map((month) => payrollService.getPayrollByMonth(month))
      );

      // Combine all results and remove duplicates
      setPayrollData((prev) => {
        const newData = results.flat();
        const existingMonths = new Set(newData.map((p) => p.month));
        const filtered = prev.filter((p) => !existingMonths.has(p.month));
        return [...filtered, ...newData];
      });

      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payroll data";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayroll = useCallback(async (payroll: EmployeePayroll) => {
    try {
      setLoading(true);
      await payrollService.updatePayroll(payroll);

      // Update the payroll in the current state instead of refetching
      setPayrollData((prev) => {
        const index = prev.findIndex((p) => p.id === payroll.id);
        if (index === -1) {
          return [...prev, payroll];
        }
        const updated = [...prev];
        updated[index] = payroll;
        return updated;
      });

      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update payroll";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PayrollContext.Provider
      value={{
        payrollData,
        loading,
        error,
        updatePayroll,
        fetchPayrollByMonth,
        fetchPayrollForMonths,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  const context = useContext(PayrollContext);
  if (context === undefined) {
    throw new Error("usePayroll must be used within a PayrollProvider");
  }
  return context;
}
