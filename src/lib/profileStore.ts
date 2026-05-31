import type { UserProfile } from "./types";

export const PROFILE_STORAGE_KEY = "drift-profile";

const profileListeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedProfile: UserProfile | null = null;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

function parseProfile(raw: string | null): UserProfile | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed.name?.trim() || !parsed.age) return null;
    return parsed;
  } catch {
    return null;
  }
}

function invalidateProfileCache() {
  cachedRaw = undefined;
}

export function getProfileSnapshot(): UserProfile | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(PROFILE_STORAGE_KEY);

  if (cachedRaw !== undefined && raw === cachedRaw) {
    return cachedProfile;
  }

  cachedRaw = raw;
  cachedProfile = parseProfile(raw);
  return cachedProfile;
}

export function subscribeToProfile(onStoreChange: () => void): () => void {
  profileListeners.add(onStoreChange);
  return () => profileListeners.delete(onStoreChange);
}

function emitProfileChange() {
  invalidateProfileCache();
  profileListeners.forEach((listener) => listener());
}

export function loadProfile(): UserProfile | null {
  return getProfileSnapshot();
}

export function saveProfile(profile: UserProfile) {
  getStorage()?.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  emitProfileChange();
}

export function clearProfile() {
  getStorage()?.removeItem(PROFILE_STORAGE_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }
  emitProfileChange();
}
