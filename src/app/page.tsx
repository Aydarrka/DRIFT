"use client";

import { useRouter } from "next/navigation";
import { BoredButton } from "@/components/BoredButton";
import { PageShell } from "@/components/PageShell";
import { VibePills } from "@/components/VibePills";
import { useDrift } from "@/context/DriftProvider";

export default function HomePage() {
  const router = useRouter();
  const { selectedVibe, setSelectedVibe, resetMatch } = useDrift();

  const handleStart = () => {
    resetMatch();
    router.push("/searching");
  };

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
      </header>

      <BoredButton onClick={handleStart} />

      <VibePills selected={selectedVibe} onSelect={setSelectedVibe} />
    </PageShell>
  );
}
