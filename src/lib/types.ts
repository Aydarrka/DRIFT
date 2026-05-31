export type Vibe = "active" | "chill" | "deep-talk";

export interface UserProfile {
  name: string;
  age: number;
  locationOverride?: string;
}

export interface SquadMember {
  id: string;
  name: string;
  age?: number;
  gradient: string;
  isSelf?: boolean;
  isLive?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  shortLabel: string;
  detail?: string;
  accuracy?: number;
}

export interface MatchResult {
  vibe: Vibe;
  plan: string;
  location: string;
  members: SquadMember[];
  isLiveMatch?: boolean;
  distanceKm?: number;
}

export interface VibeOption {
  id: Vibe;
  label: string;
  icon: "zap" | "coffee" | "message-circle";
  accent: string;
}

export interface SearchPeer {
  tabId: string;
  vibe: Vibe;
  lat: number;
  lng: number;
  locationLabel: string;
  displayName: string;
  age: number;
  joinedAt: number;
}
