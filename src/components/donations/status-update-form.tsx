"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStatusAction } from "@/lib/actions/update-status";
import {
  DONATION_STATUS_LABELS,
  type DonationStatus,
} from "@/lib/donations/types";

interface StatusUpdateFormProps {
  uuid: string;
  allowedStatuses: readonly DonationStatus[];
}

export function StatusUpdateForm({
  uuid,
  allowedStatuses,
}: StatusUpdateFormProps) {
  const [nextStatus, setNextStatus] = useState<DonationStatus | "">("");
  const [isPending, startTransition] = useTransition();

  if (allowedStatuses.length === 0)
    return (
      <span className="text-xs text-muted-foreground">No actions</span>
    );

  function handleUpdate() {
    if (!nextStatus) return;
    const target = nextStatus;
    startTransition(async () => {
      const result = await updateStatusAction(uuid, target);
      if (result.ok && result.status) {
        toast.success(
          `Donation marked as ${DONATION_STATUS_LABELS[result.status].toLowerCase()}.`,
        );
        setNextStatus("");
      } else {
        toast.error(result.error ?? "Failed to update status.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={nextStatus}
        onValueChange={(value) => setNextStatus(value as DonationStatus)}
        disabled={isPending}
      >
        <SelectTrigger className="h-8 w-[140px]" size="sm">
          <SelectValue placeholder="Update to…" />
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {DONATION_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        disabled={!nextStatus || isPending}
        onClick={handleUpdate}
      >
        {isPending ? "Updating…" : "Update"}
      </Button>
    </div>
  );
}
