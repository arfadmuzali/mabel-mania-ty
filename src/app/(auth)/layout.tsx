// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
