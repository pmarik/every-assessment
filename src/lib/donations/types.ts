export type PaymentMethod = "cc" | "ach" | "crypto" | "venmo";

export type DonationStatus = "new" | "pending" | "success" | "failure";

export interface Donation {
  uuid: string;
  amount: number;
  currency: "USD";
  paymentMethod: PaymentMethod;
  nonprofitId: string;
  donorId: string;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DonationInput {
  uuid: string;
  amount: number;
  currency: "USD";
  paymentMethod: PaymentMethod;
  nonprofitId: string;
  donorId: string;
  status: DonationStatus;
  createdAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cc: "Credit card",
  ach: "ACH",
  crypto: "Crypto",
  venmo: "Venmo",
};

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  new: "New",
  pending: "Pending",
  success: "Success",
  failure: "Failure",
};
