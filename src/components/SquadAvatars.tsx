"use client";

import { motion } from "framer-motion";
import type { SquadMember } from "@/lib/types";

interface SquadAvatarsProps {
  members: SquadMember[];
}

export function SquadAvatars({ members }: SquadAvatarsProps) {
  return (
    <div className="flex items-center pl-2">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, x: -12, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 24,
            delay: 0.15 + index * 0.08,
          }}
          className="relative -ml-3 first:ml-0"
          style={{ zIndex: members.length - index }}
          title={member.name}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-gradient-to-br text-xs font-semibold text-white shadow-lg ${
              member.isSelf
                ? "border-emerald-400/80"
                : member.isLive
                  ? "border-emerald-300/60"
                  : "border-black"
            } ${member.gradient}`}
          >
            {member.name.charAt(0)}
          </div>
          {member.isLive ? (
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
          ) : null}
        </motion.div>
      ))}
      <span className="ml-3 text-sm text-white/50">
        {members.length} nearby
      </span>
    </div>
  );
}
