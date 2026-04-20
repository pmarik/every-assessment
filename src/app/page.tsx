import { DonationTable } from "@/components/donations/donation-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDonations } from "@/lib/donations/store";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const donations = listDonations();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Donations</h1>
        <p className="text-sm text-muted-foreground">
          View and manage donations processed.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All donations</CardTitle>
          <CardDescription>
            {donations.length}{" "}
            {donations.length === 1 ? "donation" : "donations"} total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonationTable donations={donations} />
        </CardContent>
      </Card>
    </div>
  );
}
