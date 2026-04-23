"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2, UserPen } from "lucide-react";
import { toast } from "sonner";
import { patchUpdateMe } from "@/lib/api/users";
import { apiErrorMessage } from "@/lib/api/errors";
import { updateMeSchema, type UpdateMeInput } from "@/lib/validations/profile";
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4 max-w-md">
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
