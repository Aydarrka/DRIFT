"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MatchResult, UserLocation, Vibe } from "@/lib/types";

interface DriftContextValue {
  selectedVibe: Vibe;
  setSelectedVibe: (vibe: Vibe) => void;
  matchResult: MatchResult | null;
  setMatchResult: (result: MatchResult | null) => void;
  location: UserLocation | null;
  setLocation: (location: UserLocation | null) => void;
  locationError: string | null;
  setLocationError: (error: string | null) => void;
  refreshLocation: () => void;
  setRefreshLocation: (fn: () => void) => void;
  resetMatch: () => void;
}

const DriftContext = createContext<DriftContextValue | null>(null);

export function DriftProvider({ children }: { children: ReactNode }) {
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("chill");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [refreshLocation, setRefreshLocationState] = useState<() => void>(
    () => () => {},
  );

  const setRefreshLocation = useCallback((fn: () => void) => {
    setRefreshLocationState(() => fn);
  }, []);

  const resetMatch = useCallback(() => {
    setMatchResult(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedVibe,
      setSelectedVibe,
      matchResult,
      setMatchResult,
      location,
      setLocation,
      locationError,
      setLocationError,
      refreshLocation,
      setRefreshLocation,
      resetMatch,
    }),
    [
      selectedVibe,
      matchResult,
      location,
      locationError,
      refreshLocation,
      setRefreshLocation,
      resetMatch,
    ],
  );

  return (
    <DriftContext.Provider value={value}>{children}</DriftContext.Provider>
  );
}

export function useDrift() {
  const context = useContext(DriftContext);
  if (!context) {
    throw new Error("useDrift must be used within DriftProvider");
  }
  return context;
}
