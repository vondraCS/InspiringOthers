# InspiringOthers — Frontend Prototype Stack (AI Context File)

## Purpose
This document defines the recommended technical stack, architecture, and dependencies for building the InspiringOthers frontend prototype using React + TypeScript, Figma, and AI-assisted development (Claude Code).

This file is intended to be used by:
- AI coding agents (Claude Code, Copilot, etc.)
- Developers contributing to the project

---

# 1. Core Principles

- Frontend-only prototype (no required backend)
- Fast iteration > production optimization
- Clean architecture that can scale later
- Component-driven development
- Figma → Component system → UI implementation (NOT direct conversion)

---

# 2. Core Stack

## Framework
- React (with TypeScript)
- Vite (build tool)

## Styling & UI
- Tailwind CSS
- shadcn/ui
- Radix UI (underlying primitives)

## Routing
- React Router

## State Management
- Zustand (global state)
- Optional: TanStack Query (data fetching + caching patterns)

---

# 3. Key Libraries

## UI / UX
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide (icons)
- Framer Motion (animations)

## Forms & Validation
- React Hook Form
- Zod

## Utilities
- date-fns

---

# 4. Mock Backend & Data Layer

Since this is a frontend-only prototype, simulate backend behavior.

## Tools
- Mock Service Worker (MSW)
- Faker (generate realistic mock data)

## Responsibilities
Simulate:
- Users
- Posts
- Matchmaking results
- Chat messages
- Groups / communities

---

# 5. State Architecture

Use Zustand to manage:

## Global Stores
- authStore
- userStore
- feedStore
- chatStore
- matchmakingStore

## Example API abstraction
All data access should go through a fake API layer:

```ts
getRecommendedUsers()
getPostsFeed()
getChatMessages()
sendMessage()
````

IMPORTANT:

* Do NOT directly access mock data inside components
* Always go through an abstraction layer
* This allows easy replacement with real backend later

---

# 6. Project Structure

```
/src
  /components
    /ui          # buttons, inputs, primitives
    /layout      # navbar, sidebar
    /chat        # chat UI components
    /feed        # posts, cards
  /pages
    Home.tsx
    ForYou.tsx
    AroundYou.tsx
  /features
    /auth
    /chat
    /matchmaking
    /posts
  /store         # Zustand stores
  /mocks         # MSW handlers + mock data
  /lib           # utilities/helpers
  /types         # global TypeScript types
```

---

# 7. Core Features to Implement

Based on product requirements:

## 7.1 Feed System

* Long-form post cards
* Structured content (title, body, metadata)
* No infinite scroll addiction patterns

## 7.2 Matchmaking System (Frontend Simulation)

* Suggested users list
* Filter by:

  * skill level
  * interests
  * location (optional)

## 7.3 InspireChat (Core Feature)

* Persistent chat UI (bottom-right)
* Includes:

  * Direct messages
  * Group chats
  * Channels

Implementation (prototype):

* Zustand-based chat state
* Mock real-time updates

## 7.4 Pages

* Home
* For You
* Around You

---

# 8. Figma Integration Rules

Designs MUST follow:

* Use Auto Layout (maps to flexbox/grid)
* Use consistent spacing system (4, 8, 16, 24...)
* Create reusable components (Button, Card, etc.)
* Define text styles and color tokens

DO NOT:

* Export entire pages as code
* Rely on design-to-code tools for full UI

DO:

* Break screens into reusable React components

---

# 9. AI Development Workflow

## Tools

* Claude Code
* GitHub Copilot

## Usage Strategy

AI should:

* Generate components
* Refactor code
* Create mock data
* Suggest improvements

AI should NOT:

* Generate entire app blindly
* Replace architecture decisions

---

# 10. MCP (Model Context Protocol) Tools

Recommended MCP integrations:

* Filesystem MCP → edit project files
* Git MCP → version control
* Browser MCP → test UI behavior
* Figma MCP (if available) → extract design data

---

# 11. Dev Tooling

* TypeScript
* ESLint
* Prettier

---

# 12. Optional Upgrade Path (Future)

If backend is introduced:

Recommended:

* Supabase

Provides:

* Authentication
* Database
* Realtime (chat)

---

# 13. Development Strategy

## Step-by-step

1. Initialize Vite + React + TypeScript project
2. Install Tailwind CSS
3. Install and configure shadcn/ui
4. Set up project structure
5. Create base UI components
6. Implement mock API layer (MSW)
7. Build Zustand stores
8. Develop core features:

   * Feed
   * Matchmaking
   * Chat
9. Assemble pages
10. Refine UI to match Figma

---

# 14. Key Architectural Rule

This project is NOT:
"Convert Figma → Code automatically"

This project IS:
"Build a reusable component system that matches Figma"

---

# 15. Summary

This stack prioritizes:

* Speed
* Flexibility
* Clean architecture
* Future scalability

It is optimized for:

* AI-assisted development
* Frontend-only prototyping
* Rapid iteration

---