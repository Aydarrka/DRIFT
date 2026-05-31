"use client";

import { useRouter } from "next/navigation";
import { BoredButton } from "@/components/BoredButton";
import { LocationPill } from "@/components/LocationPill";
import { PageShell } from "@/components/PageShell";
import { VibePills } from "@/components/VibePills";
import { useDrift } from "@/context/DriftProvider";

export default function HomePage() {
  const router = useRouter();
  const {
    selectedVibe,
    setSelectedVibe,
    resetMatch,
    location,
    locationError,
    refreshLocation,
  } = useDrift();

  const handleStart = () => {
    resetMatch();
    router.push("/searching");
  };

  const isLocating = !location && !locationError;

  return (
    <PageShell>
      <header className="mb-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          DRIFT
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Kill the boredom
        </h1>
        <p className="mt-2 text-sm text-white/45">
          One tap. One vibe. A squad nearby.
        </p>
        <div className="mt-4 flex justify-center">
          <LocationPill
            label={location?.label}
            loading={isLocating}
            error={locationError}
            onRetry={refreshLocation}
            compact
          />
        </div>
      </header>

      <BoredButton onClick={handleStart} />

      <VibePills selected={selectedVibe} onSelect={setSelectedVibe} />

      <div className="mt-6 space-y-2 text-center text-xs text-white/30">
        <p>Live demo: open two tabs, same vibe, tap I&apos;m bored in both.</p>
        <p>Works even in demo mode — tabs match on this device.</p>
      </div>
    </PageShell>
  );
}
