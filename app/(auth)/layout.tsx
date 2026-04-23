export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-br from-background via-muted/30 to-primary/15 px-4 py-14">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/20 to-transparent blur-3xl"
        aria-hidden
      />
      {children}
    </div>
  );
}
