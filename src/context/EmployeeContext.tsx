"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Employee } from "@/types";
import { employeeService } from "@/services/employeeService";
import { useToast } from "./ToastContext";

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch employees";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateEmployee = useCallback(
    async (employee: Employee) => {
      try {
        setLoading(true);
        await employeeService.updateEmployee(employee);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === employee.id ? employee : emp))
        );
        showToast("Employee updated successfully", "success");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update employee";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await employeeService.deleteEmployee(id);
        await fetchEmployees(); // Refresh the list
        showToast("Employee deleted successfully", "success");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete employee";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchEmployees, showToast]
  );

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        fetchEmployees,
        updateEmployee,
        deleteEmployee,
      }}
    >
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
