import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  try {
    const store = await prisma.store.findUnique({
      where: {
        userId: session?.user?.id,
      },
      select: {
        id: true,
      },
    });
    if (store) {
      throw new Error("");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect("/dashboard");
  }
  return <div>{children}</div>;
}
