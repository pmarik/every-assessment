const dollarFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCentsAsDollars(cents: number): string {
  return dollarFormatter.format(cents / 100);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatIsoDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}
