"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, TicketPlus } from "lucide-react";
import { toast } from "sonner";
import { createBooking } from "@/lib/api/bookings";
import { getTours } from "@/lib/api/tours";
import { getUsers } from "@/lib/api/users";
import { apiErrorMessage } from "@/lib/api/errors";
import { manualBookingSchema, type ManualBookingInput } from "@/lib/validations/booking";
import type { Tour } from "@/types/tour";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";

export function CreateBookingForm() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const qc = useQueryClient();

  const toursQ = useQuery({
    queryKey: ["tours", "booking-form"],
    queryFn: async () => {
      const res = await getTours({ limit: 300, sort: "name" });
      return res.data.data as Tour[];
    },
  });

  const usersQ = useQuery({
    queryKey: ["users", "admin"],
    queryFn: getUsers,
    enabled: isAdmin,
  });

  const form = useForm<ManualBookingInput>({
    resolver: zodResolver(manualBookingSchema) as Resolver<ManualBookingInput>,
    defaultValues: {
      tour: "",
      user: "",
      price: 497,
      paid: true,
    },
  });

  const mut = useMutation({
    mutationFn: createBooking,
    onSuccess: async () => {
      toast.success("Booking recorded");
      await qc.invalidateQueries({ queryKey: ["bookings", "all"] });
      form.reset({ tour: "", user: "", price: 497, paid: true });
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Could not create booking")),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="tour"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Tour</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={toursQ.isPending ? "Loading tours…" : "Select tour"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(toursQ.data ?? []).map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isAdmin ? (
          <FormField
            control={form.control}
            name="user"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          usersQ.isPending ? "Loading users…" : "Select account"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(usersQ.data ?? []).map((u: User) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="user"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Customer user id</FormLabel>
                <FormControl>
                  <Input placeholder="24-character Mongo ObjectId" {...field} />
                </FormControl>
                <FormDescription>
                  Admins can pick from the directory; lead guides should paste the traveler&apos;s
                  user id (from support tools or the database).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (USD)</FormLabel>
              <FormControl>
                <Input type="number" min={1} step={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Marked as paid</FormLabel>
                <FormDescription>Uncheck for provisional holds you invoice later.</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <Button type="submit" disabled={mut.isPending} className="rounded-full gap-2">
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <TicketPlus className="size-4" aria-hidden />
            )}
            Create booking
          </Button>
        </div>
      </form>
    </Form>
  );
}
