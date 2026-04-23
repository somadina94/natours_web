"use client";

import Link from "next/link";
import { Mountain } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/env";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight text-lg",
        className,
      )}
      aria-label={`${siteName} home`}
    >
      <motion.span
        className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-[#7dd56f] to-[#28b487] text-white shadow-md shadow-primary/25"
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Mountain className="size-5" aria-hidden />
      </motion.span>
      <span className="bg-linear-to-r from-[#7dd56f] to-[#28b487] bg-clip-text text-transparent">
        {siteName}
      </span>
    </Link>
  );
}
