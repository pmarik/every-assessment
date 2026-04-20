"use server";

import { revalidatePath } from "next/cache";
import { updateDonationStatus } from "@/lib/donations/store";
import {
  DONATION_STATUS_LABELS,
  type DonationStatus,
} from "@/lib/donations/types";

export interface UpdateStatusActionResult {
  ok: boolean;
  status?: DonationStatus;
  error?: string;
}

export async function updateStatusAction(
  uuid: string,
  nextStatus: DonationStatus,
): Promise<UpdateStatusActionResult> {
  const result = updateDonationStatus(uuid, nextStatus);

  if (result.ok) {
    revalidatePath("/");
    return { ok: true, status: result.donation.status };
  }

  if (result.reason === "not_found")
    return { ok: false, error: `Donation ${uuid} not found.` };

  if (result.reason === "duplicate")
    return {
      ok: false,
      error: `Donation is already ${DONATION_STATUS_LABELS[result.donation.status].toLowerCase()}.`,
    };

  return {
    ok: false,
    error: `Invalid status transition: ${result.from} → ${result.to}.`,
  };
}
