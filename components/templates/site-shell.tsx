"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <>
      {isDashboardRoute ? null : <SiteHeader />}
      <main
        id="main-content"
        className="flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        tabIndex={-1}
      >
        {children}
      </main>
      {isDashboardRoute ? null : <SiteFooter />}
    </>
  );
}
