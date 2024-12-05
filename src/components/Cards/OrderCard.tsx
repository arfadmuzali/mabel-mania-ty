"use client";
import Link from "next/link";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { formatToDollar } from "@/lib/formatToDollar";
interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  cartId: number;
  invoice: Invoice;
  orderItems: OrderItem[];
  user: User;
}

interface Invoice {
  orderId: string;
  paymentId: string;
  invoiceUrl: string;
  paymentMethod: null;
  status: string;
  amount: number;
  bankCode: string;
  description: null;
  currency: string;
  paidAt: null;
  feePaidAmount: null;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product: Product;
}

interface Product {
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

interface Image {
  id: string;
  url: string;
  createdAt: Date;
  productId: string;
}

interface Store {
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: null;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
export default function OrderCard({
  order,
  showOrderer = false,
}: {
  order: Order;
  showOrderer?: boolean;
}) {
  const getBadgeVariant = (
    status: string
  ):
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "success"
    | "warning" => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "warning";
      case "PAID":
        return "success"; // Gunakan variant yang relevan
      case "EXPIRED":
        return "destructive";
      default:
        return "secondary"; // Variant fallback
    }
  };
  return (
    <div className="rounded-lg shadow-md p-4 w-full space-y-4 border">
      <header className="flex justify-between items-center p-2 border-b">
        {showOrderer ? (
          <div className="">
            <h2 className="text-lg font-semibold text-neutral-700">
              {order.user.name}
            </h2>
            <h5 className="text-sm text-neutral-600">{order.user.email}</h5>
          </div>
        ) : (
          <Link
            target="_blank"
            href={order.invoice?.invoiceUrl ?? "#"}
            className="max-w-[50%] truncate text-blue-400 hover:underline"
          >
            {order.invoice?.invoiceUrl}
          </Link>
        )}

        {/* <Badge variant={"success"}>{order.status}</Badge> */}
        <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
      </header>
      <div className="flex w-full border-b pb-2 gap-2">
        <div className="relative md:h-48 h-24 w-1/5 rounded-md">
          <Image
            src={order.orderItems[0]?.product?.images?.[0]?.url}
            alt="orderItems"
            fill
            className="rounded-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="w-4/5">
          {order?.orderItems?.map((val, index) => {
            return (
              <div key={index} className="flex w-full justify-between">
                <h4 className="text-neutral-900 line-clamp-1 text-lg max-w-[73%]">
                  {val.product.name}
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
      </div>
      <div className="justify-between flex items-center">
        <h2 className="text-lg font-semibold">Total Order</h2>
        <h1 className="text-2xl font-bold">
          {formatToDollar(order.totalPrice)}
        </h1>
      </div>
    </div>
  );
}
