"use client";

import { useQuery } from "@tanstack/react-query";
import { getTours } from "@/lib/api/tours";

export function useTours(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["tours", params ?? {}],
    queryFn: async () => {
      const res = await getTours(params);
      return res.data.data;
    },
  });
}
