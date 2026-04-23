"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupUser } from "@/store/slices/authSlice";

export function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const busy = useAppSelector((s) => s.auth.status === "loading");

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      acceptPolicies: false,
    },
  });

  async function onSubmit(values: SignupInput) {
    const res = await dispatch(
      signupUser({
        name: values.name,
        email: values.email,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
      }),
    );
    if (signupUser.fulfilled.match(res)) {
      toast.success("Account created — welcome aboard!");
      const next =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      const dest =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/tours";
      router.push(dest);
      router.refresh();
      return;
    }
    const msg = typeof res.payload === "string" ? res.payload : "Signup failed";
    toast.error(msg);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <UserRound className="size-4 text-primary" aria-hidden />
                  Full name
                </FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Alex Explorer" {...field} />
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
                <FormLabel className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" aria-hidden />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    {...field}
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <LockKeyhole className="size-4 text-primary" aria-hidden />
                  Password
                </FormLabel>
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
                <FormLabel className="flex items-center gap-2">
                  <LockKeyhole className="size-4 text-primary" aria-hidden />
                  Confirm password
                </FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptPolicies"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-xl border border-border/60 bg-muted/30 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex flex-wrap items-center gap-1 text-sm font-normal">
                    <ShieldCheck className="size-4 text-primary" aria-hidden />
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms &amp; conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy policy
                    </Link>
                    .
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full gap-2 rounded-full" size="lg" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </motion.div>
  );
}
