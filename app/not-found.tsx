import Link from "next/link";
import { Home, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">404</p>
      <h1 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
        This trail does not exist
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you requested may have moved, or the link could be mistyped.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild className="gap-2 rounded-full">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Back home
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2 rounded-full">
          <Link href="/tours">
            <Map className="size-4" aria-hidden />
            Browse tours
          </Link>
        </Button>
      </div>
    </div>
  );
}
