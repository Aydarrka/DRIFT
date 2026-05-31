"use client";

import { useEffect, useRef } from "react";
import { LoginSheet } from "@/components/LoginSheet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDrift } from "@/context/DriftProvider";
import {
  applyLocationOverride,
  BISHKEK_FALLBACK,
} from "@/lib/geolocation";
import type { UserLocation, UserProfile } from "@/lib/types";

function locationsEqual(a: UserLocation | null, b: UserLocation | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.lat === b.lat &&
    a.lng === b.lng &&
    a.label === b.label &&
    a.shortLabel === b.shortLabel
  );
}

function GeoTracker({ profile }: { profile: UserProfile }) {
  const { setLocation, setLocationError, setRefreshLocation } = useDrift();
  const { location, status, error, refresh } = useGeolocation(
    profile.locationOverride,
  );
  const lastSynced = useRef<UserLocation | null>(null);

  useEffect(() => {
    setRefreshLocation(refresh);
  }, [refresh, setRefreshLocation]);

  useEffect(() => {
    let next: UserLocation | null = null;

    if (location) {
      next = profile.locationOverride
        ? applyLocationOverride(location, profile.locationOverride)
        : location;
    } else if (status === "error" && profile.locationOverride) {
      next = {
        ...BISHKEK_FALLBACK,
        shortLabel: profile.locationOverride,
        label: profile.locationOverride.includes("Bishkek")
          ? profile.locationOverride
          : `${profile.locationOverride}, Bishkek`,
      };
    }

    if (next && !locationsEqual(lastSynced.current, next)) {
      lastSynced.current = next;
      setLocation(next);
      setLocationError(null);
      return;
    }

    if (status === "error" && error && !profile.locationOverride) {
      setLocationError(error);
    }
  }, [
    location,
    status,
    error,
    profile.locationOverride,
    setLocation,
    setLocationError,
  ]);

  return null;
}

export function GeoBootstrap() {
  const { profile, isLoggedIn, setProfile } = useDrift();

  if (!isLoggedIn) {
    return <LoginSheet onComplete={setProfile} />;
  }

  return <GeoTracker profile={profile!} />;
}
