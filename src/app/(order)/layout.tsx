import Footer from "@/components/layouts/Footer";
import Nav from "@/components/layouts/Nav";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order - Mabel Mania",
  description:
    "Review your cart and proceed to checkout for stylish furniture from Mabel Mania.",
  keywords:
    "cart, checkout, order furniture, ecommerce shopping, Mabel Mania orders, furniture checkout",
  authors: [{ name: "Arfad Muzali" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Order - Mabel Mania",
    description:
      "Manage your cart items and complete your purchase easily with Mabel Mania's seamless checkout process.",
    // url: "https://mabelmania.com/order",
    siteName: "Mabel Mania",
    // Uncomment and add image details when ready
    // images: [
    //   {
    //     url: "https://mabelmania.com/order-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Mabel Mania Order Page - Cart and Checkout",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order - Mabel Mania",
    description:
      "Complete your furniture shopping with Mabel Mania's secure and easy checkout process.",
  },
};

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
      <Footer />
    </div>
  );
}
