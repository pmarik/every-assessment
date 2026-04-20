import { z } from "zod";

export const paymentMethodSchema = z.enum(["cc", "ach", "crypto", "venmo"]);

export const donationStatusSchema = z.enum([
  "new",
  "pending",
  "success",
  "failure",
]);

export const createDonationSchema = z.object({
  uuid: z.string().uuid(),
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
