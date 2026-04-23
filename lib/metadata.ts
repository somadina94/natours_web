import type { Metadata } from "next";
import { siteDescription, siteName } from "@/lib/env";

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const desc = description ?? siteDescription;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const canonical = path ? `${base}${path}` : base;
  const ogTitle = title === siteName ? title : `${title} | ${siteName}`;
  return {
    title,
    description: desc,
    keywords: keywords?.length ? keywords : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
    metadataBase: new URL(base),
    openGraph: {
      title: ogTitle,
      description: desc,
      siteName,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
    },
    alternates: {
      canonical,
    },
  };
}
