import Script from "next/script";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/organisms/home-hero";
import { ToursGrid } from "@/components/molecules/tours-grid";
import { GradientHeading } from "@/components/atoms/gradient-heading";
import { Button } from "@/components/ui/button";
import { getTours } from "@/lib/api/tours";
import { buildMetadata } from "@/lib/metadata";
import { siteDescription, siteName } from "@/lib/env";
import type { Tour } from "@/types/tour";

export const metadata = buildMetadata({
  title: siteName,
  description: siteDescription,
  path: "/",
  keywords: ["Natours", "nature tours", "adventure", "guided tours"],
});

export default async function HomePage() {
  let featured: Tour[] = [];
  try {
    const res = await getTours({ limit: 6, sort: "-ratingsAverage" });
    featured = res.data.data;
  } catch {
    featured = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/tours`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="natours-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero />
      <section
        id="featured"
        aria-labelledby="featured-heading"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <GradientHeading as="h2" className="text-2xl sm:text-3xl" id="featured-heading">
              Featured tours
            </GradientHeading>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Hand-picked adventures with the highest guest ratings and the most
              dramatic scenery.
            </p>
          </div>
          <Button variant="outline" className="gap-2 self-start rounded-full sm:self-auto" asChild>
            <Link href="/tours">
              View all
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        {featured.length ? (
          <ToursGrid tours={featured} />
        ) : (
          <p className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-8 text-center text-muted-foreground">
            Tours will appear here once the API is reachable. Check{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code>{" "}
            and that the backend is running.
          </p>
        )}
      </section>
    </>
  );
}
