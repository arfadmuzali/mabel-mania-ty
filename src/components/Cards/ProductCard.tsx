"use client";
import { Image as ImageType, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TooltipWraper } from "../ui/tooltip";
import { formatToDollar } from "@/lib/formatToDollar";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/loadingSpinner";
import { useSession } from "next-auth/react";

export default function ProductCard({
  product,
}: {
  product: Product & { images: ImageType[] };
}) {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const cartMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("Unauthorized, please sign in");
      }

      try {
        return await axios.put("/api/cart", { productId: product.id });
      } catch (error) {
        console.log(error);
        throw new Error("Failed to add product to cart.");
      }
    },
    onSuccess: () => {
      // Invalidasi cache dan tampilkan toast sukses
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      toast("Product added to cart successfully!");
    },
    onError: (error) => {
      // Tampilkan error message jika tersedia
      console.error(error);
      toast(error?.message || "An unexpected error occurred.");
    },
  });
  return (
    <div className="lg:w-[17rem] grow md:max-w-[50%] md:w-56 w-full rounded-lg space-y-1 border shadow-md">
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
          <Button
            className="w-full flex gap-1 items-center justify-center"
            disabled={cartMutation.isPending}
            onClick={async () => {
              await cartMutation.mutateAsync();
            }}
          >
            <LoadingSpinner
              className={`${cartMutation.isPending ? "block" : "hidden"}`}
            />
            Add to cart
          </Button>
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
