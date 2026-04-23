"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Camera, Loader2, UserPen } from "lucide-react";
import { toast } from "sonner";
import { patchUpdateMe, patchUpdateMyPhoto } from "@/lib/api/users";
import { apiErrorMessage } from "@/lib/api/errors";
import { updateMeSchema, type UpdateMeInput } from "@/lib/validations/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";

export function ProfileUpdateForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<UpdateMeInput>({
    resolver: zodResolver(updateMeSchema),
    values: user
      ? { name: user.name, email: user.email }
      : { name: "", email: "" },
  });

  const mut = useMutation({
    mutationFn: patchUpdateMe,
    onSuccess: async () => {
      toast.success("Profile updated");
      await dispatch(fetchCurrentUser());
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Could not update profile")),
  });

  const photoMut = useMutation({
    mutationFn: patchUpdateMyPhoto,
    onSuccess: async () => {
      toast.success("Profile photo updated");
      setPhotoFile(null);
      await dispatch(fetchCurrentUser());
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Could not update profile photo")),
  });

  const previewUrl = useMemo(() => {
    if (!photoFile) return undefined;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentPhoto = previewUrl ?? user?.photo;
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((x) => x.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4 max-w-md">
        <div className="space-y-3 rounded-xl border border-border/70 bg-card/60 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={currentPhoto} alt={user?.name ?? "Profile photo"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="max-w-[240px]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                disabled={!photoFile || photoMut.isPending}
                onClick={() => {
                  if (photoFile) photoMut.mutate(photoFile);
                }}
              >
                {photoMut.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Camera className="size-4" aria-hidden />
                )}
                Upload photo
              </Button>
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoComplete="email" inputMode="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mut.isPending} variant="secondary" className="rounded-full gap-2">
          {mut.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <UserPen className="size-4" aria-hidden />
          )}
          Save profile
        </Button>
      </form>
    </Form>
  );
}
