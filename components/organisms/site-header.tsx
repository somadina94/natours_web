"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Info,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  SunMedium,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/atoms/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { dashboardPathForRole } from "@/types/auth";

const nav = [
  { href: "/tours", label: "Tours", icon: LayoutGrid },
  { href: "/features", label: "Features", icon: BookOpenText },
  { href: "/about", label: "About", icon: Info },
  { href: "/#featured", label: "Highlights", icon: Sparkles },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const isActive = (href: string) => {
    if (href.startsWith("/tours")) return pathname.startsWith("/tours");
    if (href.startsWith("/features")) return pathname.startsWith("/features");
    if (href.startsWith("/about")) return pathname.startsWith("/about");
    if (href.includes("featured")) return pathname === "/";
    return pathname === href;
  };

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Button
                key={href}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={cn("gap-2 rounded-full", active && "bg-primary/15 text-primary")}
                asChild
              >
                <Link href={href}>
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </Button>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label={
              !mounted
                ? "Toggle color theme"
                : resolvedTheme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
            }
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {!mounted ? (
              <SunMedium className="size-4 opacity-50" aria-hidden />
            ) : resolvedTheme === "dark" ? (
              <Moon className="size-4" aria-hidden />
            ) : (
              <SunMedium className="size-4" aria-hidden />
            )}
          </Button>
          {user && token ? (
            <Button variant="ghost" size="sm" className="hidden gap-2 rounded-full md:inline-flex" asChild>
              <Link href={dashboardPathForRole(String(user.role))}>
                <LayoutDashboard className="size-4" aria-hidden />
                Dashboard
              </Link>
            </Button>
          ) : null}
          {user && token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="hidden gap-2 rounded-full md:inline-flex">
                  <Avatar className="size-7">
                    <AvatarImage src={user.photo} alt={user.name} />
                    <AvatarFallback>
                      <UserRound className="size-4" aria-hidden />
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" asChild>
                  <Link href={dashboardPathForRole(String(user.role))}>
                    <LayoutDashboard className="size-4" aria-hidden />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  onSelect={() => dispatch(logout())}
                >
                  <LogOut className="size-4" aria-hidden />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden gap-2 rounded-full md:inline-flex" asChild>
                <Link href="/login">
                  <LogIn className="size-4" aria-hidden />
                  Log in
                </Link>
              </Button>
              <Button size="sm" className="hidden gap-2 rounded-full md:inline-flex" asChild>
                <Link href="/signup">
                  <UserPlus className="size-4" aria-hidden />
                  Sign up
                </Link>
              </Button>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm" className="md:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2" aria-label="Mobile">
                {nav.map(({ href, label, icon: Icon }) => (
                  <Button key={href} variant="ghost" className="justify-start gap-2" asChild>
                    <Link href={href}>
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </Link>
                  </Button>
                ))}
                {user && token ? (
                  <Button variant="ghost" className="justify-start gap-2" asChild>
                    <Link href={dashboardPathForRole(String(user.role))}>
                      <LayoutDashboard className="size-4" aria-hidden />
                      Dashboard
                    </Link>
                  </Button>
                ) : null}
                {!user || !token ? (
                  <>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/login">
                        <LogIn className="size-4" aria-hidden />
                        Log in
                      </Link>
                    </Button>
                    <Button className="justify-start gap-2" asChild>
                      <Link href="/signup">
                        <UserPlus className="size-4" aria-hidden />
                        Sign up
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-destructive"
                    onClick={() => dispatch(logout())}
                  >
                    <LogOut className="size-4" aria-hidden />
                    Log out
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
