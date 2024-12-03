import Nav from "@/components/layouts/Nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  return (
    <div>
      <Nav isSticky={true} />
      {children}
    </div>
  );
}
