"use client";

import { useState } from "react";
import { useRoles } from "@/hooks/useRoles";
import { useToast } from "@/context/ToastContext";
import { configService } from "@/services/configService";

export function RoleManagement() {
  const { roles, isLoading, refresh } = useRoles();
  const [newRole, setNewRole] = useState("");
  const [editingRole, setEditingRole] = useState<{
    original: string;
    current: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    try {
      setIsSaving(true);
      const updatedRoles = [...roles, newRole];
      await configService.updateRoles(updatedRoles);
      setNewRole("");
      showToast("Role added successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to add role:", error);
      showToast("Failed to add role", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !editingRole.current.trim()) return;

    try {
      setIsSaving(true);
      const updatedRoles = roles.map((role) =>
        role === editingRole.original ? editingRole.current : role
      );
      await configService.updateRoles(updatedRoles);
      setEditingRole(null);
      showToast("Role updated successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to update role:", error);
      showToast("Failed to update role", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async (role: string) => {
    try {
      setIsSaving(true);
      const updatedRoles = roles.filter((r) => r !== role);
      await configService.updateRoles(updatedRoles);
      showToast("Role deleted successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to delete role:", error);
      showToast("Failed to delete role", "error");
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
            Role Management
          </h1>

          {/* Add Role */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter role name"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              />
              <button
                onClick={handleAddRole}
                className="px-6 py-2 bg-accent-main text-primary-darkest font-medium rounded-xl hover:bg-accent-light transition-colors"
              >
                Add Role
              </button>
            </div>
          </div>

          {/* Role List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Roles List
            </h2>
            <div className="space-y-4">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  {editingRole?.original === role ? (
                    <input
                      type="text"
                      value={editingRole.current}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          current: e.target.value,
                        })
                      }
                      className="flex-1 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
                    />
                  ) : (
                    <span className="text-white">{role}</span>
                  )}
                  <div className="flex gap-2">
                    {editingRole?.original === role ? (
                      <>
                        <button
                          onClick={handleUpdateRole}
                          className="px-4 py-2 bg-accent-main text-primary-darkest rounded-lg hover:bg-accent-light transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditingRole({
                              original: role,
                              current: role,
                            })
                          }
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
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
