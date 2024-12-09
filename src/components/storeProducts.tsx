"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProductCardSkeleton from "./Skeleton/ProductCardSkeleton";
import { CircleX, Rocket } from "lucide-react";
import { Product, Image as ImageType } from "@prisma/client";
import ProductCard from "./Cards/ProductCard";
import Paginator from "./ui/paginator";

export default function StoreProducts({ id }: { id: string }) {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["storeProducts", currentPage, id],
    queryFn: async () => {
      const response = await axios.get(`/api/search/stores/${id}`);
      return response.data;
    },
  });

  return (
    <div className="w-full space-y-2">
      {isLoading && (
        <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, index) => {
            return <ProductCardSkeleton isLarge key={index} />;
          })}
        </div>
      )}
      {isError && (
        <div className="w-full bg- flex flex-col  gap-4 p-24 justify-center items-center">
          <CircleX className="h-20 w-20" />
          <h2 className="text-3xl font-bold">An error occured</h2>
        </div>
      )}

      {data?.products?.length <= 0 && (
        <div className="w-full flex flex-col gap-4 p-24 justify-center items-center">
          <div className="border-4 border-dashed border-black rounded-full p-5">
            <Rocket className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold">Product not found</h2>
        </div>
      )}
      <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
        {data?.products?.map((product: Product & { images: ImageType[] }) => {
          return <ProductCard product={product} isLarge key={product.id} />;
        })}
      </div>

      <Paginator
        totalPages={data?.totalPages || 0}
        currentPage={currentPage}
        onChangePage={async () => {}}
      />
    </div>
  );
}
