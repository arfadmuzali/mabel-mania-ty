"use client";
import SkeletonTable from "@/components/Skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import Paginator from "@/components/ui/paginator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatToDollar } from "@/lib/formatToDollar";
import { formatDateToEnglish } from "@/lib/fotmatDate";
import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertTriangle,
  Ellipsis,
  Eraser,
  Eye,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const rawPage = searchParams.get("page") ?? "1";
  const currentPage = Math.max(1, parseInt(rawPage, 10) || 1);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboardProducts", currentPage],
    queryFn: async () => {
      const res = await axios.get(
        "/api/dashboard/products?page=" + currentPage
      );
      return res.data;
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/dashboard/products/" + id);
      return response;
    },
    onSuccess: async () => {
      await refetch();
      setOpen(false);
      toast("Success deleteing product");
    },
    onError: () => {
      setOpen(false);

      toast("An error occured");
    },
  });

  return (
    <div className="w-full space-y-10">
      <div className="w-full flex justify-between items-start">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          onClick={() => {
            router.push("/dashboard/products/create");
          }}
        >
          <PlusCircle />
          Create
        </Button>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Name</TableHead>
              <TableHead className="w-1/5">Price</TableHead>
              <TableHead className="w-1/5">Category</TableHead>
              <TableHead className="w-1/5">Created At</TableHead>
              <TableHead className="w-1/5 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response?.products?.map(
              (
                product: Product & {
                  category: {
                    name: string;
                    slug: string;
                  };
                },
                index: number
              ) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="w-1/5">{product.name}</TableCell>
                    <TableCell className="w-1/5">
                      {formatToDollar(product.price)}
                    </TableCell>
                    <TableCell className="w-1/5">
                      {product.category?.name}
                    </TableCell>
                    <TableCell className="w-1/5">
                      {formatDateToEnglish(new Date(product.createdAt))}
                    </TableCell>
                    <TableCell className="flex w-full justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(
                                `/product/${product.slug}/${product.id}`
                              );
                            }}
                          >
                            <Eye />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Settings />
                            Edit (on going)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setOpen(true);
                              setDeleteId(product.id);
                            }}
                          >
                            <Eraser /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white">
            <Button variant="outline" onClick={() => setOpen(false)}>
              No, keep my product
            </Button>
            <Button
              variant="destructive"
              disabled={deleteProduct.isPending}
              className="w-full"
              onClick={async () => {
                await deleteProduct.mutateAsync(deleteId);
              }}
            >
              {deleteProduct.isPending ? (
                <LoadingSpinner />
              ) : (
                <span>Yes, delete my product</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isError && (
        <div className="text-center text-xl font-semibold py-10">
          Something went wrong
        </div>
      )}

      <div className="w-full flex justify-end">
        <Paginator
          totalPages={response?.totalPages || 0}
          currentPage={currentPage}
          onChangePage={async () => {}}
        />
      </div>
    </div>
  );
}
