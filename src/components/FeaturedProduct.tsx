"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCardSkeleton from "./Skeleton/ProductCardSkeleton";
import ProductCard from "./Cards/ProductCard";
import { Image, Product } from "@prisma/client";
import { TooltipWraper } from "./ui/tooltip";

async function getProducts() {
  const response = await axios.get("/api/products");
  return response.data;
}

export default function FeaturedProduct() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    gcTime: 600000,
    staleTime: 500000,
  });

  return (
    <div className="lg:px-28 p-4 md:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        {/* header */}
        <div className="flex justify-between items-center">
          {/* left */}
          <div className="flex flex-col space-1">
            <h2 className="md:text-3xl text-xl font-bold">Featured Products</h2>
            <h6 className="font-semibold text-neutral-600">
              Explore products from around the world
            </h6>
          </div>
          {/* right */}
          <TooltipWraper tooltip="View all product">
            <Link
              href={"/products"}
              className="px-2 py-1 border font-semibold flex gap-1 border-yellow-600 hover:text-white hover:bg-yellow-600 text-yellow-600 rounded transition-colors duration-300 text-sm md:text-base"
            >
              <span className="hidden md:block">View all product</span>{" "}
              <ArrowRight />
            </Link>
          </TooltipWraper>
        </div>
        {/* products */}
        {isLoading && (
          <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, index) => {
              return <ProductCardSkeleton key={index} />;
            })}
          </div>
        )}
        {isError && <div className="w-full p-5 text-center">error</div>}

        {
          <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
            {products?.map(
              (val: Product & { images: Image[] }, index: number) => {
                return <ProductCard product={val} key={index} />;
              }
            )}
          </div>
        }
      </div>
    </div>
  );
}
