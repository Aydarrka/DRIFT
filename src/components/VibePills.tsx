"use client";

import { motion } from "framer-motion";
import { Coffee, MessageCircle, Zap } from "lucide-react";
import { VIBE_OPTIONS } from "@/lib/mockData";
import type { Vibe } from "@/lib/types";

const iconMap = {
  zap: Zap,
  coffee: Coffee,
  "message-circle": MessageCircle,
};

interface VibePillsProps {
  selected: Vibe;
  onSelect: (vibe: Vibe) => void;
}

export function VibePills({ selected, onSelect }: VibePillsProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium tracking-wide text-white/45">
        What&apos;s your vibe?
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {VIBE_OPTIONS.map((option) => {
          const Icon = iconMap[option.icon];
          const isActive = selected === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              whileTap={{ scale: 0.96 }}
              className={`relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-colors ${
                isActive
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80"
              }`}
              style={
                isActive
                  ? { boxShadow: `0 0 24px ${option.accent}33` }
                  : undefined
              }
            >
              <Icon
                className="h-4 w-4"
                style={{ color: isActive ? option.accent : undefined }}
              />
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
