import AddCartButton from "@/components/CartButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatToDollar } from "@/lib/formatToDollar";
import prisma from "@/lib/prisma";
import { TabsContent } from "@radix-ui/react-tabs";
import { AlertCircle } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function getProduct(id: string) {
  try {
    const products = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
        store: true,
      },
    });
    return products;
  } catch (error) {
    console.log("error when get product", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const response = await getProduct(id);

  return response
    ? {
        title: `${response?.name} - Mabel Mania`,
        description: `${response?.description}`,
        openGraph: {
          title: `${response?.name} - Mabel Mania`,
          description: `${response?.description}`,
          url: `${process.env.NEXT_PUBLIC_URL_SITE}/product/${response.slug}/${id}`,
          siteName: "Mabel Mania",
          images: [
            {
              url: response?.images[0]?.url,
              width: 1200,
              height: 630,
              alt: "Mabel Mania",
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "Mabel Mania",
          description: `${response?.description}`,
          images: response?.images[0]?.url,
        },
      }
    : { title: "Product not found - Mabel Mania" };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;

  const response = await getProduct(id);

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Product not found
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Sorry, we couldn{"'"}t find the product you{"'"}re looking for.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Go back to products
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-20 md:px-12 px-4 flex lg:flex-row flex-col py-4">
      <div className="lg:w-6/12 w-full">
        <Tabs
          defaultValue={response.images[0]?.url}
          className="flex-col-reverse flex"
        >
          <TabsList className="grid w-full h-fit grid-cols-3">
            {response.images?.map((image) => {
              return (
                <TabsTrigger
                  key={image.url}
                  value={image.url}
                  className="p-1 data-[state=active]:bg-yellow-900 rounded-lg"
                >
                  <div className="w-full relative h-32 aspect-square">
                    <Image
                      fill
                      src={image.url}
                      alt="productImages"
                      className="rounded-lg"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {response.images?.map((image) => {
            return (
              <TabsContent
                key={image.url}
                value={image.url}
                className="w-full  aspect-square rounded-lg"
              >
                <div className="w-full relative aspect-square">
                  <Image
                    fill
                    src={image.url}
                    alt="productImages"
                    className="rounded-lg"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
      <div className="lg:w-6/12 w-full flex flex-col gap-2 lg:px-4">
        <h1 className="text-3xl font-semibold">{response.name}</h1>
        <h3 className="text-xl font-semibold text-neutral-500">
          {formatToDollar(response.price)}
        </h3>
        <h4 className="text-xl text-neutral-500 font-semibold">
          {response.store.name}
        </h4>
        <div className="h-1 border-b my-4 border-neutral-300 w-full" />
        <AddCartButton productId={response.id} />
        <div className="h-1 border-b my-4 border-neutral-300 w-full" />
        <Accordion
          type="single"
          defaultValue="item-1"
          collapsible
          className="w-full"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>{response.description}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
