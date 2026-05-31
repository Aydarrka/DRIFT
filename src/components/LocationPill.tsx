"use client";

import { motion } from "framer-motion";
import { Loader2, Navigation, RefreshCw } from "lucide-react";

interface LocationPillProps {
  label?: string | null;
  loading?: boolean;
  error?: string | null;
  compact?: boolean;
  onRetry?: () => void;
}

export function LocationPill({
  label,
  loading,
  error,
  compact = false,
  onRetry,
}: LocationPillProps) {
  const text = loading
    ? "Locating you..."
    : error
      ? "Demo mode · tap to enable location"
      : label
        ? label
        : "Near you";

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
      ) : error ? (
        <RefreshCw className="h-3.5 w-3.5 text-amber-300" />
      ) : (
        <Navigation className="h-3.5 w-3.5 text-emerald-400" />
      )}
      <span className="max-w-[240px] truncate">{text}</span>
    </>
  );

  const className = `inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md ${
    compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
  } text-white/70`;

  if (error && onRetry) {
    return (
      <motion.button
        type="button"
        onClick={onRetry}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${className} cursor-pointer transition hover:border-amber-300/30 hover:bg-amber-300/5`}
        title={error}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
      title={error ?? undefined}
    >
      {content}
    </motion.div>
  );
}
