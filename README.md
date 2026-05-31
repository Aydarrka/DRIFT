# DRIFT

Instant flash squads nearby — a hackathon MVP for killing boredom in one tap.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Browser Geolocation + OpenStreetMap reverse geocoding
- BroadcastChannel multi-tab live matching

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on a mobile viewport for the best experience. Allow location access when prompted.

## User flow

1. **Home (`/`)** — App detects your area, pick a vibe, tap **I'm bored**
2. **Searching (`/searching`)** — Radar scans near your location; if another tab is searching the same vibe, they match live
3. **Match (`/match`)** — Bottom sheet with squad avatars, localized plan, and confirm button

## Live demo (two tabs)

1. Open `http://localhost:3000` in **two browser tabs**
2. Pick the **same vibe** in both tabs
3. Tap **I'm bored** in both tabs within ~30 seconds
4. Both tabs should show **"1 person nearby also searching"** and match together with a **Live squad matched** badge

## Solo fallback

If no other searchers are found within ~7 seconds, the app falls back to a simulated squad using your real location label when available.

## Mock scenarios (Bishkek)

| Vibe | Plan |
|------|------|
| Active | Scooters on Южная Магистраль |
| Chill | Coffee at Sierra → hang out on Эркиндik |
| Deep Talk | Startups chat in Парк Панфилова |

Plans are augmented with your detected neighborhood when location is enabled.
