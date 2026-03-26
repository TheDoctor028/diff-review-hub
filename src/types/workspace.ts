export interface Workspace {
  id: string;
  name: string;
  repo_path: string;
  base: string;
  head: string;
  status: WorkspaceStatus;
  created_at: string;
  comments?: Comment[];
}

export type WorkspaceStatus = "TO_REVIEW" | "ACCEPTED" | "REQUIRE_CHANGES" | "DECLINED";

export interface Comment {
  id: string;
  file?: string;
  line?: number;
  text: string;
  created_at: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  repo_path: string;
  base: string;
  head: string;
}

export interface UpdateStateRequest {
  status: WorkspaceStatus;
  reason?: string;
}

export interface AddCommentRequest {
  file?: string;
  line?: number;
  text: string;
}
