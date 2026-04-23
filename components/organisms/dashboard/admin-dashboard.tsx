"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Crown, DollarSign, Receipt, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { getAllBookings } from "@/lib/api/bookings";
import { getTours } from "@/lib/api/tours";
import { deleteUser, getUsers, updateUser } from "@/lib/api/users";
import type { User } from "@/types/user";
import { LeadGuideWorkspace } from "@/components/organisms/dashboard/lead-guide-workspace";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAppSelector } from "@/store/hooks";
import { ADMIN_VIEW_IDS } from "@/lib/dashboard-view-ids";
import { buildDashboardHref } from "@/lib/dashboard-views";
import { usePathname } from "next/navigation";
import { useDashboardView } from "@/hooks/use-dashboard-view";

const roles = ["user", "guide", "lead-guide", "admin"] as const;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const bookingsChartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function AdminDashboard() {
  const pathname = usePathname();
  const { view, tourId } = useDashboardView(ADMIN_VIEW_IDS);
  const me = useAppSelector((s) => s.auth.user);
  const qc = useQueryClient();

  const usersQ = useQuery({
    queryKey: ["users", "admin"],
    queryFn: getUsers,
    enabled: view === "directory" || view === "overview",
  });
  const toursOverviewQ = useQuery({
    queryKey: ["tours", "admin", "overview"],
    queryFn: async () => {
      const res = await getTours({ limit: 500, sort: "-createdAt" });
      return res.data.data;
    },
    enabled: view === "overview",
  });
  const bookingsOverviewQ = useQuery({
    queryKey: ["bookings", "admin", "overview"],
    queryFn: () => getAllBookings({ limit: 500, sort: "-createdAt" }),
    enabled: view === "overview",
  });

  const patchRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUser(id, { role }),
    onSuccess: async () => {
      toast.success("Role updated");
      await qc.invalidateQueries({ queryKey: ["users", "admin"] });
    },
    onError: () => toast.error("Could not update role"),
  });

  const removeUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      toast.success("User removed");
      await qc.invalidateQueries({ queryKey: ["users", "admin"] });
    },
    onError: () => toast.error("Could not delete user"),
  });

  if (view === "directory") {
    return (
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="size-5 text-primary" aria-hidden />
            Team directory
          </CardTitle>
          <CardDescription>Invite colleagues via signup, then tune roles from here.</CardDescription>
        </CardHeader>
        <CardContent>
          {usersQ.isPending ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : usersQ.isError ? (
            <p className="text-sm text-destructive">Unable to load users.</p>
          ) : !usersQ.data?.length ? (
            <p className="text-sm text-muted-foreground">No users returned.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[120px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQ.data.map((u: User) => {
                  const isSelf = me?._id === u._id;
                  return (
                    <TableRow key={u._id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                      <TableCell>
                        <Select
                          value={String(u.role)}
                          disabled={isSelf || patchRole.isPending}
                          onValueChange={(role) => {
                            void patchRole.mutateAsync({ id: u._id, role });
                          }}
                        >
                          <SelectTrigger className="h-9 w-[140px] capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r} value={r} className="capitalize">
                                {r.replace("-", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          disabled={isSelf || removeUser.isPending}
                          aria-label="Delete user"
                          onClick={() => {
                            if (
                              isSelf ||
                              !confirm(`Permanently delete ${u.email}? This cannot be undone.`)
                            ) {
                              return;
                            }
                            void removeUser.mutateAsync(u._id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }

  if (view === "overview") {
    const usersCount = usersQ.data?.length ?? 0;
    const toursCount = toursOverviewQ.data?.length ?? 0;
    const bookingsCount = bookingsOverviewQ.data?.length ?? 0;
    const paidRevenue = (bookingsOverviewQ.data ?? [])
      .filter((b) => b.paid)
      .reduce((sum, b) => sum + Number(b.price || 0), 0);
    const metricsLoading = usersQ.isPending || toursOverviewQ.isPending || bookingsOverviewQ.isPending;
    const metricValue = (v: string) => (metricsLoading ? "—" : v);
    const dailyBookings = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      return { key, label, bookings: 0 };
    });
    for (const booking of bookingsOverviewQ.data ?? []) {
      if (!booking.createdAt) continue;
      const dayKey = new Date(booking.createdAt).toISOString().slice(0, 10);
      const day = dailyBookings.find((entry) => entry.key === dayKey);
      if (day) day.bookings += 1;
    }
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-semibold tracking-tight">Administrator control room</h2>
          <p className="max-w-2xl text-muted-foreground text-sm">
            Full visibility across people, bookings, and tours. Use destructive tools carefully —
            they hit the same production API as mobile clients.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardDescription>Total users</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="size-5 text-primary" aria-hidden />
                {metricValue(String(usersCount))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardDescription>Total tours</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="size-5 text-primary" aria-hidden />
                {metricValue(String(toursCount))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardDescription>Total bookings</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Receipt className="size-5 text-primary" aria-hidden />
                {metricValue(String(bookingsCount))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardDescription>Paid revenue</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <DollarSign className="size-5 text-primary" aria-hidden />
                {metricValue(money.format(paidRevenue))}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Bookings in the last 7 days</CardTitle>
            <CardDescription>Quick volume pulse across the last week.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsOverviewQ.isPending ? (
              <Skeleton className="h-40 w-full rounded-xl" />
            ) : bookingsOverviewQ.isError ? (
              <p className="text-sm text-destructive">Unable to load booking trend.</p>
            ) : (
              <ChartContainer config={bookingsChartConfig} className="h-44 w-full">
                <BarChart data={dailyBookings} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Bar
                    dataKey="bookings"
                    fill="var(--color-bookings)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Team directory</CardTitle>
              <CardDescription>Roles, invites, and account hygiene.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="rounded-full" variant="secondary">
                <Link href={buildDashboardHref(pathname, "directory")}>Open directory</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Catalog & ledger</CardTitle>
              <CardDescription>Same lead-guide tools, scoped to your session.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="rounded-full" variant="secondary">
                <Link href={buildDashboardHref(pathname, "create-tour")}>Create a tour</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 text-primary" aria-hidden />
          Need another admin? Promote from{" "}
          <Link className="text-primary underline-offset-4 hover:underline" href="/signup">
            signup
          </Link>{" "}
          then bump the role in the directory.
        </div>
      </div>
    );
  }

  return <LeadGuideWorkspace embedded view={view} tourId={tourId} />;
}
