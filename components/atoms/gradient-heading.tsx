"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GradientHeading({
  as: Comp = "h1",
  className,
  children,
  id,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Comp
        id={id}
        className={cn(
          "bg-linear-to-r from-[#7dd56f] to-[#28b487] bg-clip-text font-bold uppercase tracking-[0.12em] text-transparent",
          className,
        )}
      >
        {children}
      </Comp>
    </motion.div>
  );
}
