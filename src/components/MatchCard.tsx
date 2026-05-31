"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { SquadAvatars } from "@/components/SquadAvatars";
import type { MatchResult } from "@/lib/types";

interface MatchCardProps {
  match: MatchResult;
  onConfirm: () => void;
}

export function MatchCard({ match, onConfirm }: MatchCardProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md"
      >
        <div className="rounded-t-[2rem] border border-white/10 bg-zinc-950/90 px-6 pb-10 pt-3 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

          <div className="mb-6 flex items-center gap-2 text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium tracking-wide">
              Squad matched
            </span>
          </div>

          <SquadAvatars members={match.members} />

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 28 }}
            className="mt-6 text-2xl font-semibold leading-tight tracking-tight"
          >
            {match.plan}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-3 flex items-center gap-2 text-sm text-white/50"
          >
            <MapPin className="h-4 w-4 shrink-0" />
            {match.location}
          </motion.div>

          <motion.button
            type="button"
            onClick={onConfirm}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 320, damping: 26 }}
            className="mt-8 w-full rounded-2xl bg-white py-4 text-center text-base font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            Подтвердить
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
