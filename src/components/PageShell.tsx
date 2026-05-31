"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const spring = { type: "spring" as const, stiffness: 260, damping: 28 };

export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={spring}
      className={`relative flex min-h-dvh flex-col overflow-hidden bg-black text-white ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -right-16 bottom-[10%] h-80 w-80 rounded-full bg-violet-500/10 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-14">
        {children}
      </div>
    </motion.main>
  );
}
