"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SEARCH_STATUSES } from "@/lib/mockData";

interface StatusTextProps {
  peerCount?: number;
}

const LIVE_STATUSES = [
  "Нашли людей рядом...",
  "Синхронизируем вайбы...",
  "Собираем live-сквод...",
  "Почти готово...",
];

export function StatusText({ peerCount = 0 }: StatusTextProps) {
  const [index, setIndex] = useState(0);
  const isLive = peerCount > 0;
  const statuses = useMemo(
    () => (isLive ? LIVE_STATUSES : SEARCH_STATUSES),
    [isLive],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statuses.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [statuses.length]);

  return (
    <div className="relative h-8 overflow-hidden" key={isLive ? "live" : "solo"}>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${isLive}-${index}`}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-x-0 text-center text-lg font-medium tracking-tight text-white/80"
        >
          {statuses[index % statuses.length]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
