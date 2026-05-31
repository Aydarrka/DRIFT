"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  searchStatuses,
  squadMembers,
  vibeScenarios,
  vibes,
  type Vibe,
} from "../lib/mockData";

type AppState = "idle" | "searching" | "matched";

const screenMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", stiffness: 400, damping: 30 },
} as const;

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("active");
  const [statusIndex, setStatusIndex] = useState(0);

  const selectedScenario = useMemo(
    () => vibeScenarios[selectedVibe],
    [selectedVibe],
  );

  useEffect(() => {
    if (appState !== "searching") {
      setStatusIndex(0);
      return;
    }

    const statusTimer = window.setInterval(() => {
      setStatusIndex((currentIndex) =>
        currentIndex === searchStatuses.length - 1 ? 0 : currentIndex + 1,
      );
    }, 1200);

    const matchTimer = window.setTimeout(() => {
      setAppState("matched");
    }, 4000);

    return () => {
      window.clearInterval(statusTimer);
      window.clearTimeout(matchTimer);
    };
  }, [appState]);

  return (
    <main className="min-h-screen overflow-hidden bg-black px-6 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center py-10">
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <motion.section
              key="idle"
              className="flex w-full flex-col items-center gap-8"
              {...screenMotion}
            >
              <div className="text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                  Drift
                </p>
                <h1 className="text-5xl font-black tracking-[-0.08em]">
                  I&apos;m bored
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setAppState("searching")}
                className="h-52 w-52 rounded-full border border-white/10 bg-white/5 text-2xl font-black tracking-[-0.04em] shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-xl"
              >
                Start
              </button>

              <div className="flex flex-wrap justify-center gap-3">
                {vibes.map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setSelectedVibe(vibe)}
                    className={`rounded-full border px-5 py-3 text-sm font-semibold backdrop-blur-xl ${
                      selectedVibe === vibe
                        ? "border-white/30 bg-white text-black"
                        : "border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    {vibeScenarios[vibe].label}
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {appState === "searching" && (
            <motion.section
              key="searching"
              className="flex w-full flex-col items-center gap-8 text-center"
              {...screenMotion}
            >
              <div className="relative h-64 w-64 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl" />
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/35">
                  Nearby radar
                </p>
                <p className="mt-4 text-3xl font-black tracking-[-0.06em]">
                  {searchStatuses[statusIndex]}
                </p>
              </div>
            </motion.section>
          )}

          {appState === "matched" && (
            <motion.section
              key="matched"
              className="flex w-full flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(255,255,255,0.08)] backdrop-blur-xl"
              {...screenMotion}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                  Squad found
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.07em]">
                  {selectedScenario.label}
                </h2>
              </div>

              <div className="flex -space-x-3">
                {squadMembers.map((member) => (
                  <div
                    key={member.name}
                    aria-label={member.name}
                    className={`h-14 w-14 rounded-full border-2 border-black ${member.gradient}`}
                  />
                ))}
              </div>

              <div>
                <p className="text-2xl font-black leading-tight tracking-[-0.05em]">
                  {selectedScenario.activity}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {selectedScenario.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAppState("idle")}
                className="rounded-full bg-white px-6 py-4 font-black text-black"
              >
                Погнали!
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
