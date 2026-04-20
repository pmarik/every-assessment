"use client";

import { useTransition } from "react";
import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { donationSummaryParsers } from "@/lib/donations/filters";
import {
  DONATION_STATUS_LABELS,
  type DonationStatus,
} from "@/lib/donations/types";

const STATUS_OPTIONS: DonationStatus[] = [
  "new",
  "pending",
  "success",
  "failure",
];

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

export function SummaryCountToggle() {
  const [{ countedStatuses }, setParams] = useQueryStates(
    donationSummaryParsers,
    { shallow: false, clearOnDefault: true },
  );
  const [isPending, startTransition] = useTransition();

  function onToggle(value: DonationStatus) {
    startTransition(() => {
      void setParams({ countedStatuses: toggle(countedStatuses, value) });
    });
  }

  return (
    <div
      aria-busy={isPending}
      className={`flex flex-wrap items-center gap-2 transition-opacity ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Include
      </span>
      {STATUS_OPTIONS.map((value) => {
        const active = countedStatuses.includes(value);
        return (
          <Button
            key={value}
            type="button"
            size="xs"
            variant={active ? "default" : "outline"}
            aria-pressed={active}
            onClick={() => onToggle(value)}
          >
            {DONATION_STATUS_LABELS[value]}
          </Button>
        );
      })}
    </div>
  );
}
