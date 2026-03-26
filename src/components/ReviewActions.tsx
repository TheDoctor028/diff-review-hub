import { useState } from "react";
import type { WorkspaceStatus } from "@/types/workspace";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, AlertTriangle } from "lucide-react";

interface ReviewActionsProps {
  currentStatus: WorkspaceStatus;
  onUpdate: (status: WorkspaceStatus, reason?: string) => void;
  isPending: boolean;
}

export function ReviewActions({ currentStatus, onUpdate, isPending }: ReviewActionsProps) {
  const [declineOpen, setDeclineOpen] = useState(false);
  const [reason, setReason] = useState("");

  const isLocked = currentStatus !== "TO_REVIEW";

  const handleDecline = () => {
    onUpdate("DECLINED", reason || undefined);
    setDeclineOpen(false);
    setReason("");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onUpdate("ACCEPTED")}
          disabled={isPending || (isLocked && currentStatus !== "ACCEPTED")}
          size="sm"
          variant={currentStatus === "ACCEPTED" || !isLocked ? "default" : "outline"}
          className={
            currentStatus === "ACCEPTED" || !isLocked
              ? "bg-status-accepted hover:bg-status-accepted/90 text-primary-foreground"
              : ""
          }
        >
          <Check className="h-4 w-4 mr-1" /> Accept
        </Button>
        <Button
          onClick={() => onUpdate("REQUIRE_CHANGES")}
          disabled={isPending || (isLocked && currentStatus !== "REQUIRE_CHANGES")}
          size="sm"
          variant={currentStatus === "REQUIRE_CHANGES" || !isLocked ? "default" : "outline"}
          className={
            currentStatus === "REQUIRE_CHANGES" || !isLocked
              ? "bg-status-changes hover:bg-status-changes/90 text-primary-foreground"
              : ""
          }
        >
          <AlertTriangle className="h-4 w-4 mr-1" /> Request Changes
        </Button>
        <Button
          onClick={() => setDeclineOpen(true)}
          disabled={isPending || (isLocked && currentStatus !== "DECLINED")}
          size="sm"
          variant={currentStatus === "DECLINED" || !isLocked ? "destructive" : "outline"}
        >
          <X className="h-4 w-4 mr-1" /> Decline
        </Button>
      </div>

      <Dialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono">Decline Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for declining (optional)…"
              className="min-h-[80px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setDeclineOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDecline} disabled={isPending}>
                Decline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
