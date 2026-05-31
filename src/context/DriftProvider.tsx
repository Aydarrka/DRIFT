"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMatchForVibe } from "@/lib/mockData";
import type { MatchResult, Vibe } from "@/lib/types";

interface DriftContextValue {
  selectedVibe: Vibe;
  setSelectedVibe: (vibe: Vibe) => void;
  matchResult: MatchResult | null;
  generateMatch: () => MatchResult;
  resetMatch: () => void;
}

const DriftContext = createContext<DriftContextValue | null>(null);

export function DriftProvider({ children }: { children: ReactNode }) {
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("chill");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const generateMatch = useCallback(() => {
    const result = getMatchForVibe(selectedVibe);
    setMatchResult(result);
    return result;
  }, [selectedVibe]);

  const resetMatch = useCallback(() => {
    setMatchResult(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedVibe,
      setSelectedVibe,
      matchResult,
      generateMatch,
      resetMatch,
    }),
    [selectedVibe, matchResult, generateMatch, resetMatch],
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
