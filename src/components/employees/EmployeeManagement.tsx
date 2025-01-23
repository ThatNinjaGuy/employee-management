"use client";

import { useState } from "react";
import { employees as initialEmployees } from "@/data/dummy";
import { Employee } from "@/types";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeEditForm } from "./EmployeeEditForm";
import { EmployeeFilters } from "./EmployeeFilters";

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  );

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment
      ? employee.department === selectedDepartment
      : true;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-b from-primary-darkest/50 to-transparent backdrop-blur-xl rounded-[3rem]" />
          <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-center tracking-tight mb-8">
              Employee Directory
            </h1>

            <EmployeeFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              departments={departments}
            />
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-main/20 to-accent-light/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {editingEmployee?.id === employee.id ? (
                <EmployeeEditForm
                  employee={employee}
                  onSave={(updated) => {
                    setEmployees(
                      employees.map((emp) =>
                        emp.id === updated.id ? updated : emp
                      )
                    );
                    setEditingEmployee(null);
                  }}
                  onCancel={() => setEditingEmployee(null)}
                />
              ) : (
                <EmployeeCard
                  employee={employee}
                  onEdit={() => setEditingEmployee(employee)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
