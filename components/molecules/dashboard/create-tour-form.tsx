"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { createTour } from "@/lib/api/tours";
import { apiErrorMessage } from "@/lib/api/errors";
import {
  createTourFormSchema,
  createTourPayload,
  type CreateTourFormInput,
} from "@/lib/validations/tour";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
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
import {
  TourMediaFields,
  type TourGalleryEntry,
} from "@/components/molecules/dashboard/tour-media-fields";
import { appendTourJsonToFormData } from "@/lib/tour-multipart";

export function CreateTourForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<TourGalleryEntry[]>([]);

  const coverObjectUrl = useMemo(() => {
    if (!coverFile) return null;
    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    const u = coverObjectUrl;
    if (!u) return;
    return () => URL.revokeObjectURL(u);
  }, [coverObjectUrl]);

  const form = useForm<CreateTourFormInput>({
    resolver: zodResolver(createTourFormSchema) as Resolver<CreateTourFormInput>,
    defaultValues: {
      name: "",
      duration: 5,
      maxGroupSize: 12,
      difficulty: "medium",
      price: 497,
      priceDiscount: undefined,
      summary: "",
      description: "",
      imageCover: "",
      startDatesText: "",
    },
  });
  const coverUrl = useWatch({ control: form.control, name: "imageCover" }) ?? "";

  type CreateTourMutate = {
    values: CreateTourFormInput;
    gallery: TourGalleryEntry[];
    coverFile: File | null;
  };

  const mut = useMutation({
    mutationFn: async ({ values, gallery: gSnap, coverFile: coverSnap }: CreateTourMutate) => {
      const urlGallery = gSnap
        .filter((g): g is TourGalleryEntry & { kind: "url" } => g.kind === "url")
        .map((g) => g.url);
      const fileGallery = gSnap.filter(
        (g): g is TourGalleryEntry & { kind: "file" } => g.kind === "file",
      );
      const hasMultipart = Boolean(coverSnap || fileGallery.length);

      if (!coverSnap && !(values.imageCover?.trim() ?? "")) {
        throw new Error("Add a cover image file or paste a cover image URL / storage key.");
      }

      if (hasMultipart) {
        const payload = createTourPayload({
          ...values,
          imageCover: coverSnap ? "" : values.imageCover,
        }) as Record<string, unknown>;
        if (coverSnap) delete payload.imageCover;
        const fd = new FormData();
        appendTourJsonToFormData(fd, payload);
        fd.append("imagesKeep", JSON.stringify(urlGallery));
        for (const g of fileGallery) {
          fd.append("images", g.file, g.file.name || "image.jpg");
        }
        if (coverSnap) fd.append("imageCover", coverSnap, coverSnap.name || "cover.jpg");
        else if (values.imageCover?.trim()) fd.append("imageCover", values.imageCover.trim());
        return createTour(fd);
      }

      return createTour(
        createTourPayload(values, urlGallery) as Record<string, unknown>,
      );
    },
    onSuccess: async (tour) => {
      toast.success("Tour created");
      await qc.invalidateQueries({ queryKey: ["tours"] });
      await qc.invalidateQueries({ queryKey: ["tours", "ops"] });
      form.reset();
      setGallery([]);
      setCoverFile(null);
      if (tour.slug) router.push(`/tours/${tour.slug}`);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : apiErrorMessage(e, "Could not create tour")),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => mut.mutate({ values: v, gallery, coverFile }))}
        className="grid gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Name (10–40 characters)</FormLabel>
              <FormControl>
                <Input placeholder="The Forest Hiker" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (days)</FormLabel>
              <FormControl>
                <Input type="number" min={1} step={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxGroupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max group size</FormLabel>
              <FormControl>
                <Input type="number" min={1} step={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="difficult">Difficult</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="priceDiscount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price discount (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="Leave empty if none"
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? undefined : Number(v));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Short marketing blurb" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Full itinerary copy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2">
          <TourMediaFields
            coverUrl={coverUrl}
            onCoverUrlChange={(v) => form.setValue("imageCover", v, { shouldDirty: true })}
            coverFile={coverFile}
            onCoverFileChange={setCoverFile}
            coverPreviewObjectUrl={coverObjectUrl}
            gallery={gallery}
            onGalleryChange={setGallery}
            disabled={mut.isPending}
          />
        </div>

        <FormField
          control={form.control}
          name="startDatesText"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Start dates (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder={"2026-06-01\n2026-07-15"}
                  {...field}
                />
              </FormControl>
              <p className="text-muted-foreground text-xs">
                ISO dates, one per line or comma-separated.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <Button type="submit" disabled={mut.isPending} className="rounded-full gap-2">
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <PlusCircle className="size-4" aria-hidden />
            )}
            Create tour
          </Button>
        </div>
      </form>
    </Form>
  );
}
