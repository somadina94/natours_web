import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { siteDescription, siteName } from "@/lib/env";
import { cn } from "@/lib/utils";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Natours",
    "nature tours",
    "adventure travel",
    "guided hikes",
    "small group tours",
    "outdoor experiences",
  ],
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    type: "website",
    url: base,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  alternates: {
    canonical: base,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("min-h-dvh", lato.variable)}>
      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
