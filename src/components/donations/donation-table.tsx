import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/donations/status-badge";
import { StatusUpdateForm } from "@/components/donations/status-update-form";
import { formatCentsAsDollars, formatIsoDate } from "@/lib/donations/format";
import { getAllowedNextStatuses } from "@/lib/donations/transitions";
import { PAYMENT_METHOD_LABELS, type Donation } from "@/lib/donations/types";

interface DonationTableProps {
  donations: Donation[];
}

export function DonationTable({ donations }: DonationTableProps) {
  if (donations.length === 0)
    return (
      <div className="rounded-md border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No donations yet.
      </div>
    );

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">Created</TableHead>
            <TableHead>Nonprofit</TableHead>
            <TableHead>Donor</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.uuid}>
              <TableCell className="pl-4 text-muted-foreground">
                {formatIsoDate(donation.createdAt)}
              </TableCell>
              <TableCell className="font-medium">
                {donation.nonprofitId}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {donation.donorId}
              </TableCell>
              <TableCell>
                {PAYMENT_METHOD_LABELS[donation.paymentMethod]}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatCentsAsDollars(donation.amount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={donation.status} />
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end">
                  <StatusUpdateForm
                    uuid={donation.uuid}
                    allowedStatuses={getAllowedNextStatuses(donation.status)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
