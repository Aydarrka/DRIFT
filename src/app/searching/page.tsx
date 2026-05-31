"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { RadarRings } from "@/components/RadarRings";
import { StatusText } from "@/components/StatusText";
import { useDrift } from "@/context/DriftProvider";

const SEARCH_DURATION_MS = 5200;

export default function SearchingPage() {
  const router = useRouter();
  const { generateMatch } = useDrift();

  useEffect(() => {
    const timer = setTimeout(() => {
      generateMatch();
      router.push("/match");
    }, SEARCH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [generateMatch, router]);

  return (
    <PageShell className="items-center">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Searching
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Finding your squad
        </h1>
      </div>

      <RadarRings />

      <div className="pb-6">
        <StatusText />
      </div>
    </PageShell>
  );
}
