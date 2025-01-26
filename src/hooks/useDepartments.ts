import { useEffect } from "react";
import { configService } from "@/services/configService";
import { useDepartmentStore } from "@/store/departmentStore";

export function useDepartments() {
  const {
    departments,
    isLoading,
    error,
    setDepartments,
    setLoading,
    setError,
  } = useDepartmentStore();

  useEffect(() => {
    const fetchDepartments = async () => {
      // If departments are already loaded, don't fetch again
      if (departments.length > 0) return;

      try {
        setLoading(true);
        const depts = await configService.getDepartments();
        setDepartments(depts);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setError("Failed to load departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []); // Empty dependency array as we only want to fetch once

  return { departments, isLoading, error };
}
