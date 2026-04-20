import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsStringLiteral,
} from "nuqs/server";
import type { Donation, DonationStatus, PaymentMethod } from "./types";

const STATUS_VALUES: readonly DonationStatus[] = [
  "new",
  "pending",
  "success",
  "failure",
];

const PAYMENT_METHOD_VALUES: readonly PaymentMethod[] = [
  "cc",
  "ach",
  "crypto",
  "venmo",
];

export const donationFilterParsers = {
  status: parseAsArrayOf(parseAsStringLiteral(STATUS_VALUES)).withDefault([]),
  paymentMethod: parseAsArrayOf(
    parseAsStringLiteral(PAYMENT_METHOD_VALUES),
  ).withDefault([]),
};

export const donationSummaryParsers = {
  countedStatuses: parseAsArrayOf(
    parseAsStringLiteral(STATUS_VALUES),
  ).withDefault(["success"]),
};

export const dashboardSearchParamsCache = createSearchParamsCache({
  ...donationFilterParsers,
  ...donationSummaryParsers,
});

export interface DonationFilters {
  status: DonationStatus[];
  paymentMethod: PaymentMethod[];
}

export function filterDonations(
  donations: Donation[],
  filters: DonationFilters,
): Donation[] {
  const { status, paymentMethod } = filters;
  if (status.length === 0 && paymentMethod.length === 0) return donations;
  return donations.filter(
    (donation) =>
      (status.length === 0 || status.includes(donation.status)) &&
      (paymentMethod.length === 0 ||
        paymentMethod.includes(donation.paymentMethod)),
  );
}

export function hasActiveFilters(filters: DonationFilters): boolean {
  return filters.status.length > 0 || filters.paymentMethod.length > 0;
}

export function countActiveFilters(filters: DonationFilters): number {
  return filters.status.length + filters.paymentMethod.length;
}
