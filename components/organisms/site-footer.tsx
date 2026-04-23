import Link from "next/link";
import { BookOpenText, Compass, Info, Mail, MapPinned, ShieldCheck } from "lucide-react";
import { siteName } from "@/lib/env";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer
      className="border-t border-border/80 bg-card/60 backdrop-blur-md"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-[#7dd56f] to-[#28b487] text-primary-foreground shadow-md">
              <Compass className="size-5" aria-hidden />
            </span>
            {siteName}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Curated outdoor adventures with expert guides, small groups, and
            landscapes you will talk about for years.
          </p>
        </div>
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                >
                  <MapPinned className="size-4 shrink-0 text-primary" aria-hidden />
                  All tours
                </Link>
              </li>
              <li>
                <Link
                  href="/#featured"
                  className="inline-flex items-center gap-2 text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                >
                  <Compass className="size-4 shrink-0 text-primary" aria-hidden />
                  Featured picks
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                >
                  <BookOpenText className="size-4 shrink-0 text-primary" aria-hidden />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                >
                  <Info className="size-4 shrink-0 text-primary" aria-hidden />
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                >
                  <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-2 text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                >
                  <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
                  Terms &amp; conditions
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h2>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>hello@natours.app</span>
            </p>
          </div>
        </nav>
      </div>
      <div className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} {siteName}. Crafted for explorers.</p>
          <p className="text-center sm:text-right">Carbon-conscious itineraries · Safety-first guiding</p>
        </div>
      </div>
    </footer>
  );
}
