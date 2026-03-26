# Diff City

A web-based code review tool for browsing git diffs, adding inline and general comments, and managing review status across workspaces.

## Features

- **Workspace Management** — Create, list, and delete review workspaces tied to specific git repositories and branch comparisons.
- **Interactive Diff Viewer** — Side-by-side line numbers, syntax-highlighted additions/removals, collapsible file sections.
- **Inline Comments** — Click the comment icon on any diff line to leave contextual feedback.
- **General Comments** — Add workspace-level comments that aren't tied to a specific line.
- **Review Status** — Mark workspaces as `TO_REVIEW`, `ACCEPTED`, `REQUIRE_CHANGES`, or `DECLINED`.
- **Dark Mode** — Full light/dark theme support.
- **Mock Data** — Built-in mock data for local development without a backend.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Dev server & build
- **Tailwind CSS** — Utility-first styling with semantic design tokens
- **shadcn/ui** — Component library (Radix UI primitives)
- **TanStack React Query** — Server state management
- **React Router v6** — Client-side routing
- **Vitest** — Unit testing
- **Playwright** — E2E testing

## Project Structure

```
src/
├── components/         # UI components
│   ├── ui/             # shadcn/ui primitives
│   ├── AppHeader.tsx   # Top navigation bar
│   ├── DiffViewer.tsx  # Diff rendering with inline comments
│   ├── GeneralComments.tsx
│   ├── ReviewActions.tsx
│   └── StatusBadge.tsx
├── hooks/              # Custom React hooks
│   └── use-workspaces.ts  # API query/mutation hooks
├── lib/
│   ├── api.ts          # REST API client
│   ├── diff-parser.ts  # Unified diff parser
│   ├── mock-data.ts    # Mock data for development
│   └── utils.ts
├── pages/
│   ├── Index.tsx        # Redirects to workspace list
│   ├── WorkspaceListPage.tsx
│   └── WorkspaceDetailPage.tsx
└── types/
    └── workspace.ts    # TypeScript interfaces
```

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default. Without a backend, mock data is used automatically.

## API

The frontend expects a REST API at `/api`. See `src/lib/api.ts` for all endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | List all workspaces |
| POST | `/api/workspaces` | Create a workspace |
| GET | `/api/workspaces/:id` | Get workspace details |
| DELETE | `/api/workspaces/:id` | Delete a workspace |
| GET | `/api/workspaces/:id/diff` | Get raw diff text |
| POST | `/api/workspaces/:id/state` | Update review status |
| POST | `/api/workspaces/:id/comments` | Add a comment |
| DELETE | `/api/workspaces/:id/comments/:commentId` | Delete a comment |
