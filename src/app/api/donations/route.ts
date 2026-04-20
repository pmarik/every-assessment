import { NextResponse } from "next/server";
import { createDonation, listDonations } from "@/lib/donations/store";
import { createDonationSchema } from "@/lib/donations/validation";

export async function GET() {
  return NextResponse.json({ donations: listDonations() });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = createDonationSchema.safeParse(payload);
  if (!parsed.success) {
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
  }

  const result = createDonation(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: `Donation with uuid ${parsed.data.uuid} already exists`,
        existing: result.existing,
      },
      { status: 409 },
    );
  }

  return NextResponse.json(result.donation, { status: 201 });
}
