"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { departments } from "@/data/dummy";

export function DepartmentManagement() {
  const [departmentList, setDepartmentList] = useState(departments);
  const [newDepartment, setNewDepartment] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const { showToast } = useToast();

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      showToast("Department name cannot be empty", "error");
      return;
    }
    if (departmentList.includes(newDepartment)) {
      showToast("Department already exists", "error");
      return;
    }
    setDepartmentList([...departmentList, newDepartment]);
    setNewDepartment("");
    showToast("Department added successfully", "success");
  };

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return;
    if (!editingDepartment.name.trim()) {
      showToast("Department name cannot be empty", "error");
      return;
    }
    const newList = [...departmentList];
    newList[editingDepartment.index] = editingDepartment.name;
    setDepartmentList(newList);
    setEditingDepartment(null);
    showToast("Department updated successfully", "success");
  };

  const handleDeleteDepartment = (index: number) => {
    const newList = departmentList.filter((_, i) => i !== index);
    setDepartmentList(newList);
    showToast("Department deleted successfully", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main relative">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">
            Department Management
          </h1>

          {/* Add Department */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Enter department name"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              />
              <button
                onClick={handleAddDepartment}
                className="px-6 py-2 bg-accent-main text-primary-darkest font-medium rounded-xl hover:bg-accent-light transition-colors"
              >
                Add Department
              </button>
            </div>
          </div>

          {/* Department List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Departments List
            </h2>
            <div className="space-y-4">
              {departmentList.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  {editingDepartment?.index === index ? (
                    <input
                      type="text"
                      value={editingDepartment.name}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
                          name: e.target.value,
                        })
                      }
                      className="flex-1 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
                    />
                  ) : (
                    <span className="text-white">{dept}</span>
                  )}
                  <div className="flex gap-2">
                    {editingDepartment?.index === index ? (
                      <>
                        <button
                          onClick={handleUpdateDepartment}
                          className="px-4 py-2 bg-accent-main text-primary-darkest rounded-lg hover:bg-accent-light transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDepartment(null)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditingDepartment({ index, name: dept })
                          }
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(index)}
                          className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
