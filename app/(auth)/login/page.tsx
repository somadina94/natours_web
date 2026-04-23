import { LogIn } from "lucide-react";
import { AuthBackLink } from "@/components/molecules/auth-back-link";
import { LoginForm } from "@/components/molecules/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Log in",
  description: "Access your Natours account to book tours and manage adventures.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="w-full">
      <AuthBackLink />
      <Card className="border-border/70 bg-card/90 shadow-xl backdrop-blur-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <LogIn className="size-5" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">Welcome back</span>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Log in to Natours</CardTitle>
          <CardDescription>Secure access with email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
