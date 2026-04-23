"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getTourById, updateTour } from "@/lib/api/tours";
import { apiErrorMessage } from "@/lib/api/errors";
import {
  patchTourBody,
  patchTourFormSchema,
  type PatchTourFormInput,
} from "@/lib/validations/tour";
import type { Tour } from "@/types/tour";
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

const emptyDefaults: PatchTourFormInput = {
  tourId: "",
  name: "",
  duration: undefined,
  maxGroupSize: undefined,
  difficulty: undefined,
  price: undefined,
  priceDiscount: undefined,
  summary: "",
  description: "",
  imageCover: "",
  imagesText: "",
  startDatesText: "",
};

export function EditTourForm({
  tours,
  initialTourId,
}: {
  tours: Tour[];
  initialTourId?: string;
}) {
  const qc = useQueryClient();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<TourGalleryEntry[]>([]);
  const urlPrefillDone = useRef<string | null>(null);
  /** Avoid treating first load as a “tour switch”. */
  const previousTourIdRef = useRef<string | null>(null);
  const coverFileRef = useRef(coverFile);
  const galleryRef = useRef(gallery);

  useLayoutEffect(() => {
    coverFileRef.current = coverFile;
  }, [coverFile]);

  useLayoutEffect(() => {
    galleryRef.current = gallery;
  }, [gallery]);

  const coverObjectUrl = useMemo(() => {
    if (!coverFile) return null;
    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    const u = coverObjectUrl;
    if (!u) return;
    return () => URL.revokeObjectURL(u);
  }, [coverObjectUrl]);
  const form = useForm<PatchTourFormInput>({
    resolver: zodResolver(patchTourFormSchema) as Resolver<PatchTourFormInput>,
    defaultValues: emptyDefaults,
  });

  const tourId = useWatch({ control: form.control, name: "tourId" }) ?? "";
  const coverUrl = useWatch({ control: form.control, name: "imageCover" }) ?? "";

  useEffect(() => {
    if (!tourId) previousTourIdRef.current = null;
  }, [tourId]);

  useEffect(() => {
    if (!initialTourId || !/^[a-f\d]{24}$/i.test(initialTourId)) {
      urlPrefillDone.current = null;
      return;
    }
    if (!tours.some((t) => t._id === initialTourId)) return;
    if (urlPrefillDone.current === initialTourId) return;
    form.setValue("tourId", initialTourId);
    urlPrefillDone.current = initialTourId;
  }, [initialTourId, tours, form]);
  const tourQ = useQuery({
    queryKey: ["tour", "by-id", tourId],
    queryFn: () => getTourById(tourId),
    enabled: Boolean(tourId && /^[a-f\d]{24}$/i.test(tourId)),
  });

  useEffect(() => {
    const t = tourQ.data;
    if (!t || t._id !== tourId) return;

    const switchedTour =
      previousTourIdRef.current !== null &&
      previousTourIdRef.current !== tourId;
    previousTourIdRef.current = tourId;

    const frame = requestAnimationFrame(() => {
      const dirtyMedia =
        coverFileRef.current ||
        galleryRef.current.some((g) => g.kind === "file");

      if (switchedTour) {
        setCoverFile(null);
      }

      setGallery((prev) => {
        if (!switchedTour && prev.some((g) => g.kind === "file")) {
          return prev;
        }
        return (t.images ?? []).map((url) => ({
          key:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `u-${String(url).slice(0, 24)}`,
          kind: "url" as const,
          url,
        }));
      });

      if (switchedTour || !dirtyMedia) {
        form.reset({
          tourId: t._id,
          name: t.name,
          duration: t.duration,
          maxGroupSize: t.maxGroupSize,
          difficulty: t.difficulty,
          price: t.price,
          priceDiscount: t.priceDiscount,
          summary: t.summary,
          description: t.description ?? "",
          imageCover: t.imageCover ?? "",
          imagesText: (t.images ?? []).join("\n"),
          startDatesText: (t.startDates ?? [])
            .map((d) => {
              try {
                return new Date(d).toISOString().slice(0, 10);
              } catch {
                return String(d);
              }
            })
            .join("\n"),
        });
      }
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourQ.data, tourId]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const lines = gallery
        .filter((g): g is TourGalleryEntry & { kind: "url" } => g.kind === "url")
        .map((g) => g.url);
      form.setValue("imagesText", lines.join("\n"));
    });
    return () => cancelAnimationFrame(frame);
  }, [gallery, form]);

  type EditTourMutate = {
    values: PatchTourFormInput;
    gallery: TourGalleryEntry[];
    coverFile: File | null;
  };

  const mut = useMutation({
    mutationFn: async ({ values, gallery: gSnap, coverFile: coverSnap }: EditTourMutate) => {
      const urlKeep = gSnap
        .filter((e): e is TourGalleryEntry & { kind: "url" } => e.kind === "url")
        .map((e) => e.url);
      const newFiles = gSnap.filter(
        (e): e is TourGalleryEntry & { kind: "file" } => e.kind === "file",
      );
      const hasMultipart = Boolean(coverSnap || newFiles.length);

      const body = patchTourBody(values);
      if (Object.keys(body).length === 0 && !hasMultipart) {
        throw new Error("Change at least one field besides the tour pick.");
      }

      if (hasMultipart) {
        const fd = new FormData();
        const jsonBody = { ...body } as Record<string, unknown>;
        delete jsonBody.images;
        if (coverSnap) delete jsonBody.imageCover;
        appendTourJsonToFormData(fd, jsonBody);
        fd.append("imagesKeep", JSON.stringify(urlKeep));
        for (const g of newFiles) {
          fd.append("images", g.file, g.file.name || "image.jpg");
        }
        if (coverSnap) fd.append("imageCover", coverSnap, coverSnap.name || "cover.jpg");
        return updateTour(values.tourId, fd);
      }

      return updateTour(values.tourId, body);
    },
    onSuccess: async (updated: Tour, { values }: EditTourMutate) => {
      toast.success("Tour updated");
      setCoverFile(null);
      setGallery(
        (updated.images ?? []).map((url) => ({
          key:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `u-${String(url).slice(0, 24)}`,
          kind: "url" as const,
          url: String(url),
        })),
      );
      form.setValue("imagesText", (updated.images ?? []).join("\n"));
      if (updated.imageCover) {
        form.setValue("imageCover", updated.imageCover);
      }
      await qc.invalidateQueries({ queryKey: ["tours"] });
      await qc.invalidateQueries({ queryKey: ["tours", "ops"] });
      await qc.invalidateQueries({ queryKey: ["tour", "by-id", values.tourId] });
    },
    onError: (e) => {
      const local =
        e instanceof Error && !axios.isAxiosError(e) ? e.message : apiErrorMessage(e, "");
      toast.error(local || "Could not update tour");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => mut.mutate({ values: v, gallery, coverFile }))}
        className="grid gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="tourId"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Tour</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a tour to edit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tours.map((t) => (
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
        {tourQ.isFetching ? (
          <p className="text-muted-foreground text-sm md:col-span-2">Loading tour…</p>
        ) : null}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                />
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
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                />
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
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                />
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
              <FormLabel>Price discount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={1}
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
                <Textarea rows={3} {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
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
              <FormLabel>Start dates (one per line)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <Button type="submit" disabled={mut.isPending || !tourId} className="rounded-full gap-2">
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
