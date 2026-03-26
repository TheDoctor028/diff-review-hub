import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateWorkspaceRequest, UpdateStateRequest, AddCommentRequest } from "@/types/workspace";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: api.listWorkspaces,
  });
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => api.getWorkspace(id),
    enabled: !!id,
  });
}

export function useDiff(id: string) {
  return useQuery({
    queryKey: ["diff", id],
    queryFn: () => api.getDiff(id),
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => api.createWorkspace(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspaces"] }),
  });
}

export function useDeleteWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteWorkspace(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspaces"] }),
  });
}

export function useUpdateState(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStateRequest) => api.updateState(workspaceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      qc.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useAddComment(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddCommentRequest) => api.addComment(workspaceId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspace", workspaceId] }),
  });
}

export function useDeleteComment(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.deleteComment(workspaceId, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspace", workspaceId] }),
  });
}
