import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Donations</h1>
        <p className="text-sm text-muted-foreground">
          View and manage donation processes.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard coming soon</CardTitle>
          <CardDescription>
            The donations table and status controls here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
