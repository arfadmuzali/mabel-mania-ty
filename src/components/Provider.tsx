"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
// import { X } from "lucide-react";

const queryClient = new QueryClient();

const Provider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Toaster
        richColors={true}
        // closeButton
        toastOptions={{
          // unstyled: true,
          classNames: {
            toast: "bg-yellow-400 border-yellow-700",
            title: "text-yellow-950 text-base",
            description: "text-yellow-700",
            actionButton: "bg-zinc-400",
            cancelButton: "bg-orange-400",
            closeButton: "bg-lime-400",
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default Provider;
