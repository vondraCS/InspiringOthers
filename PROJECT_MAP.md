# PROJECT_MAP.md

Fast-orientation map for future Claude Code sessions. For product principles and phased build rules see `CLAUDE.md` and `IMPLEMENTATION_PLAN.md` — this file only covers *where things live*.

## Overview

InspiringOthers is a frontend-only React 19 + TypeScript prototype for a peer-to-peer talent-growth platform. The stack is Vite, Tailwind CSS 4 (via `@tailwindcss/vite`), Zustand for state, React Router v7, and MSW + Faker for a mocked `/api/*` surface — there is no real backend. Run it with `npm run dev`; MSW auto-starts in dev and intercepts fetches.

## Entry points

- `index.html` — mount point (`<div id="root">`), Google Fonts (Inter, Raleway), loads `src/main.tsx`.
- `src/main.tsx` — React bootstrap. In dev, dynamically imports `./mocks/browser` and calls `worker.start({ onUnhandledRequest: 'bypass' })` before rendering. Also attaches `@/lib/api/users` functions to `window` for console use.
- `src/App.tsx` — `BrowserRouter` + `Shell` + seven routes: `/` → Home, `/for-you` → ForYou, `/around-you` → AroundYou, `/posts/:id` → PostDetail, `/users/:id` → UserProfile, `/people` → People (stub), `*` → NotFound.
- `src/mocks/browser.ts` — MSW `setupWorker(...handlers)` export; consumed by `main.tsx`.
- `public/mockServiceWorker.js` — MSW-generated service worker (do not hand-edit; regenerate via MSW CLI).
- `vite.config.ts` — React plugin, Tailwind plugin, `@/*` → `./src/*` alias.

## Directory tree

```
InspiringOthers/
├── public/                       (static assets served as-is)
│   ├── favicon.svg
│   └── mockServiceWorker.js      (MSW worker — generated)
├── src/
│   ├── components/
│   │   ├── layout/               (app shell: Sidebar, Navbar, Shell, Logo)
│   │   ├── feed/                 (post cards + section header: PostCard, CardPost, SectionHeader)
│   │   ├── ui/                   (shadcn primitives — regenerate via shadcn CLI)
│   │   ├── chat/                 (InspireChat: ChatLauncher, ChatPanel, ConversationList, ConversationView, MessageInput)
│   │   └── matchmaking/          (UserCard, UserList, MatchmakingFilters)
│   ├── pages/                    (route-level components; default exports — Home, ForYou, AroundYou, PostDetail, UserProfile, People, NotFound)
│   ├── features/                 (feature-scoped logic — phased)
│   │   ├── chat/                 (mockRealtime.ts — dev-only fake incoming replies)
│   │   └── auth/  matchmaking/  posts/   (empty — reserved per IMPLEMENTATION_PLAN)
│   ├── store/                    (Zustand stores, one per domain)
│   ├── mocks/
│   │   ├── browser.ts            (MSW worker setup)
│   │   ├── handlers.ts           (HTTP handlers for /api/*)
│   │   └── data/                 (Faker generators — seed: 42; users, posts, conversations, groups, events)
│   ├── lib/
│   │   ├── api/                  (typed HTTP clients — the API surface)
│   │   └── utils.ts              (cn helper)
│   ├── types/                    (global TS types — single index.ts)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 (Tailwind import, oklch tokens, dark mode)
├── CLAUDE.md                     (project rules — read before editing)
├── IMPLEMENTATION_PLAN.md        (phased build plan: phase 1 → phase 10)
├── DOCUMENTATION.md              (broader product/design docs)
├── FOUNDATIONAL_PROGRAMMING_DOC.md
├── README.md
├── components.json               (shadcn config: style base-nova, lucide icons)
├── eslint.config.js
├── .prettierrc                   (singleQuote, semi, tabWidth 2, trailingComma all)
├── vite.config.ts
├── tsconfig.json                 (references app + node)
├── tsconfig.app.json             (app TS config; paths: @/* → src/*)
├── tsconfig.node.json            (Vite config TS)
├── package.json
└── index.html
```

Skipped in this tree: `node_modules/`, `dist/`, `.git/`, `.claude/`.

## Key modules

### App shell — `src/components/layout/`

- `Shell.tsx` — wraps Sidebar + (Navbar + scrollable `<main>`); mounts `<ChatPanel>` + `<ChatLauncher>` in the bottom-right; calls `authStore.initialize()` on mount; runs `useMockRealtime()` to inject fake incoming chat messages while the app is open.
- `Navbar.tsx` — 100px header with centered Logo (large).
- `Sidebar.tsx` — green (`#2ECB71`) 288px rail with `NavLink`s (Home, For You, Around You), Settings button, small Logo footer. Uses Lucide icons.
- `Logo.tsx` — exports `Logo` component + internal `LogoIcon` SVG. Props: `size: 'sm' | 'lg'`, `color: 'green' | 'black'`.

### Feed components — `src/components/feed/`

- `PostCard.tsx` — featured/tall card: 4:3 image, title, author byline, body excerpt with inline "Read More", optional tag chips. Title/image/"Read More" all link to `/posts/:id`; byline links to `/users/:authorId`. Props: `id, title, authorId, authorName, body, imageUrl?, tags?, className?`.
- `CardPost.tsx` — compact/square card for recommended rows. Same linking behavior as `PostCard` (no tags, no "Read More"). Props: `id, title, authorId, authorName, body, imageUrl?, className?`.
- `SectionHeader.tsx` — reusable section heading: Raleway-bold title on the left, optional "See More →" link (with `ArrowRight` icon) on the right. Props: `title, seeMoreHref?, seeMoreLabel?, className?`. Used by Featured Posts, Recommended Posts, and "Posts for you" sections.

### Chat components — `src/components/chat/`

Reach the panel via the floating launcher; panel + launcher both live in `Shell` so they're available on every route.

- `ChatLauncher.tsx` — floating pill button (bottom-right, `fixed`) that toggles `uiStore.chatOpen`. Always visible.
- `ChatPanel.tsx` — fixed bottom-right panel (360×520) shown when `chatOpen` is true. Loads conversations on first open via `chatStore.loadConversations()`. Header shows either "InspireChat" (list mode) or the active conversation's name plus a back button. Close button resets `chatOpen`.
- `ConversationList.tsx` — scrollable list of all conversations. Icon per type (`Hash`/`Users`/`MessageCircle` for channel/group/dm) with a tiny uppercase type label on the right. Clicking a row calls `setActiveConversation(id)`.
- `ConversationView.tsx` — renders messages for a given `Conversation`. Auto-loads messages on mount if not cached; auto-scrolls to the latest message. Own messages (`authorId === authStore.currentUser.id`) render right-aligned on brand green; others render left-aligned on `bg-black/5`. Embeds `<MessageInput>`.
- `MessageInput.tsx` — autogrowing-ish textarea + send button. Enter sends, Shift+Enter newline. Calls `chatStore.sendMessage(convId, body)`; button is disabled while sending or on empty input.

### Matchmaking components — `src/components/matchmaking/`

- `UserCard.tsx` — compact peer card (200px wide): circular avatar, name, skill-level chip, location with `MapPin` icon, up to 3 interest chips. Avatar + name link to `/users/:id`. Props: `id, name, avatar, skillLevel, interests, location, className?`.
- `UserList.tsx` — renders a list of `User`s. Two layouts: `'row'` (default; flex-wrap row) and `'grid'` (4-col CSS grid). Props: `users: User[], layout?: 'row' | 'grid', className?`.
- `MatchmakingFilters.tsx` — read/writes `matchmakingStore.filters`. Skill-level checkboxes (3 options), interest checkboxes (caller-supplied via `availableInterests` prop — usually derived from the visible user list), and a "Near me" toggle (hideable via `showNearbyToggle={false}`). Includes a "Clear all" button when any filter is active.

### UI primitives — `src/components/ui/`

- `button.tsx` — shadcn Button built on `@base-ui/react` + CVA. Variants: default, outline, secondary, ghost, destructive, link. Sizes: default, xs, sm, lg, icon (+ icon-xs/sm/lg). **Do not hand-edit — regenerate via shadcn CLI.**

### Pages — `src/pages/` (all default exports)

- `Home.tsx` — wired to `feedStore`. On mount calls `loadFeatured()` and `loadRecommended()`; renders Featured Posts (3-col `PostCard` grid, top 3) and Recommended Posts (horizontal `CardPost` row, top 4, with "See More →" to `/for-you`). Shows "Loading..." / "No posts yet." states.
- `ForYou.tsx` — wired to `feedStore.loadForYou()` and `matchmakingStore.loadRecommended()`. Renders two sections: "People you might connect with" (`MatchmakingFilters` + horizontal `UserList` of up to 8 filtered recommended users, with "See More →" to `/people`) and "Posts for you" (3-col `PostCard` grid, page-size 20 with "Load More" button — no infinite scroll). Shows loading/empty states per section.
- `AroundYou.tsx` — wired to `matchmakingStore.loadNearby()` and `eventsStore.loadLocal()`. Renders two sections: "Nearby peers" (`MatchmakingFilters` + `UserList` of filtered nearby users) and "Local events" (vertical list of events with title, formatted date via `date-fns`, location, and short description). Shows loading/empty states per section.
- `PostDetail.tsx` — route `/posts/:id`. Reads from `feedStore.postsById[id]` / `loadingPostById[id]` / `errorPostById[id]`; calls `loadPost(id)` on mount. Renders back button (`useNavigate(-1)`), Raleway title, author byline linking to `/users/:authorId`, 16:9 cover image, full body (preserves whitespace), and tag chips. Fallback states for loading, error, and not-found.
- `UserProfile.tsx` — stub (`<h1>User Profile</h1>`) added in Phase 5 so author-byline links resolve; fleshed out in Phase 8.6.
- `People.tsx` — stub (`<h1>People</h1>`) at `/people`; target of the "See More →" link on the For You "People you might connect with" row. Fleshed out in a future phase.
- `NotFound.tsx` — 404 fallback.

### State — `src/store/` (Zustand)

- `authStore.ts` — `currentUser`, `isLoaded`, `error`; `initialize()` calls `getCurrentUser()`.
- `userStore.ts` — `usersById` cache; `cacheUser(s)`, `getUserById(id)`.
- `feedStore.ts` — `featured[]`, `recommended[]`, `forYou[]` post arrays (all `PostWithAuthor`) + `postsById` cache; per-list `loading*`/`error*` flags and per-id `loadingPostById` / `errorPostById` maps; loaders `loadFeatured`, `loadRecommended`, `loadForYou`, `loadPost(id)`. List loaders populate `postsById` as a side effect so detail navigation doesn't refetch; `loadPost` short-circuits when the post is already cached or in-flight.
- `chatStore.ts` — `conversations[]`, `activeConversationId`, `messagesByConversation`, `loadingConversations`, `loadingMessages`, `error`. Actions: `loadConversations`, `loadMessages(id)`, `sendMessage(id, body)` (optimistically appends the API-returned message), `setActiveConversation(id)` (auto-loads messages for the id if not cached).
- `matchmakingStore.ts` — `recommendedUsers[]`, `nearbyUsers[]`, `filters` (`{ skillLevels, interests, nearbyOnly }`); loaders `loadRecommended`, `loadNearby`; `setFilters` (partial merge); convenience methods `filteredRecommended()` / `filteredNearby()` that read `currentUser` from `authStore`. Also exports the pure helper `applyMatchmakingFilters(users, filters, currentUser)` for use inside `useMemo` so components can re-derive filtered lists without a cross-store closure. `nearbyOnly` filters by exact-match city (case-insensitive, parsed from the `"City, Country"` location string).
- `eventsStore.ts` — `localEvents[]`, `loadingLocal`, `error`; `loadLocal()` calls `getLocalEvents()`. Used by Around You.
- `uiStore.ts` — `sidebarCollapsed`, `chatOpen` toggles. Uses Zustand `persist` middleware (localStorage key `ui-state`; only `sidebarCollapsed` persisted).

### Mock API — `src/mocks/`

- `browser.ts` — `setupWorker(...handlers)` export.
- `handlers.ts` — MSW handlers for: `GET /api/auth/me`, `GET /api/users/{recommended,nearby}`, `GET /api/posts/{feed,recommended,for-you}`, `GET /api/posts/:id`, `GET /api/conversations`, `GET/POST /api/conversations/:id/messages`, `GET /api/groups`, `GET /api/events/local`. Post endpoints return `PostWithAuthor` — `enrichPost()` joins `USERS_BY_ID` into each post so clients don't need a second lookup. The three list endpoints slice `POSTS` deterministically: feed `[0:20]`, recommended `[20:30]`, for-you `[30:50]`. `/api/users/recommended` filters peers with the same `skillLevel` as the current user; `/api/users/nearby` returns the next slice of remaining peers.
- `data/index.ts` — seeds `faker` with 42, generates and exports `USERS` (50), `POSTS` (60), `CONVERSATIONS`, `MESSAGES` (by conv id), `GROUPS` (10), `LOCAL_EVENTS` (8), and `CURRENT_USER_ID = USERS[0].id`.
- `data/users.ts` — `generateUsers(count)`; hardcoded `INTERESTS` (~30) and `GOALS` (~20) pools.
- `data/posts.ts` — `generatePosts(count, userIds)`; 10 title templates, 4–8 lorem paragraphs, picsum.photos covers, `TAGS`/`SUBJECTS` pools.
- `data/conversations.ts` — `generateConversations(users)` (6 DMs, 4 groups, 4 channels for `users[0]`) + `generateMessages(convs, users)` (5–20 msgs each).
- `data/groups.ts` — `generateInterestGroups(userIds)` → 10 groups across hardcoded `TOPICS`.
- `data/events.ts` — `generateLocalEvents(count)`; hardcoded `EVENT_TITLES` (12) and `VENUES` (8) pools, dates in the next 30 days, lorem-ipsum descriptions.

### API surface — `src/lib/api/`

**Hard rule (from `CLAUDE.md`):** components import from here, never from `@/mocks/*` directly.

- `users.ts` — `getRecommendedUsers()`, `getNearbyUsers()`, `getCurrentUser()`.
- `posts.ts` — `getFeaturedPosts()`, `getRecommendedPosts()`, `getForYouPosts()`, `getPost(id)` — all return `PostWithAuthor` (the MSW layer joins the author inline).
- `chat.ts` — `getConversations()`, `getChatMessages(convId)`, `sendMessage(convId, body)`.
- `events.ts` — `getLocalEvents()`.

All functions `fetch()` from `/api/...` and throw on non-ok response.

### Feature modules — `src/features/`

- `chat/mockRealtime.ts` — exports `useMockRealtime()` hook + internal `injectOnce()`. Schedules a recursive `setTimeout` (30–60s randomised delay) that picks a conversation with already-loaded messages, picks a non-current-user participant as the author, and appends a canned reply (from a local `REPLIES` pool) by mutating `useChatStore.setState`. Isolated in `features/` per the plan so it can be ripped out when real-time chat lands. Mounted once from `Shell`.

### Utilities — `src/lib/`

- `utils.ts` — `cn(...inputs)` helper (clsx + tailwind-merge).

### Types — `src/types/`

- `index.ts` — see Data model section below.

## Cross-cutting concerns

- **API abstraction boundary** (sacred, see `CLAUDE.md` rule #1): components → `@/lib/api/*` → MSW handlers → `@/mocks/data/*`. Never shortcut past the API layer.
- **MSW wiring**: `src/main.tsx` dynamically imports `./mocks/browser` under `import.meta.env.DEV`, then `worker.start({ onUnhandledRequest: 'bypass' })`. The worker file itself is `public/mockServiceWorker.js`. Production builds skip MSW entirely.
- **Routing**: `src/App.tsx` owns the `BrowserRouter` + routes; active-link styling lives in `src/components/layout/Sidebar.tsx` via `NavLink`.
- **Path alias `@/*` → `./src/*`**: set in both `vite.config.ts` and `tsconfig.app.json`. Always prefer it over relative imports across directories.
- **Styling / design tokens**: Tailwind 4 is configured inline via `@tailwindcss/vite` — **there is no `tailwind.config.ts` file**. Theme tokens (oklch colors, light + `.dark` variants, font variables for Raleway/Inter/Geist) live in `src/index.css`. shadcn CLI config is in `components.json` (style `base-nova`, lucide icons, aliases).
- **Auth stub**: `authStore.initialize()` fetches `/api/auth/me` (the MSW handler returns the mock `CURRENT_USER`). `Shell` triggers `initialize()` on first mount; `chatStore`/`ConversationView` read `currentUser.id` to distinguish own vs. other messages. There is no real login.
- **Feature flags / env config**: none. Dev-mode gating uses `import.meta.env.DEV` only.
- **Error handling**: API clients throw on non-ok responses; stores catch and set per-store `error` fields. No global error boundary yet (Phase 8).

## Data model

All entity types are in `src/types/index.ts`:

- `SkillLevel` enum — `'beginner' | 'intermediate' | 'advanced'`.
- `User` — `{ id, name, avatar, interests: string[], skillLevel: SkillLevel, location, goals: string[] }`.
- `Post` — `{ id, authorId, title, body, coverImage?, createdAt: ISO, tags: string[] }`.
- `PostAuthor` — `Pick<User, 'id' | 'name' | 'avatar'>` (wire format for author joins).
- `PostWithAuthor` — `Post & { author: PostAuthor }`. What every post endpoint actually returns and what `feedStore` holds.
- `ChatMessage` — `{ id, conversationId, authorId, body, createdAt: ISO }`.
- `Conversation` — `{ id, type: 'dm' | 'group' | 'channel', participantIds: string[], name }`.
- `InterestGroup` — `{ id, name, topic, skillLevel: SkillLevel, memberIds: string[] }`.
- `LocalEvent` — `{ id, title, date: ISO, location, description }`.

Mock data is deterministic: `faker.seed(42)` in `src/mocks/data/index.ts`. Reloads produce the same users/posts/conversations.

## Testing

**No test runner is currently configured.** `package.json` has no `test` script, no Vitest/Jest/Playwright dependencies, and no `tests/` or `__tests__/` directories exist. Code quality is enforced via `npm run lint` (ESLint) and `npm run build` (TypeScript `tsc -b` as part of the build). Adding a test setup is future work.

## Commands

From `package.json` — use these exactly:

- `npm run dev` — Vite dev server (MSW auto-starts).
- `npm run build` — `tsc -b && vite build`.
- `npm run preview` — preview the production build locally.
- `npm run lint` — ESLint across the repo.
- `npm run format` — Prettier over `src/**/*.{ts,tsx,css}`.

## Conventions

Patterns actually present in the codebase (spot-checked):

- **Export style**: pages use `export default function PageName()` (see `src/pages/Home.tsx:53`, `src/App.tsx:8`); components and stores use named exports (`src/components/layout/Shell.tsx:4`, stores in `src/store/*.ts`).
- **Path alias usage**: cross-directory imports use `@/...` (e.g. `src/App.tsx:2-6`, `src/pages/Home.tsx:2-3`); intra-directory imports stay relative (e.g. `src/components/layout/Shell.tsx:1-2`).
- **One Zustand store per domain**: six stores in `src/store/`, each focused on a single concern. The `persist` middleware is only used where state must survive reloads (currently just `uiStore.sidebarCollapsed`).
- **File naming**: PascalCase for React components and pages (`Sidebar.tsx`, `Home.tsx`); camelCase for stores, utilities, and non-component modules (`feedStore.ts`, `utils.ts`, `handlers.ts`).
- **Mock-data flow**: adding a new entity requires a type in `@/types`, a generator in `@/mocks/data/`, a handler in `@/mocks/handlers.ts`, and an API function in `@/lib/api/` — in that order (see `CLAUDE.md` "When Adding a New Feature").
- **Phased implementation**: see `IMPLEMENTATION_PLAN.md`. Styling polish is deliberately deferred to Phase 9. Phases 1–7 are complete: Home/ForYou/AroundYou are wired (For You has a People row + Posts grid; Around You has Nearby peers + Local events), `PostDetail` is live at `/posts/:id`, `UserProfile` and `People` are stubs at `/users/:id` and `/people` respectively, InspireChat (launcher + panel + conversation list/view + message input + mock-realtime reply injector) is functional in the bottom-right on every page, and the matchmaking components (`UserCard`, `UserList`, `MatchmakingFilters`) drive both peer-discovery surfaces.
