"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthBackLink() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      <Button variant="ghost" size="sm" className="gap-2 px-0 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden />
          <Home className="size-4" aria-hidden />
          Back to home
        </Link>
      </Button>
    </motion.div>
  );
}
