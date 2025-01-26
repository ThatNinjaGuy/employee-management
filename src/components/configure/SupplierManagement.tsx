"use client";

import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useToast } from "@/context/ToastContext";
import { configService } from "@/services/configService";
import { Supplier } from "@/types";

export function SupplierManagement() {
  const { suppliers, isLoading, refresh } = useSuppliers();
  const [newSupplier, setNewSupplier] = useState("");
  const [editingSupplier, setEditingSupplier] = useState<{
    original: Supplier;
    current: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleAddSupplier = async () => {
    if (!newSupplier.trim()) return;

    try {
      setIsSaving(true);
      const newSupplierObj: Supplier = {
        id: crypto.randomUUID(),
        name: newSupplier.trim(),
      };
      const updatedSuppliers = [...suppliers, newSupplierObj];
      await configService.updateSuppliers(updatedSuppliers);
      setNewSupplier("");
      showToast("Supplier added successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to add supplier:", error);
      showToast("Failed to add supplier", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSupplier = async () => {
    if (!editingSupplier || !editingSupplier.current.trim()) return;

    try {
      setIsSaving(true);
      const updatedSuppliers = suppliers.map((supplier) =>
        supplier.id === editingSupplier.original.id
          ? { ...supplier, name: editingSupplier.current }
          : supplier
      );
      await configService.updateSuppliers(updatedSuppliers);
      setEditingSupplier(null);
      showToast("Supplier updated successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to update supplier:", error);
      showToast("Failed to update supplier", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      setIsSaving(true);
      const updatedSuppliers = suppliers.filter((s) => s.id !== supplierId);
      await configService.updateSuppliers(updatedSuppliers);
      showToast("Supplier deleted successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      showToast("Failed to delete supplier", "error");
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
            Supplier Management
          </h1>

          {/* Add Supplier */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newSupplier}
                onChange={(e) => setNewSupplier(e.target.value)}
                placeholder="Enter supplier name"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              />
              <button
                onClick={handleAddSupplier}
                className="px-6 py-2 bg-accent-main text-primary-darkest font-medium rounded-xl hover:bg-accent-light transition-colors"
              >
                Add Supplier
              </button>
            </div>
          </div>

          {/* Supplier List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Suppliers List
            </h2>
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  {editingSupplier?.original.id === supplier.id ? (
                    <input
                      type="text"
                      value={editingSupplier.current}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          current: e.target.value,
                        })
                      }
                      className="flex-1 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
                    />
                  ) : (
                    <span className="text-white">{supplier.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingSupplier?.original.id === supplier.id ? (
                      <>
                        <button
                          onClick={handleUpdateSupplier}
                          className="px-4 py-2 bg-accent-main text-primary-darkest rounded-lg hover:bg-accent-light transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSupplier(null)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditingSupplier({
                              original: supplier,
                              current: supplier.name,
                            })
                          }
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSupplier(supplier.id)}
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
