"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { donationFilterParsers } from "@/lib/donations/filters";
import {
  DONATION_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type DonationStatus,
  type PaymentMethod,
} from "@/lib/donations/types";

const STATUS_OPTIONS: DonationStatus[] = [
  "new",
  "pending",
  "success",
  "failure",
];

const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = [
  "cc",
  "ach",
  "crypto",
  "venmo",
];

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

interface FilterGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
  selected: T[];
  onToggle: (value: T) => void;
}

function FilterGroup<T extends string>({
  label,
  options,
  labels,
  selected,
  onToggle,
}: FilterGroupProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {options.map((value) => {
        const active = selected.includes(value);
        return (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            aria-pressed={active}
            onClick={() => onToggle(value)}
          >
            {labels[value]}
          </Button>
        );
      })}
    </div>
  );
}

export function DonationFilters() {
  const [{ status, paymentMethod }, setFilters] = useQueryStates(
    donationFilterParsers,
    { shallow: false, clearOnDefault: true },
  );
  const [isPending, startTransition] = useTransition();

  const activeCount = status.length + paymentMethod.length;
  const hasActive = activeCount > 0;

  function onToggleStatus(value: DonationStatus) {
    startTransition(() => {
      void setFilters({ status: toggle(status, value) });
    });
  }

  function onTogglePaymentMethod(value: PaymentMethod) {
    startTransition(() => {
      void setFilters({ paymentMethod: toggle(paymentMethod, value) });
    });
  }

  function onClearAll() {
    startTransition(() => {
      void setFilters({ status: [], paymentMethod: [] });
    });
  }

  return (
    <div
      aria-busy={isPending}
      className={`flex flex-wrap items-center gap-x-6 gap-y-3 transition-opacity ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
    >
      <FilterGroup
        label="Status"
        options={STATUS_OPTIONS}
        labels={DONATION_STATUS_LABELS}
        selected={status}
        onToggle={onToggleStatus}
      />
      <span
        aria-hidden
        className="hidden h-5 w-px bg-border lg:block"
      />
      <FilterGroup
        label="Payment"
        options={PAYMENT_METHOD_OPTIONS}
        labels={PAYMENT_METHOD_LABELS}
        selected={paymentMethod}
        onToggle={onTogglePaymentMethod}
      />
      {hasActive && (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onClearAll}
          className="ml-auto font-medium"
          aria-label={`Clear ${activeCount} active ${
            activeCount === 1 ? "filter" : "filters"
          }`}
        >
          <X aria-hidden />
          Clear {activeCount}{" "}
          {activeCount === 1 ? "filter" : "filters"}
        </Button>
      )}
    </div>
  );
}
