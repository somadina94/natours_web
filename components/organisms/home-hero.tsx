"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map, ShieldCheck, Sparkles, Trees } from "lucide-react";
import { GradientHeading } from "@/components/atoms/gradient-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HomeHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-border/60 bg-linear-to-b from-background via-background to-muted/40"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[#7dd56f]/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Sparkles className="size-3.5" aria-hidden />
              Modern classic adventures
            </Badge>
          </motion.div>
          <GradientHeading as="h1" className="text-3xl sm:text-4xl lg:text-5xl" id="hero-heading">
            Outdoors, elevated
          </GradientHeading>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Discover hand-crafted itineraries, cinematic landscapes, and guides who
            live for the trail — all in one calm, futuristic booking experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="flex flex-wrap gap-3"
          >
            <Button size="lg" className="gap-2 rounded-full px-6" asChild>
              <Link href="/tours">
                <Map className="size-4" aria-hidden />
                Browse tours
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 rounded-full px-6" asChild>
              <Link href="/#featured">
                <Trees className="size-4" aria-hidden />
                See highlights
              </Link>
            </Button>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
            className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground"
          >
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              Vetted operators
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Small groups
            </li>
          </motion.ul>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md lg:max-w-sm"
        >
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Live pulse
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">Routes in motion</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Every tour page opens with an interactive map, rich metadata, and a
              checkout flow tuned for clarity.
            </p>
            <div className="mt-6 grid gap-3 rounded-2xl bg-muted/50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. group</span>
                <span className="font-medium">10 explorers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Guide ratio</span>
                <span className="font-medium">1 : 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Support</span>
                <span className="font-medium">24/7 concierge</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
