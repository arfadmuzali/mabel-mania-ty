import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Mabel Mania",
  description:
    "Manage your Mabel Mania account, view analytics, and control your furniture e-commerce settings.",
  keywords:
    "dashboard, admin, ecommerce management, furniture dashboard, Mabel Mania admin",
  authors: [{ name: "Arfad Muzali" }],
  openGraph: {
    title: "Dashboard - Mabel Mania",
    description:
      "Access the admin dashboard of Mabel Mania to manage your store and monitor performance.",
    // url: "https://mabelmania.com/dashboard",
    siteName: "Mabel Mania",
    // Uncomment and add image details when ready
    // images: [
    //   {
    //     url: "https://mabelmania.com/dashboard-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Mabel Mania Dashboard Overview",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Mabel Mania",
    description:
      "Manage your store efficiently with the Mabel Mania admin dashboard.",
  },
};

export default async function DashboardLayout({
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
    if (!store) {
      throw new Error("asjdwadl");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect("/onboarding");
  }

  return (
    <div>
      {/* <Nav isSticky={true} /> */}
      {children}
    </div>
  );
}
