import { useState, useEffect } from "react";
import { configService } from "@/services/configService";

export function useRoles() {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const fetchedRoles = await configService.getRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    refresh: fetchRoles,
  };
}
