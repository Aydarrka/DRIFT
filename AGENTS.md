<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Repository branches

- **`main`** currently contains only `.cursorrules` (product spec). There is no `package.json` on `main`.
- The runnable Next.js app lives on **`cursor/scaffold-drift-app-13d7`** (tracked on `origin`). Check out that branch (or merge it) before `npm install` / `npm run dev`.

### Services (E2E)

| Service | Required? | Notes |
|---------|-----------|--------|
| Next.js dev server (`npm run dev`, port 3000) | Yes | Single process; mock state in React Context |
| Supabase / Docker / external API | No | Not implemented in the MVP |

### Commands

See `README.md` for the canonical getting-started flow. Quick reference:

| Task | Command |
|------|---------|
| Install deps | `npm install` (requires `package.json` on the checked-out branch) |
| Dev server | `npm run dev` → http://localhost:3000 |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Production serve | `npm run start` (after build) |
| Tests | None configured (no `npm test` script) |

### Dev server

- Use a **mobile viewport** (~390×844) when manually testing; the UI is designed as a mobile web app.
- Mock matching on `/searching` waits **~5.2s** (`SEARCH_DURATION_MS` in `src/app/searching/page.tsx`) before redirecting to `/match`.
- No `.env` files are required for the current mock flow.

### Hello-world E2E (manual)

1. Open `/`, pick a vibe (Active / Chill / Deep Talk).
2. Tap **I'm bored** → `/searching` (radar + status text).
3. After ~5s → `/match` with squad avatars, Bishkek plan, and **Подтвердить**.
