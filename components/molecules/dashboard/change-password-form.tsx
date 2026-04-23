"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { patchUpdatePassword } from "@/lib/api/users";
import { apiErrorMessage } from "@/lib/api/errors";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/lib/validations/profile";
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
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export function ChangePasswordForm() {
  const dispatch = useAppDispatch();
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      passwordCurrent: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const mut = useMutation({
    mutationFn: patchUpdatePassword,
    onSuccess: ({ token, user }) => {
      toast.success("Password updated");
      dispatch(setCredentials({ token, user }));
      form.reset();
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Could not change password")),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="passwordCurrent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mut.isPending} variant="outline" className="rounded-full gap-2">
          {mut.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <KeyRound className="size-4" aria-hidden />
          )}
          Update password
        </Button>
      </form>
    </Form>
  );
}
