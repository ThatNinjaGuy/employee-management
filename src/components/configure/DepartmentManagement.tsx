"use client";

import { useState } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useToast } from "@/context/ToastContext";
import { configService } from "@/services/configService";

export function DepartmentManagement() {
  const { departments, isLoading } = useDepartments();
  const [newDepartment, setNewDepartment] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<{
    original: string;
    current: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return;

    try {
      setIsSaving(true);
      const updatedDepartments = [...departments, newDepartment];
      await configService.updateDepartments(updatedDepartments);
      setNewDepartment("");
      showToast("Department added successfully", "success");
    } catch (error) {
      console.error("Failed to add department:", error);
      showToast("Failed to add department", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment || !editingDepartment.current.trim()) return;

    try {
      setIsSaving(true);
      const updatedDepartments = departments.map((dept) =>
        dept === editingDepartment.original ? editingDepartment.current : dept
      );
      await configService.updateDepartments(updatedDepartments);
      setEditingDepartment(null);
      showToast("Department updated successfully", "success");
    } catch (error) {
      console.error("Failed to update department:", error);
      showToast("Failed to update department", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDepartment = async (department: string) => {
    try {
      setIsSaving(true);
      const updatedDepartments = departments.filter(
        (dept) => dept !== department
      );
      await configService.updateDepartments(updatedDepartments);
      showToast("Department deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete department:", error);
      showToast("Failed to delete department", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isSaving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-darkest via-primary-dark to-primary-main flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-main"></div>
      </div>
    );
  }

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
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  {editingDepartment?.original === dept ? (
                    <input
                      type="text"
                      value={editingDepartment.current}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
                          current: e.target.value,
                        })
                      }
                      className="flex-1 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
                    />
                  ) : (
                    <span className="text-white">{dept}</span>
                  )}
                  <div className="flex gap-2">
                    {editingDepartment?.original === dept ? (
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
                            setEditingDepartment({
                              original: dept,
                              current: dept,
                            })
                          }
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept)}
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
