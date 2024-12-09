import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import StoreProducts from "@/components/storeProducts";
import prisma from "@/lib/prisma";
import { AlertCircle, Star } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

async function getStore(id: string) {
  try {
    const response = await prisma.store.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            product: true,
          },
        },
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const response = await getStore(id);

  return response
    ? {
        title: `${response?.name} - Mabel Mania`,
        description: `${response?.description}`,
        openGraph: {
          title: `${response?.name} - Mabel Mania`,
          description: `${response?.description}`,
          url: `${process.env.NEXT_PUBLIC_URL_SITE}/store/${id}`,
          siteName: "Mabel Mania",
          // images: [
          //   {
          //     url: response?.images[0]?.url,
          //     width: 1200,
          //     height: 630,
          //     alt: "Mabel Mania",
          //   },
          // ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "Mabel Mania",
          description: `${response?.description}`,
          // images: response?.images[0]?.url,
        },
      }
    : { title: "Store not found - Mabel Mania" };
}

export default async function Store({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await getStore(id);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Store not found
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Sorry, we couldn{"'"}t find the store you{"'"}re looking for.
          </p>
          <div className="mt-6">
            <Link
              href="/stores"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Go back to stores
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-20 p-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
          <p className="text-gray-600 mb-4">{store.description}</p>
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <Suspense
          fallback={
            <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
              {Array.from({ length: 6 }).map((_, index) => {
                return <ProductCardSkeleton isLarge key={index} />;
              })}
            </div>
          }
        >
          <StoreProducts id={store.id} />
        </Suspense>
      </div>
    </div>
  );
}
