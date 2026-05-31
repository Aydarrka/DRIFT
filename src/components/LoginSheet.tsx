"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, User } from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "@/lib/types";

interface LoginSheetProps {
  onComplete: (profile: UserProfile) => void;
}

export function LoginSheet({ onComplete }: LoginSheetProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [spot, setSpot] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const parsedAge = Number.parseInt(age, 10);

    if (!trimmedName || Number.isNaN(parsedAge) || parsedAge < 13 || parsedAge > 99) {
      return;
    }

    onComplete({
      name: trimmedName,
      age: parsedAge,
      locationOverride: spot.trim() || undefined,
    });
  };

  const isValid =
    name.trim().length >= 2 &&
    !Number.isNaN(Number.parseInt(age, 10)) &&
    Number.parseInt(age, 10) >= 13 &&
    Number.parseInt(age, 10) <= 99;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center">
      <motion.form
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-t-[2rem] border border-white/10 bg-zinc-950 px-6 pb-10 pt-8 shadow-2xl sm:rounded-[2rem]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Join DRIFT
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Quick intro
        </h2>
        <p className="mt-2 text-sm text-white/45">
          Name and age so your squad knows who you are.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm text-white/50">
              <User className="h-4 w-4" />
              Your name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Aydar"
              maxLength={24}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white outline-none placeholder:text-white/25 focus:border-emerald-400/40"
              autoFocus
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-white/50">Age</span>
            <input
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="20"
              min={13}
              max={99}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white outline-none placeholder:text-white/25 focus:border-emerald-400/40"
            />
          </label>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm text-white/50">
              <MapPin className="h-4 w-4" />
              Where are you? (optional)
            </span>
            <input
              type="text"
              value={spot}
              onChange={(event) => setSpot(event.target.value)}
              placeholder="Olol Planet, Bishkek"
              maxLength={48}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white outline-none placeholder:text-white/25 focus:border-emerald-400/40"
            />
            <p className="text-xs text-white/30">
              Shown if GPS can&apos;t find your exact spot.
            </p>
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={!isValid}
          whileTap={{ scale: isValid ? 0.97 : 1 }}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enter DRIFT
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.form>
    </div>
  );
}
