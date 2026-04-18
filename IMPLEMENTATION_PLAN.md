# InspiringOthers — Implementation Plan

## Guiding Principles

This plan follows a **functionality-first, polish-last** approach:

1. **Phases 1–3:** Foundation, architecture, mock data layer
2. **Phases 4–7:** Core features with bare-minimum HTML/CSS (functional, not pretty)
3. **Phase 8:** Page assembly (still basic styling)
4. **Phase 9:** Visual design pass (make it look good)
5. **Phase 10:** Animations, micro-interactions, delight features

**Rule of thumb:** Do NOT spend time on design polish until all core features work end-to-end. A button that says "Send Message" with default Tailwind styling is fine in Phase 6. Making it look beautiful is a Phase 9 concern.

---

## Phase 1 — Environment Setup & Tooling

**Goal:** Get a working dev environment with the base toolchain installed and verified.

### 1.1 Initialize Project
- Create new Vite project with React + TypeScript template
- Verify dev server runs (`npm run dev`)
- Initialize Git repository
- Create `.gitignore` (node_modules, dist, .env, .DS_Store)

### 1.2 Install Core Dependencies

**Runtime:**
- `react`, `react-dom`
- `react-router-dom` (routing)
- `zustand` (state management)
- `@tanstack/react-query` (optional, for data fetching patterns)

**Styling & UI:**
- `tailwindcss`, `postcss`, `autoprefixer`
- `class-variance-authority`, `clsx`, `tailwind-merge` (shadcn dependencies)
- `lucide-react` (icons)

**Forms:**
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

**Utilities:**
- `date-fns`

**Mock Backend:**
- `msw` (Mock Service Worker) — install as dev dependency
- `@faker-js/faker` — install as dev dependency

**Animations (install now, use in Phase 10):**
- `framer-motion`

### 1.3 Configure Tailwind CSS
- Run Tailwind init with PostCSS config
- Update `tailwind.config.js` content paths to include `./src/**/*.{ts,tsx}`
- Import Tailwind directives in `src/index.css`
- Verify Tailwind works with a test class

### 1.4 Configure shadcn/ui
- Run `npx shadcn@latest init`
- Choose: TypeScript, default style, slate base color, CSS variables
- Configure path aliases in `tsconfig.json` and `vite.config.ts` (`@/*` → `./src/*`)
- Install one component as a smoke test (e.g., Button)

### 1.5 Configure Dev Tooling
- Set up ESLint with React + TypeScript rules
- Add Prettier with `.prettierrc` (single quotes, semicolons, 2-space indent — pick a style and commit)
- Add `lint` and `format` scripts to `package.json`

### 1.6 Brand Token
- Add primary color `#2ECB71` to Tailwind config as `primary` (override shadcn default if desired)

**Exit criteria:** `npm run dev` opens a page with Tailwind classes working and a shadcn Button rendering correctly.

---

## Phase 2 — Project Structure & Conventions

**Goal:** Lay down the folder structure so future code has a home.

### 2.1 Create Directory Structure

```
/src
  /components
    /ui          # shadcn primitives live here
    /layout      # Navbar, Sidebar, Shell
    /chat        # InspireChat components
    /feed        # Post cards, feed list
    /matchmaking # Suggested user cards, filters
  /pages
    Home.tsx
    ForYou.tsx
    AroundYou.tsx
    NotFound.tsx
  /features
    /auth
    /chat
    /matchmaking
    /posts
  /store         # Zustand stores
  /mocks         # MSW handlers + mock data generators
  /lib           # utilities, API abstraction layer
    /api         # the fake API surface
  /types         # global TypeScript types
  App.tsx
  main.tsx
  index.css
```

### 2.2 Define Global TypeScript Types

In `/src/types/index.ts`, define core entities:
- `User` (id, name, avatar, interests, skillLevel, location, goals)
- `Post` (id, authorId, title, body, createdAt, tags)
- `ChatMessage` (id, conversationId, authorId, body, createdAt)
- `Conversation` (id, type: 'dm' | 'group' | 'channel', participantIds, name)
- `InterestGroup` (id, name, topic, skillLevel, memberIds)
- `SkillLevel` enum (beginner, intermediate, advanced)

### 2.3 Set Up Path Aliases
- Confirm `@/components`, `@/lib`, `@/store`, `@/types`, `@/mocks` all resolve

### 2.4 Figma-Derived Component Scaffolding *(completed ahead of schedule)*
The following production-quality components were built from the Figma design during Phase 2 and serve as the visual reference point for all future work:
- `Logo` — brand mark SVG + Raleway wordmark, `size` (`sm`/`lg`) and `color` (`green`/`black`) props
- `Navbar` — top bar with large centered logo
- `Sidebar` — green left rail with `NavLink` items, hamburger button, Settings button, small logo footer
- `Shell` — layout wrapper (Sidebar + Navbar + scrollable `<main>`)
- `PostCard` — featured post: title, 4:3 image, author byline, body excerpt, "Read More"
- `CardPost` — compact post: square image, centered author, title, short excerpt
- `Home` page — "Featured Posts" (3-column `PostCard` grid) + "Recommended Posts" (4 `CardPost`s + "See More →")

These use hardcoded placeholder data until Phase 3 wires up the mock API.

**Exit criteria:** Folder structure exists, types are defined, imports using `@/` work.

---

## Phase 3 — Mock Data & API Abstraction Layer

**Goal:** A single API surface that components will call. Backed by mock data today, swappable for a real backend later.

### 3.1 Generate Mock Data
- In `/src/mocks/data/`, create generators using `@faker-js/faker`:
  - `generateUsers(count)` — produces realistic user records
  - `generatePosts(count, userIds)` — long-form posts tied to authors
  - `generateConversations(userIds)` — DMs, groups, channels
  - `generateMessages(conversations)` — populate each conversation
  - `generateInterestGroups()` — predefined topic list

- Use a fixed seed so data is deterministic between reloads

### 3.2 Set Up MSW Handlers
- Create `/src/mocks/handlers.ts` defining handlers for:
  - `GET /api/users/recommended`
  - `GET /api/users/nearby`
  - `GET /api/posts/feed` — featured posts shown on Home
  - `GET /api/posts/recommended` — compact posts shown in the Recommended row on Home
  - `GET /api/posts/for-you` — personalised posts shown on the For You page
  - `GET /api/posts/:id` — single post detail (needed by the post detail page)
  - `GET /api/conversations`
  - `GET /api/conversations/:id/messages`
  - `POST /api/conversations/:id/messages`
  - `GET /api/groups`
  - `GET /api/auth/me`

- Wire up MSW worker in `main.tsx` (only in development)

### 3.3 Build the API Abstraction Layer

In `/src/lib/api/`, create typed functions:

```ts
// src/lib/api/users.ts
export async function getRecommendedUsers(): Promise<User[]>
export async function getNearbyUsers(): Promise<User[]>

// src/lib/api/posts.ts
export async function getPostsFeed(): Promise<Post[]>
export async function getForYouPosts(): Promise<Post[]>

// src/lib/api/chat.ts
export async function getConversations(): Promise<Conversation[]>
export async function getChatMessages(conversationId: string): Promise<ChatMessage[]>
export async function sendMessage(conversationId: string, body: string): Promise<ChatMessage>
```

**Hard rule:** Components NEVER import from `/mocks` directly. They go through `/lib/api/*` only.

### 3.3b Add API function for post detail

```ts
// src/lib/api/posts.ts
export async function getFeaturedPosts(): Promise<Post[]>
export async function getRecommendedPosts(): Promise<Post[]>
export async function getPost(id: string): Promise<Post>
```

### 3.4 Build Zustand Stores

Create one store per concern:
- `authStore` — current user, login state
- `userStore` — cached user lookups
- `feedStore` — posts, loading state; tracks `featured` and `recommended` lists separately
- `chatStore` — conversations, active conversation, messages
- `matchmakingStore` — recommended users, filters
- `uiStore` — cross-cutting UI state: sidebar collapsed, chat panel open (avoids prop-drilling into Shell)

Each store should expose actions that call the API layer (not mock data directly).

**Exit criteria:** Open browser console, call `getRecommendedUsers()` from a test component, see realistic mock data returned via MSW.

---

## Phase 4 — Routing & App Shell (Bare Bones)

**Goal:** Navigation works between pages. Visuals can be ugly.

### 4.1 Set Up React Router
- Configure `BrowserRouter` in `App.tsx` (wraps `Shell` and all routes)
- Define routes:
  - `/` → Home
  - `/for-you` → ForYou
  - `/around-you` → AroundYou
  - `/posts/:id` → PostDetail *(see 5.4)*
  - `/users/:id` → UserProfile *(see 8.6)*
  - `*` → NotFound

### 4.2 Build the App Shell
- `Shell.tsx` — Sidebar on the left, Navbar + scrollable `<main>` on the right
- `Navbar.tsx` — top bar with the large centered Logo
- Reserve the bottom-right corner of `Shell` for the InspireChat launcher (placeholder `div` for now)

### 4.3 Create Page Stubs
- Each page renders `<h1>Page Name</h1>` and nothing else
- Verify `NavLink` active-state highlighting works on all three nav items

### 4.4 Collapsible Sidebar
- The `Menu` (hamburger) button in the Sidebar header toggles between **expanded** (288px, labels visible) and **collapsed** (72px, icons only) modes
- Collapsed state: nav labels and the footer Logo are hidden; only icons remain
- Collapse state lives in `uiStore` (`sidebarCollapsed: boolean`) so any component can read it
- Persist `sidebarCollapsed` to `localStorage` so the preference survives a page refresh
- Width change uses a CSS `transition-all duration-200` for a smooth snap — Framer Motion animation is added in Phase 10
- `Shell` reads `uiStore.sidebarCollapsed` and applies the correct width class to the `<aside>`

### 4.5 InspireChat Launcher Placeholder
- Fixed `div` in the bottom-right of the viewport with a placeholder label "Chat"
- Wired to `uiStore.chatOpen` even before the panel exists, so the toggle is testable

**Exit criteria:** You can click between Home, For You, and Around You. Sidebar collapses to icons and re-expands. Active nav item is highlighted.

---

## Phase 5 — Feed System (Functional)

**Goal:** Posts render on Home and For You pages from the mock API. No styling polish.

### 5.1 Build Post Components
Two card variants exist (built from Figma in Phase 2); wire them to real data here:
- `PostCard` — featured card: title, 4:3 image, author byline, body excerpt, "Read More" link
- `CardPost` — compact card: square image, centered author, title, short excerpt
- `SectionHeader` — reusable section heading row: title on the left, optional "See More →" link on the right; used by Featured Posts, Recommended Posts, and any future section that follows this pattern

### 5.2 Wire Up the Feed
- Home page calls `feedStore.loadFeatured()` on mount → renders 3-column `PostCard` grid
- Home page calls `feedStore.loadRecommended()` on mount → renders horizontal `CardPost` row
- For You page calls `feedStore.loadForYou()` on mount → renders its own post list
- Show "Loading..." text while fetching; show "No posts yet" empty state

### 5.3 No Infinite Scroll
- Per the product principles, do NOT implement infinite scroll
- Show a finite list (20 posts) with a "Load More" button at the bottom if the list exceeds that count

### 5.4 Post Detail Page
- Add route `/posts/:id` → `PostDetail.tsx`
- Displays full article: title, cover image (full width), author byline, full body text, tag list
- Fetches via `feedStore.loadPost(id)` which calls `getPost(id)` from the API layer
- Back-navigation returns to wherever the user came from (`useNavigate(-1)` or a back link)

### 5.5 Wire "Read More" and Card Clicks
- Wrap each `PostCard` title and image in a `<Link to="/posts/:id">` — the whole card area navigates, not just the inline button
- `CardPost` title and image link the same way
- The inline "Read More" text in `PostCard` body becomes a styled `<Link>` rather than a `<button>`
- Author byline ("By [name]") on both card types links to `/users/:authorId` *(profile stub added in 8.6)*

### 5.6 Wire "See More" Navigation
- "See More →" on the Recommended Posts row links to `/for-you`
- `SectionHeader` accepts an optional `seeMoreHref` prop so every section declares its own destination
- Future sections (user recommendations on For You, nearby peers on Around You) use the same pattern

### 5.7 Post Tags
- `PostCard` displays tags as small text labels below the body excerpt
- `PostDetail` shows the full tag list prominently
- Tags are display-only for now; filtering by tag is a Phase 7 concern

**Exit criteria:** Real (mock) posts appear on Home and For You. Clicking a card navigates to the post detail page. "Read More", card links, and "See More" all route correctly.

---

## Phase 6 — InspireChat (Functional)

**Goal:** Chat panel opens, conversations list, messages send. Looks like a basic textarea and list.

### 6.1 Build Chat UI Components
- `ChatLauncher` — floating button bottom-right that toggles the panel
- `ChatPanel` — the panel itself, fixed position bottom-right
- `ConversationList` — list of all conversations (DMs, groups, channels)
- `ConversationView` — shows messages for the selected conversation
- `MessageInput` — textarea + send button

### 6.2 Wire Up Chat State
- `chatStore` tracks: `isOpen`, `activeConversationId`, `conversations`, `messagesByConversation`
- Selecting a conversation loads its messages via `getChatMessages()`
- Sending a message calls `sendMessage()` and optimistically appends to local state

### 6.3 Mock "Real-Time" Behavior
- For prototype purposes, add a `setInterval` that occasionally injects a fake reply from another user (every 30–60s, randomly)
- Keep this logic isolated in `/features/chat/mockRealtime.ts` so it can be deleted later

### 6.4 Conversation Types
- Render DMs, group chats, and channels in the list with a small text label or icon to distinguish them
- All three use the same underlying `ConversationView` component

**Exit criteria:** Click chat launcher → panel opens → pick a conversation → read messages → send a message → see it appear. All ugly, all functional.

---

## Phase 7 — Matchmaking & Around You (Functional)

**Goal:** Suggested users appear with skill/interest filters working.

### 7.1 Build Matchmaking Components
- `UserCard` — name, avatar placeholder, skill level, interests, location
- `UserList` — renders multiple cards
- `MatchmakingFilters` — checkboxes/selects for skill level, interests, location toggle

### 7.2 Wire Up the For You Page
The For You page follows the same section-header pattern as Home:
- Section: "People you might connect with" — `SectionHeader` with "See More →" + horizontal `UserCard` row from `getRecommendedUsers()`
- Section: "Posts for you" — `SectionHeader` + `PostCard` grid from `getForYouPosts()` (wired in Phase 5)

### 7.3 Wire Up the Around You Page
- Section: "Nearby peers" — `SectionHeader` + `UserCard` row from `getNearbyUsers()`
- Section: "Local events" — `SectionHeader` + plain event list (title, date, location text — no map view yet)

### 7.4 Filters
- `MatchmakingFilters` component: skill level checkboxes, interest multi-select, "Near me" toggle
- Filter state lives in `matchmakingStore`
- Changing filters re-fetches or filters client-side from the cached list — either is fine for a prototype
- Filters appear above the relevant section on each page, not in the sidebar

### 7.5 "See More" for User Recommendations
- "See More →" on the "People you might connect with" row links to a full `/people` listing page (stub is acceptable — just a `<h1>` placeholder for now)
- This follows the same `SectionHeader` + `seeMoreHref` pattern from Phase 5

**Exit criteria:** Both pages show user cards. Filters change what's displayed. Still ugly.

---

## Phase 8 — Page Assembly & Auth Stub

**Goal:** All pages feel like a coherent app even though they're plain.

### 8.1 Auth Stub
- No real login flow needed for the prototype
- `authStore` initializes with a hardcoded "current user" from mock data
- Add a fake "Logout" button in the navbar that resets state (optional)

### 8.2 Onboarding Stub
- One-page form: select interests (multi-select), pick skill level (radio), enter location (optional text input)
- Submit writes to `userStore` and routes to Home
- Use `react-hook-form` + `zod` for validation
- Show this only on first visit (track in localStorage)

### 8.3 Empty States & Loading States
- Every list should have an empty state and a loading state
- Keep them as plain text for now ("Loading...", "Nothing here yet.")

### 8.4 Error Boundaries
- Wrap the app in a basic React error boundary
- Add try/catch to API calls in stores; surface errors via a `toast` from shadcn

### 8.5 Settings Dialog
- Settings button in the Sidebar footer opens a shadcn `Dialog`
- Contains placeholder sections: Account (display name, avatar), Interests, Skill Level
- Reads current user from `authStore`; writes changes back to `userStore`
- No real persistence — state resets on refresh (real persistence is a future-phase concern)

### 8.6 User Profile Stub
- Add route `/users/:id` → `UserProfile.tsx`
- Displays the user's name, avatar placeholder, skill level, interests, and goals from mock data
- Author bylines on `PostCard` and `CardPost` link here (wired in Phase 5.5)
- No edit functionality yet — read-only view of mock data

**Exit criteria:** App is end-to-end usable. A new visitor lands → onboards → sees a feed → clicks a post → reads the full article → finds peers → opens chat → sends a message → opens Settings. Everything works. Nothing looks designed yet.

---

## Phase 9 — Visual Design Pass

**Goal:** Now make it look good. This is where you actually use the Figma designs.

### 9.1 Define Design Tokens
- Colors: primary green `#2ECB71`, neutral grays, accent colors
- Typography scale: define heading and body sizes in Tailwind config
- Spacing: stick to the 4/8/16/24 system from the Figma rules
- Border radius, shadows, focus rings

### 9.2 Build the shadcn Component Library
- Style each shadcn primitive (Button, Card, Input, Dialog, etc.) to match the brand
- Document variants in a `/components/ui/README.md` if helpful

### 9.3 Layout Polish
- Shell layout already matches Figma (Sidebar + Navbar + scrollable main) — confirm spacing and proportions are exact
- Sidebar collapsed state renders icon-only rail cleanly at 72px width with correct icon alignment
- Navbar: confirm centered logo alignment; add a user avatar/profile menu in the top-right corner
- Responsive breakpoints — desktop first (matching Figma at 1440px), then graceful degradation to tablet

### 9.4 Component Polish (in priority order)
1. **PostCard** — most-seen component; add hover lift (`shadow-md`, subtle `-translate-y-0.5`), rounded corners, image aspect-ratio polish
2. **CardPost** — same hover treatment; ensure square image crops cleanly
3. **SectionHeader** — "See More →" link gets an underline animation on hover; arrow shifts right 2px
4. **UserCard** — avatar, skill badge, interest chips
5. **ChatPanel** — visible when open, but secondary
6. **MatchmakingFilters and forms** — last among the main components

### 9.5 Page-Level Polish
- Home: section spacing matches Figma (55px top padding, 25px gap between sections, 45px side padding)
- For You, Around You: adopt the same section-header + card-row layout language
- PostDetail: full-width cover image, generous body typography (line-height, max-width)
- Empty states get styled text or simple SVG illustrations instead of "Nothing here yet."
- Loading states use shadcn Skeletons shaped like the real cards (PostCard skeleton, CardPost skeleton)

### 9.6 Sidebar Collapse Transition
- Width animates with `transition-all duration-200 ease-in-out`
- Nav labels fade out (`opacity-0 w-0 overflow-hidden`) as sidebar collapses; fade back in on expand
- Footer logo hides when collapsed (`opacity-0`), reappears on expand
- Collapsed sidebar shows a tooltip on icon hover (shadcn `Tooltip`) so labels are still discoverable

**Exit criteria:** App looks like a real product. Matches the Figma intent without being a pixel-perfect export.

---

## Phase 10 — Animations & Delight

**Goal:** Add the small touches that make the app feel alive. Cut anything that adds engagement-farming patterns — InspiringOthers is explicitly anti-dopamine.

### 10.1 Page Transitions
- Use Framer Motion for subtle fade/slide transitions between routes
- Keep them fast (150–250ms) — no flashy hero animations

### 10.2 Component Micro-Interactions
- Button hover/press states (subtle scale or color shift)
- `PostCard` and `CardPost`: hover lifts with `whileHover={{ y: -2, boxShadow }}` via Framer Motion
- "See More →" arrow: `whileHover={{ x: 3 }}` nudge on the arrow icon
- Chat panel slide-in/slide-out
- Message send animation (gentle fade-in)

### 10.6 Sidebar Collapse Animation
- Replace the CSS `transition-all` width change with Framer Motion `motion.aside` using `animate={{ width }}` (expanded: 288px, collapsed: 72px)
- Nav labels use `AnimatePresence` + `motion.span` with `initial={{ opacity: 0, width: 0 }}` / `animate={{ opacity: 1, width: 'auto' }}` for a clean slide-and-fade
- Footer logo uses `AnimatePresence` to mount/unmount with a fade

### 10.3 Loading Polish
- Replace generic Skeletons with content-shape Skeletons
- Add a subtle shimmer (Tailwind `animate-pulse` is fine)

### 10.4 What NOT to Add
- Confetti, popups celebrating "streaks," "you're on fire!" notifications
- Read-receipt anxiety patterns (typing indicators are fine; "X is typing for 14 seconds" is not)
- Notification badges that pulse/grow to demand attention
- Auto-playing video, infinite scroll, "you might miss out" prompts

### 10.5 Accessibility Pass
- Keyboard navigation works for chat, filters, post cards
- Focus rings visible
- Color contrast meets WCAG AA
- Screen reader labels on icon-only buttons

**Exit criteria:** App feels polished, intentional, and aligned with the anti-dopamine product philosophy.

---

## Future Phases (Out of Scope for Prototype)

Reference only — not part of this build:

- Backend integration (Supabase recommended in the dev plan)
- Real authentication
- Real-time chat via WebSockets
- Skill verification system
- AI-assisted growth recommendations
- Project collaboration tools
- Portfolio integration
- Event hosting infrastructure
- Mentorship layers
- Mobile apps
- Premium subscription billing
- Ads system
- Analytics dashboards

---

## Phase Completion Checklist

Before moving from one phase to the next, confirm:

- [ ] All exit criteria for the current phase are met
- [ ] No code from later phases has leaked in (no animations in Phase 6, no design polish in Phase 7)
- [ ] Mock data still works end-to-end
- [ ] No direct mock-data imports in components — only via `/lib/api`
- [ ] TypeScript compiles with no errors
- [ ] Linter passes

---

## Key Architectural Reminders

- **Component-driven, not page-driven.** Every reusable piece becomes a component before pages assemble them.
- **One API surface.** Components call `/lib/api/*`, never `/mocks/*` directly. This is what makes swapping in a real backend trivial later.
- **Functionality before form.** Phases 1–8 produce a working but plain app. Phases 9–10 make it beautiful. Resist the urge to skip ahead.
- **No engagement-farming patterns, ever.** The product thesis is anti-dopamine. Any UX pattern that conflicts with that gets cut, regardless of how "standard" it is on other platforms.