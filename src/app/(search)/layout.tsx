import Nav from "@/components/layouts/Nav";
import { ReactNode } from "react";

export default function ProductLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <Nav isSticky={true} />
      {children}
    </div>
  );
}