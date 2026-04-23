"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const TOKEN_KEY = "natours_token";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [gate, setGate] = useState<"unknown" | "in" | "out">("unknown");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const t =
        typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      setGate(t ? "in" : "out");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (gate !== "out") return;
    const qs =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : null;
    const next = qs ?? pathname;
    const q = next && next !== "/login" ? `?next=${encodeURIComponent(next)}` : "";
    router.replace(`/login${q}`);
  }, [gate, pathname, router]);

  if (gate === "unknown") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm"
        >
          Checking your session…
        </motion.p>
      </div>
    );
  }

  if (gate === "out") return null;

  return <>{children}</>;
}
