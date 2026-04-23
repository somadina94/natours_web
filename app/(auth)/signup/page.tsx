import { UserPlus } from "lucide-react";
import { AuthBackLink } from "@/components/molecules/auth-back-link";
import { SignupForm } from "@/components/molecules/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Create account",
  description: "Join Natours to book tours, save favorites, and unlock member perks.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <div className="w-full">
      <AuthBackLink />
      <Card className="border-border/70 bg-card/90 shadow-xl backdrop-blur-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <UserPlus className="size-5" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">Join the trail</span>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Create your Natours account</CardTitle>
          <CardDescription>
            One account for checkout, confirmations, and future expedition drops.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
