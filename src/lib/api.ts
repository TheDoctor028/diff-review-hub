import type {
  Workspace,
  WorkspaceStatus,
  CreateWorkspaceRequest,
  UpdateStateRequest,
  AddCommentRequest,
  Comment,
} from "@/types/workspace";
import { config } from "@/lib/config";

const API_BASE = config.apiBaseUrl;

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

interface ApiWorkspace {
  metadata: {
    id: string;
    name: string;
    repo_path: string;
    base: string;
    head: string;
  };
  state: {
    status: WorkspaceStatus;
  };
  comments?: Comment[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiWorkspace(value: unknown): value is ApiWorkspace {
  return (
    isObject(value) &&
    isObject(value.metadata) &&
    typeof value.metadata.id === "string" &&
    typeof value.metadata.name === "string" &&
    typeof value.metadata.repo_path === "string" &&
    typeof value.metadata.base === "string" &&
    typeof value.metadata.head === "string" &&
    isObject(value.state) &&
    typeof value.state.status === "string"
  );
}

function extractWorkspaceArray(raw: unknown): unknown[] {
  if (typeof raw === "string") {
    try {
      return extractWorkspaceArray(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  if (Array.isArray(raw)) return raw;
  if (!isObject(raw)) return [];

  const prioritizedKeys = ["workspaces", "data", "items", "results"];
  for (const key of prioritizedKeys) {
    const candidate = raw[key];
    if (Array.isArray(candidate)) return candidate;
  }

  for (const value of Object.values(raw)) {
    if (Array.isArray(value)) return value;
  }

  return [];
}

function mapApiWorkspace(raw: ApiWorkspace): Workspace {
  return {
    id: raw.metadata.id,
    name: raw.metadata.name,
    repo_path: raw.metadata.repo_path,
    base: raw.metadata.base,
    head: raw.metadata.head,
    status: raw.state.status,
    created_at: "",
    comments: raw.comments ?? [],
  };
}

export const api = {
  listWorkspaces: async () => {
    const raw = await apiFetch<unknown>("/workspaces");
    const list = extractWorkspaceArray(raw).filter(isApiWorkspace);
    return list.map(mapApiWorkspace);
  },

  createWorkspace: (data: CreateWorkspaceRequest) =>
    apiFetch<Workspace>("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getWorkspace: async (id: string) => {
    const raw = await apiFetch<ApiWorkspace>(`/workspaces/${id}`);
    return mapApiWorkspace(raw);
  },

  deleteWorkspace: (id: string) =>
    apiFetch<void>(`/workspaces/${id}`, { method: "DELETE" }),

  getDiff: async (id: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/workspaces/${id}/diff`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    if (!res.ok) throw new Error(`Failed to fetch diff: ${res.status}`);
    return res.text();
  },

  updateState: (id: string, data: UpdateStateRequest) =>
    apiFetch<Workspace>(`/workspaces/${id}/state`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addComment: (id: string, data: AddCommentRequest) =>
    apiFetch<Comment>(`/workspaces/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteComment: (id: string, commentId: string) =>
    apiFetch<void>(`/workspaces/${id}/comments/${commentId}`, {
      method: "DELETE",
    }),
};
