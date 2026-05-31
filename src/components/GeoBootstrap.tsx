"use client";

import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDrift } from "@/context/DriftProvider";

export function GeoBootstrap() {
  const { location, status, error } = useGeolocation();
  const { setLocation, setLocationError } = useDrift();

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

  return null;
}
