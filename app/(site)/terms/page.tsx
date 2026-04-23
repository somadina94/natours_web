import { Scale } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms & conditions",
  description:
    "The rules governing your use of Natours, bookings, cancellations, and liability when you travel with our partner operators.",
  path: "/terms",
  keywords: ["terms of service", "Natours", "bookings", "cancellation", "travel"],
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Scale className="size-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Terms &amp; conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated April 22, 2026</p>
        </div>
      </div>
      <article className="max-w-none space-y-10 text-[0.95rem] leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">1. Agreement</h2>
          <p>
            By accessing Natours or completing a booking, you agree to these Terms and our Privacy
            Policy. If you do not agree, please discontinue use of the platform.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">2. Role of Natours</h2>
          <p>
            Natours provides a digital storefront and coordination layer for third-party operators
            (&quot;Operators&quot;). Unless expressly stated on your confirmation, the Operator is
            the principal service provider responsible for delivering the tour experience on the
            ground.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            3. Bookings &amp; pricing
          </h2>
          <ul className="list-disc space-y-2 pl-5 marker:text-primary">
            <li>Published prices are per person unless noted otherwise.</li>
            <li>
              Availability is managed by Operators; rare conflicts may require rescheduling or
              refunds in line with Section 5.
            </li>
            <li>
              You must provide accurate traveler information. Misrepresentation may result in
              denied participation without refund.
            </li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            4. Fitness, safety, &amp; conduct
          </h2>
          <p>
            Outdoor activities carry inherent risk. You are responsible for assessing whether a
            tour matches your fitness and medical profile. Operators may remove participants who
            endanger the group or disregard safety instructions.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            5. Changes &amp; cancellations
          </h2>
          <p>
            Cancellation windows, fees, and weather contingencies vary by itinerary. The policy
            that governs your departure is the one presented at checkout and in your confirmation
            email. Where Natours facilitates refunds, processing times may depend on Stripe and your
            card issuer.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            6. Intellectual property
          </h2>
          <p>
            Natours branding, photography, copy, and software are protected by intellectual property
            laws. You may not scrape, resell, or misrepresent our content without written permission.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">7. Disclaimers</h2>
          <p>
            The platform is provided on an &quot;as is&quot; basis to the maximum extent permitted
            by law. Natours disclaims implied warranties where allowable, but nothing in these Terms
            limits statutory rights that cannot legally be waived.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            8. Limitation of liability
          </h2>
          <p>
            To the extent permitted by law, Natours&apos; aggregate liability arising from your use
            of the platform is limited to the amount you paid for the applicable booking in the six
            (6) months preceding the claim. Natours is not liable for indirect or consequential damages.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">9. Governing law</h2>
          <p>
            These Terms are governed by the laws applicable to Natours&apos; operating entity,
            without regard to conflict-of-law principles, except where consumer protection rules in
            your country mandate otherwise.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">10. Contact</h2>
          <p>
            Legal notices:{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="mailto:hello@natours.app">
              hello@natours.app
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
