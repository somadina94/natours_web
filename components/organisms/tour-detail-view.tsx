"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarRange,
  CreditCard,
  Flag,
  MapPinned,
  Share2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GradientHeading } from "@/components/atoms/gradient-heading";
import { StarRating } from "@/components/atoms/star-rating";
import { PriceTag } from "@/components/atoms/price-tag";
import { getCheckoutSession } from "@/lib/api/tours";
import type { Tour } from "@/types/tour";
import { useAppSelector } from "@/store/hooks";
import { tourImageSrc } from "@/lib/media";

const TourMap = dynamic(
  () => import("@/components/organisms/tour-map").then((m) => ({ default: m.TourMap })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[min(52vh,520px)] w-full rounded-xl" />,
  },
);

function isRemoteUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

export function TourDetailView({ tour }: { tour: Tour }) {
  const token = useAppSelector((s) => s.auth.token);
  const heroSrc = tourImageSrc(tour.imageCover);
  const heroRemote = isRemoteUrl(heroSrc);
  const galleryImages = (tour.images ?? [])
    .map((x) => String(x).trim())
    .filter(Boolean);

  async function onBook() {
    if (!token) {
      toast.message("Sign in to continue", {
        description: "We need your account to create a secure Stripe checkout session.",
      });
      return;
    }
    try {
      const session = await getCheckoutSession(tour._id);
      const url = session.url;
      if (url) window.location.assign(url);
      else toast.error("Checkout is unavailable right now.");
    } catch {
      toast.error("Could not start checkout. Please try again.");
    }
  }

  return (
    <article className="pb-16">
      <div className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <Button variant="ghost" size="sm" className="gap-2 px-0 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/tours">
                <ArrowLeft className="size-4" aria-hidden />
                All tours
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 rounded-full">
                <Flag className="size-3" aria-hidden />
                {tour.difficulty}
              </Badge>
              <Badge variant="outline" className="gap-1 rounded-full">
                <CalendarRange className="size-3" aria-hidden />
                {tour.duration} days
              </Badge>
              <Badge variant="outline" className="gap-1 rounded-full">
                <Users className="size-3" aria-hidden />
                Up to {tour.maxGroupSize}
              </Badge>
            </div>
            <GradientHeading as="h1" className="text-3xl sm:text-4xl">
              {tour.name}
            </GradientHeading>
            <p className="max-w-2xl text-muted-foreground">{tour.summary}</p>
            <div className="flex flex-wrap items-center gap-4">
              <StarRating value={tour.ratingsAverage} count={tour.ratingsQuantity} />
              <PriceTag amount={tour.price} discount={tour.priceDiscount} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="flex flex-col gap-3 lg:items-end"
          >
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={() => {
                  void navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              >
                <Share2 className="size-4" aria-hidden />
                Share
              </Button>
              <Button size="lg" className="gap-2 rounded-full px-6" onClick={() => void onBook()}>
                <CreditCard className="size-4" aria-hidden />
                Book now
              </Button>
            </div>
            <p className="max-w-xs text-right text-xs text-muted-foreground">
              Secure payment via Stripe. You will receive a confirmation email after purchase.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/60 shadow-lg"
        >
          {heroRemote ? (
            <Image
              src={heroSrc}
              alt={`${tour.name} hero`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              referrerPolicy="no-referrer"
              unoptimized
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heroSrc}
              alt={`${tour.name} hero`}
              className="absolute inset-0 size-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>

        {galleryImages.length > 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
            aria-labelledby="tour-gallery-heading"
          >
            <h2 id="tour-gallery-heading" className="text-lg font-semibold tracking-tight">
              Photo gallery
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {galleryImages.map((raw, i) => {
                  const src = tourImageSrc(raw);
                  const remote = isRemoteUrl(src);
                  return (
                    <figure
                      key={`${i}-${raw.slice(0, 64)}`}
                      className="relative aspect-[4/3] min-h-0 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm"
                    >
                      {remote ? (
                        <Image
                          src={src}
                          alt={`${tour.name} gallery ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          referrerPolicy="no-referrer"
                          unoptimized
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={src}
                          alt={`${tour.name} gallery ${i + 1}`}
                          className="absolute inset-0 size-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </figure>
                  );
                })}
            </div>
          </motion.section>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold tracking-tight">About this experience</h2>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {tour.description ?? tour.summary}
            </p>
            {tour.guides?.length ? (
              <>
                <Separator />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Your guides
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {tour.guides.map((g, i) => (
                    <li
                      key={`${g.name}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3"
                    >
                      {g.photo ? (
                        (() => {
                          const u = tourImageSrc(g.photo);
                          return isRemoteUrl(u) ? (
                            <Image
                              src={u}
                              alt=""
                              width={44}
                              height={44}
                              className="size-11 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                              unoptimized
                            />
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={u}
                              alt=""
                              className="size-11 rounded-full object-cover"
                            />
                          );
                        })()
                      ) : (
                        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {(g.name ?? "?").slice(0, 1)}
                        </span>
                      )}
                      <div>
                        <p className="font-medium leading-none">{g.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{g.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPinned className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="font-medium text-foreground">Kickoff</p>
                  <p>
                    {tour.startLocation?.description ??
                      tour.startLocation?.address ??
                      "Meet your guide at the trailhead listed in your confirmation."}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <Button className="w-full gap-2 rounded-full" size="lg" onClick={() => void onBook()}>
                <CreditCard className="size-4" aria-hidden />
                Book this tour
              </Button>
            </div>
            <TourMap tour={tour} />
          </motion.aside>
        </div>
      </div>
    </article>
  );
}
