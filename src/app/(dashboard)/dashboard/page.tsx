"use client";
import { Package, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { Label } from "@/components/ui/label";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required") // Kolom wajib diisi
    .min(3, "Name must be at least 3 characters") // Minimal 3 karakter
    .max(50, "Name must not exceed 50 characters"), // Maksimal 50 karakter
  description: Yup.string()
    .required("Description is required") // Kolom wajib diisi
    .min(10, "Description must be at least 10 characters") // Minimal 10 karakter
    .max(200, "Description must not exceed 200 characters"), // Maksimal 200 karakter
});

async function getStore() {
  const response = await axios.get("/api/dashboard/store");
  return response.data;
}

export default function DashboardPage() {
  const { data: session } = useSession();

  const {
    data: store,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["updateStore"],
    queryFn: getStore,
  });

  const updateStore = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await axios.put("/api/dashboard/store", data);
      return response.data;
    },
    onSuccess: async () => {
      await refetch();
      toast("updating store was succeeded");
    },
    onError: async () => {
      toast("an error occured");
    },
  });

  const initialValues = {
    name: store?.name || "",
    description: store?.description || "",
  };

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    await updateStore.mutateAsync({
      name: values.name,
      description: values.description,
    });
  };
  return (
    <div className="space-y-4">
      <div className="border gap-8 border-neutral-400 flex flex-col justify-center p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <h1 className="text-5xl">👋</h1>
          <div>
            <h2 className="md:text-2xl text-xl font-bold">
              Welcome, {session?.user?.name}!
            </h2>
            <p className="text-sm text-neutral-700">
              Check what{"'"}s happen to your product and store order
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-start gap-2">
          <Link
            href={"/dashboard/products"}
            className="bg-yellow-700  text-sm md:text-base flex gap-2 items-center justify-center p-2 rounded-md text-neutral-50 hover:bg-yellow-800/90 dark:text-neutral-900 dark:hover:bg-neutral-50/90 "
          >
            <Package /> Go to store products
          </Link>
          <Link
            href={"/dashboard/orders"}
            className="bg-yellow-700 flex gap-2 items-center justify-center p-2 rounded-md text-neutral-50 hover:bg-yellow-800/90 dark:text-neutral-900 dark:hover:bg-neutral-50/90 "
          >
            <ShoppingBag /> Go to store orders
          </Link>
        </div>
      </div>

      <div className="border gap-6 border-neutral-400 flex flex-col justify-center p-4 rounded-lg shadow">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Update Your Store</h2>
          <p className="text-sm text-neutral-700">
            Update your store name and description{" "}
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 w-3/5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Field
                  className="flex h-10 w-full  rounded-md bg-white px-3 py-2 text-base file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:outline-none focus:border-0 border disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-xs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Field
                  className="flex h-10 w-full rounded-md bg-white px-3 py-2 text-base file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:outline-none focus:border-0 border disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 min-h-24"
                  id="description"
                  name="description"
                  placeholder="Enter your description"
                  as="textarea"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600 text-xs"
                />
              </div>

              <Button
                type="submit"
                className=""
                disabled={isSubmitting || updateStore.isPending || isLoading}
              >
                {isSubmitting || updateStore.isPending || isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <span>Update Store</span>
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
