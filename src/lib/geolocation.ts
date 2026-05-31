import type { UserLocation } from "./types";

/** Bishkek center — used for queue matching when GPS is unavailable */
export const BISHKEK_FALLBACK: UserLocation = {
  lat: 42.8746,
  lng: 74.5698,
  label: "Bishkek",
  shortLabel: "Bishkek",
};

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}

interface GeocodeResponse {
  label: string;
  shortLabel: string;
  detail?: string;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeocodeResponse> {
  try {
    const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error("geocode failed");
    return (await res.json()) as GeocodeResponse;
  } catch {
    return {
      label: formatCoords(lat, lng),
      shortLabel: "Near you",
      detail: formatCoords(lat, lng),
    };
  }
}

function geolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location blocked — click the pill to retry, or allow location in browser settings";
    case 2:
      return "Location unavailable on this device";
    case 3:
      return "Location timed out — click the pill to retry";
    default:
      return "Location unavailable";
  }
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export async function requestUserLocation(
  locationOverride?: string,
): Promise<UserLocation> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser");
  }

  if (!window.isSecureContext) {
    throw new Error(
      "Location requires HTTPS or localhost — open http://localhost:3000 (not an IP address)",
    );
  }

  let position: GeolocationPosition;

  try {
    position = await getPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });
  } catch (firstError) {
    const geoError = firstError as GeolocationPositionError;
    if (geoError.code === 1) throw firstError;

    position = await getPosition({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 60000,
    });
  }

  const { latitude: lat, longitude: lng, accuracy } = position.coords;
  const geocoded = await reverseGeocode(lat, lng);

  const shortLabel = locationOverride?.trim() || geocoded.shortLabel;
  const label = locationOverride?.trim()
    ? `${locationOverride.trim()}${geocoded.label.includes("Bishkek") ? ", Bishkek" : ""}`
    : geocoded.label;

  return {
    lat,
    lng,
    label,
    shortLabel,
    detail: geocoded.detail,
    accuracy,
  };
}

export function applyLocationOverride(
  location: UserLocation,
  override?: string,
): UserLocation {
  if (!override?.trim()) return location;

  const spot = override.trim();
  return {
    ...location,
    shortLabel: spot,
    label: spot.includes("Bishkek") ? spot : `${spot}, Bishkek`,
  };
}

export function getGeolocationErrorMessage(error: unknown): string {
  if (error instanceof GeolocationPositionError) {
    return geolocationErrorMessage(error.code);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Location unavailable — using demo mode";
}

export function getQueueLocation(location: UserLocation | null): UserLocation {
  return location ?? BISHKEK_FALLBACK;
}

export function getTabId(): string {
  if (typeof window === "undefined") return "server";

  const key = "drift-tab-id";
  let tabId = sessionStorage.getItem(key);
  if (!tabId) {
    tabId = `tab-${crypto.randomUUID().slice(0, 8)}`;
    sessionStorage.setItem(key, tabId);
  }
  return tabId;
}

export const PROFILE_STORAGE_KEY = "drift-profile";

export function loadProfile(): import("./types").UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as import("./types").UserProfile;
    if (!parsed.name?.trim() || !parsed.age) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: import("./types").UserProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
