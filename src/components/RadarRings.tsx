"use client";

import { motion } from "framer-motion";

export function RadarRings() {
  const rings = [1, 2, 3, 4];

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <div className="relative flex h-72 w-72 items-center justify-center">
        {rings.map((ring, index) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-white/15"
            style={{
              width: `${ring * 22}%`,
              height: `${ring * 22}%`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15 + index * 0.08, 0.35, 0.15 + index * 0.08],
            }}
            transition={{
              duration: 2.4 + index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}

        <motion.div
          className="absolute h-full w-full rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(52,211,153,0.35) 40deg, transparent 80deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="relative z-10 h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
