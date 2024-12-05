"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CornerDownLeft, SearchIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
}

export interface Image {
  id: string;
  url: string;
  createdAt: Date;
  productId: string;
}

async function getProducts(q: string) {
  const response = await axios.get("/api/products?take=5&q=" + q);
  return response.data as Product[];
}

export default function SearchButton() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearch(value), 500),
    []
  );

  const {
    data: products,
    // isLoading,
    // isError,
  } = useQuery({
    queryKey: ["productsQueryNav", search],
    queryFn: async () => {
      const products = getProducts(search);
      return products;
    },
    enabled: !!search,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"white"} className="rounded-2xl font-semibold">
          <SearchIcon /> <span className="hidden md:block">Search Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:w-full bg-white/40 p-2 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;

                const searchValue = (
                  form.elements.namedItem("search") as HTMLInputElement
                ).value;
                router.push("/products?q=" + searchValue);
              }}
              className="flex gap-2 items-center justify-center"
            >
              <SearchIcon />
              <Input
                placeholder="Search Product..."
                autoCorrect="off"
                autoComplete="off"
                aria-hidden
                name="search"
                onChange={(e) => {
                  debouncedSearch(e.target.value);
                }}
              />
              <Button type="submit">
                <CornerDownLeft />
              </Button>
              <DialogClose className="px-2" type="button" asChild>
                <XIcon className="w-12 h-12" />
              </DialogClose>
            </form>
            <DialogDescription></DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <div
          className={`grid gap-2 min-h-24 max-h-64 overflow-y-auto rounded-md ${
            search.length > 0 ? "visible" : "invisible"
          }`}
        >
          {products?.map((val) => {
            return (
              <Link
                key={val.id}
                href={`/product/${val.slug}/${val.id}`}
                className="p-3 rounded-md bg-neutral-200/60 shadow h-fit hover:bg-neutral-300 transition-colors duration-200 font-semibold"
              >
                {val.name}
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
