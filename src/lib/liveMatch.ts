import { getQueueLocation, haversineKm, getTabId } from "@/lib/geolocation";
import { buildMatchResult } from "@/lib/mockData";
import type {
  MatchResult,
  SearchPeer,
  UserLocation,
  UserProfile,
  Vibe,
} from "@/lib/types";

const CHANNEL_NAME = "drift-live-match-v1";
const STORAGE_KEY = "drift-live-queue";
const PEER_RADIUS_KM = 50;
const MIN_LIVE_SQUAD = 2;
const LIVE_MATCH_DELAY_MS = 2200;
const SOLO_FALLBACK_MS = 7500;
const QUEUE_TTL_MS = 45000;

type MatchMessage =
  | { type: "queue-update" }
  | {
      type: "match-found";
      peers: SearchPeer[];
      vibe: Vibe;
      location: UserLocation;
      peerIds: string[];
      leaderId: string;
      isLiveMatch: boolean;
    };

export interface LiveSearchOptions {
  vibe: Vibe;
  location: UserLocation | null;
  profile: UserProfile;
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
  queueLocation: UserLocation,
  tabId: string,
  hasRealLocation: boolean,
): SearchPeer[] {
  const queue = readQueue().filter((peer) => peer.vibe === vibe);

  if (!hasRealLocation) {
    return queue;
  }

  return queue.filter(
    (peer) =>
      haversineKm(
        queueLocation.lat,
        queueLocation.lng,
        peer.lat,
        peer.lng,
      ) <= PEER_RADIUS_KM,
  );
}

function joinQueue(
  vibe: Vibe,
  queueLocation: UserLocation,
  profile: UserProfile,
  tabId: string,
): SearchPeer[] {
  const entry: SearchPeer = {
    tabId,
    vibe,
    lat: queueLocation.lat,
    lng: queueLocation.lng,
    locationLabel: queueLocation.label,
    displayName: profile.name,
    age: profile.age,
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

function createMatch(
  vibe: Vibe,
  location: UserLocation,
  peers: SearchPeer[],
  selfTabId: string,
  isLiveMatch: boolean,
): MatchResult {
  return buildMatchResult({
    vibe,
    location,
    peers,
    selfTabId: selfTabId,
    isLiveMatch,
  });
}

export function startLiveSearch({
  vibe,
  location,
  profile,
  tabId,
  onPeerCount,
  onMatch,
}: LiveSearchOptions): () => void {
  const channel = getChannel();
  const queueLocation = getQueueLocation(location);
  const hasRealLocation = location !== null;
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

    const peers = getMatchingPeers(vibe, queueLocation, tabId, hasRealLocation);
    const others = peers.filter((peer) => peer.tabId !== tabId);
    onPeerCount(others.length);

    if (peers.length >= MIN_LIVE_SQUAD) {
      const leaderId = pickLeader(peers);

      if (leaderId === tabId && !liveMatchTimer) {
        liveMatchTimer = setTimeout(() => {
          const matchLocation = location ?? queueLocation;

          broadcast({
            type: "match-found",
            peers,
            vibe,
            location: matchLocation,
            peerIds: peers.map((peer) => peer.tabId),
            leaderId,
            isLiveMatch: true,
          });

          finish(
            createMatch(vibe, matchLocation, peers, tabId, true),
          );
        }, LIVE_MATCH_DELAY_MS);
      }
    }
  };

  joinQueue(vibe, queueLocation, profile, tabId);
  evaluate();

  soloTimer = setTimeout(() => {
    finish(
      createMatch(
        vibe,
        location ?? queueLocation,
        getMatchingPeers(vibe, queueLocation, tabId, hasRealLocation),
        tabId,
        false,
      ),
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
      finish(
        createMatch(
          message.vibe,
          message.location,
          message.peers,
          tabId,
          message.isLiveMatch,
        ),
      );
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
