"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StoreCardSkeleton from "./Skeleton/StoreCardSkeleton";
import StoreCard from "./Cards/StoreCard";
import { Store } from "@prisma/client";
import { TooltipWraper } from "./ui/tooltip";

async function getStores() {
  const response = await axios.get("/api/stores");

  return response.data;
}

export default function FeaturedStore() {
  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
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
            <h2 className="md:text-3xl text-xl font-bold">Featured Store</h2>
            <h6 className="font-semibold text-neutral-600">
              Explore stores from around the world
            </h6>
          </div>
          {/* right */}
          <TooltipWraper tooltip="View all store">
            <Link
              href={"/stores"}
              className="px-2 py-1 border font-semibold flex gap-1 border-yellow-600 hover:text-white hover:bg-yellow-600 text-yellow-600 rounded transition-colors duration-300 text-sm md:text-base"
            >
              <span className="hidden md:block">View all store</span>{" "}
              <ArrowRight />
            </Link>
          </TooltipWraper>
        </div>
        {/* products */}
        {isLoading && (
          <div className="flex md:justify-between justify-center items-center gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, index) => {
              return <StoreCardSkeleton isLarge key={index} />;
            })}
          </div>
        )}
        {isError && <div>error</div>}
        <div className="flex md:justify-start justify-center items-center gap-2 md:gap-3 flex-wrap">
          {stores?.map(
            (
              val: Store & {
                _count: {
                  product: number;
                };
              }
            ) => {
              return <StoreCard isLarge key={val.id} store={val} />;
            }
          )}
        </div>
      </div>
    </div>
  );
}
