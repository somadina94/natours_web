import { Compass } from "lucide-react";
import Link from "next/link";
import { ToursGrid } from "@/components/molecules/tours-grid";
import { GradientHeading } from "@/components/atoms/gradient-heading";
import { Button } from "@/components/ui/button";
import { getTours } from "@/lib/api/tours";
import { buildMetadata } from "@/lib/metadata";
import type { Tour } from "@/types/tour";

export const metadata = buildMetadata({
  title: "All tours",
  description:
    "Browse every Natours itinerary — difficulty, duration, ratings, and live map previews.",
  path: "/tours",
  keywords: ["tours catalog", "hiking tours", "group adventures", "Natours"],
});

const TOURS_PER_PAGE = 6;

export default async function ToursPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = Number(resolvedSearchParams.page ?? "1");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;

  let tours: Tour[] = [];
  let fetchedCount = 0;
  try {
    // Fetch one extra row so we can know whether a next page exists.
    const res = await getTours({
      limit: TOURS_PER_PAGE + 1,
      page,
      sort: "-ratingsAverage",
    });
    fetchedCount = res.data.data.length;
    tours = res.data.data.slice(0, TOURS_PER_PAGE);
  } catch {
    tours = [];
  }
  const hasPrevPage = page > 1;
  const hasNextPage = fetchedCount > TOURS_PER_PAGE;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Compass className="size-6" aria-hidden />
        </span>
        <div>
          <GradientHeading as="h1" className="text-3xl sm:text-4xl">
            Explore every route
          </GradientHeading>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Filter mentally by difficulty and vibe — each card mirrors the classic Natours
            layout with a sharper, glass-forward presentation.
          </p>
        </div>
      </div>
      {tours.length ? (
        <>
          <ToursGrid tours={tours} />
          <div className="mt-10 flex items-center justify-between gap-3">
            <Button variant="outline" disabled={!hasPrevPage} asChild={hasPrevPage}>
              {hasPrevPage ? (
                <Link href={`/tours?page=${page - 1}`}>Previous</Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">Page {page}</p>
            <Button variant="outline" disabled={!hasNextPage} asChild={hasNextPage}>
              {hasNextPage ? <Link href={`/tours?page=${page + 1}`}>Next</Link> : <span>Next</span>}
            </Button>
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-8 text-center text-muted-foreground">
          No tours loaded. Ensure the API is running and reachable.
        </p>
      )}
    </div>
  );
}
