import prisma from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_URL_SITE || "http://localhost:3000";

async function getProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return products.map((product) => ({
    path: `/product/${product.slug}/${product.id}`,
    priority: 0.9,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    { path: "/", priority: 1.0 },
    { path: "/dashboard", priority: 0.9 },
    { path: "/signin", priority: 0.7 },
    { path: "/stores", priority: 0.8 },
    { path: "/products", priority: 0.9 },
  ];

  const product = await getProducts();

  return [...pages, ...product].map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
