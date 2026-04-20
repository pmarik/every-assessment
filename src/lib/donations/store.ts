import sampleData from "../../../data/sample.json";
import { isValidTransition } from "./transitions";
import type { Donation, DonationInput, DonationStatus } from "./types";

export type CreateDonationResult =
  | { ok: true; donation: Donation }
  | { ok: false; reason: "duplicate"; existing: Donation };

export type UpdateStatusResult =
  | { ok: true; donation: Donation }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "duplicate"; donation: Donation }
  | {
      ok: false;
      reason: "invalid_transition";
      from: DonationStatus;
      to: DonationStatus;
    };

function seedStore(): Map<string, Donation> {
  const store = new Map<string, Donation>();
  for (const item of sampleData as DonationInput[]) {
    const donation: Donation = { ...item, updatedAt: item.createdAt };
    store.set(donation.uuid, donation);
  }
  return store;
}

const globalRef = globalThis as unknown as {
  __donationStore?: Map<string, Donation>;
};

const donations: Map<string, Donation> =
  globalRef.__donationStore ?? (globalRef.__donationStore = seedStore());

export function listDonations(): Donation[] {
  return Array.from(donations.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getDonation(uuid: string): Donation | undefined {
  return donations.get(uuid);
}

export function createDonation(input: DonationInput): CreateDonationResult {
  const existing = donations.get(input.uuid);
  if (existing) return { ok: false, reason: "duplicate", existing };

  const now = new Date().toISOString();
  const donation: Donation = { ...input, updatedAt: now };
  donations.set(donation.uuid, donation);
  return { ok: true, donation };
}

export function updateDonationStatus(
  uuid: string,
  nextStatus: DonationStatus,
): UpdateStatusResult {
  const current = donations.get(uuid);
  if (!current) return { ok: false, reason: "not_found" };

  if (current.status === nextStatus)
    return { ok: false, reason: "duplicate", donation: current };

  if (!isValidTransition(current.status, nextStatus))
    return {
      ok: false,
      reason: "invalid_transition",
      from: current.status,
      to: nextStatus,
    };

  const updated: Donation = {
    ...current,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
  donations.set(uuid, updated);
  return { ok: true, donation: updated };
}

export function resetDonationStore(): void {
  donations.clear();
  for (const [uuid, donation] of seedStore()) donations.set(uuid, donation);
}
