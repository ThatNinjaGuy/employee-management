import { useState, useEffect } from "react";
import { configService } from "@/services/configService";
import { Site } from "@/types";

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      const fetchedSites = await configService.getSites();
      setSites(fetchedSites);
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    isLoading,
    refresh: fetchSites,
  };
}
