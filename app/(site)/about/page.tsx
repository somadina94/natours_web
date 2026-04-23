import { Compass, Leaf, Mountain, Users } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn the Natours story, mission, and principles behind our classic approach to safe, small-group outdoor travel.",
  path: "/about",
  keywords: ["about Natours", "travel mission", "outdoor tours", "small groups", "guided adventures"],
});

const values = [
  {
    title: "Adventure with purpose",
    description: "We design routes that celebrate wild places while respecting local communities and ecosystems.",
    icon: Mountain,
  },
  {
    title: "Small groups, real guides",
    description: "Better experiences come from smaller groups and guides who know each trail beyond the map.",
    icon: Users,
  },
  {
    title: "Light footprint",
    description: "Our planning favors low-impact choices and partners who operate with environmental care.",
    icon: Leaf,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <Compass className="size-4 text-primary" aria-hidden />
          About Natours
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">A classic way to explore</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Natours began with a simple belief: outdoor travel should feel personal, safe, and unforgettable.
          We pair timeless expedition values with modern product design so every step from discovery to booking
          feels clear.
        </p>
      </header>

      <section className="rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">What we stand for</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {values.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-border/60 bg-background/70 p-5">
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
