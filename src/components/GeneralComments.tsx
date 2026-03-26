import { useState } from "react";
import type { Comment } from "@/types/workspace";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MessageSquare } from "lucide-react";

interface GeneralCommentsProps {
  comments: Comment[];
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}

export function GeneralComments({ comments, onAdd, onDelete }: GeneralCommentsProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="font-mono text-sm font-medium">General Comments</span>
        <span className="text-xs text-muted-foreground">({comments.length})</span>
      </div>
      <div className="p-4 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start justify-between gap-2 bg-muted/30 rounded-md p-3 border text-sm animate-fade-in">
            <p className="text-foreground whitespace-pre-wrap">{c.text}</p>
            <button onClick={() => onDelete(c.id)} className="text-muted-foreground hover:text-destructive shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a general comment…"
            className="min-h-[60px] text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <Button size="sm" onClick={handleSubmit} disabled={!text.trim()}>
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
