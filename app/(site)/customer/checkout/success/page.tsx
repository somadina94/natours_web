import Link from "next/link";
import { CheckCircle2, CreditCard, LayoutDashboard } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Checkout success",
  description: "Your Natours payment completed successfully.",
  path: "/customer/checkout/success",
  noIndex: true,
});

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const checkout = params.checkout;
  const ok = Array.isArray(checkout) ? checkout.includes("success") : checkout === "success";

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-2xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full rounded-2xl border border-border/70 bg-card/70 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-6" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {ok ? "Payment successful" : "Checkout received"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {ok
            ? "Thanks for booking with Natours. Your booking will appear in your dashboard shortly."
            : "Your checkout callback was received. If payment completed, your booking will be reflected in your account."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button className="gap-2 rounded-full" asChild>
            <Link href="/dashboard?view=bookings">
              <LayoutDashboard className="size-4" aria-hidden />
              View my bookings
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 rounded-full" asChild>
            <Link href="/tours">
              <CreditCard className="size-4" aria-hidden />
              Browse more tours
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
