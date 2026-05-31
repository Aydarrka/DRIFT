"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Radio, Users } from "lucide-react";

interface LiveSearchBannerProps {
  peerCount: number;
  locationLabel?: string | null;
}

export function LiveSearchBanner({
  peerCount,
  locationLabel,
}: LiveSearchBannerProps) {
  return (
    <div className="space-y-3">
      {locationLabel ? (
        <p className="text-center text-sm text-white/45">
          Searching near{" "}
          <span className="text-white/75">{locationLabel.split(",")[0]}</span>
        </p>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={peerCount > 0 ? "live" : "scanning"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`mx-auto flex max-w-xs items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
            peerCount > 0
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-white/10 bg-white/5 text-white/60"
          }`}
        >
          {peerCount > 0 ? (
            <>
              <Users className="h-4 w-4" />
              <span>
                {peerCount} {peerCount === 1 ? "person" : "people"} nearby also
                searching
              </span>
            </>
          ) : (
            <>
              <Radio className="h-4 w-4 animate-pulse" />
              <span>Scanning for nearby searchers...</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
