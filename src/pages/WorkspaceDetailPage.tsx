import { useParams } from "react-router-dom";
import { useWorkspace, useDiff, useAddComment, useDeleteComment, useUpdateState } from "@/hooks/use-workspaces";
import { useParsedDiff } from "@/lib/diff-parser";
import { AppHeader } from "@/components/AppHeader";
import { DiffViewer } from "@/components/DiffViewer";
import { GeneralComments } from "@/components/GeneralComments";
import { ReviewActions } from "@/components/ReviewActions";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { WorkspaceStatus } from "@/types/workspace";

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workspace, isLoading: wsLoading } = useWorkspace(id!);
  const { data: rawDiff, isLoading: diffLoading } = useDiff(id!);
  const files = useParsedDiff(rawDiff);
  const addComment = useAddComment(id!);
  const deleteComment = useDeleteComment(id!);
  const updateState = useUpdateState(id!);

  const isLoading = wsLoading || diffLoading;

  const handleAddInlineComment = (file: string, line: number, text: string) => {
    addComment.mutate({ file, line, text }, {
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAddGeneralComment = (text: string) => {
    addComment.mutate({ text }, {
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate(commentId, {
      onError: (err) => toast.error(err.message),
    });
  };

  const handleUpdateState = (status: WorkspaceStatus, reason?: string) => {
    updateState.mutate({ status, reason }, {
      onSuccess: () => toast.success(`Status updated to ${status}`),
      onError: (err) => toast.error(err.message),
    });
  };

  const inlineComments = workspace?.comments?.filter((c) => c.file && c.line !== undefined) ?? [];
  const generalComments = workspace?.comments?.filter((c) => !c.file) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {workspace && (
          <>
            <div className="mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-3 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold font-mono text-foreground">{workspace.name}</h1>
                    <StatusBadge status={workspace.status} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {workspace.base} ← {workspace.head} · {workspace.repo_path}
                  </p>
                </div>
                <ReviewActions
                  currentStatus={workspace.status}
                  onUpdate={handleUpdateState}
                  isPending={updateState.isPending}
                />
              </div>
            </div>

            <div className="space-y-6">
              <DiffViewer
                files={files}
                comments={inlineComments}
                onAddComment={handleAddInlineComment}
                onDeleteComment={handleDeleteComment}
              />
              <GeneralComments
                comments={generalComments}
                onAdd={handleAddGeneralComment}
                onDelete={handleDeleteComment}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
