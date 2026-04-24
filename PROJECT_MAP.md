# PROJECT_MAP.md

Fast-orientation map for future Claude Code sessions. For product principles and phased build rules see `CLAUDE.md` and `IMPLEMENTATION_PLAN.md` — this file only covers *where things live*.

## Overview

InspiringOthers is a frontend-only React 19 + TypeScript prototype for a peer-to-peer talent-growth platform. The stack is Vite, Tailwind CSS 4 (via `@tailwindcss/vite`), Zustand for state, React Router v7, and MSW + Faker for a mocked `/api/*` surface — there is no real backend. Run it with `npm run dev`; MSW auto-starts in dev and intercepts fetches.

## Entry points

- `index.html` — mount point (`<div id="root">`), Google Fonts (Inter, Raleway), loads `src/main.tsx`.
- `src/main.tsx` — React bootstrap. In dev, dynamically imports `./mocks/browser` and calls `worker.start({ onUnhandledRequest: 'bypass' })` before rendering. Also attaches `@/lib/api/users` functions to `window` for console use.
- `src/App.tsx` — `<ErrorBoundary>` + `<ToastProvider>` + `BrowserRouter`. Top-level route split: `/onboarding` renders full-page `Onboarding` (no Shell); everything else is wrapped in `<OnboardingGuard>` + `<Shell>` with child routes `/`, `/for-you`, `/around-you`, `/posts/:id`, `/users/:id`, `/people`, `*`. `OnboardingGuard` reads `localStorage['io-onboarded']` and redirects to `/onboarding` on first visit.
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
│   │   ├── ErrorBoundary.tsx     (top-level React error boundary — renders a fallback + "Try again")
│   │   ├── layout/               (app shell: Sidebar, Navbar, Shell, Logo)
│   │   ├── feed/                 (post + section header + loading: Post, PostSkeleton, SectionHeader)
│   │   ├── ui/                   (shadcn primitives + Base UI wrappers — button, dialog, toast, tooltip, dropdown-menu, skeleton, empty-state)
│   │   ├── chat/                 (InspireChat: ChatLauncher, ChatPanel, ConversationList, ConversationView, MessageInput)
│   │   ├── settings/             (SettingsDialog — profile editor)
│   │   └── matchmaking/          (UserCard, UserCardSkeleton, UserList, MatchmakingFilters)
│   ├── pages/                    (route-level components; default exports — Home, ForYou, AroundYou, PostDetail, UserProfile, People, Onboarding, NotFound)
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
│   │   ├── useMediaQuery.ts      (useSyncExternalStore hook for matchMedia subscriptions)
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

- `Shell.tsx` — wraps Sidebar + (Navbar + scrollable `<main>`); mounts `<ChatPanel>` + `<ChatLauncher>` in the bottom-right and the `<SettingsDialog>` driven by `uiStore.settingsOpen`; calls `authStore.initialize()` on mount; runs `useMockRealtime()` to inject fake incoming chat messages while the app is open.
- `Navbar.tsx` — 100px header with centered Logo (large); right-side avatar menu (current user's avatar + name) opens a `DropdownMenu` with "Settings" (opens `SettingsDialog`) and "Log out". Logout clears the `io-onboarded` localStorage flag, calls `authStore.logout()`, and redirects to `/onboarding`. Renders nothing on the right until `authStore.currentUser` loads.
- `Sidebar.tsx` — `bg-primary` 288px rail (72px when collapsed) with `NavLink`s (Home, For You, Around You), Settings button (opens `SettingsDialog` via `uiStore.setSettingsOpen(true)`), small Logo footer. Uses Lucide icons. Nav labels + footer Logo fade via `opacity` / `w-0 overflow-hidden` (200ms) instead of unmounting. Collapsed-state icons wrap in `<Tooltip side="right">` so labels remain discoverable. Effective collapsed state is `storedCollapsed || isBelowLg` via `useMediaQuery('(max-width: 1023.98px)')`, so under the `lg` breakpoint the rail collapses automatically without mutating the persisted preference.
- `Logo.tsx` — exports `Logo` component + internal `LogoIcon` SVG. Props: `size: 'sm' | 'lg'`, `color: 'green' | 'black'`.

### Feed components — `src/components/feed/`

- `Post.tsx` — unified post card with two variants. `featured`: 4:3 image, title (reserved 2-line height so images align across a row), author byline, body excerpt, optional tag chips. `compact`: square image, centered byline, title, body — used in compact recommended rows. Uses a stretched-link pattern so clicking anywhere on the card navigates to `/posts/:id`; the byline is a layered link to `/users/:authorId`. Hover treatment: `group` wrapper + `hover:-translate-y-0.5 hover:shadow-card-hover` on the article, `group-hover:scale-[1.03]` zoom on the image, and `group-hover:text-primary` color shift on the title. Tag chips use the tokenised `bg-muted text-muted-foreground` pill treatment. Props: `id, title, authorId, authorName, body, imageUrl?, tags?, variant?, className?`.
- `PostSkeleton.tsx` — loading placeholder matching both `Post` variants (featured and compact). Used by Home, ForYou, and PostDetail while data loads. Uses `Skeleton` primitive.
- `SectionHeader.tsx` — reusable section heading: Raleway-bold title on the left (via `text-heading` token), optional "See More →" link (with `ArrowRight` icon) on the right. The underline is a grow-from-left pseudo-element (`scale-x-0 group-hover:scale-x-100`) and the text shifts to `text-primary` on hover. Props: `title, seeMoreHref?, seeMoreLabel?, className?`. Used by Featured Posts, Recommended Posts, and "Posts for you" sections.

### Chat components — `src/components/chat/`

Reach the panel via the floating launcher; panel + launcher both live in `Shell` so they're available on every route.

- `ChatLauncher.tsx` — floating pill button (bottom-right, `fixed`) that toggles `uiStore.chatOpen`. Always visible.
- `ChatPanel.tsx` — fixed bottom-right panel (360×520) shown when `chatOpen` is true. Loads conversations on first open via `chatStore.loadConversations()`. Header shows either "InspireChat" (list mode) or the active conversation's name plus a back button. Close button resets `chatOpen`.
- `ConversationList.tsx` — scrollable list of all conversations. Icon per type (`Hash`/`Users`/`MessageCircle` for channel/group/dm) with a tiny uppercase type label on the right. Clicking a row calls `setActiveConversation(id)`.
- `ConversationView.tsx` — renders messages for a given `Conversation`. Auto-loads messages on mount if not cached; auto-scrolls to the latest message. Own messages (`authorId === authStore.currentUser.id`) render right-aligned on brand green; others render left-aligned on `bg-black/5`. Embeds `<MessageInput>`.
- `MessageInput.tsx` — autogrowing-ish textarea + send button. Enter sends, Shift+Enter newline. Calls `chatStore.sendMessage(convId, body)`; button is disabled while sending or on empty input.

### Matchmaking components — `src/components/matchmaking/`

- `UserCard.tsx` — compact peer card (200px wide): circular avatar (with `ring-1 ring-border-subtle`), name, `@username`, location with `MapPin` icon, up to 3 interest pills. Avatar + name link to `/users/:id`. Hover: `hover:-translate-y-0.5 hover:shadow-card`. Props: `id, fullName, username, avatar, interests, location, className?`.
- `UserCardSkeleton.tsx` — loading placeholder sized to match `UserCard`. Used by ForYou and AroundYou while recommendations load.
- `UserList.tsx` — renders a list of `User`s. Two layouts: `'row'` (default; flex-wrap row) and `'grid'` (4-col CSS grid). Props: `users: User[], layout?: 'row' | 'grid', className?`.
- `MatchmakingFilters.tsx` — read/writes `matchmakingStore.filters`. Interest chips render as clickable toggle buttons (selected: `bg-primary/15 border-primary text-primary`, unselected: neutral outline) and a "Near me" checkbox (hideable via `showNearbyToggle={false}`). Includes a "Clear all" button when any filter is active. Uses `accent-primary` for native checkbox styling.

### UI primitives — `src/components/ui/`

- `button.tsx` — shadcn Button built on `@base-ui/react` + CVA. Variants: default, outline, secondary, ghost, destructive, link. Sizes: default, xs, sm, lg, icon (+ icon-xs/sm/lg). **Do not hand-edit — regenerate via shadcn CLI.**
- `dialog.tsx` — wraps Base UI `Dialog.Root/Portal/Backdrop/Popup/Title/Description/Close`. Exports `Dialog`, `DialogTrigger`, `DialogClose`, and a ready-styled `DialogContent` (centered, 520px max, backdrop, X close button). Hand-edit freely — not a shadcn-generated primitive.
- `toast.tsx` — wraps Base UI Toast. Exports a `toastManager` singleton (from `Toast.createToastManager()`), a `toast` helper API (`toast.show|success|error({ title, description, timeout })`), and a `<ToastProvider>` that mounts the provider + a top-right viewport/portal with styled toasts. Stores import `toast` and call `toast.error(...)` from their catch blocks so API failures surface globally without cross-store wiring.
- `tooltip.tsx` — wraps Base UI `Tooltip.Root/Portal/Positioner/Popup`. Exports `Tooltip` (renders children as the trigger via Base UI's `render={element}` pattern) and the raw `TooltipProvider` for shared delay grouping. Props: `children, content, disabled?, side?, sideOffset?, className?`. Used by the collapsed-sidebar icons.
- `dropdown-menu.tsx` — wraps Base UI `Menu.Root/Trigger/Portal/Positioner/Popup/Item`. Exports `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent` (styled popover with fade-in/out), and `DropdownMenuItem` (highlighted via `data-[highlighted]:bg-muted`). Used by the Navbar avatar menu.
- `skeleton.tsx` — minimal pulse-animated div (`animate-pulse bg-muted rounded-md`). Used by `PostSkeleton`, `UserCardSkeleton`, `PostDetail`, and `UserProfile` loading states.
- `empty-state.tsx` — centered icon + title + optional description block. Props: `icon?: LucideIcon, title, description?, className?`. Used across Home, ForYou, AroundYou to replace bare "No X yet." strings.

### Settings — `src/components/settings/`

- `SettingsDialog.tsx` — profile editor mounted once in `Shell`. `{ open, onOpenChange }` props. Renders a `Dialog` with three sections (Account: display name + avatar URL, Skill level radios, Interests checkbox list over a hardcoded `INTEREST_POOL` of 30). Reads `authStore.currentUser` and calls `authStore.updateProfile(...)` on Save (which also writes through to `userStore.cacheUser`). Uses `key={String(open)}` on the inner `SettingsForm` so the form re-initializes from props each time the dialog opens (avoids setState-in-effect). Changes are in-memory only — there is no persistence layer.

### Error handling — `src/components/ErrorBoundary.tsx`

Class-component error boundary wrapping `<ToastProvider>` + `<BrowserRouter>` in `App.tsx`. Catches render-time errors, logs them, and renders a plain fallback with a "Try again" button that clears the boundary state.

### Pages — `src/pages/` (all default exports)

- `Home.tsx` — wired to `feedStore`. On mount calls `loadFeatured()` and `loadRecommended()`; renders Featured Posts (responsive `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` of `Post variant="featured"`, top 3) and Recommended Posts (horizontal `Post variant="compact"` row, top 4, with "See More →" to `/for-you`). Loading state renders `PostSkeleton`s shaped like the real cards; empty states use `EmptyState` with a `Newspaper` icon.
- `ForYou.tsx` — wired to `feedStore.loadForYou()` and `matchmakingStore.loadRecommended()`. Renders two sections: "People you might connect with" (`MatchmakingFilters` + horizontal `UserList` of up to 8 filtered recommended users, with "See More →" to `/people`) and "Posts for you" (responsive `Post variant="featured"` grid, page-size 20 with shadcn `Button` "Load More" — no infinite scroll). Loading states render `UserCardSkeleton` / `PostSkeleton`; empty states use `EmptyState` (`Users` / `Newspaper` icons).
- `AroundYou.tsx` — wired to `matchmakingStore.loadNearby()` and `eventsStore.loadLocal()`. Renders two sections: "Nearby peers" (`MatchmakingFilters` + `UserList` of filtered nearby users) and "Local events" (vertical list of events with title, formatted date via `date-fns`, location, and short description; each card has hover-lift). Loading states render `UserCardSkeleton` and event-shaped `Skeleton`s; empty states use `EmptyState`.
- `PostDetail.tsx` — route `/posts/:id`. Reads from `feedStore.postsById[id]` / `loadingPostById[id]` / `errorPostById[id]`; calls `loadPost(id)` on mount. Renders shadcn `Button variant="ghost"` back control (`useNavigate(-1)`), Raleway title at `text-display` size, author byline linking to `/users/:authorId`, 16:9 cover image, and paragraphs split on blank lines rendered inside a `max-w-prose` column at `text-lg leading-relaxed`. Tags render as tokenised pill chips. Loading state is a card-shaped `Skeleton` block.
- `UserProfile.tsx` — route `/users/:id`. Reads from `userStore.usersById[id]` / `loadingById[id]` / `errorById[id]` and calls `loadUser(id)` on mount. Renders shadcn `Button variant="ghost"` back control, circular avatar (`ring-4 ring-primary/10`), name, `@username`, location with `MapPin`, an Interests chip row (`bg-muted` pills), and a Goals list (each goal rendered with a `border-primary` left border). Loading state is avatar + text `Skeleton`s; fallback states for error and not-found.
- `People.tsx` — stub (`<h1>People</h1>`) at `/people`; target of the "See More →" link on the For You "People you might connect with" row. Fleshed out in a future phase.
- `Onboarding.tsx` — route `/onboarding`, rendered outside `Shell`. `react-hook-form` + `zod` (schema: interests non-empty, skillLevel enum, optional location string). One-page form: interest checkboxes (hardcoded 20-entry pool), skill-level radios, optional "City, Country" text input. Submit calls `authStore.updateProfile(...)`, writes `localStorage['io-onboarded'] = '1'`, fires a success toast, and navigates to `/`. Also exports the `ONBOARDED_KEY = 'io-onboarded'` constant used by `OnboardingGuard` (App.tsx) and the Navbar logout handler.
- `NotFound.tsx` — 404 fallback.

### State — `src/store/` (Zustand)

- `authStore.ts` — `currentUser`, `isLoaded`, `error`. Actions: `initialize()` (fetches `/api/auth/me`, caches the user into `userStore`, toasts on failure), `updateProfile(updates: ProfileUpdate)` (merges into `currentUser` and writes through to `userStore.cacheUser`; used by `SettingsDialog` + `Onboarding`), `logout()` (resets `currentUser`/`isLoaded`). Also exports the `ProfileUpdate` type (`Partial<Pick<User, 'name'|'avatar'|'location'|'interests'|'goals'> & { skillLevel }>`).
- `userStore.ts` — `usersById` cache + per-id `loadingById` / `errorById`. Actions: `cacheUser(s)`, `getUserById(id)`, `loadUser(id)` (short-circuits if cached or in-flight; fetches from `/api/users/:id` via `getUser()`, toasts on failure). Drives `UserProfile.tsx`.
- `feedStore.ts` — `featured[]`, `recommended[]`, `forYou[]` post arrays (all `PostWithAuthor`) + `postsById` cache; per-list `loading*`/`error*` flags and per-id `loadingPostById` / `errorPostById` maps; loaders `loadFeatured`, `loadRecommended`, `loadForYou`, `loadPost(id)`. List loaders populate `postsById` as a side effect so detail navigation doesn't refetch; `loadPost` short-circuits when the post is already cached or in-flight.
- `chatStore.ts` — `conversations[]`, `activeConversationId`, `messagesByConversation`, `loadingConversations`, `loadingMessages`, `error`. Actions: `loadConversations`, `loadMessages(id)`, `sendMessage(id, body)` (optimistically appends the API-returned message), `setActiveConversation(id)` (auto-loads messages for the id if not cached).
- `matchmakingStore.ts` — `recommendedUsers[]`, `nearbyUsers[]`, `filters` (`{ skillLevels, interests, nearbyOnly }`); loaders `loadRecommended`, `loadNearby`; `setFilters` (partial merge); convenience methods `filteredRecommended()` / `filteredNearby()` that read `currentUser` from `authStore`. Also exports the pure helper `applyMatchmakingFilters(users, filters, currentUser)` for use inside `useMemo` so components can re-derive filtered lists without a cross-store closure. `nearbyOnly` filters by exact-match city (case-insensitive, parsed from the `"City, Country"` location string).
- `eventsStore.ts` — `localEvents[]`, `loadingLocal`, `error`; `loadLocal()` calls `getLocalEvents()`. Used by Around You.
- `uiStore.ts` — `sidebarCollapsed`, `chatOpen`, `settingsOpen` toggles (+ `setX` / `toggleX` actions). Uses Zustand `persist` middleware (localStorage key `ui-state`; only `sidebarCollapsed` persisted — `chatOpen`/`settingsOpen` reset on reload).

All list/detail loaders (auth, feed, chat, matchmaking, events, user-by-id) call `toast.error(...)` from their `catch` blocks in addition to setting their local `error` field, so API failures surface globally without cross-store wiring.

### Mock API — `src/mocks/`

- `browser.ts` — `setupWorker(...handlers)` export.
- `handlers.ts` — MSW handlers for: `GET /api/auth/me`, `GET /api/users/{recommended,nearby}`, `GET /api/users/:id`, `GET /api/posts/{feed,recommended,for-you}`, `GET /api/posts/:id`, `GET /api/conversations`, `GET/POST /api/conversations/:id/messages`, `GET /api/groups`, `GET /api/events/local`. Post endpoints return `PostWithAuthor` — `enrichPost()` joins `USERS_BY_ID` into each post so clients don't need a second lookup. The three list endpoints slice `POSTS` deterministically: feed `[0:20]`, recommended `[20:30]`, for-you `[30:50]`. `/api/users/recommended` filters peers with the same `skillLevel` as the current user; `/api/users/nearby` returns the next slice of remaining peers; `/api/users/:id` looks up against `USERS_BY_ID` and 404s if missing.
- `data/index.ts` — seeds `faker` with 42, generates and exports `USERS` (50), `POSTS` (60), `CONVERSATIONS`, `MESSAGES` (by conv id), `GROUPS` (10), `LOCAL_EVENTS` (8), and `CURRENT_USER_ID = USERS[0].id`.
- `data/users.ts` — `generateUsers(count)`; hardcoded `INTERESTS` (~30) and `GOALS` (~20) pools.
- `data/posts.ts` — `generatePosts(count, userIds)`; 10 title templates, 4–8 lorem paragraphs, picsum.photos covers, `TAGS`/`SUBJECTS` pools.
- `data/conversations.ts` — `generateConversations(users)` (6 DMs, 4 groups, 4 channels for `users[0]`) + `generateMessages(convs, users)` (5–20 msgs each).
- `data/groups.ts` — `generateInterestGroups(userIds)` → 10 groups across hardcoded `TOPICS`.
- `data/events.ts` — `generateLocalEvents(count)`; hardcoded `EVENT_TITLES` (12) and `VENUES` (8) pools, dates in the next 30 days, lorem-ipsum descriptions.

### API surface — `src/lib/api/`

**Hard rule (from `CLAUDE.md`):** components import from here, never from `@/mocks/*` directly.

- `users.ts` — `getRecommendedUsers()`, `getNearbyUsers()`, `getCurrentUser()`, `getUser(id)`.
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

- **Onboarding gate**: `OnboardingGuard` in `App.tsx` reads `localStorage['io-onboarded']` (key constant `ONBOARDED_KEY` lives in `pages/Onboarding.tsx`). When unset, any non-`/onboarding` route redirects to `/onboarding`. Submitting the form sets the flag; the Navbar logout handler clears it. The onboarding page lives *outside* `Shell` — no sidebar/navbar/chat chrome.
- **API abstraction boundary** (sacred, see `CLAUDE.md` rule #1): components → `@/lib/api/*` → MSW handlers → `@/mocks/data/*`. Never shortcut past the API layer.
- **MSW wiring**: `src/main.tsx` dynamically imports `./mocks/browser` under `import.meta.env.DEV`, then `worker.start({ onUnhandledRequest: 'bypass' })`. The worker file itself is `public/mockServiceWorker.js`. Production builds skip MSW entirely.
- **Routing**: `src/App.tsx` owns the `BrowserRouter` + routes; active-link styling lives in `src/components/layout/Sidebar.tsx` via `NavLink`.
- **Path alias `@/*` → `./src/*`**: set in both `vite.config.ts` and `tsconfig.app.json`. Always prefer it over relative imports across directories.
- **Styling / design tokens**: Tailwind 4 is configured inline via `@tailwindcss/vite` — **there is no `tailwind.config.ts` file**. Theme tokens live in `src/index.css`: oklch colors (light + `.dark` variants), font variables (Raleway/Inter/Geist), typography scale (`text-display` 2.625rem, `text-heading` 2.25rem, `text-body` 1rem — each with matching line-heights), shadow tokens (`shadow-card`, `shadow-card-hover`), and semantic aliases (`border-border-subtle`, `bg-image-placeholder`). `--primary` is aligned to brand `#2ECB71` (`oklch(0.77 0.181 151)`) so `bg-primary` matches the design spec. shadcn CLI config is in `components.json` (style `base-nova`, lucide icons, aliases).
- **Auth stub**: `authStore.initialize()` fetches `/api/auth/me` (the MSW handler returns the mock `CURRENT_USER`). `Shell` triggers `initialize()` on first mount; `chatStore`/`ConversationView` read `currentUser.id` to distinguish own vs. other messages. `authStore.updateProfile(...)` lets the onboarding form and settings dialog mutate the in-memory current user (and writes through to `userStore.cacheUser`). `authStore.logout()` resets auth state; the Navbar logout button also clears the `io-onboarded` localStorage flag and redirects to `/onboarding`. There is no real login.
- **Error surfacing**: a top-level `<ErrorBoundary>` wraps the app and renders a fallback UI for render-time crashes. Every store loader calls `toast.error(...)` on catch in addition to setting its local `error` field. The `<ToastProvider>` (Base UI Toast) is mounted between the boundary and `BrowserRouter`; toasts render in a fixed top-right viewport via `ToastPortal`.
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
- **Phased implementation**: see `IMPLEMENTATION_PLAN.md`. Styling polish is deliberately deferred to Phase 9. Phases 1–8 are complete: Home/ForYou/AroundYou wired; `PostDetail` at `/posts/:id`; `UserProfile` fleshed out at `/users/:id` (avatar + skill chip + interests + goals); `People` remains a stub at `/people`; InspireChat (launcher + panel + conversation list/view + message input + mock-realtime reply injector) is functional in the bottom-right on every page; matchmaking components drive both peer-discovery surfaces; onboarding stub gates first-time visits at `/onboarding`; `SettingsDialog` opens from the sidebar Settings button; Navbar has a Log out button; a top-level `ErrorBoundary` + Base UI `ToastProvider` surface render errors and API failures.
