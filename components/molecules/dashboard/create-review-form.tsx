"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { createReviewOnTour } from "@/lib/api/reviews";
import { getTours } from "@/lib/api/tours";
import { apiErrorMessage } from "@/lib/api/errors";
import {
  createReviewFormSchema,
  type CreateReviewFormInput,
} from "@/lib/validations/review";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export function CreateReviewForm({ initialTourId }: { initialTourId?: string }) {
  const qc = useQueryClient();
  const toursQ = useQuery({
    queryKey: ["tours", "review-form"],
    queryFn: async () => {
      const res = await getTours({ limit: 300, sort: "name" });
      return res.data.data as Tour[];
    },
  });

  const form = useForm<CreateReviewFormInput>({
    resolver: zodResolver(createReviewFormSchema) as Resolver<CreateReviewFormInput>,
    defaultValues: {
      tourId: "",
      review: "",
      rating: 5,
    },
  });

  useEffect(() => {
    if (!initialTourId || !/^[a-f\d]{24}$/i.test(initialTourId)) return;
    const list = toursQ.data;
    if (!list?.some((t) => t._id === initialTourId)) return;
    const cur = form.getValues("tourId");
    if (cur === initialTourId) return;
    form.setValue("tourId", initialTourId);
  }, [initialTourId, toursQ.data, form]);

  const mut = useMutation({
    mutationFn: async ({ tourId, review, rating }: CreateReviewFormInput) =>
      createReviewOnTour(tourId, { review, rating }),
    onSuccess: async () => {
      toast.success("Review published");
      await qc.invalidateQueries({ queryKey: ["my-reviews"] });
      await qc.invalidateQueries({ queryKey: ["tours"] });
      form.reset({ tourId: "", review: "", rating: 5 });
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Could not post review")),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4 max-w-xl">
        <FormField
          control={form.control}
          name="tourId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tour</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={toursQ.isPending ? "Loading tours…" : "Select a tour"}
                    />
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
              <FormDescription>One review per tour per account.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                value={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} ★
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your experience</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="What stood out about the guides, pacing, and scenery?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mut.isPending} className="rounded-full gap-2">
          {mut.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Star className="size-4" aria-hidden />
          )}
          Post review
        </Button>
      </form>
    </Form>
  );
}
