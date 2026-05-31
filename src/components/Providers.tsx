"use client";

import { DriftProvider } from "@/context/DriftProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <DriftProvider>{children}</DriftProvider>;
}
