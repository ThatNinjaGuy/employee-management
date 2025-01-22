"use client";

import { useState } from "react";
import { employees as initialEmployees } from "@/data/dummy";
import { Employee } from "@/types";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // Get unique departments
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

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleSave = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setEditingEmployee(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="border p-4 rounded-lg shadow-sm">
            {editingEmployee?.id === employee.id ? (
              <EmployeeEditForm
                employee={employee}
                onSave={handleSave}
                onCancel={() => setEditingEmployee(null)}
              />
            ) : (
              <EmployeeCard
                employee={employee}
                onEdit={() => handleEdit(employee)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeCard({
  employee,
  onEdit,
}: {
  employee: Employee;
  onEdit: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">{employee.name}</h2>
        <p>{employee.email}</p>
        <p>
          {employee.position} - {employee.department}
        </p>
        <p>Joined: {employee.joinDate}</p>
      </div>
      <button
        onClick={onEdit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit
      </button>
    </div>
  );
}

function EmployeeEditForm({
  employee,
  onSave,
  onCancel,
}: {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(employee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Position:</label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Department:</label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          className="border p-2 w-full"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
