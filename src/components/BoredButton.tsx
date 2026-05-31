"use client";

import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 22 };

interface BoredButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function BoredButton({ onClick, disabled }: BoredButtonProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center py-8">
      <motion.div
        className="absolute h-56 w-56 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        transition={spring}
        className="group relative flex h-52 w-52 items-center justify-center rounded-full disabled:opacity-50"
        aria-label="I'm bored"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-white/5 shadow-[0_0_60px_rgba(255,255,255,0.08)] backdrop-blur-xl" />
        <div className="absolute inset-[3px] rounded-full border border-white/20 bg-gradient-to-b from-zinc-800/90 to-black shadow-inner" />
        <div className="absolute inset-x-8 top-6 h-12 rounded-full bg-gradient-to-b from-white/25 to-transparent opacity-70" />

        <span className="relative z-10 px-4 text-center text-2xl font-semibold tracking-tight text-white">
          I&apos;m
          <br />
          bored
        </span>

        <motion.div
          className="absolute inset-0 rounded-full border border-white/10"
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.button>
    </div>
  );
}
