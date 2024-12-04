"use client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { TooltipWraper } from "@/components/ui/tooltip";
import { formatToDollar } from "@/lib/formatToDollar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PackageSearch, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getCart() {
  const response = await axios.get("/api/cart");
  return response.data;
}

export interface Cart {
  id: number;
  totalPrice: number;
  userId: string;
  cartItems: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  cartId: number;
  productId: string;
  product: Product;
}

export interface Product {
  id: string;
  slug: string;
  description: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  categorySlug: string;
  storeId: string;
  images: Image[];
  store: Store;
}

export interface Image {
  id: string;
  url: string;
  createdAt: Date;
  productId: string;
}

export interface Store {
  name: string;
}

async function deleteCartItem(cartItemId: number) {
  const response = await axios.delete(`/api/cart/${cartItemId}`);
  return response.data;
}

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: cart,
    isLoading,
    isError,

    refetch,
  } = useQuery({
    queryKey: ["cartTable"],
    queryFn: getCart,
  });

  console.log(cart);

  const deleteCart = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: async () => {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      toast("Cart item deleted");
    },
    onError: (error) => {
      console.log(error);
      toast("Failed delete cart item");
    },
  });
  return (
    <div className="min-h-screen lg:px-28 md:px-12 px-4  py-5 space-y-10">
      <h1 className="text-2xl font-extrabold">Shopping Cart</h1>
      <div className="flex flex-col md:flex-row w-full gap-1 ">
        {/* cart items */}
        <div className="gap-5 md:w-2/3 w-full h-full flex flex-col">
          {isLoading && (
            <div className="flex flex-col gap-5 h-full justify-center items-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          )}
          {isError && <div>Something Went Wrong</div>}
          {cart?.cartItems?.length <= 0 && (
            <div className="flex flex-col gap-5 h-full justify-center items-center">
              <h2 className="text-2xl font-semibold">Cart are empty</h2>
              {/* <PackageSearch className="w-12 h-12" /> */}
              <Button
                onClick={() => {
                  router.push("/products");
                }}
              >
                <PackageSearch /> Search here
              </Button>
            </div>
          )}
          {(cart as Cart)?.cartItems?.map((cart, index) => {
            return (
              <div
                key={index}
                className="flex relative  flex-row gap-4 w-full  pb-2 border-b border-neutral"
              >
                <div className="relative md:h-44 md:w-48 h-24 w-28 rounded-md shadow-md ">
                  <Image
                    src={cart?.product?.images?.[0]?.url}
                    alt=""
                    fill
                    className="rounded-md"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <TooltipWraper tooltip={cart?.product?.name}>
                    <Link
                      href={`/product/${cart?.product?.slug}/${cart?.productId}`}
                      className="md:text-lg font-bold md:max-w-56 max-w-44   lg:max-w-96 line-clamp-1 pb-1"
                    >
                      {cart?.product?.name}
                    </Link>
                  </TooltipWraper>

                  <h3 className="text-lg font-semibold text-neutral-600">
                    {formatToDollar(cart?.product?.price)}
                  </h3>

                  <h3 className="text-neutral-600">
                    From: {cart?.product?.store.name}
                  </h3>
                  <h3 className="text-neutral-600">
                    Quantity: {cart?.quantity}
                  </h3>
                </div>
                <TooltipWraper tooltip="Delete from cart">
                  <button
                    disabled={isLoading || deleteCart.isPending}
                    onClick={async () => {
                      await deleteCart.mutateAsync(cart.id);
                    }}
                    className="absolute top-0 right-0 text-sm rounded-full md:p-2 p-1 bg-neutral-100 shadow-md"
                  >
                    {isLoading || deleteCart.isPending ? (
                      <LoadingSpinner className="text-sm" />
                    ) : (
                      <X />
                    )}
                  </button>
                </TooltipWraper>
              </div>
            );
          })}
        </div>
        {/* order summary */}
        <div className="md:w-1/3 w-full h-fit md:sticky top-20 px-2">
          <div className=" bg-neutral-100 shadow-md space-y-4 h-fit min-h-20 rounded-md p-2">
            <h2 className="text-xl font-semibold pb-5 border-b border-neutral-200">
              Order Summary
            </h2>
            <div className=" flex flex-col gap-4  pb-4 border-b border-neutral-200">
              {(cart as Cart)?.cartItems?.map((val, index) => {
                return (
                  <div key={index} className="flex  justify-between">
                    <h4 className="text-neutral-900 line-clamp-1 max-w-[73%]">
                      {val.product.name}{" "}
                    </h4>
                    <h5 className="font-semibold">
                      {formatToDollar(val.product.price)}{" "}
                      <span className="text-sm font-normal text-neutral-800">
                        x{val.quantity}
                      </span>
                    </h5>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center">
              <h4 className="text-sm">Order Total</h4>
              <h2 className="font-bold text-2xl">
                {formatToDollar(cart?.totalPrice ?? 0)}
              </h2>
            </div>
            <Button
              disabled={
                isLoading ||
                deleteCart.isPending ||
                cart?.cartItems?.length <= 0
              }
              className="w-full"
            >
              <ShoppingBag />
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
