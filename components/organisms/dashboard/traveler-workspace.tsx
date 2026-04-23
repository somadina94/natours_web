"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CreditCard,
  MessageSquare,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { getMyBookings } from "@/lib/api/bookings";
import { deleteReview, getMyReviews } from "@/lib/api/reviews";
import type { Booking } from "@/types/booking";
import type { Review } from "@/types/review";
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
import { Badge } from "@/components/ui/badge";
import { ChangePasswordForm } from "@/components/molecules/dashboard/change-password-form";
import { CreateReviewForm } from "@/components/molecules/dashboard/create-review-form";
import { ProfileUpdateForm } from "@/components/molecules/dashboard/profile-update-form";
import { MonthlyPlanCard } from "@/components/organisms/dashboard/monthly-plan-card";
import { GUIDE_VIEW_IDS, USER_VIEW_IDS } from "@/lib/dashboard-view-ids";
import { buildDashboardHref } from "@/lib/dashboard-views";
import { useDashboardView } from "@/hooks/use-dashboard-view";

function tourFromBooking(tour: Booking["tour"]) {
  if (tour && typeof tour === "object" && "name" in tour) {
    return tour as { _id: string; name: string; slug?: string; imageCover?: string };
  }
  return null;
}

function tourFromReview(tour: Review["tour"]) {
  if (tour && typeof tour === "object" && "name" in tour) {
    return tour as { _id: string; name: string; slug?: string };
  }
  return null;
}

export function TravelerWorkspace({
  mode,
  showTitle = true,
}: {
  mode: "user" | "guide";
  showTitle?: boolean;
}) {
  const pathname = usePathname();
  const ids = mode === "user" ? USER_VIEW_IDS : GUIDE_VIEW_IDS;
  const { view, tourId } = useDashboardView(ids);
  const canPostReview = mode === "user";

  const qc = useQueryClient();
  const needBookings = view === "bookings";
  const needReviews = view === "reviews" || view === "write-review";

  const bookingsQ = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
    enabled: needBookings,
  });
  const reviewsQ = useQuery({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
    enabled: needReviews,
  });

  const delReview = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => {
      toast.success("Review removed");
      await qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
    onError: () => toast.error("Could not delete review"),
  });

  return (
    <div className="space-y-8">
      {showTitle && view === "overview" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            {mode === "guide" ? "Field guide workspace" : "Traveler workspace"}
          </h2>
          <p className="max-w-2xl text-muted-foreground text-sm">
            {mode === "guide"
              ? "Operational calendars plus the same traveler tools you use off-duty."
              : "Book new adventures, track purchases, and curate the stories you share after each trip."}
          </p>
        </motion.div>
      ) : null}

      {view === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            href="/tours"
            icon={Sparkles}
            title="Browse tours"
            desc="Filter by difficulty, compare prices, and launch checkout."
          />
          <QuickAction
            href="/#featured"
            icon={CreditCard}
            title="Featured picks"
            desc="Jump to curated departures with the highest ratings."
          />
          <QuickAction
            href={buildDashboardHref(pathname, "reviews")}
            icon={MessageSquare}
            title="Your reviews"
            desc="Manage feedback you have published across itineraries."
          />
        </div>
      ) : null}

      {view === "monthly-plan" && mode === "guide" ? <MonthlyPlanCard /> : null}

      {view === "profile" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="size-5 text-primary" aria-hidden />
              Profile
            </CardTitle>
            <CardDescription>
              Name and email sync across devices as soon as you save.
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
            <CardDescription>
              Rotating credentials issues a fresh token for this browser session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : null}

      {view === "write-review" && canPostReview ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Write a review</CardTitle>
            <CardDescription>
              Share feedback on tours you have experienced. One review per tour per account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateReviewForm initialTourId={tourId} />
          </CardContent>
        </Card>
      ) : null}

      {view === "bookings" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">My bookings</CardTitle>
            <CardDescription>Confirmed Stripe checkouts tied to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsQ.isPending ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : bookingsQ.isError ? (
              <p className="text-sm text-destructive">Unable to load bookings.</p>
            ) : !bookingsQ.data?.length ? (
              <p className="text-sm text-muted-foreground">
                No bookings yet — explore{" "}
                <Link className="text-primary underline-offset-4 hover:underline" href="/tours">
                  live departures
                </Link>
                .
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Booked</TableHead>
                    <TableHead />
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
                              className="text-primary underline-offset-4 hover:underline"
                              href={`/tours/${t.slug}`}
                            >
                              {t.name}
                            </Link>
                          ) : (
                            (t?.name ?? "Tour")
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">${b.price}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {t?.slug ? (
                            <Button size="sm" variant="secondary" className="rounded-full" asChild>
                              <Link href={`/tours/${t.slug}`}>View</Link>
                            </Button>
                          ) : null}
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

      {view === "reviews" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">My reviews</CardTitle>
            <CardDescription>Delete a review if your plans changed.</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewsQ.isPending ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : reviewsQ.isError ? (
              <p className="text-sm text-destructive">Unable to load reviews.</p>
            ) : !reviewsQ.data?.length ? (
              <p className="text-sm text-muted-foreground">
                You have not published a review yet. Open any tour and share your experience.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Excerpt</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewsQ.data.map((r) => {
                    const t = tourFromReview(r.tour);
                    return (
                      <TableRow key={r._id}>
                        <TableCell className="font-medium">
                          {t?.slug ? (
                            <Link
                              className="text-primary underline-offset-4 hover:underline"
                              href={`/tours/${t.slug}`}
                            >
                              {t.name}
                            </Link>
                          ) : (
                            (t?.name ?? "Tour")
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{r.rating} ★</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                          {r.review}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label="Delete review"
                            disabled={delReview.isPending}
                            onClick={() => {
                              if (confirm("Remove this review permanently?")) {
                                void delReview.mutateAsync(r._id);
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

      {view === "overview" ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Session</CardTitle>
            <CardDescription>
              Switch accounts or invite friends from the marketing signup.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/login">Switch account</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/signup">Invite a friend</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function QuickAction({
  href,
  title,
  desc,
  icon: Icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: typeof Sparkles;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader>
          <Icon className="size-5 text-primary" aria-hidden />
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="rounded-full" variant="secondary" asChild>
            <Link href={href}>Go</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
