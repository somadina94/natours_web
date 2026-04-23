"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, LogOut, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  buildDashboardHref,
  dashboardViewsForPath,
  viewLabel,
} from "@/lib/dashboard-views";
import { dashboardNavItems, dashboardSharedLinks } from "@/lib/dashboard-nav";
import type { AuthRole } from "@/types/auth";
import { isAuthRole } from "@/types/auth";
import { logout } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const role: AuthRole =
    user?.role && isAuthRole(String(user.role)) ? (user.role as AuthRole) : "user";

  const primary = dashboardNavItems.filter((l) => l.roles.includes(role));
  const actionViews = dashboardViewsForPath(pathname);
  const currentView = searchParams.get("view") ?? "overview";
  const pageTitle = actionViews ? viewLabel(actionViews, currentView) : "Dashboard";
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="pointer-events-none h-auto min-h-12 !flex-col !items-start gap-0.5 py-2.5 data-[size=lg]:p-2 md:min-h-14"
              >
                <span className="w-full truncate text-left font-semibold">
                  {user?.name ?? "Account"}
                </span>
                <span className="w-full truncate text-left text-xs capitalize text-sidebar-foreground/70">
                  {String(user?.role ?? "").replaceAll("-", " ")}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {primary.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={label}
                        className="gap-2"
                      >
                        <Link href={buildDashboardHref(href, "overview")}>
                          <Icon className="size-4 shrink-0" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {actionViews ? (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel>Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {actionViews.map(({ id, label, icon: Icon }) => {
                      const active = currentView === id;
                      return (
                        <SidebarMenuItem key={id}>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={label}
                            className="gap-2"
                          >
                            <Link href={buildDashboardHref(pathname, id)} scroll={false}>
                              <Icon className="size-4 shrink-0" />
                              <span>{label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          ) : null}

          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboardSharedLinks.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild tooltip={label} className="gap-2">
                      <Link href={href}>
                        <Icon className="size-4 shrink-0" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 justify-start gap-2"
              aria-label={
                !mounted
                  ? "Toggle color theme"
                  : resolvedTheme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
              }
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {!mounted ? (
                <SunMedium className="size-4 opacity-50" aria-hidden />
              ) : resolvedTheme === "dark" ? (
                <Moon className="size-4" aria-hidden />
              ) : (
                <SunMedium className="size-4" aria-hidden />
              )}
              <span>Theme</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              aria-label="Log out"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="size-4" aria-hidden />
            </Button>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset id="main-content" tabIndex={-1}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-xs font-medium uppercase tracking-wide">
              {actionViews ? "Current task" : "Dashboard"}
            </p>
            <h1 className="truncate text-lg font-semibold leading-tight">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Go to home page"
              asChild
            >
              <Link href="/">
                <Home className="size-4" aria-hidden />
              </Link>
            </Button>
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
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {!mounted ? (
                <SunMedium className="size-4 opacity-50" aria-hidden />
              ) : resolvedTheme === "dark" ? (
                <Moon className="size-4" aria-hidden />
              ) : (
                <SunMedium className="size-4" aria-hidden />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-destructive hover:text-destructive"
              aria-label="Log out"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="size-4" aria-hidden />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
