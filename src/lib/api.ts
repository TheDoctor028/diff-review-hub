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
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }
  return res.text() as unknown as T;
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
    const raw = await apiFetch<ApiWorkspace[] | Record<string, unknown>>("/workspaces");
    const list = Array.isArray(raw) ? raw : (Object.values(raw).find(Array.isArray) as ApiWorkspace[] ?? []);
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
    const res = await fetch(`${API_BASE}/workspaces/${id}/diff`);
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
