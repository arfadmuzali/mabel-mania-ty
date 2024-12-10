import { ReactNode, Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products - Mabel Mania",
  description:
    "Find the perfect furniture for your home using Mabel Mania's advanced search feature.",
  keywords:
    "search furniture, find products, product search, Mabel Mania furniture, search tool, modern furniture, minimalist furniture",
  authors: [{ name: "Arfad Muzali" }],
  openGraph: {
    title: "Search Products - Mabel Mania",
    description:
      "Easily search and discover furniture that fits your style and needs with Mabel Mania's intuitive search feature.",
    // url: "https://mabelmania.com/search",
    siteName: "Mabel Mania",
    // Uncomment and add image details when ready
    // images: [
    //   {
    //     url: "https://mabelmania.com/search-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Search Products at Mabel Mania",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Products - Mabel Mania",
    description:
      "Quickly find your desired furniture with Mabel Mania's advanced search capabilities.",
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="lg:px-20 p-4 md:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <h4 className="font-semibold text-neutral-600">
            Buy products from our store
          </h4>
        </div>
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
}
