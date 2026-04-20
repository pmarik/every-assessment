import type { SearchParams } from "nuqs/server";
import { DonationFilters } from "@/components/donations/donation-filters";
import { DonationSummary } from "@/components/donations/donation-summary";
import { DonationTable } from "@/components/donations/donation-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  dashboardSearchParamsCache,
  filterDonations,
  hasActiveFilters,
} from "@/lib/donations/filters";
import { listDonations } from "@/lib/donations/store";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { countedStatuses, ...filters } =
    await dashboardSearchParamsCache.parse(searchParams);
  const allDonations = listDonations();
  const filteredDonations = filterDonations(allDonations, filters);
  const filtersActive = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Donations</h1>
        <p className="text-sm text-muted-foreground">
          View and manage donations processed.
        </p>
      </div>
      <DonationSummary
        donations={filteredDonations}
        countedStatuses={countedStatuses}
        scopeLabel={filtersActive ? "filtered donations" : "all donations"}
      />
      <Card>
        <CardHeader>
          <CardTitle>All donations</CardTitle>
          <CardDescription>
            {filtersActive
              ? `${filteredDonations.length} of ${allDonations.length} ${
                  allDonations.length === 1 ? "donation" : "donations"
                } match the current filters.`
              : `${allDonations.length} ${
                  allDonations.length === 1 ? "donation" : "donations"
                } total.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DonationFilters />
          <DonationTable donations={filteredDonations} />
        </CardContent>
      </Card>
    </div>
  );
}
