import { useState } from "react";
import type { DiffFile, DiffLine } from "@/lib/diff-parser";
import type { Comment } from "@/types/workspace";
import { cn } from "@/lib/utils";
import { MessageSquarePlus, Trash2, ChevronDown, ChevronRight, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DiffViewerProps {
  files: DiffFile[];
  comments: Comment[];
  onAddComment: (file: string, line: number, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function DiffViewer({ files, comments, onAddComment, onDeleteComment }: DiffViewerProps) {
  const [collapsedFiles, setCollapsedFiles] = useState<Set<string>>(new Set());

  const toggleFile = (filename: string) => {
    setCollapsedFiles((prev) => {
      const next = new Set(prev);
      next.has(filename) ? next.delete(filename) : next.add(filename);
      return next;
    });
  };

  if (files.length === 0) {
    return <p className="text-muted-foreground text-center py-12">No diff content available.</p>;
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div key={file.filename} className="border rounded-lg overflow-hidden bg-card animate-fade-in">
          <button
            onClick={() => toggleFile(file.filename)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-left bg-muted/50 hover:bg-muted transition-colors border-b"
          >
            {collapsedFiles.has(file.filename) ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <FileCode className="h-4 w-4 text-primary shrink-0" />
            <span className="font-mono text-sm truncate">{file.filename}</span>
          </button>
          {!collapsedFiles.has(file.filename) && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {file.lines.map((line, i) => (
                    <DiffLineRow
                      key={i}
                      line={line}
                      filename={file.filename}
                      comments={comments.filter(
                        (c) => c.file === file.filename && c.line === (line.newLine ?? line.oldLine)
                      )}
                      onAddComment={onAddComment}
                      onDeleteComment={onDeleteComment}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface DiffLineRowProps {
  line: DiffLine;
  filename: string;
  comments: Comment[];
  onAddComment: (file: string, line: number, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

function DiffLineRow({ line, filename, comments, onAddComment, onDeleteComment }: DiffLineRowProps) {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");

  const lineNum = line.newLine ?? line.oldLine;
  const isCommentable = line.type === "add" || line.type === "remove" || line.type === "context";

  const handleSubmit = () => {
    if (!text.trim() || lineNum === undefined) return;
    onAddComment(filename, lineNum, text.trim());
    setText("");
    setShowInput(false);
  };

  const rowClass = cn(
    "group",
    line.type === "add" && "bg-diff-add-bg",
    line.type === "remove" && "bg-diff-remove-bg",
    line.type === "hunk" && "bg-diff-hunk-bg",
  );

  const prefix = line.type === "add" ? "+" : line.type === "remove" ? "-" : line.type === "hunk" ? "" : " ";

  return (
    <>
      <tr className={rowClass}>
        <td className="select-none w-8 text-center py-0 align-top">
          {isCommentable && (
            <button
              onClick={() => setShowInput(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary/80 py-0.5"
              aria-label="Add comment"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
            </button>
          )}
        </td>
        <td className="select-none text-right px-2 py-0 w-12 text-diff-line-number text-xs align-top">
          {line.oldLine ?? ""}
        </td>
        <td className="select-none text-right px-2 py-0 w-12 text-diff-line-number text-xs align-top border-r">
          {line.newLine ?? ""}
        </td>
        <td className="px-4 py-0 whitespace-pre">
          <span className={cn(
            line.type === "add" && "text-diff-add-fg",
            line.type === "remove" && "text-diff-remove-fg",
            line.type === "hunk" && "text-diff-hunk-fg text-xs",
            line.type === "header" && "text-muted-foreground text-xs",
          )}>
            {line.type === "hunk" || line.type === "header" ? line.content : `${prefix}${line.content}`}
          </span>
        </td>
      </tr>
      {(showInput || comments.length > 0) && (
        <tr>
          <td colSpan={4} className="px-4 py-2 bg-muted/30 border-y">
            <div className="space-y-2 max-w-2xl">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-2 bg-card rounded-md p-2.5 border text-sm animate-fade-in">
                  <p className="text-foreground whitespace-pre-wrap">{c.text}</p>
                  <button onClick={() => onDeleteComment(c.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {showInput && (
                <div className="space-y-2 animate-fade-in">
                  <Textarea
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment…"
                    className="min-h-[60px] text-sm font-sans"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
                      if (e.key === "Escape") setShowInput(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSubmit} disabled={!text.trim()}>Comment</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowInput(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
