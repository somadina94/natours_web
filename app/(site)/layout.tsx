import { SiteShell } from "@/components/templates/site-shell";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteShell>{children}</SiteShell>
    </div>
  );
}
