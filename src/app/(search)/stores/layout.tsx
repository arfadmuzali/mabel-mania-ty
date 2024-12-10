import { ReactNode, Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Stores - Mabel Mania",
  description:
    "Find stores near you that offer modern, minimalist, and high-quality furniture with Mabel Mania.",
  keywords:
    "search stores, find furniture stores, Mabel Mania stores, store locator, furniture near me, modern furniture stores",
  authors: [{ name: "Arfad Muzali" }],
  openGraph: {
    title: "Search Stores - Mabel Mania",
    description:
      "Locate Mabel Mania stores easily and explore collections near you for stylish furniture.",
    // url: "https://mabelmania.com/search-stores",
    siteName: "Mabel Mania",
    // Uncomment and add image details when ready
    // images: [
    //   {
    //     url: "https://mabelmania.com/search-stores-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Find Mabel Mania Stores Near You",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Stores - Mabel Mania",
    description:
      "Discover Mabel Mania stores near you to find the perfect furniture for your home.",
  },
  // icons: {
  //   icon: "/store-icon.png",
  // },
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="lg:px-20 p-4 md:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Stores</h1>
          <h4 className="font-semibold text-neutral-600">
            Discover store all around the world
          </h4>
        </div>
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
}
