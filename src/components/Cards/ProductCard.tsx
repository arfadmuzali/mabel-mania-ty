"use client";
import { Image as ImageType, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TooltipWraper } from "../ui/tooltip";
import { formatToDollar } from "@/lib/formatToDollar";
import { Eye } from "lucide-react";
import { AddCartButton } from "../CartButton";

export default function ProductCard({
  product,
  isLarge = false,
}: {
  product: Product & { images: ImageType[] };
  isLarge?: boolean;
}) {
  return (
    <div
      className={`${
        isLarge ? "lg:w-[18rem]" : "lg:w-[17rem]"
      } md:w-56 grow md:max-w-[50%] w-full rounded-lg space-y-1 border shadow-md`}
    >
      <Link href={`/product/${product.slug}/${product.id}`}>
        <div className="w-full relative rounded-t-lg h-64 md:h-52 lg:h-64">
          <Image
            src={product.images?.[0]?.url ?? "/images/placeholder.svg"}
            alt={product.name}
            className="rounded-t-lg"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </Link>

      <div className="flex w-full flex-col gap-1 p-2">
        <Link href={`/product/${product.slug}/${product.id}`}>
          <TooltipWraper tooltip={product.name}>
            <h2 className="line-clamp-1 text-lg font-bold">{product.name}</h2>
          </TooltipWraper>
        </Link>
        <h4 className="text-neutral-700 font-bold md:text-base text-sm">
          {formatToDollar(product.price)}
        </h4>

        <div className="flex gap-1 w-full items-center mt-2">
          <AddCartButton productId={product.id} />
          <TooltipWraper tooltip="See Product">
            <Link
              href={`/product/${product.slug}/${product.id}`}
              className="bg-neutral-400 hover:bg-neutral-400/80 text-white p-2 rounded-md"
            >
              <Eye />
            </Link>
          </TooltipWraper>
        </div>
      </div>
    </div>
  );
}
