export type Vibe = "active" | "chill" | "deep-talk";

export interface SquadMember {
  id: string;
  name: string;
  gradient: string;
}

export interface MatchResult {
  vibe: Vibe;
  plan: string;
  location: string;
  members: SquadMember[];
}

export interface VibeOption {
  id: Vibe;
  label: string;
  icon: "zap" | "coffee" | "message-circle";
  accent: string;
}
