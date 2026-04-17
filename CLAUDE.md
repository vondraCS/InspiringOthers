# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**InspiringOthers** is a peer-to-peer talent growth platform. Instead of comparing users to top performers (the LinkedIn/Instagram failure mode), it matches them with others at a similar stage — same skill level, similar interests, comparable goals — to encourage real collaboration.

This repository is a **frontend-only React + TypeScript prototype**. There is no backend; all data comes from a mocked API layer.

**Brand:** Primary color `#2ECB71`. Motto: "Peer-to-Peer Talent Growth."

---

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Routing:** React Router
- **State:** Zustand (one store per concern)
- **Forms:** React Hook Form + Zod
- **Mock backend:** MSW (Mock Service Worker) + Faker
- **Animations:** Framer Motion (used in late phases only)
- **Icons:** Lucide React
- **Dates:** date-fns

---

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

---

## Project Structure

```
/src
  /components
    /ui          # shadcn primitives — do not hand-edit; regenerate via shadcn CLI
    /layout      # Navbar, Sidebar, Shell
    /chat        # InspireChat components
    /feed        # Post cards, feed list
    /matchmaking # User cards, filters
  /pages         # Route-level components only (Home, ForYou, AroundYou)
  /features      # Feature-scoped logic (auth, chat, matchmaking, posts)
  /store         # Zustand stores
  /mocks         # MSW handlers + Faker generators
  /lib
    /api         # The fake API surface — components import from here
  /types         # Global TypeScript types
```

Path alias: `@/*` resolves to `./src/*`. Always use it instead of relative imports.

---

## Critical Architectural Rules

### 1. The API abstraction is sacred
Components MUST import data-access functions from `@/lib/api/*`. They MUST NOT import directly from `@/mocks/*`. This single rule is what makes the prototype swappable for a real backend later — do not break it.

```ts
// CORRECT
import { getRecommendedUsers } from '@/lib/api/users';

// WRONG — never do this
import { mockUsers } from '@/mocks/data/users';
```

### 2. State lives in Zustand, not in components
If a piece of state is used by more than one component, or persists across navigation, it belongs in a Zustand store. Local UI state (open/closed, hover, input focus) stays in `useState`.

Stores: `authStore`, `userStore`, `feedStore`, `chatStore`, `matchmakingStore`.

### 3. Components are dumb; stores call the API
Components render and dispatch. Stores hold state and call the API layer. Don't put `fetch` or API calls inside component bodies.

### 4. Types are global and shared
Core entity types (`User`, `Post`, `ChatMessage`, `Conversation`, `InterestGroup`, `SkillLevel`) live in `@/types`. Reuse them everywhere — don't redefine them per file.

### 5. shadcn/ui components are the building blocks
For any common primitive (Button, Input, Card, Dialog, Dropdown), use the shadcn version. Don't hand-roll new buttons or inputs unless there's a reason no shadcn equivalent fits.

---

## Product Principles That Affect Code

These aren't preferences — they're product requirements that constrain implementation choices:

### Anti-dopamine design
Do not implement, even if asked offhand:
- Infinite scroll
- Notification badges that pulse, grow, or otherwise demand attention
- "Streak" counters or "you're on fire" prompts
- Auto-playing video
- Engagement-bait popups ("you have 3 unread messages!" with anxiety framing)
- Read-receipt patterns designed to create social pressure

If a request would introduce one of these, flag it and propose a non-addictive alternative.

### Long-form content only
Posts are article-style. There are no tweets, stories, or short-form clips on this platform. Post components should accommodate substantial body text (titles, paragraphs, structured content) — not 140-character snippets.

### Peer-level matching, not top-performer surfacing
Matchmaking and "For You" recommendations should reflect users at a similar skill level, not the highest-engagement users. Mock data and any ranking logic should respect this.

### Output over consumption
UX should encourage users to create, collaborate, and publish — not passively scroll. When designing flows, prefer surfaces that lead to action (write a post, message a peer, attend an event) over surfaces that lead to more scrolling.

---

## Development Strategy: Functionality First, Polish Last

The implementation plan (see `IMPLEMENTATION_PLAN.md`) is phased deliberately:

- **Phases 1–3:** Setup, structure, mock API
- **Phases 4–8:** Core features with bare-minimum styling — basic HTML elements, default Tailwind utilities, shadcn defaults
- **Phase 9:** Visual design pass
- **Phase 10:** Animations and micro-interactions

**Do not skip ahead.** If we're in Phase 5 (Feed) and the request is to "make the post cards look amazing," push back: that work belongs in Phase 9. A plain `<Card>` with a title and body text is the correct Phase 5 deliverable.

The reasoning: it's far cheaper to redesign a working app than to debug a beautiful one. Get all features working end-to-end first.

---

## Mock Data Conventions

- Generated via `@faker-js/faker` with a **fixed seed** so data is deterministic across reloads
- Generators live in `/src/mocks/data/`
- MSW handlers live in `/src/mocks/handlers.ts`
- The MSW worker is started only in development (in `main.tsx`)
- When adding a new entity, add: (1) a type, (2) a generator, (3) an MSW handler, (4) an API function in `/lib/api/`

---

## Working with Figma Designs

The Figma designs are reference, not source-of-truth code:

- **Do** break designs into reusable React components matching the spacing system (4 / 8 / 16 / 24)
- **Do** extract design tokens (colors, typography, spacing) into Tailwind config
- **Don't** export entire pages from Figma as code
- **Don't** rely on design-to-code tools for full UI generation

The goal is a component system that matches Figma's intent — not a pixel-perfect port.

---

## Code Style

- TypeScript strict mode is on; no `any` without justification in a comment
- Functional components only; no class components
- Hooks at the top of the component, then handlers, then JSX
- Prefer named exports; default exports only for route-level page components
- Two-space indentation, single quotes, semicolons (Prettier-enforced)

---

## When Adding a New Feature

1. Add or update the relevant type in `@/types`
2. Add mock data generator if needed (`@/mocks/data/`)
3. Add MSW handler (`@/mocks/handlers.ts`)
4. Add API function (`@/lib/api/`)
5. Add or extend the relevant Zustand store
6. Build the component(s) — start ugly, get it working
7. Wire components into the relevant page
8. Polish styling only after the feature works end-to-end

---

## What NOT to Build (Out of Scope)

These are noted in the product roadmap but **not part of the current prototype**. Don't introduce them speculatively:

- Real authentication (use a hardcoded "current user" stub)
- Real-time WebSocket chat (use `setInterval`-based mock for the prototype)
- Backend persistence
- Skill verification
- AI growth recommendations
- Portfolio integration
- Event hosting infrastructure
- Premium subscription billing
- Ads system
- Mobile apps

If a request touches any of these, confirm scope before building.

---

## Quick Reference: The Three Pages

| Page | Route | Primary Content |
|------|-------|-----------------|
| Home | `/` | Recommended long-form posts |
| For You | `/for-you` | Suggested people, groups, communities, posts |
| Around You | `/around-you` | Nearby peers + local events |

InspireChat (the persistent chat panel) appears on every page in the bottom-right corner.