"use client";

import * as React from "react";
import { useCallback, useId, useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { tourImageSrc } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type TourGalleryEntry =
  | { key: string; kind: "url"; url: string }
  | { key: string; kind: "file"; file: File; preview: string };

function GalleryGridItem({
  item,
  disabled,
  onRemove,
}: {
  item: TourGalleryEntry;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const src = item.kind === "url" ? tourImageSrc(item.url) : item.preview;

  const imgReferrerPolicy = (s: string): React.HTMLAttributeReferrerPolicy | undefined =>
    /^https?:\/\//i.test(s) ? "no-referrer" : undefined;

  return (
    <figure className="group relative aspect-[4/3] min-h-0 w-full overflow-hidden rounded-lg border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 size-full object-cover"
        referrerPolicy={imgReferrerPolicy(src)}
      />
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        disabled={disabled}
        className="absolute right-1 top-1 rounded-full opacity-90 shadow-sm"
        aria-label="Remove image"
        onClick={onRemove}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </figure>
  );
}

export type TourMediaFieldsProps = {
  coverUrl: string;
  onCoverUrlChange: (v: string) => void;
  coverFile: File | null;
  onCoverFileChange: (f: File | null) => void;
  /** Local preview from `URL.createObjectURL(coverFile)` (caller owns revoke). */
  coverPreviewObjectUrl: string | null;
  gallery: TourGalleryEntry[];
  onGalleryChange: React.Dispatch<React.SetStateAction<TourGalleryEntry[]>>;
  disabled?: boolean;
  className?: string;
};

export const TourMediaFields = React.forwardRef<HTMLDivElement, TourMediaFieldsProps>(
  function TourMediaFields(
    {
      coverUrl,
      onCoverUrlChange,
      coverFile,
      onCoverFileChange,
      coverPreviewObjectUrl,
      gallery,
      onGalleryChange,
      disabled,
      className,
    },
    ref,
  ) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const coverInputId = `${baseId}-cover`;
  const galleryInputId = `${baseId}-gallery`;

  const coverDisplay =
    coverPreviewObjectUrl || (coverUrl.trim() ? tourImageSrc(coverUrl.trim()) : "");

  const pickCover = useCallback(() => {
    coverInputRef.current?.click();
  }, []);

  const imgReferrerPolicy = (src: string): React.HTMLAttributeReferrerPolicy | undefined =>
    /^https?:\/\//i.test(src) ? "no-referrer" : undefined;

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor={coverInputId}>
          Cover image
        </label>
        <p className="text-muted-foreground text-xs">
          Upload a JPEG/PNG/WebP, paste a URL or bucket key, or both (upload wins on save).
        </p>
        <div className="flex flex-wrap items-start gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={pickCover}
            className={cn(
              "relative flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition hover:bg-muted/70",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            {coverDisplay ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverDisplay}
                alt=""
                className="size-full object-cover"
                referrerPolicy={imgReferrerPolicy(coverDisplay)}
              />
            ) : (
              <span className="flex flex-col items-center gap-1 px-2 text-center text-xs">
                <ImagePlus className="size-8 opacity-60" aria-hidden />
                Add cover
              </span>
            )}
          </button>
          <input
            ref={coverInputRef}
            id={coverInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              onCoverFileChange(f);
            }}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Input
              placeholder="https://… or tours/cover-key.jpg"
              value={coverUrl}
              onChange={(e) => onCoverUrlChange(e.target.value)}
              disabled={disabled}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full"
                disabled={disabled}
                onClick={pickCover}
              >
                <ImagePlus className="mr-1 size-4" aria-hidden />
                Choose file
              </Button>
              {(coverFile || coverUrl.trim()) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-destructive hover:text-destructive"
                  disabled={disabled}
                  onClick={() => {
                    onCoverFileChange(null);
                    onCoverUrlChange("");
                  }}
                >
                  <Trash2 className="mr-1 size-4" aria-hidden />
                  Remove cover
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor={galleryInputId}>
          Gallery
        </label>
        <p className="text-muted-foreground text-xs">
          Up to 12 images. Click a tile to remove it. New uploads are sent with existing URLs you
          keep in order.
        </p>
        <input
          id={galleryInputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (!picked.length) return;
            onGalleryChange((prev) => {
              const next = [...prev];
              for (const file of picked) {
                if (next.length >= 12) break;
                next.push({
                  key:
                    typeof crypto !== "undefined" && crypto.randomUUID
                      ? crypto.randomUUID()
                      : `g-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                  kind: "file",
                  file,
                  preview: URL.createObjectURL(file),
                });
              }
              return next;
            });
          }}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {gallery.map((item) => (
            <GalleryGridItem
              key={item.key}
              item={item}
              disabled={disabled}
              onRemove={() => onGalleryChange(gallery.filter((g) => g.key !== item.key))}
            />
          ))}
          {gallery.length < 12 ? (
            <label
              htmlFor={galleryInputId}
              className={cn(
                "flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/30 text-xs text-muted-foreground transition hover:bg-muted/60",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <ImagePlus className="size-6 opacity-70" aria-hidden />
              Add to gallery
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
});
