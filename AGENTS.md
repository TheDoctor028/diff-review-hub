# Agents Guide — Diff City

This document helps AI agents and contributors understand the codebase and make effective changes.

## Overview

Diff City is a React SPA for code review. Users create **workspaces** that reference a git repo and two refs (base/head). The app fetches a unified diff, parses it, and renders an interactive viewer where reviewers can comment on individual lines or leave general feedback. Each workspace has a review status lifecycle.

## Architecture

### Frontend Only

This is a client-side React app built with Vite. There is no backend in this repo — the app calls a REST API at `/api` (see `src/lib/api.ts`). For local development without a backend, mock data is served automatically (see `src/lib/mock-data.ts` and `shouldUseMock()`).

### Key Patterns

- **React Query** for all server state — queries and mutations live in `src/hooks/use-workspaces.ts`.
- **Unified diff parsing** is handled by `src/lib/diff-parser.ts` which converts raw diff text into structured `DiffFile[]` data.
- **shadcn/ui** components in `src/components/ui/` — these are primitives, don't modify them unless updating the design system.
- **Tailwind semantic tokens** — colors are defined as CSS variables in `src/index.css` and mapped in `tailwind.config.ts`. Always use tokens (e.g., `bg-primary`, `text-muted-foreground`), never raw color values.

### Data Flow

```
User action → React Query mutation → api.ts → REST API → cache invalidation → UI update
```

For reads:
```
Component mounts → useQuery hook → api.ts (or mock) → parsed data → render
```

### Types

All shared types are in `src/types/workspace.ts`:
- `Workspace` — core entity with id, name, repo info, status, comments
- `WorkspaceStatus` — `"TO_REVIEW" | "ACCEPTED" | "REQUIRE_CHANGES" | "DECLINED"`
- `Comment` — inline (has `file` + `line`) or general (no `file`)
- Request types: `CreateWorkspaceRequest`, `UpdateStateRequest`, `AddCommentRequest`

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | REST client — all backend calls |
| `src/lib/diff-parser.ts` | Parses unified diff format into structured data |
| `src/hooks/use-workspaces.ts` | React Query hooks for workspaces, diffs, comments |
| `src/components/DiffViewer.tsx` | Main diff rendering with inline comment support |
| `src/components/GeneralComments.tsx` | Workspace-level comments section |
| `src/components/ReviewActions.tsx` | Status update buttons (accept, decline, etc.) |
| `src/pages/WorkspaceDetailPage.tsx` | Full workspace view — diff + comments + actions |
| `src/pages/WorkspaceListPage.tsx` | Workspace listing and creation |
| `src/lib/mock-data.ts` | Mock data for development without a backend |

## Guidelines

1. **Don't modify `src/components/ui/`** unless changing the design system globally.
2. **Use semantic Tailwind tokens** — never hardcode colors like `text-white` or `bg-blue-500`.
3. **All API calls go through `src/lib/api.ts`** — don't use `fetch` directly in components.
4. **Comments are polymorphic** — inline comments have `file` and `line` fields; general comments don't. Filter accordingly.
5. **Mock mode** is automatic when the API is unavailable — check `shouldUseMock()` in `src/lib/mock-data.ts`.
6. **Testing** — unit tests with Vitest (`src/test/`), E2E with Playwright.

## Common Tasks

### Add a new API endpoint
1. Add the function to `src/lib/api.ts`
2. Create a React Query hook in `src/hooks/use-workspaces.ts`
3. Add any new types to `src/types/workspace.ts`

### Add a new page
1. Create the component in `src/pages/`
2. Add the route in `src/App.tsx`

### Modify diff rendering
- Parser logic: `src/lib/diff-parser.ts`
- Visual rendering: `src/components/DiffViewer.tsx`
- Diff-specific CSS tokens (backgrounds, line numbers): `src/index.css` under `--diff-*` variables
