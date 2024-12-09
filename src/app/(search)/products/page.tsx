"use client";

import ProductCard from "@/components/Cards/ProductCard";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Paginator from "@/components/ui/paginator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants/categories";
import { Product, Image as ImageType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircleX, Rocket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") ?? "");

  const page = searchParams.get("page") ?? "1";
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: async () => {
      const response = await axios.get(
        `/api/search?q=${q}&category=${category}&min=${minPrice}&max=${maxPrice}&page=${page}`
      );
      return response.data;
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["searchProducts"],
  });
  return (
    <div className="py-5 space-y-5 max-w-7xl mx-auto">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          router.push(
            `?q=${q}&category=${category}&min=${minPrice}&max=${maxPrice}&page=${1}`
          );
          await refetch();
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <Input
            placeholder="Product name"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
            }}
            className="border border-black focus:border"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="max-w-[35%] border border-black text-neutral-600">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Min price"
            inputMode="numeric"
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
            }}
            className="border border-black focus:border"
          />
          <Input
            placeholder="Max price"
            inputMode="numeric"
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
            }}
            className="border border-black focus:border"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
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
        searchParams={`q=${q}&category=${category}&min=${minPrice}&max=${maxPrice}&`}
        totalPages={data?.totalPages || 0}
        currentPage={currentPage}
        onChangePage={async () => {}}
      />
    </div>
  );
}
