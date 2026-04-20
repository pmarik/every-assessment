import { SummaryCountToggle } from "@/components/donations/summary-count-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCentsAsDollars } from "@/lib/donations/format";
import {
  computeDonationSummary,
  formatRate,
} from "@/lib/donations/summary";
import {
  DONATION_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type Donation,
  type DonationStatus,
} from "@/lib/donations/types";

interface DonationSummaryProps {
  donations: Donation[];
  countedStatuses: DonationStatus[];
  scopeLabel?: string;
}

function formatCountedStatuses(statuses: DonationStatus[]): string {
  if (statuses.length === 0) return "no statuses";
  if (statuses.length === 4) return "all statuses";
  return statuses.map((s) => DONATION_STATUS_LABELS[s].toLowerCase()).join(", ");
}

export function DonationSummary({
  donations,
  countedStatuses,
  scopeLabel = "current view",
}: DonationSummaryProps) {
  const summary = computeDonationSummary(donations, { countedStatuses });
  const {
    paymentTotals,
    countedTotalCents,
    successRate,
    failureRate,
    terminalCount,
    statusCounts,
  } = summary;

  const countedLabel = formatCountedStatuses(countedStatuses);
  const excludedPending = statusCounts.pending + statusCounts.new;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Totals for the {scopeLabel}. Counting {countedLabel} ={" "}
              <span className="tabular-nums font-medium text-foreground">
                {formatCentsAsDollars(countedTotalCents)}
              </span>
              .
            </CardDescription>
          </div>
          <SummaryCountToggle />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <section className="flex-1">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total by payment method
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {paymentTotals.map((bucket) => (
              <div
                key={bucket.method}
                className="rounded-md border border-border bg-muted/30 px-3 py-2"
              >
                <div className="text-xs text-muted-foreground">
                  {PAYMENT_METHOD_LABELS[bucket.method]}
                </div>
                <div className="mt-0.5 text-base font-semibold tabular-nums">
                  {formatCentsAsDollars(bucket.countedCents)}
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {bucket.countedCount} of {bucket.totalCount}
                </div>
              </div>
            ))}
          </div>
        </section>
        <div
          aria-hidden
          className="hidden w-px self-stretch bg-border lg:block"
        />
        <section className="lg:w-72 lg:shrink-0">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Outcome rates
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <div className="text-xs text-muted-foreground">Success rate</div>
              <div className="mt-0.5 text-base font-semibold tabular-nums text-primary">
                {formatRate(successRate)}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {statusCounts.success} succeeded
              </div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <div className="text-xs text-muted-foreground">Failure rate</div>
              <div className="mt-0.5 text-base font-semibold tabular-nums text-destructive">
                {formatRate(failureRate)}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {statusCounts.failure} failed
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            Based on {terminalCount} {" "}
            {terminalCount === 1 ? "donation" : "donations"}
            {excludedPending > 0 && (
              <>
                {" "}
                ({statusCounts.pending} pending, {statusCounts.new} new excluded)
              </>
            )}
            .
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
