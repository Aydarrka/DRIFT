import type { MatchResult, SearchPeer, SquadMember, UserLocation, Vibe } from "./types";

export const VIBE_OPTIONS = [
  {
    id: "active" as const,
    label: "Active",
    icon: "zap" as const,
    accent: "#34d399",
  },
  {
    id: "chill" as const,
    label: "Chill",
    icon: "coffee" as const,
    accent: "#60a5fa",
  },
  {
    id: "deep-talk" as const,
    label: "Deep Talk",
    icon: "message-circle" as const,
    accent: "#c084fc",
  },
];

const MATCHES: Record<Vibe, Omit<MatchResult, "vibe" | "isLiveMatch">> = {
  active: {
    plan: "Катаем на самокатах по Южной Магистрали",
    location: "Южная Магистраль, Бишкек",
    members: [
      { id: "1", name: "Айбек", gradient: "from-emerald-400 to-teal-600" },
      { id: "2", name: "Нур", gradient: "from-lime-400 to-green-600" },
      { id: "3", name: "Дана", gradient: "from-cyan-400 to-blue-600" },
      { id: "4", name: "Тим", gradient: "from-teal-400 to-emerald-700" },
    ],
  },
  chill: {
    plan: "Берем холодный кофе в Sierra и сидим на траве на Эркиндик",
    location: "Sierra → Эркиндик, Бишкек",
    members: [
      { id: "1", name: "Алина", gradient: "from-sky-400 to-indigo-600" },
      { id: "2", name: "Бек", gradient: "from-blue-400 to-violet-600" },
      { id: "3", name: "Саша", gradient: "from-indigo-400 to-purple-600" },
    ],
  },
  "deep-talk": {
    plan: "Идем обсуждать стартапы в парк Панфилова",
    location: "Парк Панфилова, Бишкек",
    members: [
      { id: "1", name: "Артём", gradient: "from-violet-400 to-purple-700" },
      { id: "2", name: "Жанна", gradient: "from-fuchsia-400 to-pink-600" },
      { id: "3", name: "Макс", gradient: "from-purple-400 to-indigo-700" },
      { id: "4", name: "Лина", gradient: "from-rose-400 to-violet-600" },
      { id: "5", name: "Кай", gradient: "from-indigo-400 to-blue-700" },
    ],
  },
};

const LIVE_PEER_NAMES = ["Guest", "Nearby", "Local"];

export const SEARCH_STATUSES = [
  "Сканируем район...",
  "Ищем людей рядом...",
  "Матчим вайбы...",
  "Собираем сквод...",
  "Почти готово...",
];

interface BuildMatchOptions {
  vibe: Vibe;
  location: UserLocation | null;
  peers: SearchPeer[];
  selfTabId: string;
  isLiveMatch: boolean;
}

function buildLiveMembers(
  peers: SearchPeer[],
  selfTabId: string,
  filler: SquadMember[],
): SquadMember[] {
  const liveMembers: SquadMember[] = peers.map((peer, index) => {
    if (peer.tabId === selfTabId) {
      return {
        id: peer.tabId,
        name: "You",
        gradient: "from-white to-zinc-400",
        isSelf: true,
        isLive: true,
      };
    }

    return {
      id: peer.tabId,
      name: LIVE_PEER_NAMES[index % LIVE_PEER_NAMES.length],
      gradient: "from-emerald-300 to-teal-500",
      isLive: true,
    };
  });

  const targetSize = Math.min(
    5,
    Math.max(3, liveMembers.length + Math.min(2, filler.length)),
  );

  const combined = [...liveMembers];
  for (const member of filler) {
    if (combined.length >= targetSize) break;
    if (!combined.some((entry) => entry.id === member.id)) {
      combined.push(member);
    }
  }

  return combined;
}

export function buildMatchResult({
  vibe,
  location,
  peers,
  selfTabId,
  isLiveMatch,
}: BuildMatchOptions): MatchResult {
  const base = MATCHES[vibe];
  const locationLabel = location?.label ?? base.location;

  const members =
    isLiveMatch && peers.length >= 2
      ? buildLiveMembers(peers, selfTabId, base.members)
      : base.members;

  const plan = location
    ? `${base.plan} · стартуем рядом с ${location.label.split(",")[0]}`
    : base.plan;

  return {
    vibe,
    plan,
    location: locationLabel,
    members,
    isLiveMatch,
    distanceKm: isLiveMatch ? 0.2 : undefined,
  };
}

export function getMatchForVibe(vibe: Vibe): MatchResult {
  return buildMatchResult({
    vibe,
    location: null,
    peers: [],
    selfTabId: "solo",
    isLiveMatch: false,
  });
}
