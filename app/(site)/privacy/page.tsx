import { Shield } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How Natours collects, uses, and protects your personal information when you use our website and services.",
  path: "/privacy",
  keywords: ["privacy", "data protection", "Natours", "cookies", "GDPR"],
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Shield className="size-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
          <p className="text-sm text-muted-foreground">Last updated April 22, 2026</p>
        </div>
      </div>
      <article className="max-w-none space-y-10 text-[0.95rem] leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">1. Who we are</h2>
          <p>
            Natours (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates this website and the adventure
            booking experiences described on it. This policy explains what data we collect, why we
            collect it, and the choices you have.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            2. Information we collect
          </h2>
          <ul className="list-disc space-y-2 pl-5 marker:text-primary">
            <li>
              <strong className="text-foreground">Account details</strong> — name, email address, and
              credentials you provide when you register or log in.
            </li>
            <li>
              <strong className="text-foreground">Booking &amp; payment data</strong> — tour
              selections, Stripe checkout metadata, and confirmation details required to fulfill your
              purchase. Card numbers are handled exclusively by Stripe; we do not store full card
              data on our servers.
            </li>
            <li>
              <strong className="text-foreground">Usage &amp; device data</strong> — standard web
              logs, approximate location derived from IP for fraud prevention, and analytics events
              that help us improve performance and accessibility.
            </li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            3. How we use information
          </h2>
          <p>We process personal data to:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-primary">
            <li>authenticate users and secure sessions;</li>
            <li>process payments, send confirmations, and coordinate operators;</li>
            <li>provide customer support and safety-critical notifications;</li>
            <li>detect abuse, protect our platform, and comply with legal obligations.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            4. Sharing &amp; subprocessors
          </h2>
          <p>
            We share data with service providers who help us run Natours — for example payment
            processors (Stripe), email delivery, cloud hosting, and error monitoring. Each vendor is
            bound by contractual confidentiality and may only use data for the services they provide
            to us.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">5. Retention</h2>
          <p>
            We retain account and booking records for as long as your account is active and as needed
            to comply with tax, audit, and legal requirements. Marketing preferences can be updated at
            any time from your profile (when available) or by contacting support.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">6. Your rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete, export,
            or restrict processing of your personal data. To exercise these rights, email
            hello@natours.app with the subject line &quot;Privacy Request&quot; and we will respond
            within the timelines required by law.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            7. International transfers
          </h2>
          <p>
            Natours may process data in countries where we or our vendors operate. When we transfer
            personal data across borders, we rely on appropriate safeguards such as standard
            contractual clauses approved by regulators.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">8. Contact</h2>
          <p>
            Questions about this policy? Reach us at{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="mailto:hello@natours.app">
              hello@natours.app
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
