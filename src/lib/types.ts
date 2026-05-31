export type Vibe = "active" | "chill" | "deep-talk";

export interface SquadMember {
  id: string;
  name: string;
  gradient: string;
  isSelf?: boolean;
  isLive?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;
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
  joinedAt: number;
}
