"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { EmployeePayroll } from "@/types";
import { employeePayrolls as initialPayrolls } from "@/data/dummy";

interface PayrollContextType {
  payrollData: EmployeePayroll[];
  updatePayroll: (updatedPayroll: EmployeePayroll) => void;
  addPayroll: (newPayroll: EmployeePayroll) => void;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export function PayrollProvider({ children }: { children: ReactNode }) {
  const [payrollData, setPayrollData] =
    useState<EmployeePayroll[]>(initialPayrolls);

  const updatePayroll = (updatedPayroll: EmployeePayroll) => {
    setPayrollData((prev) => {
      const index = prev.findIndex(
        (p) =>
          p.employeeId === updatedPayroll.employeeId &&
          p.month === updatedPayroll.month
      );
      if (index === -1) {
        return [...prev, updatedPayroll];
      }
      const newData = [...prev];
      newData[index] = updatedPayroll;
      return newData;
    });
  };

  const addPayroll = (newPayroll: EmployeePayroll) => {
    setPayrollData((prev) => [...prev, newPayroll]);
  };

  return (
    <PayrollContext.Provider value={{ payrollData, updatePayroll, addPayroll }}>
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
