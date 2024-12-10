import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import Provider from "@/components/Provider";
import { auth } from "@/lib/auth";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "300", "500", "800", "700", "600"],
});

export const metadata: Metadata = {
  title: "Mabel Mania - Your Furniture Dream Store",
  description:
    "Explore a wide range of modern, minimalist, and stylish furniture for your home at Mabel Mania.",
  keywords:
    "furniture, home decor, modern furniture, minimalist design, tables, chairs, sofas, cabinets, ecommerce",
  authors: [{ name: "Arfad Muzali" }],
  openGraph: {
    title: "Mabel Mania - Your Furniture Dream Store",
    description:
      "Discover high-quality furniture with elegant designs that fit perfectly in any home.",
    // url: "https://mabelmania.com",
    siteName: "Mabel Mania",
    // images: [
    //   {
    //     url: "https://mabelmania.com/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Mabel Mania - Furniture for Your Dream Home",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mabel Mania - Your Furniture Dream Store",
    description:
      "Shop elegant and minimalist furniture for every corner of your home.",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={openSans.className}
        // disable color zila listener
        cz-shortcut-listen="false"
      >
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
