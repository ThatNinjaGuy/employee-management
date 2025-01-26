import { useState, useEffect } from "react";
import { configService } from "@/services/configService";
import { Supplier } from "@/types";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const fetchedSuppliers = await configService.getSuppliers();
      setSuppliers(fetchedSuppliers);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    isLoading,
    refresh: fetchSuppliers,
  };
}
