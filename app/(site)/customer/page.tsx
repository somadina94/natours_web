import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Natours checkout status page.",
  path: "/customer",
  noIndex: true,
});

export default function CustomerPage() {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-2xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full rounded-2xl border border-border/70 bg-card/70 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <RefreshCcw className="size-6" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Checkout canceled</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          No charge was completed. You can return to any tour and try checkout again when ready.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button className="gap-2 rounded-full" asChild>
            <Link href="/tours">Back to tours</Link>
          </Button>
          <Button variant="outline" className="gap-2 rounded-full" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              Back home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
