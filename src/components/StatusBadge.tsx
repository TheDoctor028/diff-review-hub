import type { WorkspaceStatus } from "@/types/workspace";
import { cn } from "@/lib/utils";

const statusConfig: Record<WorkspaceStatus, { label: string; className: string }> = {
  TO_REVIEW: { label: "To Review", className: "bg-status-review/15 text-status-review" },
  ACCEPTED: { label: "Accepted", className: "bg-status-accepted/15 text-status-accepted" },
  REQUIRE_CHANGES: { label: "Changes Requested", className: "bg-status-changes/15 text-status-changes" },
  DECLINED: { label: "Declined", className: "bg-status-declined/15 text-status-declined" },
};

export function StatusBadge({ status }: { status: WorkspaceStatus }) {
  const config = statusConfig[status] ?? statusConfig.TO_REVIEW;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-mono", config.className)}>
      {config.label}
    </span>
  );
}
