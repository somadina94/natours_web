"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { makeStore, type AppStore } from "@/store";
import { hydrateToken, fetchCurrentUser } from "@/store/slices/authSlice";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppDispatch } from "@/store/hooks";

function AuthBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateToken());
    const t = typeof window !== "undefined" ? localStorage.getItem("natours_token") : null;
    if (t) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <AuthBootstrap />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            <div className="flex min-h-dvh flex-1 flex-col">{children}</div>
            <Toaster richColors position="top-center" closeButton />
          </TooltipProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "development" ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </Provider>
  );
}
