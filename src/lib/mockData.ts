import type { MatchResult, Vibe, VibeOption } from "./types";

export const VIBE_OPTIONS: VibeOption[] = [
  {
    id: "active",
    label: "Active",
    icon: "zap",
    accent: "#34d399",
  },
  {
    id: "chill",
    label: "Chill",
    icon: "coffee",
    accent: "#60a5fa",
  },
  {
    id: "deep-talk",
    label: "Deep Talk",
    icon: "message-circle",
    accent: "#c084fc",
  },
];

const MATCHES: Record<Vibe, Omit<MatchResult, "vibe">> = {
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

export const SEARCH_STATUSES = [
  "Сканируем район...",
  "Ищем людей рядом...",
  "Матчим вайбы...",
  "Собираем сквод...",
  "Почти готово...",
];

export function getMatchForVibe(vibe: Vibe): MatchResult {
  return { vibe, ...MATCHES[vibe] };
}
