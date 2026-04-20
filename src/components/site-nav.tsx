import Link from "next/link";

export function SiteNav() {
  return (
    <header className="bg-nav text-nav-foreground">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-full bg-accent"
          />
          <span className="font-heading text-base font-semibold tracking-tight">
            Donations Dashboard
          </span>
        </Link>
      </div>
    </header>
  );
}
