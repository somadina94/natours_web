"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useDashboardView(allowedIds: readonly string[], defaultView = "overview") {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("view");
  const tour = searchParams.get("tour");
  const queryString = searchParams.toString();

  const view = useMemo(() => {
    if (raw && allowedIds.includes(raw)) return raw;
    return defaultView;
  }, [raw, allowedIds, defaultView]);

  useEffect(() => {
    if (raw && allowedIds.includes(raw)) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("view", defaultView);
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [raw, allowedIds, defaultView, pathname, queryString, router, searchParams]);

  return {
    view,
    tourId: tour && /^[a-f\d]{24}$/i.test(tour) ? tour : undefined,
  };
}
