"use client";

import { useState, useEffect } from "react";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeEditForm } from "./EmployeeEditForm";
import { EmployeeFilters } from "./EmployeeFilters";
import { useEmployees } from "@/context/EmployeeContext";
import { useDepartments } from "@/hooks/useDepartments";
import { Employee } from "@/types";
import { useToast } from "@/context/ToastContext";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useSites } from "@/hooks/useSites";

export function EmployeeManagement() {
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    updateEmployee,
    addEmployee,
  } = useEmployees();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const { departments } = useDepartments();
  const { suppliers } = useSuppliers();
  const { sites } = useSites();

  const { showToast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? employee.department === selectedDepartment
      : true;

    const matchesSite = selectedSiteId
      ? employee.siteId && employee.siteId === selectedSiteId
      : true;

    const matchesSupplier = selectedSupplierId
      ? employee.supplierId && employee.supplierId === selectedSupplierId
      : true;

    const finalResult =
      matchesSearch && matchesDepartment && matchesSite && matchesSupplier;

    return finalResult;
  });

  const handleSave = async (employee: Employee) => {
    try {
      if (editingEmployee) {
        await updateEmployee(employee);
        setEditingEmployee(null);
        showToast("Employee updated successfully", "success");
      } else {
        await addEmployee(employee);
        setIsAddingEmployee(false);
        showToast("Employee added successfully", "success");
      }
    } catch (error) {
      console.error("Failed to save employee:", error);
      showToast(
        `Failed to ${editingEmployee ? "update" : "add"} employee`,
        "error"
      );
    }
  };

  // Combine both edit and add modals into a single JSX
  const renderEmployeeModal = () => {
    const isEditing = !!editingEmployee;
    const employee = editingEmployee || {
      id: Date.now(),
      name: "",
      email: "",
      position: "",
      department: "",
      joinDate: new Date().toISOString().slice(0, 10),
      hourlyRate: 0,
    };

    if (!isEditing && !isAddingEmployee) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-primary-main rounded-2xl p-6 w-full max-w-2xl mx-4">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <EmployeeEditForm
            employee={employee}
            onSave={handleSave}
            onCancel={() => {
              setEditingEmployee(null);
              setIsAddingEmployee(false);
            }}
          />
        </div>
      </div>
    );
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
              selectedSiteId={selectedSiteId}
              setSelectedSiteId={setSelectedSiteId}
              selectedSupplierId={selectedSupplierId}
              setSelectedSupplierId={setSelectedSupplierId}
              departments={departments}
              sites={sites}
              suppliers={suppliers}
              onAddEmployee={() => setIsAddingEmployee(true)}
            />
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-main/20 to-accent-light/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <EmployeeCard
                employee={employee}
                onEdit={() => setEditingEmployee(employee)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Employee Modal - for both edit and add */}
      {renderEmployeeModal()}
    </div>
  );
}
