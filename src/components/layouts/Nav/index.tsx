"use client";
import Image from "next/image";
import Menu from "./menu";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import SearchButton from "./SearchButton";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import AvatarMenu from "./avatarMenu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CATEGORIES } from "@/lib/constants/categories";

async function getCountCart() {
  const response = await axios.get("/api/cart/count");
  return response.data;
}

export default function Nav({ isSticky = false }: { isSticky?: boolean }) {
  const { data: session } = useSession();
  const {
    data: cartCount,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCountCart,
    gcTime: 300000,
    staleTime: 250000,
  });
  return (
    <nav
      className={`${
        isSticky ? "sticky" : "fixed"
      } top-0 p-3 lg:px-20 md:px-12 px-4 bg-white w-full z-40  border-b border-neutral-300`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* left */}
        <div className="lg:flex hidden  items-center gap-3 ">
          <Link
            href={"/"}
            className="flex gap-2 rounded-full justify-center items-center "
          >
            <div className="relative w-10 h-10">
              <Image
                alt="icon"
                src={"/icon/furniture.png"}
                //   height={20}
                //   width={20}
                fill
                // objectFit="cover"
                style={{ objectFit: "cover" }}
                className="bg-yellow-500 p-2 rounded-full"
              />
            </div>
            <span className="text-lg font-bold ">Mabel Mania</span>
          </Link>
          <Menu />
        </div>
        <div className="lg:hidden flex items-center gap-3 ">
          <Sheet>
            <SheetTrigger
              aria-label="menu-sheet"
              className="cursor-pointer"
              asChild
            >
              <MenuIcon size={24} />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href={"/"}
                    className="flex  gap-2 rounded-full justify-start items-center "
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        alt="icon"
                        src={"/icon/furniture.png"}
                        //   height={20}
                        //   width={20}
                        fill
                        // objectFit="cover"
                        style={{ objectFit: "cover" }}
                        className="bg-yellow-500 p-2 rounded-full"
                      />
                    </div>
                    <span className="text-lg font-bold ">Mabel Mania</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="grid py-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem defaultChecked value="item-1">
                    <AccordionTrigger>Getting Started</AccordionTrigger>
                    <AccordionContent className="flex gap-3 flex-col justify-start items-start px-1">
                      <SheetClose asChild>
                        <Link href={"/products"}>Products</Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href={"/stores"}>Stores</Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href={"/dashboard"}>Build your store</Link>
                      </SheetClose>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent className="flex gap-3 flex-col justify-start items-start px-1">
                      {CATEGORIES.map((val) => {
                        return (
                          <SheetClose key={val.slug} asChild>
                            <Link href={"/products?category=" + val.slug}>
                              {val.name}
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* right */}
        <div className="flex items-center md:gap-5 gap-3">
          <SearchButton />
          {/* TODO: add href location */}
          <Link
            href={"/cart"}
            className="flex items-center justify-center gap-2 relative py-2 px-2 hover:bg-neutral-200 rounded-md"
          >
            <ShoppingCartIcon />
            {cartCount?.count <= 0 ||
            !cartCount ||
            isLoading ||
            isError ? null : (
              <div className="absolute text-xs font-semibold top-0 right-0 w-4 text-center rounded-full bg-red-600 text-white">
                {cartCount.count}
              </div>
            )}
          </Link>
          {session ? (
            <AvatarMenu session={session} />
          ) : (
            <Button
              onClick={async () => {
                await signIn();
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
