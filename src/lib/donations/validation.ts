import { z } from "zod";

export const paymentMethodSchema = z.enum(["cc", "ach", "crypto", "venmo"]);

export const donationStatusSchema = z.enum([
  "new",
  "pending",
  "success",
  "failure",
]);

const UUID_FORMAT =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createDonationSchema = z.object({
  uuid: z.string().regex(UUID_FORMAT, "Invalid UUID format"),
  amount: z.number().int().nonnegative(),
  currency: z.literal("USD"),
  paymentMethod: paymentMethodSchema,
  nonprofitId: z.string().min(1),
  donorId: z.string().min(1),
  status: donationStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
});

export const updateStatusSchema = z.object({
  status: donationStatusSchema,
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
