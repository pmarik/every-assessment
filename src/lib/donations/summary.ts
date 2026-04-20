import type {
  Donation,
  DonationStatus,
  PaymentMethod,
} from "./types";

export interface PaymentMethodTotal {
  method: PaymentMethod;
  countedCents: number;
  countedCount: number;
  totalCount: number;
}

export interface DonationSummary {
  totalCount: number;
  statusCounts: Record<DonationStatus, number>;
  paymentTotals: PaymentMethodTotal[];
  countedTotalCents: number;
  successRate: number | null;
  failureRate: number | null;
  terminalCount: number;
}

const PAYMENT_METHOD_ORDER: PaymentMethod[] = ["cc", "ach", "crypto", "venmo"];

interface ComputeOptions {
  countedStatuses: DonationStatus[];
}

export function computeDonationSummary(
  donations: Donation[],
  { countedStatuses }: ComputeOptions,
): DonationSummary {
  const countedSet = new Set<DonationStatus>(countedStatuses);
  const statusCounts: Record<DonationStatus, number> = {
    new: 0,
    pending: 0,
    success: 0,
    failure: 0,
  };

  const totalsByMethod = new Map<PaymentMethod, PaymentMethodTotal>();
  for (const method of PAYMENT_METHOD_ORDER) {
    totalsByMethod.set(method, {
      method,
      countedCents: 0,
      countedCount: 0,
      totalCount: 0,
    });
  }

  let countedTotalCents = 0;
  for (const donation of donations) {
    statusCounts[donation.status] += 1;
    const bucket = totalsByMethod.get(donation.paymentMethod);
    if (!bucket) continue;
    bucket.totalCount += 1;
    if (countedSet.has(donation.status)) {
      bucket.countedCents += donation.amount;
      bucket.countedCount += 1;
      countedTotalCents += donation.amount;
    }
  }

  const terminalCount = statusCounts.success + statusCounts.failure;
  const successRate =
    terminalCount > 0 ? statusCounts.success / terminalCount : null;
  const failureRate =
    terminalCount > 0 ? statusCounts.failure / terminalCount : null;

  return {
    totalCount: donations.length,
    statusCounts,
    paymentTotals: PAYMENT_METHOD_ORDER.map(
      (method) => totalsByMethod.get(method)!,
    ),
    countedTotalCents,
    successRate,
    failureRate,
    terminalCount,
  };
}

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatRate(rate: number | null): string {
  return rate === null ? "—" : percentFormatter.format(rate);
}
