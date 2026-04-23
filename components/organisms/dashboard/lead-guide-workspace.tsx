"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarRange, Map, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { deleteBooking, getAllBookings } from "@/lib/api/bookings";
import { deleteTour, getTours } from "@/lib/api/tours";
import { tourImageSrc } from "@/lib/media";
import { buildDashboardHref } from "@/lib/dashboard-views";
import type { Booking } from "@/types/booking";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthlyPlanCard } from "@/components/organisms/dashboard/monthly-plan-card";
import { CreateTourForm } from "@/components/molecules/dashboard/create-tour-form";
import { CreateBookingForm } from "@/components/molecules/dashboard/create-booking-form";
import { EditTourForm } from "@/components/molecules/dashboard/edit-tour-form";
import { ProfileUpdateForm } from "@/components/molecules/dashboard/profile-update-form";
import { ChangePasswordForm } from "@/components/molecules/dashboard/change-password-form";

function tourFromBooking(tour: Booking["tour"]) {
  if (tour && typeof tour === "object" && "name" in tour) {
    return tour as { _id: string; name: string; slug?: string };
  }
  return null;
}

export function LeadGuideWorkspace({
  view,
  tourId,
  embedded,
}: {
  view: string;
  tourId?: string;
  embedded?: boolean;
}) {
  const isEmbedded = Boolean(embedded);
  const pathname = usePathname();
  const qc = useQueryClient();

  const needBookings = view === "bookings";
  const needTours = view === "tours" || view === "update-tour";

  const bookingsQ = useQuery({
    queryKey: ["bookings", "all"],
    queryFn: () => getAllBookings({ limit: 200, sort: "-createdAt" }),
    enabled: needBookings,
  });
  const toursQ = useQuery({
    queryKey: ["tours", "ops"],
    queryFn: async () => {
      const res = await getTours({ limit: 200, sort: "name" });
      return res.data.data;
    },
    enabled: needTours,
  });

  const delBooking = useMutation({
    mutationFn: deleteBooking,
    onSuccess: async () => {
      toast.success("Booking removed");
      await qc.invalidateQueries({ queryKey: ["bookings", "all"] });
    },
    onError: () => toast.error("Could not delete booking"),
  });

  const delTour = useMutation({
    mutationFn: deleteTour,
    onSuccess: async () => {
      toast.success("Tour removed");
      await qc.invalidateQueries({ queryKey: ["tours"] });
      await qc.invalidateQueries({ queryKey: ["tours", "ops"] });
    },
    onError: () => toast.error("Could not delete tour"),
  });

  return (
    <div className="space-y-8">
      {!isEmbedded && view === "overview" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-semibold tracking-tight">Lead guide operations</h2>
          <p className="max-w-2xl text-muted-foreground text-sm">
            Manage departures, bookings, and catalog quality. Destructive actions require explicit
            confirmation.
          </p>
        </motion.div>
      ) : null}

      {view === "overview" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Quick href="/tours" icon={Map} title="Live catalog" desc="Preview public pages." />
          <Quick
            href={buildDashboardHref(pathname, "bookings")}
            icon={Users}
            title="Bookings ledger"
            desc="Open the all-bookings table."
          />
        </div>
      ) : null}

      {view === "monthly-plan" ? <MonthlyPlanCard /> : null}

      {view === "profile" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>
              Update your name, email, and profile photo used across dashboard views.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileUpdateForm />
          </CardContent>
        </Card>
      ) : null}

      {view === "password" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Password</CardTitle>
            <CardDescription>Rotate your credentials and keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : null}

      {view === "create-tour" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Create a tour</CardTitle>
            <CardDescription>
              Upload cover and gallery images (B2 required), or paste URLs / bucket keys when you
              are not sending files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTourForm />
          </CardContent>
        </Card>
      ) : null}

      {view === "update-tour" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Update a tour</CardTitle>
            <CardDescription>
              Pick a listing to fetch the latest fields, edit, then save. URLs from the API are
              fine to round-trip.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {toursQ.isPending ? (
              <Skeleton className="h-40 w-full rounded-xl" />
            ) : !toursQ.data?.length ? (
              <p className="text-sm text-muted-foreground">No tours to edit yet.</p>
            ) : (
              <EditTourForm tours={toursQ.data} initialTourId={tourId} />
            )}
          </CardContent>
        </Card>
      ) : null}

      {view === "create-booking" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Record a manual booking</CardTitle>
            <CardDescription>
              Phone or partner reservations that bypassed Stripe checkout still belong in the
              ledger.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateBookingForm />
          </CardContent>
        </Card>
      ) : null}

      {view === "bookings" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5 text-primary" aria-hidden />
              All bookings
            </CardTitle>
            <CardDescription>Every paid reservation across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsQ.isPending ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : bookingsQ.isError ? (
              <p className="text-sm text-destructive">Unable to load bookings.</p>
            ) : !bookingsQ.data?.length ? (
              <p className="text-sm text-muted-foreground">No bookings found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">When</TableHead>
                    <TableHead className="w-[90px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingsQ.data.map((b) => {
                    const t = tourFromBooking(b.tour);
                    return (
                      <TableRow key={b._id}>
                        <TableCell className="font-medium">
                          {t?.slug ? (
                            <Link
                              href={`/tours/${t.slug}`}
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              {t.name}
                            </Link>
                          ) : (
                            (t?.name ?? "Tour")
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">${b.price}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label="Delete booking"
                            disabled={delBooking.isPending}
                            onClick={() => {
                              if (confirm("Delete this booking permanently?")) {
                                void delBooking.mutateAsync(b._id);
                              }
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
      ) : null}

      {view === "tours" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarRange className="size-5 text-primary" aria-hidden />
              Tour catalog (ops)
            </CardTitle>
            <CardDescription>
              Retire stale listings or jump into update mode for a row.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {toursQ.isPending ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : toursQ.isError ? (
              <p className="text-sm text-destructive">Unable to load tours.</p>
            ) : !toursQ.data?.length ? (
              <p className="text-sm text-muted-foreground">No tours.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[160px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toursQ.data.map((tour: Tour) => (
                    <TableRow key={tour._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 overflow-hidden rounded-lg bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={tourImageSrc(tour.imageCover)}
                              alt=""
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/tours/${tour.slug}`}
                              className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {tour.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">{tour.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{tour.difficulty}</TableCell>
                      <TableCell className="text-right tabular-nums">${tour.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button size="sm" variant="secondary" className="rounded-full" asChild>
                            <Link href={`/tours/${tour.slug}`}>View</Link>
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full" asChild>
                            <Link
                              href={buildDashboardHref(pathname, "update-tour", {
                                tour: tour._id,
                              })}
                              scroll={false}
                            >
                              Update
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            disabled={delTour.isPending}
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete “${tour.name}”? This cannot be undone for guests.`,
                                )
                              ) {
                                void delTour.mutateAsync(tour._id);
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Quick({
  href,
  title,
  desc,
  icon: Icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: typeof Map;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <Icon className="size-5 text-primary" aria-hidden />
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="rounded-full" variant="outline">
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
