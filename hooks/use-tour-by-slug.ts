"use client";

import { useQuery } from "@tanstack/react-query";
import { getTourBySlug } from "@/lib/api/tours";

export function useTourBySlug(slug: string) {
  return useQuery({
    queryKey: ["tour", slug],
    queryFn: () => getTourBySlug(slug),
    enabled: Boolean(slug),
  });
}
