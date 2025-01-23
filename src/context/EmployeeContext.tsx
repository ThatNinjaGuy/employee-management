"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Employee } from "@/types";
import { employees as initialEmployees } from "@/data/dummy";

interface EmployeeContextType {
  employees: Employee[];
  updateEmployee: (employee: Employee) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  };

  return (
    <EmployeeContext.Provider value={{ employees, updateEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
}
