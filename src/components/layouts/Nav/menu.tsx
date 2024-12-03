import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    description:
      "Furniture and decor to make your living room cozy and inviting.",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description:
      "Stylish and comfortable furniture for the perfect bedroom retreat.",
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    description:
      "Modern and functional kitchen essentials for cooking and dining.",
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    description:
      "Elegant dining furniture to enhance your mealtime experiences.",
  },
  {
    name: "Others",
    slug: "others",
    description: "Unique and versatile pieces for every corner of your home.",
  },
];

export default function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
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
                    <div className="mb-2 mt-4 text-lg font-bold">
                      Mabel Mania
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      An open-source furniture e-commerce platform built with
                      Next.js. Explore, customize, and learn from this modern
                      web development project!
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/products" title="Products">
                All the product we have to over
              </ListItem>
              <ListItem href="/stores" title="Store">
                See store all over the world
              </ListItem>
              <ListItem href="/dashboard" title="Build Your Store">
                Build your own store
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {categories.map((category) => (
                <ListItem
                  key={category.slug}
                  title={category.name}
                  href={"/products?category=" + category.slug}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
