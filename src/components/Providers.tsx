"use client";

import { DriftProvider } from "@/context/DriftProvider";
import { GeoBootstrap } from "@/components/GeoBootstrap";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DriftProvider>
      <GeoBootstrap />
      {children}
    </DriftProvider>
  );
}
