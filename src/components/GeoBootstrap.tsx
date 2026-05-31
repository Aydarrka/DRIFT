"use client";

import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDrift } from "@/context/DriftProvider";

export function GeoBootstrap() {
  const { location, status, error, refresh } = useGeolocation();
  const { setLocation, setLocationError, setRefreshLocation } = useDrift();

  useEffect(() => {
    if (location) {
      setLocation(location);
      setLocationError(null);
    }
  }, [location, setLocation, setLocationError]);

  useEffect(() => {
    if (status === "error" && error) {
      setLocationError(error);
    }
  }, [status, error, setLocationError]);

  useEffect(() => {
    setRefreshLocation(refresh);
  }, [refresh, setRefreshLocation]);

  return null;
}
