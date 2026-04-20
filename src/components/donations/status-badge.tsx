import { Badge } from "@/components/ui/badge";
import { DONATION_STATUS_LABELS, type DonationStatus } from "@/lib/donations/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<DonationStatus, string> = {
  new: "bg-muted text-foreground/80 border border-border",
  pending: "bg-amber-100 text-amber-900 border border-amber-200",
  success: "bg-accent/25 text-[#0a3d33] border border-accent/40",
  failure: "bg-red-100 text-red-900 border border-red-200",
};

interface StatusBadgeProps {
  status: DonationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(STATUS_STYLES[status], "uppercase", className)}>
      {DONATION_STATUS_LABELS[status]}
    </Badge>
  );
}
