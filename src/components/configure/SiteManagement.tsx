"use client";

import { useState } from "react";
import { useSites } from "@/hooks/useSites";
import { useToast } from "@/context/ToastContext";
import { configService } from "@/services/configService";
import { Site } from "@/types";

export function SiteManagement() {
  const { sites, isLoading, refresh } = useSites();
  const [newSite, setNewSite] = useState("");
  const [editingSite, setEditingSite] = useState<{
    original: Site;
    current: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleAddSite = async () => {
    if (!newSite.trim()) return;

    try {
      setIsSaving(true);
      const newSiteObj: Site = {
        id: crypto.randomUUID(),
        name: newSite.trim(),
      };
      const updatedSites = [...sites, newSiteObj];
      await configService.updateSites(updatedSites);
      setNewSite("");
      showToast("Site added successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to add site:", error);
      showToast("Failed to add site", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSite = async () => {
    if (!editingSite || !editingSite.current.trim()) return;

    try {
      setIsSaving(true);
      const updatedSites = sites.map((site) =>
        site.id === editingSite.original.id
          ? { ...site, name: editingSite.current }
          : site
      );
      await configService.updateSites(updatedSites);
      setEditingSite(null);
      showToast("Site updated successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to update site:", error);
      showToast("Failed to update site", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    try {
      setIsSaving(true);
      const updatedSites = sites.filter((s) => s.id !== siteId);
      await configService.updateSites(updatedSites);
      showToast("Site deleted successfully", "success");
      refresh();
    } catch (error) {
      console.error("Failed to delete site:", error);
      showToast("Failed to delete site", "error");
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
            Site Management
          </h1>

          {/* Add Site */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                placeholder="Enter site name"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-main/50"
              />
              <button
                onClick={handleAddSite}
                className="px-6 py-2 bg-accent-main text-primary-darkest font-medium rounded-xl hover:bg-accent-light transition-colors"
              >
                Add Site
              </button>
            </div>
          </div>

          {/* Site List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Sites List
            </h2>
            <div className="space-y-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  {editingSite?.original.id === site.id ? (
                    <input
                      type="text"
                      value={editingSite.current}
                      onChange={(e) =>
                        setEditingSite({
                          ...editingSite,
                          current: e.target.value,
                        })
                      }
                      className="flex-1 h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent-main/50"
                    />
                  ) : (
                    <span className="text-white">{site.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingSite?.original.id === site.id ? (
                      <>
                        <button
                          onClick={handleUpdateSite}
                          className="px-4 py-2 bg-accent-main text-primary-darkest rounded-lg hover:bg-accent-light transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSite(null)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditingSite({
                              original: site,
                              current: site.name,
                            })
                          }
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSite(site.id)}
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
