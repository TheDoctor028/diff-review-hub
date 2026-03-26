import { useWorkspaces, useDeleteWorkspace } from "@/hooks/use-workspaces";
import { AppHeader } from "@/components/AppHeader";
import { CreateWorkspaceDialog } from "@/components/CreateWorkspaceDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import { Trash2, GitBranch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WorkspaceListPage() {
  const { data: workspaces, isLoading, error } = useWorkspaces();
  const deleteWs = useDeleteWorkspace();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteWs.mutate(id, {
      onSuccess: () => toast.success("Workspace deleted"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Workspaces</h1>
            <p className="text-sm text-muted-foreground mt-1">Review code diffs and collaborate</p>
          </div>
          <CreateWorkspaceDialog />
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-destructive font-mono text-sm">Failed to load workspaces</p>
            <p className="text-muted-foreground text-xs mt-1">{(error as Error).message}</p>
          </div>
        )}

        {workspaces && workspaces.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-mono">No workspaces yet</p>
            <p className="text-sm mt-1">Create one to start reviewing diffs.</p>
          </div>
        )}

        <div className="grid gap-3">
          {workspaces?.map((ws) => (
            <button
              key={ws.id}
              onClick={() => navigate(`/workspace/${ws.id}`)}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left animate-fade-in group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-semibold text-foreground truncate">{ws.name}</span>
                  <StatusBadge status={ws.status} />
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {ws.base} ← {ws.head}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(e, ws.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
