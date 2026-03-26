import { useState } from "react";
import { useCreateWorkspace } from "@/hooks/use-workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", repo_path: "", base: "main", head: "" });
  const create = useCreateWorkspace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(form, {
      onSuccess: () => {
        toast.success("Workspace created");
        setOpen(false);
        setForm({ name: "", repo_path: "", base: "main", head: "" });
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono">Create Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input id="ws-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Feature Review" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-repo">Repository Path</Label>
            <Input id="ws-repo" value={form.repo_path} onChange={(e) => update("repo_path", e.target.value)} placeholder="/path/to/repo" className="font-mono text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ws-base">Base Branch</Label>
              <Input id="ws-base" value={form.base} onChange={(e) => update("base", e.target.value)} placeholder="main" className="font-mono text-sm" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ws-head">Head Branch</Label>
              <Input id="ws-head" value={form.head} onChange={(e) => update("head", e.target.value)} placeholder="feature-branch" className="font-mono text-sm" required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create Workspace"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
