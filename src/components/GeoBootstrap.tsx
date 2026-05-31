"use client";

import { useEffect } from "react";
import { LoginSheet } from "@/components/LoginSheet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDrift } from "@/context/DriftProvider";
import { applyLocationOverride } from "@/lib/geolocation";

export function GeoBootstrap() {
  const {
    profile,
    isLoggedIn,
    setProfile,
    setLocation,
    setLocationError,
    setRefreshLocation,
  } = useDrift();

  const { location, status, error, refresh } = useGeolocation(
    profile?.locationOverride,
  );

  useEffect(() => {
    if (location) {
      setLocation(
        profile?.locationOverride
          ? applyLocationOverride(location, profile.locationOverride)
          : location,
      );
      setLocationError(null);
    }
  }, [location, profile?.locationOverride, setLocation, setLocationError]);

  useEffect(() => {
    if (status === "error" && error) {
      if (profile?.locationOverride) {
        setLocation({
          lat: 42.8746,
          lng: 74.5698,
          label: profile.locationOverride.includes("Bishkek")
            ? profile.locationOverride
            : `${profile.locationOverride}, Bishkek`,
          shortLabel: profile.locationOverride,
        });
        setLocationError(null);
      } else {
        setLocationError(error);
      }
    }
  }, [status, error, profile?.locationOverride, setLocation, setLocationError]);

  useEffect(() => {
    setRefreshLocation(refresh);
  }, [refresh, setRefreshLocation]);

  if (!isLoggedIn) {
    return <LoginSheet onComplete={setProfile} />;
  }

  return null;
}
