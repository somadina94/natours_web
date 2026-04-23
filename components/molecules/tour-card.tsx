"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Flag, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconMeta } from "@/components/atoms/icon-meta";
import { PriceTag } from "@/components/atoms/price-tag";
import { StarRating } from "@/components/atoms/star-rating";
import type { Tour } from "@/types/tour";
import { tourImageSrc } from "@/lib/media";

export function TourCard({
  tour,
  index = 0,
}: {
  tour: Tour;
  index?: number;
}) {
  const href = `/tours/${tour.slug}`;
  const nextStart = tour.startDates?.[0]
    ? new Date(tour.startDates[0]).toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "Dates TBA";
  const stops = tour.locations?.length ?? 0;
  const coverSrc = tourImageSrc(tour.imageCover);
  const coverRemote = /^https?:\/\//i.test(coverSrc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-xl">
        <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-xl">
          <div className="relative aspect-[4/3] overflow-hidden">
            <div
              className="absolute inset-0 z-10 bg-linear-to-t from-black/55 via-black/10 to-transparent"
              aria-hidden
            />
            {coverRemote ? (
              <Image
                src={coverSrc}
                alt={`${tour.name} tour cover`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element -- local or legacy relative paths */
              <img
                src={coverSrc}
                alt={`${tour.name} tour cover`}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute bottom-3 right-3 z-20 max-w-[78%] text-right">
              <h3 className="text-lg font-semibold uppercase tracking-wide text-white drop-shadow-md">
                <span className="rounded-md bg-white/10 px-2 py-1 backdrop-blur-sm">
                  {tour.name}
                </span>
              </h3>
            </div>
          </div>
        </Link>
        <CardContent className="space-y-4 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Flag className="size-3" aria-hidden />
              {tour.difficulty}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <CalendarDays className="size-3" aria-hidden />
              {tour.duration} days
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{tour.summary}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <IconMeta icon={MapPin}>
              {tour.startLocation?.description ??
                tour.startLocation?.address ??
                "Wilderness"}
            </IconMeta>
            <IconMeta icon={CalendarDays}>{nextStart}</IconMeta>
            <IconMeta icon={Flag}>
              {stops} {stops === 1 ? "stop" : "stops"}
            </IconMeta>
            <IconMeta icon={Users}>
              Max {tour.maxGroupSize} explorers
            </IconMeta>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-end justify-between gap-4 border-t bg-muted/30 px-6 py-4">
          <PriceTag amount={tour.price} />
          <div className="flex flex-col items-end gap-2">
            <StarRating value={tour.ratingsAverage} count={tour.ratingsQuantity} />
            <Button asChild size="sm" className="rounded-full">
              <Link href={href}>Details</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
