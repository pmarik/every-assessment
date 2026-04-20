import { NextResponse } from "next/server";
import { getDonation } from "@/lib/donations/store";

interface RouteContext {
  params: Promise<{ uuid: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { uuid } = await params;
  const donation = getDonation(uuid);
  if (!donation)
    return NextResponse.json(
      { error: `Donation with uuid ${uuid} not found` },
      { status: 404 },
    );

  return NextResponse.json(donation);
}
