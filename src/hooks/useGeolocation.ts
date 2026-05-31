"use client";

import { useCallback, useEffect, useState } from "react";
import { requestUserLocation } from "@/lib/geolocation";
import type { UserLocation } from "@/lib/types";

type GeoStatus = "idle" | "loading" | "ready" | "error";

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("loading");
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const result = await requestUserLocation();
      setLocation(result);
      setStatus("ready");
      return result;
    } catch {
      setError("Location unavailable — using Bishkek demo mode");
      setStatus("error");
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    requestUserLocation()
      .then((result) => {
        if (cancelled) return;
        setLocation(result);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setError("Location unavailable — using Bishkek demo mode");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { location, status, error, refresh };
}
