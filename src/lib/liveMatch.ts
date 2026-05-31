import { haversineKm, getTabId } from "@/lib/geolocation";
import { buildMatchResult } from "@/lib/mockData";
import type { MatchResult, SearchPeer, UserLocation, Vibe } from "@/lib/types";

const CHANNEL_NAME = "drift-live-match-v1";
const STORAGE_KEY = "drift-live-queue";
const PEER_RADIUS_KM = 8;
const MIN_LIVE_SQUAD = 2;
const LIVE_MATCH_DELAY_MS = 2200;
const SOLO_FALLBACK_MS = 7500;
const QUEUE_TTL_MS = 45000;

type MatchMessage =
  | { type: "queue-update" }
  | { type: "match-found"; match: MatchResult; peerIds: string[]; leaderId: string };

export interface LiveSearchOptions {
  vibe: Vibe;
  location: UserLocation | null;
  tabId: string;
  onPeerCount: (count: number) => void;
  onMatch: (match: MatchResult) => void;
}

function readQueue(): SearchPeer[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SearchPeer[]) : [];
    return parsed.filter((entry) => Date.now() - entry.joinedAt < QUEUE_TTL_MS);
  } catch {
    return [];
  }
}

function writeQueue(queue: SearchPeer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }
  return new BroadcastChannel(CHANNEL_NAME);
}

function broadcast(message: MatchMessage) {
  getChannel()?.postMessage(message);
}

function getMatchingPeers(
  vibe: Vibe,
  location: UserLocation | null,
  tabId: string,
): SearchPeer[] {
  const queue = readQueue().filter((peer) => peer.vibe === vibe);

  if (!location) {
    return queue.filter((peer) => peer.tabId === tabId);
  }

  return queue.filter(
    (peer) =>
      haversineKm(location.lat, location.lng, peer.lat, peer.lng) <=
      PEER_RADIUS_KM,
  );
}

function joinQueue(
  vibe: Vibe,
  location: UserLocation,
  tabId: string,
): SearchPeer[] {
  const entry: SearchPeer = {
    tabId,
    vibe,
    lat: location.lat,
    lng: location.lng,
    locationLabel: location.label,
    joinedAt: Date.now(),
  };

  const queue = readQueue().filter((peer) => peer.tabId !== tabId);
  queue.push(entry);
  writeQueue(queue);
  broadcast({ type: "queue-update" });
  return queue;
}

function leaveQueue(tabId: string) {
  writeQueue(readQueue().filter((peer) => peer.tabId !== tabId));
  broadcast({ type: "queue-update" });
}

function pickLeader(peers: SearchPeer[]): string {
  return [...peers].sort((a, b) => a.tabId.localeCompare(b.tabId))[0].tabId;
}

export function startLiveSearch({
  vibe,
  location,
  tabId,
  onPeerCount,
  onMatch,
}: LiveSearchOptions): () => void {
  const channel = getChannel();
  let matched = false;
  let liveMatchTimer: ReturnType<typeof setTimeout> | null = null;
  let soloTimer: ReturnType<typeof setTimeout> | null = null;

  const finish = (match: MatchResult) => {
    if (matched) return;
    matched = true;
    if (liveMatchTimer) clearTimeout(liveMatchTimer);
    if (soloTimer) clearTimeout(soloTimer);
    onMatch(match);
  };

  const evaluate = () => {
    if (matched) return;

    const peers = getMatchingPeers(vibe, location, tabId);
    const others = peers.filter((peer) => peer.tabId !== tabId);
    onPeerCount(others.length);

    if (peers.length >= MIN_LIVE_SQUAD && location) {
      const leaderId = pickLeader(peers);

      if (leaderId === tabId && !liveMatchTimer) {
        liveMatchTimer = setTimeout(() => {
          const match = buildMatchResult({
            vibe,
            location,
            peers,
            selfTabId: tabId,
            isLiveMatch: true,
          });

          broadcast({
            type: "match-found",
            match,
            peerIds: peers.map((peer) => peer.tabId),
            leaderId,
          });
          finish(match);
        }, LIVE_MATCH_DELAY_MS);
      }
    }
  };

  if (location) {
    joinQueue(vibe, location, tabId);
  }

  evaluate();

  soloTimer = setTimeout(() => {
    finish(
      buildMatchResult({
        vibe,
        location,
        peers: location
          ? getMatchingPeers(vibe, location, tabId)
          : [],
        selfTabId: tabId,
        isLiveMatch: false,
      }),
    );
  }, SOLO_FALLBACK_MS);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) evaluate();
  };

  const onMessage = (event: MessageEvent<MatchMessage>) => {
    const message = event.data;
    if (!message) return;

    if (message.type === "queue-update") {
      evaluate();
      return;
    }

    if (
      message.type === "match-found" &&
      message.peerIds.includes(tabId) &&
      message.leaderId !== tabId
    ) {
      finish(message.match);
    }
  };

  window.addEventListener("storage", onStorage);
  channel?.addEventListener("message", onMessage);

  return () => {
    matched = true;
    if (liveMatchTimer) clearTimeout(liveMatchTimer);
    if (soloTimer) clearTimeout(soloTimer);
    leaveQueue(tabId);
    window.removeEventListener("storage", onStorage);
    channel?.removeEventListener("message", onMessage);
    channel?.close();
  };
}

export function getClientTabId(): string {
  return getTabId();
}
