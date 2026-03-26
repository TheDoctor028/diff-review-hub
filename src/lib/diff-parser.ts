import { useMemo } from "react";

export interface DiffLine {
  type: "add" | "remove" | "context" | "hunk" | "header";
  content: string;
  oldLine?: number;
  newLine?: number;
}

export interface DiffFile {
  filename: string;
  lines: DiffLine[];
}

export function parseDiff(raw: string): DiffFile[] {
  const files: DiffFile[] = [];
  const lines = raw.split("\n");
  let currentFile: DiffFile | null = null;
  let oldLine = 0;
  let newLine = 0;

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      currentFile = { filename: "", lines: [] };
      files.push(currentFile);
      currentFile.lines.push({ type: "header", content: line });
      continue;
    }

    if (!currentFile) continue;

    if (line.startsWith("---") || line.startsWith("+++")) {
      if (line.startsWith("+++ b/")) {
        currentFile.filename = line.slice(6);
      } else if (line.startsWith("+++ /dev/null")) {
        // file deleted, keep filename from --- line
      }
      if (line.startsWith("--- a/") && !currentFile.filename) {
        currentFile.filename = line.slice(6);
      }
      currentFile.lines.push({ type: "header", content: line });
      continue;
    }

    if (line.startsWith("@@")) {
      const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (match) {
        oldLine = parseInt(match[1], 10);
        newLine = parseInt(match[2], 10);
      }
      currentFile.lines.push({ type: "hunk", content: line });
      continue;
    }

    if (line.startsWith("index") || line.startsWith("new file") || line.startsWith("deleted file") || line.startsWith("similarity") || line.startsWith("rename") || line.startsWith("old mode") || line.startsWith("new mode")) {
      currentFile.lines.push({ type: "header", content: line });
      continue;
    }

    if (line.startsWith("+")) {
      currentFile.lines.push({ type: "add", content: line.slice(1), newLine: newLine++ });
    } else if (line.startsWith("-")) {
      currentFile.lines.push({ type: "remove", content: line.slice(1), oldLine: oldLine++ });
    } else if (line.startsWith(" ")) {
      currentFile.lines.push({ type: "context", content: line.slice(1), oldLine: oldLine++, newLine: newLine++ });
    } else if (line.startsWith("\\")) {
      // "\ No newline at end of file"
      currentFile.lines.push({ type: "header", content: line });
    }
  }

  return files;
}

export function useParsedDiff(raw: string | undefined) {
  return useMemo(() => (raw ? parseDiff(raw) : []), [raw]);
}
