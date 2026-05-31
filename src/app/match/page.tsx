"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MatchCard } from "@/components/MatchCard";
import { PageShell } from "@/components/PageShell";
import { useDrift } from "@/context/DriftProvider";

export default function MatchPage() {
  const router = useRouter();
  const { matchResult, resetMatch } = useDrift();

  useEffect(() => {
    if (!matchResult) {
      router.replace("/");
    }
  }, [matchResult, router]);

  const handleConfirm = () => {
    resetMatch();
    router.push("/");
  };

  if (!matchResult) {
    return null;
  }

  return (
    <PageShell className="justify-end">
      <div className="flex flex-1 flex-col justify-center text-center opacity-30">
        <p className="text-xs font-semibold uppercase tracking-[0.35em]">
          Match found
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Your squad is ready
        </h1>
      </div>

      <MatchCard match={matchResult} onConfirm={handleConfirm} />
    </PageShell>
  );
}
