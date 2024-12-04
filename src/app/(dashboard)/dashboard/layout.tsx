"use client";

import AvatarMenu from "@/components/layouts/Nav/avatarMenu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { capitalizeWords } from "@/lib/uppercaseFirstLetter";
import { cn } from "@/lib/utils";
import { House, Package, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const navigation = [
  {
    name: "Dashboard",
    icon: <House className="" />,
    href: "/dashboard",
  },
  {
    name: "Store Orders",
    icon: <ShoppingBag className="" />,
    href: "/dashboard/orders",
  },
  {
    name: "Products",
    icon: <Package className="" />,
    href: "/dashboard/products",
  },
];

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const breadcrumbs = pathname.split("/").slice(1);
  const currentPageName = breadcrumbs.pop();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link
            href={"/"}
            className="flex gap-2 px-2 rounded-full justify-start items-center "
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
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="p-4 gap-4 ">
            {navigation.map((val) => {
              return (
                <Link
                  href={val.href}
                  key={val.href}
                  className={cn(
                    "font-semibold flex gap-2 w-full hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 p-2 rounded-md",
                    pathname === val.href
                      ? "bg-neutral-200 text-neutral-900"
                      : ""
                  )}
                >
                  {val.icon} <span>{val.name}</span>
                </Link>
              );
            })}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="w-full">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4  justify-between">
          <div className="flex items-center gap-2 h-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 " />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((val, index) => {
                  const breadcrumbPath =
                    "/" + breadcrumbs.slice(0, index + 1).join("/");

                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={breadcrumbPath}>
                          {capitalizeWords(val)}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </Fragment>
                  );
                })}

                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {capitalizeWords(currentPageName || "")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {status == "loading" ? (
            <Avatar className="">
              <AvatarFallback>{"AV"}</AvatarFallback>
              {/* <AvatarImage alt="image" src={session.user?.image ?? ""} /> */}
            </Avatar>
          ) : (
            <AvatarMenu session={session!} />
          )}
        </header>

        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
