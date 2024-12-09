"use client";

import OrderCard from "@/components/Cards/OrderCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

async function getOrders() {
  const response = await axios.get("/api/order");
  return response.data as Order[];
}

export default function OrderPage() {
  const {
    data: orders,
    isLoading,
    // isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  return (
    <div className="min-h-screen lg:px-28 md:px-12 px-4 py-5 space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold">Orders</h1>
        <h4 className="text-neutral-700">See Your Transaction History</h4>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full flex justify-between">
          <TabsTrigger className="w-full" value="all">
            All
          </TabsTrigger>
          <TabsTrigger className="w-full" value="pending">
            Pending
          </TabsTrigger>
          <TabsTrigger className="w-full" value="paid">
            Paid
          </TabsTrigger>
          <TabsTrigger className="w-full" value="canceled">
            Canceled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-5 py-5">
          {isLoading && (
            <div className="flex flex-col gap-5 h-full justify-center items-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          )}
          {orders?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        <TabsContent value="pending" className="space-y-5 py-5">
          {isLoading && (
            <div className="flex flex-col gap-5 h-full justify-center items-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          )}
          {orders
            ?.filter((order) => order.status.toUpperCase() === "PENDING")
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </TabsContent>
        <TabsContent value="paid" className="space-y-5 py-5">
          {isLoading && (
            <div className="flex flex-col gap-5 h-full justify-center items-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          )}
          {orders
            ?.filter((order) => order.status.toUpperCase() === "PAID")
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </TabsContent>
        <TabsContent value="canceled" className="space-y-5 py-5">
          {isLoading && (
            <div className="flex flex-col gap-5 h-full justify-center items-center">
              <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
          )}
          {orders
            ?.filter(
              (order) =>
                order.status.toUpperCase() !== "PAID" &&
                order.status.toUpperCase() !== "PENDING"
            )
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
