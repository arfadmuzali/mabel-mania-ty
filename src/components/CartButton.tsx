"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function AddCartButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const cartMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("Unauthorized, please sign in");
      }

      try {
        return await axios.put("/api/cart", { productId: productId });
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data);
        } else {
          throw new Error("Failed to add product to cart.");
        }
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
    <Button
      className={cn("w-full flex gap-1 items-center justify-center", className)}
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
  );
}

export default function AddCart({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(1);

  const cartMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("Unauthorized, please sign in");
      }

      try {
        return await axios.put("/api/cart", { productId, quantity });
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data);
        } else {
          throw new Error("Failed to add product to cart.");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      toast("Product added to cart successfully!");
    },
    onError: (error) => {
      toast(error?.message || "An unexpected error occurred.");
    },
  });

  return (
    <div>
      <div className="flex items-center gap-0.5 bg-neutral-300 p-1 rounded w-fit">
        <button
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} // Minimal 1
          className="px-2 bg-white rounded-l "
        >
          <Minus />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value)); // Minimal 1
            setQuantity(value);
          }}
          className="appearance-none w-10 text-center border-none focus:outline-none bg-white px-2 no-arrows"
        />
        <button
          onClick={() => setQuantity((prev) => prev + 1)}
          className="px-2 bg-white rounded-r"
        >
          <Plus />
        </button>
      </div>
      <Button
        className={cn(
          "w-fit px-10 flex gap-1 items-center justify-center mt-2",
          className
        )}
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
    </div>
  );
}
