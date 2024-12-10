import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - Mabel Mania",
  description:
    "Set up your store with Mabel Mania and start managing your products and sales from your personalized dashboard.",
  keywords:
    "onboarding, store setup, create store, Mabel Mania store creation, ecommerce onboarding, manage store",
  authors: [{ name: "Arfad Muzali" }],
  openGraph: {
    title: "Onboarding - Mabel Mania",
    description:
      "Create your store and prepare to manage inventory, track sales, and explore advanced features with Mabel Mania's dashboard.",
    // url: "https://mabelmania.com/onboarding",
    siteName: "Mabel Mania",
    // Uncomment and add image details when ready
    // images: [
    //   {
    //     url: "https://mabelmania.com/onboarding-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Mabel Mania Onboarding Page - Create Your Store",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onboarding - Mabel Mania",
    description:
      "Easily create your store with Mabel Mania's onboarding process and get ready to manage your business efficiently.",
  },
  // icons: {
  //   icon: "/onboarding-icon.png",
  // },
};

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
    redirect("/");
  }
  return <div>{children}</div>;
}
