"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LiveSearchBanner } from "@/components/LiveSearchBanner";
import { LocationPill } from "@/components/LocationPill";
import { PageShell } from "@/components/PageShell";
import { RadarRings } from "@/components/RadarRings";
import { StatusText } from "@/components/StatusText";
import { useDrift } from "@/context/DriftProvider";
import { getClientTabId, startLiveSearch } from "@/lib/liveMatch";

export default function SearchingPage() {
  const router = useRouter();
  const {
    profile,
    selectedVibe,
    setMatchResult,
    location,
    locationError,
    refreshLocation,
  } = useDrift();
  const [peerCount, setPeerCount] = useState(0);
  const tabId = useMemo(() => getClientTabId(), []);

  useEffect(() => {
    if (!profile) return;

    const cleanup = startLiveSearch({
      vibe: selectedVibe,
      location,
      profile,
      tabId,
      onPeerCount: setPeerCount,
      onMatch: (match) => {
        setMatchResult(match);
        router.push("/match");
      },
    });

    return cleanup;
  }, [selectedVibe, location, profile, tabId, setMatchResult, router]);

  if (!profile) return null;

  return (
    <PageShell className="items-center">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Searching
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Finding your squad
        </h1>
        <div className="mt-4 flex justify-center">
          <LocationPill
            label={location?.label}
            shortLabel={location?.shortLabel}
            detail={location?.detail}
            loading={!location && !locationError}
            error={locationError}
            onRetry={refreshLocation}
            compact
          />
        </div>
      </div>

      <RadarRings />

      <div className="w-full space-y-4 pb-6">
        <LiveSearchBanner
          peerCount={peerCount}
          locationLabel={location?.shortLabel ?? location?.label}
        />
        <StatusText peerCount={peerCount} />
      </div>
    </PageShell>
  );
}
