import type { DonationStatus } from "./types";

export const VALID_TRANSITIONS: Record<
  DonationStatus,
  readonly DonationStatus[]
> = {
  new: ["pending"],
  pending: ["success", "failure"],
  success: [],
  failure: [],
};

export function isValidTransition(
  from: DonationStatus,
  to: DonationStatus,
): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function getAllowedNextStatuses(
  from: DonationStatus,
): readonly DonationStatus[] {
  return VALID_TRANSITIONS[from];
}
