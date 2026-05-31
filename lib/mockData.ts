export type Vibe = "active" | "chill" | "deepTalk";

export type SquadMember = {
  name: string;
  gradient: string;
};

export type VibeScenario = {
  label: string;
  activity: string;
  description: string;
};

export const vibes: Vibe[] = ["active", "chill", "deepTalk"];

export const vibeScenarios: Record<Vibe, VibeScenario> = {
  active: {
    label: "Active",
    activity: "Катаем на самокатах по Южной Магистрали",
    description: "Scooters on Yuzhnaya Magistral",
  },
  chill: {
    label: "Chill",
    activity: "Берем холодный кофе в Sierra и сидим на траве на Эркиндик",
    description: "Iced coffee at Sierra, chilling on Erkindik grass",
  },
  deepTalk: {
    label: "Deep Talk",
    activity: "Идем обсуждать стартапы в парк Панфилова",
    description: "Discussing startups at Panfilov Park",
  },
};

export const squadMembers: SquadMember[] = [
  {
    name: "Aida",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
  },
  {
    name: "Emir",
    gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
  },
  {
    name: "Nika",
    gradient: "bg-gradient-to-br from-amber-400 to-pink-500",
  },
];

export const searchStatuses = [
  "Сканируем район...",
  "Ищем свободных...",
  "Матчим вайбы...",
];
