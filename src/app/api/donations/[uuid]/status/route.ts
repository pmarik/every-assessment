import { NextResponse } from "next/server";
import { updateDonationStatus } from "@/lib/donations/store";
import { DONATION_STATUS_LABELS } from "@/lib/donations/types";
import { updateStatusSchema } from "@/lib/donations/validation";

interface RouteContext {
  params: Promise<{ uuid: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { uuid } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = updateStatusSchema.safeParse(payload);
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Invalid payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );

  const result = updateDonationStatus(uuid, parsed.data.status);
  if (result.ok) return NextResponse.json(result.donation);

  if (result.reason === "not_found")
    return NextResponse.json(
      { error: `Donation with uuid ${uuid} not found` },
      { status: 404 },
    );

  if (result.reason === "duplicate")
    return NextResponse.json(
      {
        error: `Donation ${uuid} is already ${DONATION_STATUS_LABELS[result.donation.status].toLowerCase()}`,
        donation: result.donation,
      },
      { status: 409 },
    );

  return NextResponse.json(
    {
      error: `Invalid status transition: ${result.from} -> ${result.to}`,
      from: result.from,
      to: result.to,
    },
    { status: 422 },
  );
}
