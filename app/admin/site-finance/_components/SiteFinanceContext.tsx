"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getSiteFinanceData,
  getAllExpenses,
  SITE_LOCATIONS,
  SiteFinanceData,
  LocationConfig,
} from "@/app/admin/_lib/site-finance-data";

interface SiteFinanceContextType {
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;
  siteData: SiteFinanceData;
  selectedLocation: LocationConfig | undefined;
  locations: typeof SITE_LOCATIONS;
  getAllExpenses: (locationId: string) => any;
}

const SiteFinanceContext = createContext<SiteFinanceContextType | null>(null);

export function SiteFinanceProvider({ children }: { children: ReactNode }) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("monrovia");
  const [siteData, setSiteData] = useState(() => getSiteFinanceData("monrovia"));

  useEffect(() => {
    setSiteData(getSiteFinanceData(selectedLocationId));
  }, [selectedLocationId]);

  const selectedLocation = SITE_LOCATIONS.find(l => l.id === selectedLocationId);

  return (
    <SiteFinanceContext.Provider value={{
      selectedLocationId,
      setSelectedLocationId,
      siteData,
      selectedLocation,
      locations: SITE_LOCATIONS,
      getAllExpenses,
    }}>
      {children}
    </SiteFinanceContext.Provider>
  );
}

export function useSiteFinance() {
  const context = useContext(SiteFinanceContext);
  if (!context) {
    throw new Error("useSiteFinance must be used within a SiteFinanceProvider");
  }
  return context;
}