"use client";

import StoreCard from "@/components/Cards/StoreCard";
import StoreCardSkeleton from "@/components/Skeleton/StoreCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Paginator from "@/components/ui/paginator";
import { Store } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircleX, Rocket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const page = searchParams.get("page") ?? "1";
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: async () => {
      const response = await axios.get(
        `/api/search/stores?q=${q}&page=${page}`
      );
      return response.data;
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["searchStores", currentPage],
  });
  return (
    <div className="py-5 space-y-5 max-w-7xl mx-auto">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          router.push(`?q=${q}&page=${1}`);
          await refetch();
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex">
          <Input
            placeholder="Store name"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
            }}
            className="border border-black focus:border"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      {isLoading && (
        <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, index) => {
            return <StoreCardSkeleton isLarge key={index} />;
          })}
        </div>
      )}

      {isError && (
        <div className="w-full bg- flex flex-col  gap-4 p-24 justify-center items-center">
          <CircleX className="h-20 w-20" />
          <h2 className="text-3xl font-bold">An error occured</h2>
        </div>
      )}

      {data?.stores?.length <= 0 && (
        <div className="w-full flex flex-col gap-4 p-24 justify-center items-center">
          <div className="border-4 border-dashed border-black rounded-full p-5">
            <Rocket className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold">Store not found</h2>
        </div>
      )}
      <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
        {data?.stores?.map(
          (
            store: Store & {
              _count: {
                product: number;
              };
            }
          ) => {
            return <StoreCard store={store} isLarge key={store.id} />;
          }
        )}
      </div>

      <Paginator
        searchParams={`q=${q}&`}
        totalPages={data?.totalPages || 0}
        currentPage={currentPage}
        onChangePage={async () => {}}
      />
    </div>
  );
}
