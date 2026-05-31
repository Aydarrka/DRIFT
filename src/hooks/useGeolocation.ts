"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getGeolocationErrorMessage,
  requestUserLocation,
} from "@/lib/geolocation";
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
    } catch (err) {
      const message = getGeolocationErrorMessage(err);
      setError(message);
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
      .catch((err) => {
        if (cancelled) return;
        setError(getGeolocationErrorMessage(err));
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { location, status, error, refresh, isDemoMode: status === "error" };
}
