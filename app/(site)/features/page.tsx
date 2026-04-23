import { BadgeCheck, BookOpenText, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Features",
  description:
    "Explore the core Natours experience: curated itineraries, trusted guides, transparent bookings, and support built for modern travelers.",
  path: "/features",
  keywords: ["Natours features", "travel booking", "guided tours", "itineraries", "support"],
});

const features = [
  {
    title: "Curated routes",
    description:
      "Every tour is selected for scenery, pacing, and real traveler satisfaction so you can book with confidence.",
    icon: MapPinned,
  },
  {
    title: "Trusted operators",
    description:
      "Operators are screened for safety standards, local expertise, and small-group guiding practices.",
    icon: ShieldCheck,
  },
  {
    title: "Clear pricing",
    description:
      "Simple per-person pricing, transparent inclusions, and checkout flows designed to avoid surprises.",
    icon: BadgeCheck,
  },
  {
    title: "Classic + modern UX",
    description:
      "A classic travel ethos with modern tools like rich tour pages, fast account access, and responsive layouts.",
    icon: Sparkles,
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <BookOpenText className="size-4 text-primary" aria-hidden />
          Classic features
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built for timeless adventures</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Natours keeps the spirit of classic guided travel: expert leaders, thoughtful routes, and dependable
          logistics, delivered in a cleaner modern web experience.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Feature list">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-border/70 bg-card/70 p-6">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
